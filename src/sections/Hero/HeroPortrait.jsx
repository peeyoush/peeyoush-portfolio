
import { motion, useReducedMotion } from "motion/react";

import peeyoushCutout from "../../assets/hero/peeyoush-cutout.png";

function HeroPortrait() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              x: 12,
              y: 6,
            }
      }
      animate={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.6,
        delay: shouldReduceMotion ? 0 : 0.12,
        ease: "easeOut",
      }}
      className="relative w-[88%] max-w-[480px] md:w-[70%] lg:w-[100%] lg:max-w-[640px]"
    >
      <motion.div
        animate={
          shouldReduceMotion
            ? { y: 0 }
            : { y: [0, -5, 0] }
        }
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : {
                y: {
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.6,
                },
              }
        }
        className="relative"
      >
        <div className="absolute inset-x-[10%] bottom-[15%] h-[60%] rounded-full bg-orange-600/20 blur-[100px]" />

        <img
          src={peeyoushCutout}
          alt="Peeyoush Shah"
          className="relative block h-auto w-full object-contain [mask-image:linear-gradient(to_bottom,black_0%,black_82%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_82%,transparent_100%)]"
        />
      </motion.div>
    </motion.div>
  );
}

export default HeroPortrait;
