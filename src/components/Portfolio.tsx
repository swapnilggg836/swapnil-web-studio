import { useState, useCallback } from "react";
import Preloader from "./Preloader";
import Navigation from "./Navigation";
import Hero from "./Hero";
import Skills from "./Skills";
import Projects from "./Projects";
import TechnologyTools from "./TechnologyTools";
import Experience from "./Experience";
import Education from "./Education";
import Achievements from "./Achievements";
import Contact from "./Contact";
import Footer from "./Footer";

const Portfolio = () => {
  const [preloaderDone, setPreloaderDone] = useState(false);

  const handlePreloaderComplete = useCallback(() => {
    setPreloaderDone(true);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#000" }}>
      {!preloaderDone && <Preloader onComplete={handlePreloaderComplete} />}
      <Navigation />
      <main>
        <Hero />
        <Skills />
        <Projects />
        <TechnologyTools />
        <Experience />
        <Education />
        <Achievements />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Portfolio;
