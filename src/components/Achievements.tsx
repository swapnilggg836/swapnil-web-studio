import { useState, useEffect, useRef } from "react";
import { useAchievements } from "@/hooks/useAchievements";
import {
  Award, FileCheck, Video, ExternalLink, Calendar, Building,
  Loader2, Sparkles, Play, Eye, Presentation, Trophy,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const categoryIcons: Record<string, any> = {
  Certificate: FileCheck,
  Award: Trophy,
  Presentation: Presentation,
  Hackathon: Sparkles,
  Event: Award,
};

const categoryAccents: Record<string, { bg: string; border: string; text: string; glow: string; top: string }> = {
  Certificate:  { bg: "hsl(199,89%,48%,0.12)", border: "hsl(199,89%,48%,0.35)", text: "hsl(199,89%,68%)",  glow: "hsl(199,89%,48%,0.15)", top: "hsl(199,89%,48%)" },
  Award:        { bg: "hsl(45,90%,50%,0.12)",  border: "hsl(45,90%,50%,0.35)",  text: "hsl(45,90%,68%)",   glow: "hsl(45,90%,50%,0.15)", top: "hsl(45,90%,50%)" },
  Presentation: { bg: "hsl(270,70%,60%,0.12)", border: "hsl(270,70%,60%,0.35)", text: "hsl(270,70%,72%)",  glow: "hsl(270,70%,60%,0.15)", top: "hsl(270,70%,60%)" },
  Hackathon:    { bg: "hsl(142,70%,45%,0.12)", border: "hsl(142,70%,45%,0.35)", text: "hsl(142,70%,62%)",  glow: "hsl(142,70%,45%,0.15)", top: "hsl(142,70%,45%)" },
  Event:        { bg: "hsl(330,80%,60%,0.12)", border: "hsl(330,80%,60%,0.35)", text: "hsl(330,80%,72%)",  glow: "hsl(330,80%,60%,0.15)", top: "hsl(330,80%,60%)" },
};

const CATEGORIES = ["All", "Certificate", "Award", "Presentation", "Hackathon"];

export const Achievements = () => {
  const { achievements, loading } = useAchievements();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeMedia, setActiveMedia] = useState<{ type: "image" | "video"; url: string; title: string } | null>(null);
  const [headerVisible, setHeaderVisible] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHeaderVisible(true); },
      { threshold: 0.1 }
    );
    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  // Sliding filter pill position
  useEffect(() => {
    const wrapper = filterRef.current;
    if (!wrapper) return;
    const active = wrapper.querySelector(`[data-cat="${selectedCategory}"]`) as HTMLElement;
    if (!active) return;
    const wrapperRect = wrapper.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    setPillStyle({
      left: activeRect.left - wrapperRect.left,
      width: activeRect.width,
    });
  }, [selectedCategory]);

  const filteredAchievements = selectedCategory === "All"
    ? achievements
    : achievements.filter(a => a.category?.toLowerCase() === selectedCategory.toLowerCase());

  const getEmbedUrl = (url: string) => {
    if (url.includes("youtube.com/watch")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  return (
    <section
      id="achievements"
      className="relative py-28 overflow-hidden"
      style={{ background: "#060606" }}
    >
      <div className="absolute inset-0 bg-grid pointer-events-none" style={{ opacity: 0.3 }} />

      <div
        className="decorative-bg-text pointer-events-none select-none"
        style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
      >
        AWARDS
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div
          ref={headerRef}
          className="text-center mb-12"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(28px)",
            transition: "all 0.65s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <div className="section-badge justify-center mx-auto w-fit mb-4">Honors &amp; Credentials</div>
          <h2 className="section-title mb-4">Achievements &amp; Certificates</h2>
          <p className="section-subtitle mx-auto text-center">
            Certifications, awards, presentations, and competition milestones
          </p>
        </div>

        {/* Category filters with sliding pill indicator */}
        <div className="flex justify-center mb-14">
          <div
            ref={filterRef}
            className="relative flex items-center gap-1 p-1 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            {/* Sliding background pill */}
            <div
              className="absolute rounded-xl pointer-events-none"
              style={{
                left: pillStyle.left,
                width: pillStyle.width,
                height: "calc(100% - 8px)",
                top: "4px",
                background: "hsl(199,89%,48%,0.15)",
                border: "1px solid hsl(199,89%,48%,0.3)",
                transition: "left 0.3s cubic-bezier(.16,1,.3,1), width 0.3s cubic-bezier(.16,1,.3,1)",
              }}
            />
            {CATEGORIES.map(cat => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  data-cat={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="relative z-10 px-4 py-2 rounded-xl text-xs font-semibold transition-colors duration-200 cursor-pointer"
                  style={{ color: isActive ? "hsl(199,89%,65%)" : "rgba(255,255,255,0.5)" }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cards grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "hsl(199,89%,48%)" }} />
          </div>
        ) : filteredAchievements.length === 0 ? (
          <div className="text-center py-16 text-white/35">No achievements found in this category.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map((ach, index) => {
              const IconComp = categoryIcons[ach.category] || Award;
              const accent = categoryAccents[ach.category] || categoryAccents.Certificate;

              return (
                <div
                  key={ach.id}
                  className="rounded-2xl overflow-hidden flex flex-col shimmer-card group transition-all duration-400"
                  style={{
                    background: "rgba(10,10,10,0.95)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderTop: `2px solid ${accent.top}`,
                    opacity: headerVisible ? 1 : 0,
                    transform: headerVisible ? "translateY(0)" : "translateY(24px)",
                    transition: `all 0.65s cubic-bezier(.16,1,.3,1) ${index * 70}ms`,
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 50px rgba(0,0,0,0.6), 0 0 30px ${accent.glow}`;
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                    (e.currentTarget as HTMLElement).style.transform = "";
                  }}
                >
                  {/* Media thumbnail */}
                  {ach.image_url ? (
                    <div
                      className="relative h-48 overflow-hidden bg-black/60 cursor-pointer"
                      onClick={() => setActiveMedia({ type: "image", url: ach.image_url!, title: ach.title })}
                    >
                      <img
                        src={ach.image_url}
                        alt={ach.title}
                        className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                      <div
                        className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 backdrop-blur-md"
                        style={{ background: accent.bg, border: `1px solid ${accent.border}`, color: accent.text }}
                      >
                        <Eye size={11} /> Preview
                      </div>
                    </div>
                  ) : ach.video_url ? (
                    <div
                      className="relative h-48 overflow-hidden bg-black/80 flex items-center justify-center cursor-pointer group/video"
                      onClick={() => setActiveMedia({ type: "video", url: ach.video_url!, title: ach.title })}
                    >
                      <div className="absolute inset-0 bg-grid opacity-20" />
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 group-hover/video:scale-110"
                        style={{ background: "hsl(199,89%,48%)", boxShadow: "0 0 30px hsl(199,89%,48%,0.6)" }}
                      >
                        <Play size={22} className="ml-1 text-black fill-black" />
                      </div>
                      <div className="absolute bottom-3 left-3 text-xs font-semibold text-white/70 flex items-center gap-1 bg-black/60 px-2.5 py-1 rounded-full border border-white/10">
                        <Video size={11} className="text-red-400" /> Watch Video Presentation
                      </div>
                    </div>
                  ) : null}

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span
                          className="px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1.5"
                          style={{ background: accent.bg, border: `1px solid ${accent.border}`, color: accent.text }}
                        >
                          <IconComp size={11} />
                          {ach.category}
                        </span>
                        <span className="text-white/35 text-xs font-medium flex items-center gap-1">
                          <Calendar size={10} />
                          {ach.date}
                        </span>
                      </div>

                      <h3
                        className="font-black text-white text-lg leading-snug mb-2 group-hover:text-gradient-cyan transition-all"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        {ach.title}
                      </h3>

                      <div className="flex items-center gap-1.5 text-white/45 text-xs font-semibold mb-3">
                        <Building size={11} style={{ color: accent.text }} />
                        <span>{ach.issuer}</span>
                      </div>

                      <p className="text-white/50 text-xs leading-relaxed mb-4 line-clamp-3">{ach.description}</p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/05">
                      {ach.link_url && (
                        <a
                          href={ach.link_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-pill btn-pill-outline text-xs flex-1 justify-center py-1.5"
                          style={{ padding: "0.4rem 0.8rem" }}
                        >
                          <ExternalLink size={11} /> Verify Credential
                        </a>
                      )}
                      {ach.video_url && !ach.link_url && (
                        <button
                          onClick={() => setActiveMedia({ type: "video", url: ach.video_url!, title: ach.title })}
                          className="btn-pill btn-pill-primary text-xs flex-1 justify-center py-1.5"
                          style={{ padding: "0.4rem 0.8rem" }}
                        >
                          <Play size={11} /> Watch Presentation
                        </button>
                      )}
                      {ach.image_url && !ach.video_url && !ach.link_url && (
                        <button
                          onClick={() => setActiveMedia({ type: "image", url: ach.image_url!, title: ach.title })}
                          className="btn-pill btn-pill-outline text-xs flex-1 justify-center py-1.5"
                          style={{ padding: "0.4rem 0.8rem" }}
                        >
                          <Eye size={11} /> View Certificate
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Media Lightbox */}
      {activeMedia && (
        <Dialog open={!!activeMedia} onOpenChange={open => !open && setActiveMedia(null)}>
          <DialogContent
            className="max-w-3xl border-white/10 text-white"
            style={{ background: "rgba(5,5,5,0.98)", backdropFilter: "blur(30px)" }}
          >
            <DialogHeader>
              <DialogTitle className="text-lg font-bold pr-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {activeMedia.title}
              </DialogTitle>
            </DialogHeader>
            <div className="py-2 flex items-center justify-center">
              {activeMedia.type === "image" ? (
                <img
                  src={activeMedia.url}
                  alt={activeMedia.title}
                  className="max-h-[75vh] w-auto max-w-full rounded-xl object-contain border border-white/10"
                  style={{ animation: "fadeUp 0.3s ease forwards" }}
                />
              ) : (
                <div className="w-full aspect-video rounded-xl overflow-hidden bg-black border border-white/10">
                  <iframe
                    src={getEmbedUrl(activeMedia.url)}
                    title={activeMedia.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
};

export default Achievements;
