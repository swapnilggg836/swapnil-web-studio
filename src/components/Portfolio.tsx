import SectionErrorBoundary from "./ErrorBoundary";
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
      <SectionErrorBoundary name="Navigation">
        <Navigation />
      </SectionErrorBoundary>

      <main>
        <SectionErrorBoundary name="Hero">
          <Hero />
        </SectionErrorBoundary>

        <SectionErrorBoundary name="Skills">
          <Skills />
        </SectionErrorBoundary>

        <SectionErrorBoundary name="Projects">
          <Projects />
        </SectionErrorBoundary>

        <SectionErrorBoundary name="TechnologyTools">
          <TechnologyTools />
        </SectionErrorBoundary>

        <SectionErrorBoundary name="Experience">
          <Experience />
        </SectionErrorBoundary>

        <SectionErrorBoundary name="Education">
          <Education />
        </SectionErrorBoundary>

        <SectionErrorBoundary name="Achievements">
          <Achievements />
        </SectionErrorBoundary>

        <SectionErrorBoundary name="Contact">
          <Contact />
        </SectionErrorBoundary>
      </main>

      <SectionErrorBoundary name="Footer">
        <Footer />
      </SectionErrorBoundary>
    </div>
  );
};

export default Portfolio;
