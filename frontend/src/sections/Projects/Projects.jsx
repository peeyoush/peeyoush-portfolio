import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

import projects from "./projectsData";
import ProjectRow from "./components/ProjectRow";
import ProjectPreview from "./components/ProjectPreview";
import ProjectActions from "./components/ProjectActions";
import SectionLabel from "../../components/common/SectionLabel";

/*
  Entrance rules:
  - Plays the first time the section scrolls into view.
  - Scrolling away and back does NOT replay it.
  - Clicking "Projects" in the navbar (replayKey changes) replays it
    when the section is reached.
*/
function Projects({ replayKey = 0 }) {
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { amount: 0.35 });

  const [isEntered, setIsEntered] = useState(false);
  const armedRef = useRef(true); // true = next arrival should play the entrance
  const inViewRef = useRef(false);
  const previousReplayKeyRef = useRef(replayKey);

  const selectedProject =
    projects.find((project) => project.id === selectedProjectId) ?? null;

  // Play when the section arrives and the entrance is armed.
  useEffect(() => {
    inViewRef.current = isInView;

    if (isInView && armedRef.current) {
      armedRef.current = false;
      setIsEntered(true);
    }
  }, [isInView]);

  // Only a change in replayKey is an intentional navbar click.
  useEffect(() => {
    if (previousReplayKeyRef.current === replayKey) {
      return undefined;
    }

    previousReplayKeyRef.current = replayKey;
    armedRef.current = true;
    setIsEntered(false); // rows snap back to hidden

    // Already looking at the section: replay right away.
    if (!inViewRef.current) {
      return undefined;
    }

    const timer = setTimeout(() => {
      armedRef.current = false;
      setIsEntered(true);
    }, 120);

    return () => clearTimeout(timer);
  }, [replayKey]);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="projects-section relative isolate overflow-hidden bg-[#080707] px-4 py-16 text-white sm:px-6 sm:py-20 lg:min-h-[760px] lg:px-8 lg:py-8"
      aria-labelledby="projects-heading"
    >
      <div className="projects-ambient-light" aria-hidden="true" />

      <div className="projects-inner relative z-10 mx-auto w-full max-w-[1500px]">
        <header className="projects-kicker" id="projects-heading">
          <div className="w-fit">
            <SectionLabel>PROJECTS</SectionLabel>

            <div className="mt-4 h-[3px] w-14 rounded-full bg-gradient-to-r from-orange-500 to-red-600" />
          </div>
        </header>

        <div className="projects-layout">
          <div className="projects-left">
            <nav className="projects-list" aria-label="Select a project">
              {projects.map((project, index) => (
                <ProjectRow
                  key={project.id}
                  project={project}
                  index={index}
                  isEntered={isEntered}
                  isSelected={selectedProjectId === project.id}
                  onSelect={setSelectedProjectId}
                />
              ))}
            </nav>
          </div>

          <div className="projects-details">
            <ProjectPreview project={selectedProject} />
            <ProjectActions project={selectedProject} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Projects;
