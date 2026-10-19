import { useEffect, useRef, useState } from "react";

import {
  siC,
  siCss,
  siDocker,
  siFastapi,
  siGit,
  siGithub,
  siGithubactions,
  siHtml5,
  siHuggingface,
  siOpenjdk,
  siJavascript,
  siLinux,
  siMysql,
  siNextdotjs,
  siOllama,
  siPostgresql,
  siPydantic,
  siPython,
  siPytorch,
  siReact,
  siTailwindcss,
  siTensorflow,
  siTypescript,
} from "simple-icons";

const skillsRows = [
  {
    id: "languages",
    duration: 38,
    delay: "-6s",
    direction: "right",
    skills: [
      { name: "Python", icon: siPython },
      { name: "Java", icon: siOpenjdk },
      { name: "JavaScript", icon: siJavascript },
      { name: "C", icon: siC },
    ],
  },
  {
    id: "frontend",
    duration: 43,
    delay: "-17s",
    direction: "left",
    skills: [
      { name: "TypeScript", icon: siTypescript },
      { name: "HTML5", icon: siHtml5 },
      { name: "CSS", icon: siCss },
      { name: "React", icon: siReact },
      { name: "Next.js", icon: siNextdotjs },
      { name: "Tailwind CSS", icon: siTailwindcss },
    ],
  },
  {
    id: "ai-and-backend",
    duration: 40,
    delay: "-11s",
    direction: "right",
    skills: [
      { name: "PyTorch", icon: siPytorch },
      { name: "TensorFlow", icon: siTensorflow },
      { name: "Hugging Face", icon: siHuggingface },
      { name: "FastAPI", icon: siFastapi },
      { name: "Pydantic", icon: siPydantic },
      { name: "Ollama", icon: siOllama },
    ],
  },
  {
    id: "databases-and-tools",
    duration: 46,
    delay: "-28s",
    direction: "left",
    skills: [
      { name: "PostgreSQL", icon: siPostgresql },
      { name: "MySQL", icon: siMysql },
      { name: "Docker", icon: siDocker },
      { name: "Git", icon: siGit },
      { name: "GitHub", icon: siGithub },
      { name: "GitHub Actions", icon: siGithubactions },
      { name: "Linux", icon: siLinux },
    ],
  },
];

function SkillTile({ skill, onPointerEnter, onPointerLeave }) {
  return (
    <div
      className="skills-tile"
      role="group"
      aria-label={skill.name}
      title={skill.name}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      {/* The SVG path is the actual brand logo, not a text abbreviation. */}
      <svg
        className="skills-tile-icon"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <path d={skill.icon.path} />
      </svg>

      <span className="skills-tile-label">{skill.name}</span>
    </div>
  );
}

function Skills() {
  const sectionRef = useRef(null);
  const cursorRef = useRef(null);

  const [isSkillAreaHovered, setIsSkillAreaHovered] = useState(false);

  const [hoveredRowId, setHoveredRowId] = useState(null);

  const [isCustomCursorVisible, setIsCustomCursorVisible] = useState(false);

  function handleSectionPointerMove(event) {
    if (event.pointerType !== "mouse") {
      return;
    }

    const section = sectionRef.current;
    const cursor = cursorRef.current;

    if (!section || !cursor) {
      return;
    }

    const bounds = section.getBoundingClientRect();

    const pointerX = event.clientX - bounds.left;
    const pointerY = event.clientY - bounds.top;

    cursor.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0) translate(-50%, -50%)`;
  }

  function handleSkillAreaEnter(event) {
    if (event.pointerType !== "mouse") {
      return;
    }

    setIsSkillAreaHovered(true);
  }

  function handleSkillAreaLeave() {
    setIsSkillAreaHovered(false);
    setHoveredRowId(null);
    setIsCustomCursorVisible(false);
  }

  function handleRowEnter(rowId, event) {
    if (event.pointerType !== "mouse") {
      return;
    }

    setHoveredRowId(rowId);
  }

  function handleRowLeave(event) {
    if (event.pointerType !== "mouse") {
      return;
    }

    setHoveredRowId(null);
  }

  function handleTileEnter(event) {
    if (event.pointerType !== "mouse") {
      return;
    }

    setIsCustomCursorVisible(true);
  }

  function handleTileLeave(event) {
    if (event.pointerType !== "mouse") {
      return;
    }

    setIsCustomCursorVisible(false);
  }

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return undefined;
    }

    const tracks = Array.from(
      section.querySelectorAll(".skills-marquee-track"),
    );

    const animations = tracks
      .map((track) => {
        const animation = track.getAnimations()[0];

        return {
          rowId: track.dataset.rowId,
          animation,
        };
      })
      .filter((item) => item.animation);

    let animationFrameId = null;
    let transitionStartTime = null;

    const animationChanges = animations.map(({ rowId, animation }) => {
      const isHoveredRow = isSkillAreaHovered && rowId === hoveredRowId;

      // Freeze the hovered row immediately so its tile cannot
      // slide away from beneath the pointer.
      if (isHoveredRow) {
        animation.playbackRate = 0;

        return {
          animation,
          startRate: 0,
          targetRate: 0,
        };
      }

      const targetRate = isSkillAreaHovered ? 0.12 : 1;

      return {
        animation,
        startRate: animation.playbackRate,
        targetRate,
      };
    });

    function updateAnimationSpeeds(timestamp) {
      if (transitionStartTime === null) {
        transitionStartTime = timestamp;
      }

      const elapsedTime = timestamp - transitionStartTime;

      const progress = Math.min(elapsedTime / 320, 1);

      // Smoothstep makes acceleration and deceleration less abrupt.
      const easedProgress = progress * progress * (3 - 2 * progress);

      animationChanges.forEach(({ animation, startRate, targetRate }) => {
        animation.playbackRate =
          startRate + (targetRate - startRate) * easedProgress;
      });

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateAnimationSpeeds);
      }
    }

    animationFrameId = requestAnimationFrame(updateAnimationSpeeds);

    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isSkillAreaHovered, hoveredRowId]);

  return (
    <section
      id="skills"
      ref={sectionRef}
      onPointerMove={handleSectionPointerMove}
      className="skills-section relative isolate overflow-hidden bg-[#080707] px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      {/* Very subtle lighting keeps the section connected to the theme. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-10 h-56 w-96 -translate-x-1/2 rounded-full bg-orange-600/[0.035] blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl">
        {/* Section title */}
        <div className="mb-8 text-center sm:mb-10">
          <h2 className="bg-gradient-to-r from-orange-400 via-orange-500 to-red-600 bg-clip-text text-4xl font-light tracking-tight text-transparent sm:text-5xl lg:text-6xl">
            Skills...
          </h2>

          <div className="mx-auto mt-3 h-[3px] w-14 rounded-full bg-gradient-to-r from-orange-500 to-red-600" />
        </div>

        {/* The rows have separate directions, speeds, and starting offsets. */}
        <div
          className="skills-marquee-list space-y-3 sm:space-y-4"
          onPointerEnter={handleSkillAreaEnter}
          onPointerLeave={handleSkillAreaLeave}
        >
          {skillsRows.map((row) => (
            <div
              key={row.id}
              className="skills-marquee-viewport"
              data-skills-row={row.id}
              onPointerEnter={(event) => handleRowEnter(row.id, event)}
              onPointerLeave={handleRowLeave}
            >
              <div
                className="skills-marquee-track"
                data-row-id={row.id}
                style={{
                  "--skills-duration": `${row.duration}s`,
                  "--skills-delay": row.delay,
                  "--skills-animation-name":
                    row.direction === "right"
                      ? "skills-scroll-right"
                      : "skills-scroll-left",
                }}
              >
                {/* First copy */}
                <div className="skills-marquee-group">
                  {row.skills.map((skill) => (
                    <SkillTile
                      key={skill.name}
                      skill={skill}
                      onPointerEnter={handleTileEnter}
                      onPointerLeave={handleTileLeave}
                    />
                  ))}
                </div>

                {/* Second copy keeps the loop seamless. */}
                <div className="skills-marquee-group" aria-hidden="true">
                  {row.skills.map((skill) => (
                    <SkillTile
                      key={`duplicate-${skill.name}`}
                      skill={skill}
                      onPointerEnter={handleTileEnter}
                      onPointerLeave={handleTileLeave}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom circular cursor shown only on a tile. */}
      <span
        ref={cursorRef}
        aria-hidden="true"
        className={`skills-custom-cursor ${
          isCustomCursorVisible ? "is-visible" : ""
        }`}
      />
    </section>
  );
}

export default Skills;
