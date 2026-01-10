
import Navigation from "./Navigation";
import Hero from "./Hero";
import Projects from "./Projects";
import TechnologyTools from "./TechnologyTools";
import Education from "./Education";
import Contact from "./Contact";
import Footer from "./Footer";

const Portfolio = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
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
