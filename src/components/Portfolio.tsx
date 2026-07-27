import { useState } from "react";
import Preloader from "./Preloader";
import Navigation from "./Navigation";
import Hero from "./Hero";
import Skills from "./Skills";
import Projects from "./Projects";
import TechnologyTools from "./TechnologyTools";
import Education from "./Education";
import Contact from "./Contact";
import Footer from "./Footer";

const Portfolio = () => {
  const [preloaderDone, setPreloaderDone] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: "#000" }}>
      {!preloaderDone && <Preloader onComplete={() => setPreloaderDone(true)} />}
      <Navigation />
      <main>
        <Hero />
        <Skills />
        <Projects />
        <TechnologyTools />
        <Education />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Portfolio;
