import { useNavigate } from "react-router-dom";
import { Github, Linkedin, Instagram, Mail } from "lucide-react";

const Footer = () => {
  const navigate = useNavigate();

  const socials = [
    { href: "https://github.com/swapnilggg836", icon: Github, label: "GitHub" },
    { href: "https://linkedin.com/in/swapnil-gaikwad", icon: Linkedin, label: "LinkedIn" },
    { href: "https://instagram.com/swapnil_gaikwad", icon: Instagram, label: "Instagram" },
    { href: "mailto:swapnilgaikwad@example.com", icon: Mail, label: "Email" },
  ];

  const navLinks = [
    { label: "Home", href: "#hero" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Technology", href: "#technology" },
    { label: "Experience", href: "#experience" },
    { label: "Education", href: "#education" },
    { label: "Achievements", href: "#achievements" },
    { label: "Contact", href: "#contact" },
  ];

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: "#000", borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      {/* Huge brand name display */}
      <div className="relative py-16 text-center overflow-hidden">
        {/* Glow behind name */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 80% 50% at 50% 50%, hsl(199,89%,48%,0.05) 0%, transparent 70%)",
          }}
        />
        <div
          className="font-black text-white/[0.06] select-none leading-none"
          style={{
            fontSize: "clamp(5rem, 18vw, 14rem)",
            letterSpacing: "-0.04em",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          swapnil
        </div>
        {/* Tagline overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none">
          <div className="section-badge">
            Web Developer & AI Engineer
          </div>
          <p className="text-white/30 text-sm tracking-wider">
            Building the web, one line at a time.
          </p>
        </div>
      </div>

      {/* Footer links row */}
      <div
        className="py-8"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-10">
            {/* Brand column */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/logo.svg"
                  alt="Swapnil Logo"
                  className="w-9 h-9 rounded-full"
                  style={{ boxShadow: "0 0 14px hsl(199,89%,48%,0.4)" }}
                />
                <span className="font-black text-white text-lg tracking-tight">
                  Swapnil<span style={{ color: "hsl(199,89%,48%)" }}>.</span>
                </span>
              </div>
              <p className="text-white/35 text-sm leading-relaxed max-w-xs">
                Passionate web developer & AI student crafting innovative digital experiences.
              </p>
            </div>

            {/* Nav links */}
            <div>
              <h4 className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-4">Navigation</h4>
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => scrollTo(link.href)}
                    className="text-left text-white/40 hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact info */}
            <div>
              <h4 className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-4">Contact</h4>
              <div className="space-y-2 mb-6">
                <p className="text-white/40 text-sm">swapnilgaikwad@example.com</p>
                <p className="text-white/40 text-sm">Nashik, Maharashtra, India</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span
                    className="w-2 h-2 rounded-full animate-glow-pulse"
                    style={{ background: "hsl(142,70%,50%)" }}
                  />
                  <span className="text-white/40 text-xs">Available for opportunities</span>
                </div>
              </div>
              {/* Social icons */}
              <div className="flex items-center gap-3">
                {socials.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-all duration-300"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.07)",
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = "hsl(199,89%,48%,0.5)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 0 12px hsl(199,89%,48%,0.3)";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "none";
                      }}
                    >
                      <Icon size={15} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            <p
              className="text-white/25 text-xs cursor-pointer hover:text-white/50 transition-colors select-none"
              onClick={() => navigate("/admin/login")}
              title="Admin Access"
            >
              © {new Date().getFullYear()} Swapnil Gaikwad. All rights reserved.
            </p>
            <p className="text-white/20 text-xs">
              Nashik, Maharashtra 🇮🇳
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
