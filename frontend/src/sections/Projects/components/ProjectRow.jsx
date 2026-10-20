import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

/* Resting pose of the list. Positive rotateY = right side recedes. */
const ANGLED_POSE = { rotateY: 36 };
const STRAIGHT_POSE = { rotateY: 0 };

/* Entrance: where a row starts (above, tilted) and where it lands. */
const ENTRANCE_HIDDEN = { opacity: 0, y: -140, x: -60, rotate: -16 };
const ENTRANCE_LANDED = { opacity: 1, y: 0, x: 0, rotate: 0 };
const ENTRANCE_STAGGER = 0.1; // seconds between rows

function ProjectRow({ project, index = 0, isEntered = true, isSelected, onSelect }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const isStraight = isSelected || isHovered || isFocused;
  const lines = project.titleLines ?? [project.title];
  const entered = isEntered || shouldReduceMotion;

  const animateTarget = {
    ...(entered ? ENTRANCE_LANDED : ENTRANCE_HIDDEN),
    rotateY: isStraight ? STRAIGHT_POSE.rotateY : ANGLED_POSE.rotateY,
  };

  const delay = index * ENTRANCE_STAGGER;
  const landing = { type: "spring", stiffness: 130, damping: 13, mass: 0.9, delay };

  /* Hidden state snaps instantly (nobody sees it). The entrance uses springs
     with a per-row delay; rotateY (hover) keeps its own delay-free tween. */
  let transition;
  if (shouldReduceMotion) {
    transition = { duration: 0 };
  } else if (entered) {
    transition = {
      default: { type: "tween", duration: 0.85, ease: [0.22, 1, 0.36, 1] },
      y: landing,
      x: landing,
      rotate: { type: "spring", stiffness: 80, damping: 10, mass: 1, delay },
      opacity: { duration: 0.35, delay },
    };
  } else {
    transition = { duration: 0 };
  }

  function handleClick() {
    onSelect(isSelected ? null : project.id);
  }

  return (
    <div
      className={[
        "projects-item",
        isSelected ? "is-selected" : "",
        isStraight ? "is-straight" : "",
      ].join(" ")}
    >
      <motion.div
        className="projects-row"
        aria-hidden="true"
        initial={false}
        animate={animateTarget}
        transition={transition}
      >
        <span className="projects-year">{project.year}</span>

        <span className="projects-slash" />

        <span className="projects-title-wrap">
          <span className="projects-title">
            {lines.map((line) => (
              <span className="projects-title-line" key={line}>
                {line}
              </span>
            ))}
          </span>
        </span>
      </motion.div>

      <button
        type="button"
        className="projects-hit"
        onClick={handleClick}
        onPointerEnter={(event) => {
          if (event.pointerType !== "touch") {
            setIsHovered(true);
          }
        }}
        onPointerLeave={() => setIsHovered(false)}
        onFocus={(event) => {
          setIsFocused(event.currentTarget.matches(":focus-visible"));
        }}
        onBlur={() => setIsFocused(false)}
        aria-pressed={isSelected}
        aria-label={
          isSelected
            ? `Deselect ${project.title}`
            : `View ${project.title}, ${project.year}`
        }
      />
    </div>
  );
}

export default ProjectRow;
