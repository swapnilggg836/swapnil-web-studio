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
import Preloader from "./Preloader";

const Portfolio = () => {
  return (
    <div className="min-h-screen" style={{ background: "#000" }}>
      {/* Preloader */}
      <Preloader />

      <SectionErrorBoundary name="Navigation">
        <Navigation />
      </SectionErrorBoundary>

      <main>
        <SectionErrorBoundary name="Hero">
          <Hero />
        </SectionErrorBoundary>

        {/* Section divider */}
        <div className="section-divider" />

        <SectionErrorBoundary name="Skills">
          <Skills />
        </SectionErrorBoundary>

        <div className="section-divider" />

        <SectionErrorBoundary name="Projects">
          <Projects />
        </SectionErrorBoundary>

        <div className="section-divider" />

        <SectionErrorBoundary name="TechnologyTools">
          <TechnologyTools />
        </SectionErrorBoundary>

        <div className="section-divider" />

        <SectionErrorBoundary name="Experience">
          <Experience />
        </SectionErrorBoundary>

        <div className="section-divider" />

        <SectionErrorBoundary name="Education">
          <Education />
        </SectionErrorBoundary>

        <div className="section-divider" />

        <SectionErrorBoundary name="Achievements">
          <Achievements />
        </SectionErrorBoundary>

        <div className="section-divider" />

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
