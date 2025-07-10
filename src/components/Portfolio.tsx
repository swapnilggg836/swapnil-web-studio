import Navigation from "./Navigation";
import Hero from "./Hero";
import Projects from "./Projects";
import Skills from "./Skills";
import Education from "./Education";
import Contact from "./Contact";

const Portfolio = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <Projects />
        <Skills />
        <Education />
        <Contact />
      </main>
      
      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            © Created by Swapnil Gaikwad
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;