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
  return (
    <div className="min-h-screen" style={{ background: "#000" }}>
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
