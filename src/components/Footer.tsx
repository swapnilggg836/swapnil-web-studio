import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Github, Linkedin, Mail, MessageCircle } from "lucide-react";

const marqueeItems = [
  "Web Developer", "React.js", "AI Engineer", "Node.js", "Python",
  "Supabase", "Full-Stack", "TypeScript", "Open to Work", "Data Science",
  "Web Developer", "React.js", "AI Engineer", "Node.js", "Python",
  "Supabase", "Full-Stack", "TypeScript", "Open to Work", "Data Science",
];

const Footer = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  const socials = [
    { href: "https://github.com/swapnilggg836", icon: Github, label: "GitHub" },
    { href: "https://www.linkedin.com/in/swapnil-gaikwad-3136a4275/", icon: Linkedin, label: "LinkedIn" },
    { href: "mailto:swapnilg836@gmail.com", icon: Mail, label: "Gmail" },
    { href: "https://wa.me/918605887561", icon: MessageCircle, label: "WhatsApp" },
    { href: "mailto:swapnilg836@outlook.com", icon: Mail, label: "Outlook" },
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

  const scrollTo = (href: string) => document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden"
      style={{ background: "#000", borderTop: "1px solid rgba(255,255,255,0.04)" }}
    >
      {/* Gradient top border */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, hsl(199,89%,48%,0.3), hsl(270,70%,60%,0.25), transparent)" }}
      />

      {/* Marquee ribbon */}
      <div
        className="py-3 overflow-hidden border-b"
        style={{ borderColor: "rgba(255,255,255,0.04)" }}
      >
        <div className="marquee-wrapper">
          <div className="marquee-track">
            {marqueeItems.map((item, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-3 px-6"
                style={{ color: i % 2 === 0 ? "rgba(255,255,255,0.25)" : "hsl(199,89%,48%,0.5)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", whiteSpace: "nowrap" }}
              >
                {item}
                <span style={{ color: "hsl(199,89%,48%,0.3)" }}>✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Brand display */}
      <div className="relative py-16 text-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 50% at 50% 50%, hsl(199,89%,48%,0.04) 0%, transparent 70%)" }}
        />
        <div
          className="font-black select-none leading-none cursor-default"
          style={{
            fontSize: "clamp(5rem, 18vw, 14rem)",
            letterSpacing: "-0.04em",
            fontFamily: "'Space Grotesk', sans-serif",
            color: "rgba(255,255,255,0.05)",
            transition: "color 0.4s ease",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.color = "transparent";
            (e.currentTarget as HTMLElement).style.background = "linear-gradient(135deg, hsl(199,89%,48%), hsl(270,70%,60%))";
            (e.currentTarget as HTMLElement).style.webkitBackgroundClip = "text";
            (e.currentTarget as HTMLElement).style.backgroundClip = "text";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.05)";
            (e.currentTarget as HTMLElement).style.background = "";
          }}
        >
          swapnil
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none">
          <div className="section-badge">Web Developer &amp; AI Engineer</div>
          <p className="text-white/25 text-sm tracking-wider">Building the web, one line at a time.</p>
        </div>
      </div>

      {/* Footer links grid */}
      <div className="py-8" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-10">

            {/* Brand column */}
            <div
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.65s cubic-bezier(.16,1,.3,1) 0s",
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-9 h-9 rounded-full overflow-hidden"
                  style={{ boxShadow: "0 0 14px hsl(199,89%,48%,0.4)" }}
                >
                  <img src="/logo.svg" alt="Swapnil Logo" className="w-full h-full object-cover" />
                </div>
                <span
                  className="font-black text-lg tracking-tight"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  <span className="text-white">Swapnil</span>
                  <span className="text-gradient-cyan">.</span>
                </span>
              </div>
              <p className="text-white/30 text-sm leading-relaxed max-w-xs">
                Passionate web developer &amp; AI student crafting innovative digital experiences.
              </p>
            </div>

            {/* Nav links */}
            <div
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.65s cubic-bezier(.16,1,.3,1) 0.08s",
              }}
            >
              <h4 className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-4">Navigation</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {navLinks.map(link => (
                  <button
                    key={link.href}
                    onClick={() => scrollTo(link.href)}
                    className="text-left text-white/35 hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact info + socials */}
            <div
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.65s cubic-bezier(.16,1,.3,1) 0.16s",
              }}
            >
              <h4 className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-4">Contact</h4>
              <div className="space-y-2 mb-6">
                <p className="text-white/55 text-sm font-medium">swapnilg836@gmail.com</p>
                <p className="text-white/30 text-xs">Outlook: swapnilg836@outlook.com</p>
                <p className="text-white/30 text-xs">WhatsApp: +91 8605887561</p>
                <p className="text-white/30 text-sm">Yeola, Nashik – 423401, Maharashtra</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: "hsl(142,70%,50%)", boxShadow: "0 0 6px hsl(142,70%,50%)", animation: "glowPulse 1.5s ease-in-out infinite" }}
                  />
                  <span className="text-white/30 text-xs">Available for opportunities</span>
                </div>
              </div>

              {/* Social icons */}
              <div className="flex items-center gap-3 flex-wrap">
                {socials.map(social => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white/35 transition-all duration-300"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px) scale(1.1)";
                        (e.currentTarget as HTMLElement).style.borderColor = "hsl(199,89%,48%,0.5)";
                        (e.currentTarget as HTMLElement).style.color = "hsl(199,89%,55%)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 0 14px hsl(199,89%,48%,0.3)";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.transform = "";
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                        (e.currentTarget as HTMLElement).style.color = "";
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
            style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
          >
            <p
              className="text-white/20 text-xs cursor-pointer hover:text-white/40 transition-colors select-none"
              onClick={() => navigate("/admin/login")}
              title="Admin Access"
            >
              © {new Date().getFullYear()} Swapnil Gaikwad. All rights reserved.
            </p>
            <p className="text-white/15 text-xs">
              Yeola, Nashik 423401, Maharashtra 🇮🇳
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
