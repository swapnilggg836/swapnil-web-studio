import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navItems = [
    { href: "#hero", label: "Home" },
    { href: "#skills", label: "Skills" },
    { href: "#projects", label: "Projects" },
    { href: "#technology", label: "Technology" },
    { href: "#experience", label: "Experience" },
    { href: "#education", label: "Education" },
    { href: "#achievements", label: "Achievements" },
    { href: "#contact", label: "Contact" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled
          ? "rgba(0, 0, 0, 0.92)"
          : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.5)" : "none",
      }}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection("#hero")}>
            <img
              src="/logo.svg"
              alt="Swapnil Logo"
              className="w-10 h-10 rounded-full"
              style={{ boxShadow: "0 0 16px hsl(199,89%,48%,0.5)" }}
            />
            <span className="font-black text-xl tracking-tight text-white">
              Swapnil<span style={{ color: "hsl(199,89%,48%)" }}>.</span>
            </span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white transition-all duration-200 hover:bg-white/5"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Hire Me CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="mailto:swapnilg836@gmail.com"
              className="btn-pill btn-pill-primary text-sm"
              style={{ padding: "0.5rem 1.25rem" }}
            >
              Hire Me
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-all"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile nav */}
        {isOpen && (
          <div
            className="md:hidden py-4 border-t animate-fade-in"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}
          >
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className="px-4 py-3 text-left text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all text-sm font-medium"
                >
                  {item.label}
                </button>
              ))}
              <a
                href="mailto:swapnilg836@gmail.com"
                className="btn-pill btn-pill-primary mt-2 text-sm justify-center"
              >
                Hire Me
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
