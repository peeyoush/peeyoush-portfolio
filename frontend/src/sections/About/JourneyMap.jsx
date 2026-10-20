import { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";

import mapLibreWorkerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";

import { useInView, useReducedMotion } from "motion/react";

import "maplibre-gl/dist/maplibre-gl.css";

maplibregl.setWorkerUrl(mapLibreWorkerUrl);

const MAP_STYLE_URL = "https://tiles.openfreemap.org/styles/dark";

const FLIGHT_DURATION_MS = 5500;
const FLIGHT_SAMPLE_COUNT = 120;

const KATHMANDU = {
  name: "Kathmandu",
  code: "KTM",
  coordinates: [85.324, 27.7172],
};

const BHUBANESWAR = {
  name: "Bhubaneswar",
  code: "BBI",
  coordinates: [85.8245, 20.2961],
};

function createFlightCoordinates() {
  const start = KATHMANDU.coordinates;
  const controlPointOne = [87.8, 26.1];
  const controlPointTwo = [88.0, 22.3];
  const destination = BHUBANESWAR.coordinates;

  const coordinates = [];

  for (let step = 0; step <= FLIGHT_SAMPLE_COUNT; step += 1) {
    const progress = step / FLIGHT_SAMPLE_COUNT;
    const remainingProgress = 1 - progress;

    const longitude =
      remainingProgress ** 3 * start[0] +
      3 * remainingProgress ** 2 * progress * controlPointOne[0] +
      3 * remainingProgress * progress ** 2 * controlPointTwo[0] +
      progress ** 3 * destination[0];

    const latitude =
      remainingProgress ** 3 * start[1] +
      3 * remainingProgress ** 2 * progress * controlPointOne[1] +
      3 * remainingProgress * progress ** 2 * controlPointTwo[1] +
      progress ** 3 * destination[1];

    coordinates.push([longitude, latitude]);
  }

  return coordinates;
}

const FLIGHT_COORDINATES = createFlightCoordinates();

function createLineFeature(coordinates) {
  return {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates,
    },
  };
}

function getFlightCoordinatesAtProgress(progress) {
  const lastIndex = FLIGHT_COORDINATES.length - 1;
  const exactIndex = progress * lastIndex;

  const lowerIndex = Math.floor(exactIndex);
  const upperIndex = Math.min(lowerIndex + 1, lastIndex);

  const segmentProgress = exactIndex - lowerIndex;

  const startCoordinate = FLIGHT_COORDINATES[lowerIndex];
  const endCoordinate = FLIGHT_COORDINATES[upperIndex];

  const currentCoordinate = [
    startCoordinate[0] +
      (endCoordinate[0] - startCoordinate[0]) * segmentProgress,

    startCoordinate[1] +
      (endCoordinate[1] - startCoordinate[1]) * segmentProgress,
  ];

  const visibleCoordinates = FLIGHT_COORDINATES.slice(0, lowerIndex + 1);

  if (progress < 1) {
    visibleCoordinates.push(currentCoordinate);
  }

  return {
    visibleCoordinates,
    currentCoordinate,
    nextCoordinate: endCoordinate,
  };
}

function createAirportMarkerElement(name, code, color) {
  const markerElement = document.createElement("div");

  markerElement.style.position = "relative";
  markerElement.style.width = "14px";
  markerElement.style.height = "14px";
  markerElement.style.pointerEvents = "none";

  const markerDot = document.createElement("span");

  markerDot.style.position = "absolute";
  markerDot.style.inset = "2px";
  markerDot.style.borderRadius = "50%";
  markerDot.style.backgroundColor = color;
  markerDot.style.boxShadow = `0 0 0 5px ${color}25, 0 0 16px ${color}90`;

  const markerLabel = document.createElement("span");

  markerLabel.textContent = `${name.toUpperCase()} · ${code}`;
  markerLabel.style.position = "absolute";
  markerLabel.style.left = "22px";
  markerLabel.style.top = "-3px";
  markerLabel.style.color = color;
  markerLabel.style.fontSize = "10px";
  markerLabel.style.fontWeight = "600";
  markerLabel.style.letterSpacing = "0.08em";
  markerLabel.style.whiteSpace = "nowrap";
  markerLabel.style.textShadow = "0 1px 5px rgba(0, 0, 0, 0.95)";

  markerElement.append(markerDot, markerLabel);

  return markerElement;
}

function createPlaneMarkerElement() {
  const markerElement = document.createElement("div");

  markerElement.style.width = "42px";
  markerElement.style.height = "42px";
  markerElement.style.display = "flex";
  markerElement.style.alignItems = "center";
  markerElement.style.justifyContent = "center";
  markerElement.style.pointerEvents = "none";
  markerElement.style.filter = "drop-shadow(0 0 7px rgba(251, 146, 60, 0.8))";

  markerElement.innerHTML = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="34"
      height="34"
      viewBox="-18 -18 36 36"
      aria-hidden="true"
    >
      <path
        d="M 0 -16 L 3 -4 L 12 1 L 12 4 L 4 2 L 2 11 L 4 14 L 0 12 L -4 14 L -2 11 L -4 2 L -12 4 L -12 1 L -3 -4 Z"
        fill="#fff7ed"
        stroke="#fb923c"
        stroke-width="0.8"
        stroke-linejoin="round"
      />
    </svg>
  `;

  return markerElement;
}

function getPlaneRotation(map, currentCoordinate, nextCoordinate) {
  const currentPoint = map.project(currentCoordinate);
  const nextPoint = map.project(nextCoordinate);

  const horizontalDifference = nextPoint.x - currentPoint.x;

  const verticalDifference = nextPoint.y - currentPoint.y;

  if (
    Math.abs(horizontalDifference) < 0.001 &&
    Math.abs(verticalDifference) < 0.001
  ) {
    return null;
  }

  // The plane points north when its rotation is zero.
  return (
    (Math.atan2(horizontalDifference, -verticalDifference) * 180) / Math.PI
  );
}

function JourneyMap({ replayKey = 0 }) {
  const mapFrameRef = useRef(null);
  const mapContainerRef = useRef(null);

  const animationFrameRef = useRef(null);
  const animationRunRef = useRef(0);

  const hasStartedFlightRef = useRef(false);
  const previousReplayKeyRef = useRef(replayKey);
  const replayRequestedRef = useRef(false);

  const flightControllerRef = useRef(null);
  const shouldReduceMotionRef = useRef(false);

  const isMapInView = useInView(mapFrameRef, {
    amount: 0.25,
    once: false,
  });

  const shouldReduceMotion = useReducedMotion();

  const [isMapReady, setIsMapReady] = useState(false);
  const [flightState, setFlightState] = useState("idle");

  shouldReduceMotionRef.current = Boolean(shouldReduceMotion);

  useEffect(() => {
    const mapContainer = mapContainerRef.current;
    const mapFrame = mapFrameRef.current;

    if (!mapContainer || !mapFrame) {
      return undefined;
    }

    const map = new maplibregl.Map({
      container: mapContainer,
      style: MAP_STYLE_URL,
      center: [86.2, 24.0],
      zoom: 5.1,
      minZoom: 4,
      maxZoom: 10,
      maxPitch: 0,
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
      cooperativeGestures: true,
      attributionControl: false,
    });
    map.on("error", (event) => {
      console.error("MapLibre failed to load:", event.error || event);
    });
    const markers = [];

    map.on("load", () => {
      const fullFlightFeature = createLineFeature(FLIGHT_COORDINATES);

      const firstCoordinate = KATHMANDU.coordinates;

      const initialFlightFeature = createLineFeature([
        firstCoordinate,
        firstCoordinate,
      ]);

      // Faint dotted route that remains visible before departure.
      map.addSource("flight-route-background", {
        type: "geojson",
        data: fullFlightFeature,
      });

      map.addLayer({
        id: "flight-route-background",
        type: "line",
        source: "flight-route-background",
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": "rgba(255, 255, 255, 0.3)",
          "line-width": 1.5,
          "line-dasharray": [2, 3],
        },
      });

      // This route source will be updated by the flight animation.
      map.addSource("flight-route-progress", {
        type: "geojson",
        data: initialFlightFeature,
        lineMetrics: true,
      });

      map.addLayer({
        id: "flight-route-progress",
        type: "line",
        source: "flight-route-progress",
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-gradient": [
            "interpolate",
            ["linear"],
            ["line-progress"],
            0,
            "#fb923c",
            1,
            "#ef4444",
          ],
          "line-width": 3,
          "line-blur": 0.7,
        },
      });

      const originMarker = new maplibregl.Marker({
        element: createAirportMarkerElement(
          KATHMANDU.name,
          KATHMANDU.code,
          "#fb923c",
        ),
        anchor: "center",
      })
        .setLngLat(KATHMANDU.coordinates)
        .addTo(map);

      const destinationMarker = new maplibregl.Marker({
        element: createAirportMarkerElement(
          BHUBANESWAR.name,
          BHUBANESWAR.code,
          "#f87171",
        ),
        anchor: "center",
      })
        .setLngLat(BHUBANESWAR.coordinates)
        .addTo(map);

      const planeMarker = new maplibregl.Marker({
        element: createPlaneMarkerElement(),
        anchor: "center",
        rotationAlignment: "map",
      })
        .setLngLat(KATHMANDU.coordinates)
        .addTo(map);

      markers.push(originMarker, destinationMarker, planeMarker);

      function updateFlightProgress(progress) {
        const flightPosition = getFlightCoordinatesAtProgress(progress);

        const routeSource = map.getSource("flight-route-progress");

        if (!routeSource) {
          return;
        }

        // Draw the route up to exactly the aircraft's current position.
        routeSource.setData(
          createLineFeature(flightPosition.visibleCoordinates),
        );

        planeMarker.setLngLat(flightPosition.currentCoordinate);

        // Preserve the aircraft's final direction when it arrives.
        const headingStart =
          progress >= 1
            ? FLIGHT_COORDINATES[FLIGHT_COORDINATES.length - 2]
            : flightPosition.currentCoordinate;

        const headingEnd =
          progress >= 1
            ? FLIGHT_COORDINATES[FLIGHT_COORDINATES.length - 1]
            : flightPosition.nextCoordinate;

        const planeRotation = getPlaneRotation(map, headingStart, headingEnd);

        if (planeRotation !== null) {
          planeMarker.setRotation(planeRotation);
        }
      }

      function finishFlight() {
        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }

        animationRunRef.current += 1;

        updateFlightProgress(1);
        setFlightState("arrived");
      }

      function startFlight() {
        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }

        animationRunRef.current += 1;

        const currentRun = animationRunRef.current;

        if (shouldReduceMotionRef.current) {
          updateFlightProgress(1);
          setFlightState("arrived");
          return;
        }

        // Reset the plane and route together before every flight.
        updateFlightProgress(0);
        setFlightState("flying");

        let animationStartTime = null;

        function animateFlight(timestamp) {
          if (currentRun !== animationRunRef.current) {
            return;
          }

          if (animationStartTime === null) {
            animationStartTime = timestamp;
          }

          const elapsedTime = timestamp - animationStartTime;

          const linearProgress = Math.min(elapsedTime / FLIGHT_DURATION_MS, 1);

          // Ease in and out using one shared animation clock.
          const easedProgress =
            linearProgress < 0.5
              ? 4 * linearProgress ** 3
              : 1 - Math.pow(-2 * linearProgress + 2, 3) / 2;

          updateFlightProgress(easedProgress);

          if (linearProgress < 1) {
            animationFrameRef.current = requestAnimationFrame(animateFlight);
          } else {
            animationFrameRef.current = null;
            setFlightState("arrived");
          }
        }

        animationFrameRef.current = requestAnimationFrame(animateFlight);
      }

      flightControllerRef.current = {
        startFlight,
        finishFlight,
      };

      // Ensure MapLibre measures the actual responsive container.
      map.resize();

      setIsMapReady(true);
    });

    // Resize the map whenever the card's dimensions change.
    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });

    resizeObserver.observe(mapFrame);

    return () => {
      resizeObserver.disconnect();

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      animationRunRef.current += 1;
      flightControllerRef.current = null;

      markers.forEach((marker) => marker.remove());
      map.remove();
    };
  }, []);

  // Only a change in replayKey represents an intentional navbar click.
  useEffect(() => {
    if (previousReplayKeyRef.current !== replayKey) {
      previousReplayKeyRef.current = replayKey;
      hasStartedFlightRef.current = true;
      replayRequestedRef.current = true;
    }

    if (!isMapReady || !replayRequestedRef.current) {
      return;
    }

    replayRequestedRef.current = false;
    flightControllerRef.current?.startFlight();
  }, [replayKey, isMapReady]);

  // Start automatically the first time the map enters the viewport.
  useEffect(() => {
    if (!isMapReady || !isMapInView || hasStartedFlightRef.current) {
      return;
    }

    hasStartedFlightRef.current = true;
    flightControllerRef.current?.startFlight();
  }, [isMapReady, isMapInView]);

  // Finish immediately if reduced-motion preference is enabled.
  useEffect(() => {
    if (shouldReduceMotion && flightState === "flying") {
      flightControllerRef.current?.finishFlight();
    }
  }, [shouldReduceMotion, flightState]);

  const flightStatusLabel = {
    idle: "READY TO DEPART",
    flying: "IN FLIGHT",
    arrived: "JOURNEY COMPLETE",
  }[flightState];

  return (
    <div
      ref={mapFrameRef}
      role="group"
      aria-label="Interactive map showing a journey from Kathmandu to Bhubaneswar"
      className="relative isolate h-[200px] w-full overflow-hidden bg-[#101112] sm:h-[235px] lg:h-[270px]"
    >
      {/* The real interactive map fills this entire container. */}
      <div ref={mapContainerRef} className="relative isolate h-[180px] w-full overflow-hidden bg-[#101112] sm:h-[205px] lg:h-[230px]" />

      {/* This overlay does not block map dragging. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-4 bg-gradient-to-b from-black/60 to-transparent p-5 sm:p-7">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-orange-300 sm:text-xs">
            The journey
          </p>

          <p className="mt-2 text-sm font-medium text-white/90 sm:text-base">
            Nepal <span className="text-orange-400">→</span> Odisha, India
          </p>
        </div>

        <span className="shrink-0 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-[9px] font-medium tracking-[0.13em] text-white/80 backdrop-blur-sm sm:text-[10px]">
          {flightStatusLabel}
        </span>
      </div>

      {/* Blend the bottom of the map into the story below. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-b from-transparent via-[#080808]/65 to-[#080808] sm:h-20"
      />

      {/* Keep the map's data credits visible. */}
      <div className="absolute bottom-3 right-3 z-20 max-w-[92%] rounded bg-black/65 px-2 py-1 text-[9px] leading-4 text-white/80 backdrop-blur-sm sm:bottom-4 sm:right-4">
        <a
          href="https://openfreemap.org/"
          target="_blank"
          rel="noreferrer"
          className="hover:text-white focus-visible:outline-none focus-visible:underline"
        >
          © OpenFreeMap
        </a>

        <span> · </span>

        <a
          href="https://openmaptiles.org/"
          target="_blank"
          rel="noreferrer"
          className="hover:text-white focus-visible:outline-none focus-visible:underline"
        >
          © OpenMapTiles
        </a>

        <span> · </span>

        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noreferrer"
          className="hover:text-white focus-visible:outline-none focus-visible:underline"
        >
          © OpenStreetMap contributors
        </a>
      </div>
    </div>
  );
}

export default JourneyMap;
