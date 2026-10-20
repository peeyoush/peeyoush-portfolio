
import { motion, useReducedMotion } from "motion/react";
import { useId, useRef, useState } from "react";
import nameData from "../../data/peeyoush-glyphs.json";

const ORANGE = "#f97316";
const WHITE = "#ffffff";
const FILL_DURATION = 1.3;
const SETTLE_DURATION = 0.3;

function AnimatedName({ onComplete }) {
  const shouldReduceMotion = useReducedMotion();
  const generatedId = useId().replace(/:/g, "");
  const phaseRef = useRef("idle");
  const orangeRef = useRef(false);
  const pointerTypeRef = useRef(null);

  const [phase, setPhase] = useState("idle");
  const [isOrange, setIsOrange] = useState(false);

  const isSettling =
    phase === "settling-loading" ||
    phase === "settling-resetting";

  const targetColor =
    phase === "loading" || phase === "settling-loading"
      ? ORANGE
      : WHITE;

  function startAnimation() {
    if (phaseRef.current !== "idle") return;

    const nextPhase = orangeRef.current ? "resetting" : "loading";

    if (shouldReduceMotion) {
      const nextOrange = nextPhase === "loading";

      phaseRef.current = "idle";
      orangeRef.current = nextOrange;

      setPhase("idle");
      setIsOrange(nextOrange);
      onComplete?.(nextOrange);
      return;
    }

    phaseRef.current = nextPhase;
    setPhase(nextPhase);
  }

  function cancelAnimation() {
    if (phaseRef.current === "idle") return;

    // Leaving before completion restores the initial white state.
    phaseRef.current = "idle";
    orangeRef.current = false;

    setPhase("idle");
    setIsOrange(false);
    onComplete?.(false);
  }

  function finishAnimation() {
    const currentPhase = phaseRef.current;

    if (
      currentPhase !== "loading" &&
      currentPhase !== "resetting"
    ) {
      return;
    }

    // Don't switch the entire letter color immediately.
    // First transition into the smooth final-fill phase.
    const nextPhase =
      currentPhase === "loading"
        ? "settling-loading"
        : "settling-resetting";

    phaseRef.current = nextPhase;
    setPhase(nextPhase);
  }

  function finishSettling() {
    const currentPhase = phaseRef.current;

    if (
      currentPhase !== "settling-loading" &&
      currentPhase !== "settling-resetting"
    ) {
      return;
    }

    const nextOrange = currentPhase === "settling-loading";

    phaseRef.current = "idle";
    orangeRef.current = nextOrange;

    setPhase("idle");
    setIsOrange(nextOrange);
    onComplete?.(nextOrange);
  }

  function handlePointerEnter(event) {
    pointerTypeRef.current = event.pointerType;

    if (event.pointerType !== "touch") {
      startAnimation();
    }
  }

  function handlePointerLeave(event) {
    if (event.pointerType !== "touch") {
      cancelAnimation();
      pointerTypeRef.current = null;
    }
  }

  function handleClick(event) {
    if (
      pointerTypeRef.current === "touch" ||
      event.detail === 0
    ) {
      startAnimation();
    }
  }

  const clipPrefix = `peeyoush-${generatedId}`;
  const lastGlyphIndex = nameData.glyphs.length - 1;

  return (
    <span className="relative inline-block align-baseline">
      <svg
        viewBox={`0 0 ${nameData.width} ${nameData.height}`}
        className="block h-[0.95em] w-auto overflow-visible"
        role="button"
        aria-label="Animate the Peeyoush name"
        tabIndex={0}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onFocus={startAnimation}
        onBlur={cancelAnimation}
        onClick={handleClick}
      >
        <defs>
          {nameData.glyphs.map((glyph, index) => (
            <clipPath
              id={`${clipPrefix}-clip-${index}`}
              key={index}
              clipPathUnits="userSpaceOnUse"
            >
              <path d={glyph.path} />
            </clipPath>
          ))}
        </defs>

        {nameData.glyphs.map((glyph, index) => (
          <g key={`${glyph.character}-${index}`}>
            {/* Permanent base letter */}
            <path
              d={glyph.path}
              fill={isOrange ? ORANGE : WHITE}
            />

            {/* Moving snake: fades out as the solid fill fades in */}
            {phase !== "idle" && (
              <motion.path
                d={glyph.snakePath}
                fill="none"
                stroke={targetColor}
                strokeWidth={glyph.snakeStrokeWidth ?? 4.4}
                strokeLinecap="round"
                strokeLinejoin="round"
                clipPath={`url(#${clipPrefix}-clip-${index})`}
                initial={{ pathLength: 0, opacity: 1 }}
                animate={{
                  pathLength: 1,
                  opacity: isSettling ? 0 : 1,
                }}
                transition={{
                  pathLength: {
                    duration: FILL_DURATION,
                    ease: "linear",
                  },
                  opacity: {
                    duration: isSettling ? SETTLE_DURATION : 0,
                    ease: "easeOut",
                  },
                }}
                onAnimationComplete={
                  index === lastGlyphIndex && !isSettling
                    ? finishAnimation
                    : undefined
                }
              />
            )}

            {/* Solid letter fades in smoothly at the end */}
            {isSettling && (
              <motion.path
                d={glyph.path}
                fill={targetColor}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: SETTLE_DURATION,
                  ease: "easeOut",
                }}
                onAnimationComplete={
                  index === lastGlyphIndex
                    ? finishSettling
                    : undefined
                }
              />
            )}
          </g>
        ))}
      </svg>
    </span>
  );
}

export default AnimatedName;
