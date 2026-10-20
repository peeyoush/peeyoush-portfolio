
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import ProjectCover from "./ProjectCover";

function ProjectPreview({ project }) {
  const shouldReduceMotion = useReducedMotion();

  const transition = shouldReduceMotion
    ? { duration: 0 }
    : {
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
      };

  return (
    <div
      className="projects-preview-stage"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence mode="wait" initial={false}>
        {project ? (
          <motion.article
            key={project.id}
            className="projects-preview-card projects-preview-card-selected"
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, rotateY: 9, x: 8 }
            }
            animate={{ opacity: 1, rotateY: 0, x: 0 }}
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, rotateY: -7, x: -5 }
            }
            transition={transition}
            style={{ transformPerspective: 1200 }}
          >
            <ProjectCover project={project} />

            <div className="projects-preview-copy">
              <span className="projects-preview-year">
                {project.year}
              </span>

              <h3>{project.title}</h3>

              <p>{project.description}</p>
            </div>
          </motion.article>
        ) : (
          <motion.div
            key="empty-preview"
            className="projects-preview-card projects-preview-empty"
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, rotateY: 7 }
            }
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0 }}
            transition={transition}
          >
            <svg
              className="projects-empty-icon"
              viewBox="0 0 64 64"
              aria-hidden="true"
            >
              <rect x="8" y="8" width="39" height="39" rx="4" />
              <rect x="18" y="18" width="39" height="39" rx="4" />
            </svg>

            <h3>CHOOSE A PROJECT</h3>

            <p>
              Select a project from the list to explore its details.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ProjectPreview;
