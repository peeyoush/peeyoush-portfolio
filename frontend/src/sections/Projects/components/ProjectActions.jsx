import { useEffect, useState } from "react";

const projectActions = [
  { key: "liveDemoUrl", label: "Live Demo", icon: "external" },
  { key: "githubUrl", label: "GitHub", icon: "github" },
  { key: "videoUrl", label: "Video Explanation", icon: "play" },
];

function ActionIcon({ type }) {
  if (type === "external") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14 4h6v6M20 4l-9 9" />
        <path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6" />
      </svg>
    );
  }

  if (type === "github") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          className="projects-icon-fill"
          d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-2.02c-3.1.67-3.76-1.31-3.76-1.31-.5-1.28-1.23-1.62-1.23-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.7 1.15 1.7 1.15.99 1.7 2.6 1.21 3.23.93.1-.72.39-1.21.7-1.49-2.48-.28-5.09-1.24-5.09-5.53 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.15a10.6 10.6 0 0 1 5.55 0c2.11-1.45 3.05-1.15 3.05-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3.01 0 4.3-2.61 5.24-5.1 5.52.4.35.75 1.02.75 2.06V22c0 .29.2.63.76.52A11.1 11.1 0 0 0 12 .9Z"
        />
      </svg>
    );
  }

  if (type === "camera") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="7" width="13" height="11" rx="2" />
        <path d="m16 11 5-3v9l-5-3" />
        <circle cx="9.5" cy="12.5" r="2.2" />
      </svg>
    );
  }
  if (type === "bricks") {
    return (
      <svg
        className="projects-brick-icon"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        {/* Bottom course: two full bricks */}
        <rect x="2" y="17" width="9.5" height="4" rx="0.6" />
        <rect x="12.5" y="17" width="9.5" height="4" rx="0.6" />

        {/* Second course: half brick, full brick, then an empty slot on the right */}
        <rect x="2" y="12" width="4" height="4" rx="0.6" />
        <rect x="7" y="12" width="9.5" height="4" rx="0.6" />

        {/* The brick that drops into the empty slot */}
        <rect
          className="projects-falling-brick"
          x="18"
          y="12"
          width="4"
          height="4"
          rx="0.6"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m7 4 13 8-13 8V4Z" />
    </svg>
  );
}

function ProjectActions({ project }) {
  const [temporaryAction, setTemporaryAction] = useState(null);

  useEffect(() => {
    setTemporaryAction(null);
  }, [project?.id]);

  function handleActionClick(action, url) {
    if (!project) {
      return;
    }

    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }

    setTemporaryAction(action.key);
  }

  return (
    <div className="projects-actions" aria-label="Project links">
      {projectActions.map((action) => {
        const isAvailable = Boolean(project);
        const url = project?.[action.key] ?? null;
        const isTemporary = temporaryAction === action.key;

        let label = action.label;
        let icon = action.icon;

        if (isTemporary && action.key === "liveDemoUrl") {
          label = "sry,deployment in progress..";
          icon = "bricks";
        } else if (isTemporary && action.key === "videoUrl") {
          label = "sry,recording in session ";
          icon = "camera";
        }

        return (
          <button
            key={action.key}
            type="button"
            className={[
              "projects-action",
              isAvailable ? "is-active" : "is-disabled",
              isTemporary ? "is-temporary" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            disabled={!isAvailable}
            onClick={() => handleActionClick(action, url)}
            aria-label={
              !project
                ? `${action.label}: select a project first`
                : url
                  ? `${action.label} for ${project.title}, opens in a new tab`
                  : isTemporary
                    ? label
                    : `${action.label} for ${project.title}`
            }
          >
            <ActionIcon type={icon} />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default ProjectActions;
