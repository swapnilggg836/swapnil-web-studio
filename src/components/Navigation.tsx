import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { href: "#hero", label: "Home" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#technology", label: "Tech" },
  { href: "#experience", label: "Experience" },
  { href: "#education", label: "Education" },
  { href: "#achievements", label: "Achievements" },
  { href: "#contact", label: "Contact" },
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track active section via IntersectionObserver
  useEffect(() => {
    const sections = navItems.map(item => item.href.replace("#", ""));
    const observers: IntersectionObserver[] = [];

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const scrollToSection = (href: string) => {
    const id = href.replace("#", "");
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(5,5,5,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(24px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "none",
          boxShadow: scrolled ? "0 4px 40px rgba(0,0,0,0.6)" : "none",
        }}
      >
        {/* Gradient top-border on scroll */}
        {scrolled && (
          <div
            className="absolute top-0 left-0 right-0 h-px pointer-events-none"
            style={{
              background: "linear-gradient(90deg, transparent, hsl(199,89%,48%,0.4), hsl(270,70%,60%,0.3), transparent)",
            }}
          />
        )}

        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection("#hero")}>
              <div
                className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
                style={{ boxShadow: "0 0 16px hsl(199,89%,48%,0.5)" }}
              >
                <img src="/logo.svg" alt="Swapnil Logo" className="w-full h-full object-cover" />
              </div>
              <span
                className="font-black text-xl tracking-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                <span className="text-white">Swapnil</span>
                <span className="text-gradient-cyan">.</span>
              </span>
            </div>

            {/* Desktop nav */}
            <div ref={navRef} className="hidden md:flex items-center gap-1 relative">
              {navItems.map(item => {
                const sectionId = item.href.replace("#", "");
                const isActive = activeSection === sectionId;
                return (
                  <button
                    key={item.href}
                    onClick={() => scrollToSection(item.href)}
                    className={`fancy-underline px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive ? "text-white active" : "text-white/60 hover:text-white"
                    } hover:bg-white/5`}
                    style={isActive ? { color: "hsl(199,89%,65%)" } : {}}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Hire Me CTA — desktop */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href="mailto:swapnilg836@gmail.com"
                className="btn-pill btn-pill-primary text-sm"
                style={{ padding: "0.5rem 1.25rem" }}
              >
                Hire Me
              </a>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-all"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className="fixed inset-0 z-[60] md:hidden transition-all duration-300"
        style={{
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
        }}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile slide-in panel */}
      <div
        className="fixed top-0 right-0 bottom-0 z-[70] w-[80vw] max-w-xs md:hidden flex flex-col"
        style={{
          background: "rgba(8,8,8,0.97)",
          backdropFilter: "blur(30px)",
          borderLeft: "1px solid rgba(255,255,255,0.07)",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(.16,1,.3,1)",
          boxShadow: isOpen ? "-20px 0 60px rgba(0,0,0,0.8)" : "none",
        }}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between p-6 border-b border-white/06">
          <span
            className="font-black text-lg text-white"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Menu
          </span>
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/08 transition-all"
            onClick={() => setIsOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav links */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-1">
          {navItems.map((item, i) => {
            const sectionId = item.href.replace("#", "");
            const isActive = activeSection === sectionId;
            return (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className="text-left px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-200"
                style={{
                  background: isActive ? "hsl(199,89%,48%,0.12)" : "transparent",
                  border: isActive ? "1px solid hsl(199,89%,48%,0.25)" : "1px solid transparent",
                  color: isActive ? "hsl(199,89%,65%)" : "rgba(255,255,255,0.65)",
                  transitionDelay: isOpen ? `${i * 30}ms` : "0ms",
                  transform: isOpen ? "translateX(0)" : "translateX(20px)",
                  opacity: isOpen ? 1 : 0,
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="p-5 border-t border-white/06">
          <a
            href="mailto:swapnilg836@gmail.com"
            className="btn-pill btn-pill-primary w-full justify-center text-sm"
          >
            Hire Me
          </a>
        </div>
      </div>
    </>
  );
};

export default Navigation;
