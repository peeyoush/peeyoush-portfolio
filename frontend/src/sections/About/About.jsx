import { motion, useReducedMotion } from "motion/react";
import SectionLabel from "../../components/common/SectionLabel";
import AboutStory from "./AboutStory.jsx";
import JourneyMap from "./JourneyMap.jsx";

function About({ flightReplayKey = 0 }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="about"
      className="relative isolate overflow-hidden bg-[#080707] px-5 py-10 text-white sm:px-8 sm:py-12 lg:px-10 lg:py-16"
    >
      {/* Soft lighting keeps the section connected to the portfolio theme. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute left-[-180px] top-[220px] h-[380px] w-[380px] rounded-full bg-orange-600/[0.055] blur-[130px]" />

        <div className="absolute right-[-170px] top-[520px] h-[420px] w-[420px] rounded-full bg-red-700/[0.045] blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-3xl">
        {/* The map and story share one surface instead of looking like two cards. */}
        <motion.article
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.65,
            ease: "easeOut",
          }}
          className="overflow-hidden rounded-3xl border border-white/[0.09] bg-[#080808] shadow-[0_16px_50px_rgba(0,0,0,0.25)]"
        >
          <JourneyMap replayKey={flightReplayKey} />
          <AboutStory />
        </motion.article>
      </div>
    </section>
  );
}

export default About;
