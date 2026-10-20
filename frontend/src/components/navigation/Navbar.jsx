import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const navigationLinks = [
  { label: "Home", href: "#hero" },
  { label: "About Me", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

function Navbar({ onHomeClick, onAboutClick, onProjectsClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function toggleMenu() {
    setIsMenuOpen((currentState) => !currentState);
  }

  function handleNavigationClick(link) {
    closeMenu();

    if (link.href === "#hero") {
      onHomeClick?.();
    }

    if (link.href === "#about") {
      onAboutClick?.();
    }

    if (link.href === "#projects") {
      onProjectsClick?.();
    }
  }

  function handleHomeLogoClick() {
    closeMenu();
    onHomeClick?.();
  }

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    }

    function handleOutsideClick(event) {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        closeMenu();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handleOutsideClick);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, [isMenuOpen]);

  return (
    <motion.header
      initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.45,
        ease: "easeOut",
      }}
      className="absolute inset-x-0 top-0 z-50 px-5 pt-5 sm:px-8 lg:px-10"
    >
      <div
        ref={menuRef}
        className="relative mx-auto flex max-w-7xl items-center justify-between"
      >
        <a
          href="#hero"
          onClick={handleHomeLogoClick}
          className="text-sm font-semibold tracking-tight text-white sm:text-base"
        >
          PEEYOUSH SHAH
        </a>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-8 rounded-full border border-white/10 bg-black/20 px-7 py-3 backdrop-blur-xl md:flex">
          {navigationLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => handleNavigationClick(link)}
              className="text-sm text-white/80 transition-colors duration-200 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Mobile navigation */}
        <div className="md:hidden">
          <button
            type="button"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/30 backdrop-blur-xl transition-colors duration-200 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400"
          >
            <span className="sr-only">
              {isMenuOpen ? "Close navigation" : "Open navigation"}
            </span>

            <span className="relative flex h-4 w-4 items-center justify-center">
              <motion.span
                animate={{
                  rotate: isMenuOpen ? 45 : 0,
                  y: isMenuOpen ? 0 : -3,
                }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                className="absolute block h-0.5 w-4 rounded-full bg-white"
              />

              <motion.span
                animate={{
                  rotate: isMenuOpen ? -45 : 0,
                  y: isMenuOpen ? 0 : 3,
                }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                className="absolute block h-0.5 w-4 rounded-full bg-white"
              />
            </span>
          </button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.nav
                id="mobile-navigation"
                initial={
                  shouldReduceMotion
                    ? false
                    : {
                        opacity: 0,
                        scale: 0.96,
                        y: -8,
                      }
                }
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.96,
                  y: -8,
                }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.2,
                  ease: "easeOut",
                }}
                className="absolute right-0 top-14 w-56 overflow-hidden rounded-2xl border border-white/10 bg-black/70 p-2 shadow-2xl backdrop-blur-xl"
              >
                {navigationLinks.map((link, index) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={() => handleNavigationClick(link)}
                    initial={
                      shouldReduceMotion
                        ? false
                        : {
                            opacity: 0,
                            x: -5,
                          }
                    }
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      duration: shouldReduceMotion ? 0 : 0.2,
                      delay: shouldReduceMotion ? 0 : index * 0.04,
                    }}
                    className="block rounded-xl px-4 py-3 text-sm text-white/75 transition-colors duration-200 hover:bg-white/5 hover:text-orange-400"
                  >
                    {link.label}
                  </motion.a>
                ))}
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
}

export default Navbar;
