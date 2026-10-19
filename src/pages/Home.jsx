import { useState } from "react";

import Navbar from "../components/navigation/Navbar.jsx";
import Hero from "../sections/Hero/Hero.jsx";
import About from "../sections/About/About.jsx";
import Skills from "../sections/Skills/Skills.jsx";
import Projects from "../sections/Projects/Projects.jsx";
import Contact from "../sections/Contact/Contact.jsx";

function Home() {
  const [heroAnimationKey, setHeroAnimationKey] = useState(0);
  const [aboutFlightReplayKey, setAboutFlightReplayKey] = useState(0);

  function replayHeroAnimation() {
    setHeroAnimationKey((currentKey) => currentKey + 1);
  }

  function replayAboutFlightAnimation() {
    setAboutFlightReplayKey((currentKey) => currentKey + 1);
  }

  return (
    <div>
      <Navbar
        onHomeClick={replayHeroAnimation}
        onAboutClick={replayAboutFlightAnimation}
      />

      <Hero key={heroAnimationKey} />
      <About flightReplayKey={aboutFlightReplayKey} />
      <Skills />
      <Projects />
      <Contact />
    </div>
  );
}

export default Home;
