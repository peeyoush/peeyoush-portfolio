import SectionLabel from "../../components/common/SectionLabel";
function AboutStory() {
  return (
    <div className="relative bg-gradient-to-b from-[#080808] to-[#090807] px-5 pb-6 pt-0 sm:px-7 sm:pb-7 lg:px-8 lg:pb-8">
      {/* Compact section heading */}
      <div className="relative z-10 mb-4 sm:mb-5">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45 sm:text-xs">
          A little about my journey
        </p>

        <SectionLabel>About me </SectionLabel>

        <div className="mt-2.5 h-[3px] w-14 rounded-full bg-gradient-to-r from-orange-500 to-red-600" />
      </div>

      {/* Original story, with tighter reading rhythm */}
      <div className="relative z-10 max-w-4xl space-y-3 sm:space-y-4">
        <p className="text-sm leading-6 text-white/100">
          Born in the cold altitude of Kathmandu, I traded it for the melting
          temperatures of Odisha, India, to pursue a bachelor’s degree in
          Computer Science because diamonds are made under heat and pressure.
        </p>

        <p className="text-sm leading-6 text-white/100">
          I kicked off my degree running a classic breadth-first search on the
          oh-so-hyped Computer Science industry, getting my hands on every
          domain. Eventually, I got buried in the already hyped world of AI and
          ML. I even picked up some DevOps along the way, mostly because I enjoy
          the masochistic thrill of configuring YAML files at 2 AM (and yes, I
          actually know my way around it).
        </p>

        <p className="text-sm leading-6 text-white/100">
          Then I tweaked the algorithm towards a depth-first approach and went
          straight into the trenches of complex projects, academic research, and
          the absolute, caffeine-fueled fever dream that is a standard
          engineering degree. Now, firmly entrenched in my fourth year, I’m
          still out here exploring, breaking code, and somehow managing to
          duct-tape my wildest ideas together until they actually run as working
          systems.
        </p>
      </div>
    </div>
  );
}

export default AboutStory;
