
function ProjectCover({ project }) {
  if (project.image) {
    return (
      <img
        className="projects-preview-image"
        src={project.image}
        alt={`${project.title} project preview`}
      />
    );
  }

  return (
    <div
      className={`projects-cover-placeholder projects-cover-${project.coverType}`}
      role="img"
      aria-label={`Placeholder cover for ${project.title}`}
    >
      <div className="projects-cover-grid" aria-hidden="true" />

      <div className="projects-cover-art projects-cover-mark" aria-hidden="true">
        {project.coverType === "code"
          ? "</>"
          : project.coverType === "clinical"
            ? "+"
            : project.coverType === "kalman"
              ? "K"
              : "FV"}
      </div>

      <div className="projects-cover-caption">
        <span>PROJECT PREVIEW</span>
        <strong>{project.coverLabel}</strong>
        <small>Screenshot placeholder · replace when ready</small>
      </div>
    </div>
  );
}

export default ProjectCover;
