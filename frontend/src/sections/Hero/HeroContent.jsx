import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import { useRef, useState } from "react";
import HeroActions from "./HeroActions.jsx";
import AnimatedName from "../../components/hero/AnimatedName.jsx";

function HeroContent() {
  const shouldReduceMotion = useReducedMotion();
  const [isPronunciationHovered, setIsPronunciationHovered] = useState(false);

  const [isPronunciationFocused, setIsPronunciationFocused] = useState(false);

  const [isPronunciationActivated, setIsPronunciationActivated] =
    useState(false);

  const showPronunciationNote =
    isPronunciationHovered ||
    isPronunciationFocused ||
    isPronunciationActivated;

  const entranceInitial = shouldReduceMotion
    ? false
    : {
        opacity: 0,
        y: 10,
      };
  const [isHighlighted, setIsHighlighted] = useState(false);
  function getEntranceTransition(delay) {
    return {
      duration: shouldReduceMotion ? 0 : 0.45,
      delay: shouldReduceMotion ? 0 : delay,
      ease: "easeOut",
    };
  }

  return (
    <div className="relative z-20 max-w-2xl">
      <motion.p
        initial={entranceInitial}
        animate={{ opacity: 1, y: 0 }}
        transition={getEntranceTransition(0.12)}
        className="mb-5 text-sm font-medium uppercase tracking-[0.28em] text-orange-400"
      >
        <span className="relative inline-block pb-3">
          AI / ML Engineer
          <span className="absolute bottom-0 left-0 h-px w-[160%] origin-left bg-gradient-to-r from-white via-white/70 to-transparent" />
        </span>
      </motion.p>

      <motion.h1
        initial={entranceInitial}
        animate={{ opacity: 1, y: 0 }}
        transition={getEntranceTransition(0.22)}
        className="text-5xl font-light leading-[0.95] tracking-[-0.04em] text-white sm:text-6xl lg:text-8xl"
      >
        Hi, I'm
        <br />
        <AnimatedName onComplete={setIsHighlighted} />
      </motion.h1>

      <motion.div
        initial={entranceInitial}
        animate={{ opacity: 1, y: 0 }}
        transition={getEntranceTransition(0.32)}
        className="mt-5 h-7"
      >
        <motion.button
          type="button"
          onHoverStart={() => setIsPronunciationHovered(true)}
          onHoverEnd={() => setIsPronunciationHovered(false)}
          onFocus={() => setIsPronunciationFocused(true)}
          onBlur={() => {
            setIsPronunciationFocused(false);
            setIsPronunciationActivated(false);
          }}
          onClick={() => {
            setIsPronunciationActivated((currentState) => !currentState);
          }}
          aria-label={
            showPronunciationNote
              ? "Yeah, that's my spelling and that's my pronunciation."
              : "Pronunciation: pi yu sh. Activate to reveal more."
          }
          className="block h-full bg-transparent p-0 text-left text-white/55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
        >
          <span className="relative block h-7 overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={
                  showPronunciationNote ? "pronunciation-note" : "pronunciation"
                }
                initial={
                  shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }
                }
                animate={{ opacity: 1, y: 0 }}
                exit={
                  shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }
                }
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.22,
                  ease: "easeOut",
                }}
                className="block whitespace-nowrap text-sm leading-6 sm:text-base"
              >
                {showPronunciationNote
                  ? "Yeah, that's my spelling and that's my pronunciation."
                  : "pi — yu — sh"}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.button>
      </motion.div>

      <motion.p
        initial={entranceInitial}
        animate={{ opacity: 1, y: 0 }}
        transition={getEntranceTransition(0.42)}
        className={`mt-6 max-w-xl text-base leading-7 transition-colors duration-500 sm:text-lg sm:leading-8 lg:text-xl ${
          isHighlighted ? "text-white/55" : "text-white"
        }`}
      >
        I combine{" "}
        <span
          className={`rounded-sm transition-all duration-500 ${
            isHighlighted ? "bg-white/10 px-1 font-medium text-orange-400" : ""
          }`}
        >
          AI/ML, backend development, and DevOps
        </span>{" "}
        to turn research and ideas into{" "}
        <span
          className={`rounded-sm transition-all duration-500 ${
            isHighlighted ? "bg-white/10 px-1 font-medium text-orange-400" : ""
          }`}
        >
          production-ready applications
        </span>
        .
      </motion.p>

      <HeroActions />
    </div>
  );
}

export default HeroContent;
