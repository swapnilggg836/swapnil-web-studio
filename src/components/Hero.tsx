import { useState, useEffect, useRef } from "react";
import { Github, Linkedin, Instagram, Facebook, Download, Mail, Twitter, Youtube, MessageCircle, Globe, Phone, ArrowDown, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import profilePhotoFallback from "@/assets/profile-photo.jpg";

interface ProfileInfo {
  profile_image_url: string | null;
  name: string;
  title: string;
  description: string;
}

interface Resume {
  file_url: string;
  file_name: string;
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  display_order: number;
}

const iconMap: Record<string, any> = {
  Linkedin, Github, Mail, Instagram, Facebook, Twitter, Youtube, MessageCircle, Globe, Phone,
};

// Random particles for background
const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 1,
  delay: Math.random() * 5,
  duration: Math.random() * 4 + 4,
}));

const Hero = () => {
  const [profileInfo, setProfileInfo] = useState<ProfileInfo | null>(null);
  const [resume, setResume] = useState<Resume | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [visible, setVisible] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [profileRes, resumeRes, socialRes] = await Promise.all([
        supabase.from("profile_info").select("*").limit(1).maybeSingle(),
        supabase.from("resume").select("*").limit(1).maybeSingle(),
        supabase.from("social_links").select("*").order("display_order", { ascending: true }),
      ]);
      if (profileRes.data) setProfileInfo(profileRes.data);
      if (resumeRes.data) setResume(resumeRes.data);
      if (socialRes.data && socialRes.data.length > 0) {
        setSocialLinks(socialRes.data);
      } else {
        setSocialLinks([
          { id: "1", platform: "GitHub", url: "https://github.com/swapnilggg836", icon: "Github", display_order: 0 },
          { id: "2", platform: "LinkedIn", url: "https://linkedin.com/in/swapnil-gaikwad", icon: "Linkedin", display_order: 1 },
          { id: "3", platform: "Gmail", url: "mailto:swapnilg836@gmail.com", icon: "Mail", display_order: 2 },
          { id: "4", platform: "WhatsApp", url: "https://wa.me/918605887561", icon: "MessageCircle", display_order: 3 },
          { id: "5", platform: "Outlook", url: "mailto:swapnilg836@outlook.com", icon: "Mail", display_order: 4 },
        ]);
      }
    };
    fetchData();

    const t = setTimeout(() => {
      setVisible(true);
      setMounted(true);
    }, 100);
    return () => clearTimeout(t);
  }, []);

  // Cursor spotlight tracker
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty("--cursor-x", `${x}%`);
      el.style.setProperty("--cursor-y", `${y}%`);
      setCursorPos({ x, y });
    };
    el.addEventListener("mousemove", handleMove);
    return () => el.removeEventListener("mousemove", handleMove);
  }, []);

  const handleDownloadResume = () => {
    if (resume?.file_url) {
      window.open(resume.file_url, "_blank");
    } else {
      const link = document.createElement("a");
      link.href = "/resume.pdf";
      link.download = "Swapnil_Gaikwad_Resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const name = profileInfo?.name || "Swapnil Gaikwad";
  const title = profileInfo?.title || "Web Developer";
  const description = profileInfo?.description || "To create dynamic, responsive, and secure web applications that enhance user experience and meet business goals.";
  const profileImage = profileInfo?.profile_image_url || profilePhotoFallback;

  const scrollToProjects = () => document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" });
  const scrollToContact = () => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-noise"
      style={{ background: "#000" }}
    >
      {/* Cursor spotlight */}
      <div className="cursor-spotlight" />

      {/* Background grid */}
      <div className="absolute inset-0 bg-grid pointer-events-none" style={{ opacity: 0.5 }} />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {PARTICLES.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: p.id % 3 === 0 ? "hsl(199,89%,60%)" : p.id % 3 === 1 ? "hsl(270,70%,70%)" : "rgba(255,255,255,0.4)",
              animation: `particleDrift ${p.duration}s ${p.delay}s ease-in-out infinite`,
              opacity: 0.4,
            }}
          />
        ))}
      </div>

      {/* Background blobs */}
      <div
        className="absolute pointer-events-none animate-blob"
        style={{
          top: "10%", left: "-10%",
          width: "700px", height: "700px",
          borderRadius: "50%",
          background: "radial-gradient(circle, hsl(199,89%,48%,0.1) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute pointer-events-none animate-blob"
        style={{
          bottom: "10%", right: "-10%",
          width: "600px", height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, hsl(270,70%,60%,0.07) 0%, transparent 70%)",
          filter: "blur(70px)",
          animationDelay: "3s",
        }}
      />

      <div className="container mx-auto px-6 pt-24 pb-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Text content */}
          <div className="space-y-8">

            {/* Available badge */}
            <div
              className="section-badge"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transition: "all 0.6s cubic-bezier(.16,1,.3,1)",
              }}
            >
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{
                  background: "hsl(142,70%,50%)",
                  boxShadow: "0 0 6px hsl(142,70%,50%)",
                  animation: "glowPulse 1.5s ease-in-out infinite",
                }}
              />
              Available for opportunities
            </div>

            {/* Greeting + Name */}
            <div
              className="space-y-2"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(28px)",
                transition: "all 0.7s cubic-bezier(.16,1,.3,1) 0.1s",
              }}
            >
              <p className="text-white/45 text-lg font-medium tracking-wide">Hi there 👋, I am</p>
              <h1
                className="font-black tracking-tighter text-white leading-none"
                style={{
                  fontSize: "clamp(3rem, 7vw, 5.5rem)",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {name}
              </h1>
              <div className="flex items-center gap-3 flex-wrap pt-1">
                <span
                  className="px-4 py-1.5 rounded-full text-sm font-semibold"
                  style={{
                    background: "hsl(199,89%,48%,0.12)",
                    border: "1px solid hsl(199,89%,48%,0.35)",
                    color: "hsl(199,89%,65%)",
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {/* Typewriter effect on title */}
                  <span
                    className="inline-block overflow-hidden border-r-2 whitespace-nowrap"
                    style={{
                      borderColor: "hsl(199,89%,48%)",
                      animation: mounted
                        ? "typing 2s steps(40, end) 0.6s both, blinkCursor 0.75s step-end infinite"
                        : "none",
                      maxWidth: mounted ? `${Math.max(title.length + 2, 50)}ch` : "0ch",
                    }}
                  >
                    {title}
                  </span>
                </span>
                <span className="text-white/25 text-sm hidden sm:block">•</span>
                <span className="text-white/35 text-sm hidden sm:block">AI &amp; Data Science Student</span>
              </div>
            </div>

            {/* Description */}
            <p
              className="text-white/50 leading-relaxed max-w-lg"
              style={{
                fontSize: "1.05rem",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transition: "all 0.7s cubic-bezier(.16,1,.3,1) 0.2s",
              }}
            >
              {description}
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-wrap gap-3"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transition: "all 0.7s cubic-bezier(.16,1,.3,1) 0.3s",
              }}
            >
              <button onClick={scrollToProjects} className="btn-pill btn-pill-primary" id="hero-view-work-btn">
                <ExternalLink size={16} />
                View My Work
              </button>
              <button onClick={scrollToContact} className="btn-pill btn-pill-outline" id="hero-contact-btn">
                <Mail size={16} />
                Contact Me
              </button>
              <button onClick={handleDownloadResume} className="btn-pill btn-pill-outline" id="hero-resume-btn">
                <Download size={16} />
                Resume
              </button>
            </div>

            {/* Social links — mobile row */}
            {socialLinks.length > 0 && (
              <div
                className="flex items-center gap-3 lg:hidden"
                style={{ opacity: visible ? 1 : 0, transition: "opacity 0.7s ease 0.4s" }}
              >
                {socialLinks.map(link => {
                  const IconComponent = iconMap[link.icon] || Globe;
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      aria-label={link.platform}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white/50 hover:text-white transition-all duration-300"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = "hsl(199,89%,48%,0.6)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 0 16px hsl(199,89%,48%,0.3)";
                        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "none";
                        (e.currentTarget as HTMLElement).style.transform = "";
                      }}
                    >
                      <IconComponent size={17} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right — Profile image */}
          <div className="flex justify-center lg:justify-end relative">
            {/* Floating vertical social rail — desktop */}
            {socialLinks.length > 0 && (
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3 items-center"
                style={{ opacity: visible ? 1 : 0, transition: "opacity 0.7s ease 0.5s" }}
              >
                {socialLinks.map(link => {
                  const IconComponent = iconMap[link.icon] || Globe;
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      aria-label={link.platform}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-all duration-300"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = "hsl(199,89%,48%,0.5)";
                        (e.currentTarget as HTMLElement).style.color = "hsl(199,89%,55%)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 0 16px hsl(199,89%,48%,0.3)";
                        (e.currentTarget as HTMLElement).style.transform = "translateX(2px)";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                        (e.currentTarget as HTMLElement).style.color = "";
                        (e.currentTarget as HTMLElement).style.boxShadow = "none";
                        (e.currentTarget as HTMLElement).style.transform = "";
                      }}
                    >
                      <IconComponent size={17} />
                    </a>
                  );
                })}
                <div className="w-px h-12" style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.1), transparent)" }} />
              </div>
            )}

            {/* Profile image */}
            <div
              className="relative animate-float"
              style={{ opacity: visible ? 1 : 0, transition: "opacity 0.8s ease 0.3s" }}
            >
              {/* Outer glow */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background: "radial-gradient(circle, hsl(199,89%,48%,0.18) 0%, transparent 70%)",
                  transform: "scale(1.2)",
                  animation: "glowPulse 3s ease-in-out infinite",
                }}
              />

              {/* Spinning rainbow conic border */}
              <div
                className="absolute inset-0 rounded-full animate-rotate-slow pointer-events-none"
                style={{
                  background: "conic-gradient(from 0deg, hsl(199,89%,48%), hsl(270,70%,60%), hsl(330,80%,60%), hsl(199,89%,48%))",
                  padding: "2px",
                  borderRadius: "50%",
                }}
              />

              {/* Image */}
              <div
                className="relative w-72 h-72 md:w-80 md:h-80 rounded-full overflow-hidden"
                style={{
                  border: "3px solid rgba(255,255,255,0.05)",
                  boxShadow: "0 0 80px hsl(199,89%,48%,0.2), 0 40px 100px rgba(0,0,0,0.8)",
                }}
              >
                <img src={profileImage} alt={name} className="w-full h-full object-cover" />
                {/* Overlay gradient */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ background: "linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.35))" }}
                />
              </div>

              {/* Stat badges */}
              <div
                className="absolute -bottom-3 -left-4 px-4 py-2 text-center rounded-xl"
                style={{
                  background: "rgba(10,10,10,0.9)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                  minWidth: "100px",
                }}
              >
                <div className="font-black text-xl text-gradient-cyan" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>8+</div>
                <div className="text-white/45 text-xs">Projects</div>
              </div>
              <div
                className="absolute -top-2 -right-4 px-4 py-2 text-center rounded-xl"
                style={{
                  background: "rgba(10,10,10,0.9)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                  minWidth: "100px",
                }}
              >
                <div className="font-black text-xl text-gradient-cyan" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>AI</div>
                <div className="text-white/45 text-xs">Engineer</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex flex-col items-center gap-3 mt-20 animate-bounce-slow">
          <span className="text-white/25 text-xs tracking-widest uppercase" style={{ letterSpacing: "0.2em" }}>Scroll</span>
          <div className="scroll-indicator">
            <div className="scroll-indicator-dot" />
          </div>
          <ArrowDown size={13} className="text-white/25" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
