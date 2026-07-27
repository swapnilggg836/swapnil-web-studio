import { useState, useEffect, useRef } from "react";
import { useAchievements, Achievement } from "@/hooks/useAchievements";
import {
  Award,
  FileCheck,
  Video,
  ExternalLink,
  Calendar,
  Building,
  Loader2,
  Sparkles,
  Play,
  Eye,
  X,
  Presentation,
  Trophy,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const categoryIcons: Record<string, any> = {
  Certificate: FileCheck,
  Award: Trophy,
  Presentation: Presentation,
  Hackathon: Sparkles,
  Event: Award,
};

const categoryBadgeColors: Record<string, { bg: string; border: string; text: string }> = {
  Certificate:  { bg: "hsl(199,89%,48%,0.15)", border: "hsl(199,89%,48%,0.4)", text: "hsl(199,89%,70%)" },
  Award:        { bg: "hsl(45,90%,50%,0.15)",  border: "hsl(45,90%,50%,0.4)",  text: "hsl(45,90%,70%)" },
  Presentation: { bg: "hsl(270,70%,60%,0.15)", border: "hsl(270,70%,60%,0.4)", text: "hsl(270,70%,75%)" },
  Hackathon:    { bg: "hsl(142,70%,45%,0.15)", border: "hsl(142,70%,45%,0.4)", text: "hsl(142,70%,65%)" },
  Event:        { bg: "hsl(330,80%,60%,0.15)", border: "hsl(330,80%,60%,0.4)", text: "hsl(330,80%,75%)" },
};

export const Achievements = () => {
  const { achievements, loading } = useAchievements();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeMedia, setActiveMedia] = useState<{ type: "image" | "video"; url: string; title: string } | null>(null);

  const [headerVisible, setHeaderVisible] = useState(true);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHeaderVisible(true); },
      { threshold: 0.1 }
    );
    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  const categories = ["All", "Certificate", "Award", "Presentation", "Hackathon"];

  const filteredAchievements = selectedCategory === "All"
    ? achievements
    : achievements.filter(a => a.category?.toLowerCase() === selectedCategory.toLowerCase());

  // Helper to extract Youtube Embed URL
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
      {/* Background dots & grid */}
      <div className="absolute inset-0 bg-grid pointer-events-none" style={{ opacity: 0.3 }} />

      {/* Decorative text */}
      <div
        className="decorative-bg-text pointer-events-none select-none"
        style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
      >
        AWARDS
      </div>

      {/* Glow blob */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "-100px", left: "50%", transform: "translateX(-50%)",
          width: "700px", height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(ellipse, hsl(199,89%,48%,0.06) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div
          ref={headerRef}
          className="text-center mb-12 transition-all duration-700"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <div className="section-badge justify-center mx-auto w-fit mb-4">
            Honors & Credentials
          </div>
          <h2 className="section-title mb-4">Achievements & Certificates</h2>
          <p className="section-subtitle mx-auto text-center">
            Certifications, awards, presentations, and competition milestones
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-14">
          {categories.map(cat => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer"
                style={{
                  background: isActive ? "hsl(199,89%,48%)" : "rgba(255,255,255,0.04)",
                  color: isActive ? "#000" : "rgba(255,255,255,0.7)",
                  border: `1px solid ${isActive ? "hsl(199,89%,48%)" : "rgba(255,255,255,0.08)"}`,
                  boxShadow: isActive ? "0 0 20px hsl(199,89%,48%,0.4)" : "none",
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "hsl(199,89%,48%)" }} />
          </div>
        ) : filteredAchievements.length === 0 ? (
          <div className="text-center py-16 text-white/40">
            No achievements found in this category.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map((ach, index) => {
              const IconComp = categoryIcons[ach.category] || Award;
              const badgeStyle = categoryBadgeColors[ach.category] || categoryBadgeColors.Certificate;

              return (
                <div
                  key={ach.id}
                  className="glass-card rounded-2xl overflow-hidden flex flex-col group transition-all duration-500 hover:-translate-y-1.5"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    borderColor: "rgba(255,255,255,0.08)",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = badgeStyle.border;
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 40px rgba(0,0,0,0.5), 0 0 30px ${badgeStyle.bg}`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  {/* Media Thumbnail */}
                  {ach.image_url ? (
                    <div className="relative h-48 overflow-hidden bg-black/60 cursor-pointer" onClick={() => setActiveMedia({ type: "image", url: ach.image_url!, title: ach.title })}>
                      <img
                        src={ach.image_url}
                        alt={ach.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 backdrop-blur-md" style={{ background: badgeStyle.bg, border: `1px solid ${badgeStyle.border}`, color: badgeStyle.text }}>
                        <Eye size={12} /> Preview
                      </div>
                    </div>
                  ) : ach.video_url ? (
                    <div className="relative h-48 overflow-hidden bg-black/80 flex items-center justify-center cursor-pointer group/video" onClick={() => setActiveMedia({ type: "video", url: ach.video_url!, title: ach.title })}>
                      <div className="absolute inset-0 bg-grid opacity-30" />
                      <div className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 group-hover/video:scale-110" style={{ background: "hsl(199,89%,48%)", boxShadow: "0 0 25px hsl(199,89%,48%,0.6)" }}>
                        <Play size={22} className="ml-1 text-black fill-black" />
                      </div>
                      <div className="absolute bottom-3 left-3 text-xs font-semibold text-white/70 flex items-center gap-1 bg-black/60 px-2.5 py-1 rounded-full border border-white/10">
                        <Video size={12} className="text-red-400" /> Watch Video Presentation
                      </div>
                    </div>
                  ) : null}

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Badge + Date */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span
                          className="px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1.5"
                          style={{
                            background: badgeStyle.bg,
                            border: `1px solid ${badgeStyle.border}`,
                            color: badgeStyle.text,
                          }}
                        >
                          <IconComp size={12} />
                          {ach.category}
                        </span>
                        <span className="text-white/40 text-xs font-medium flex items-center gap-1">
                          <Calendar size={11} />
                          {ach.date}
                        </span>
                      </div>

                      <h3 className="font-black text-white text-lg leading-snug mb-2 group-hover:text-cyan-400 transition-colors">
                        {ach.title}
                      </h3>

                      <div className="flex items-center gap-1.5 text-white/50 text-xs font-semibold mb-3">
                        <Building size={12} style={{ color: "hsl(199,89%,60%)" }} />
                        <span>{ach.issuer}</span>
                      </div>

                      <p className="text-white/60 text-xs leading-relaxed mb-4 line-clamp-3">
                        {ach.description}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
                      {ach.link_url && (
                        <a
                          href={ach.link_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-pill btn-pill-outline text-xs flex-1 justify-center py-1.5"
                          style={{ padding: "0.4rem 0.8rem" }}
                        >
                          <ExternalLink size={12} /> Verify Credential
                        </a>
                      )}
                      {ach.video_url && !ach.link_url && (
                        <button
                          onClick={() => setActiveMedia({ type: "video", url: ach.video_url!, title: ach.title })}
                          className="btn-pill btn-pill-primary text-xs flex-1 justify-center py-1.5"
                          style={{ padding: "0.4rem 0.8rem" }}
                        >
                          <Play size={12} /> Watch Presentation
                        </button>
                      )}
                      {ach.image_url && !ach.video_url && !ach.link_url && (
                        <button
                          onClick={() => setActiveMedia({ type: "image", url: ach.image_url!, title: ach.title })}
                          className="btn-pill btn-pill-outline text-xs flex-1 justify-center py-1.5"
                          style={{ padding: "0.4rem 0.8rem" }}
                        >
                          <Eye size={12} /> View Certificate
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

      {/* Media Lightbox Modal */}
      {activeMedia && (
        <Dialog open={!!activeMedia} onOpenChange={(open) => !open && setActiveMedia(null)}>
          <DialogContent className="max-w-3xl bg-black/95 border-white/10 text-white">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold flex items-center justify-between pr-6">
                <span>{activeMedia.title}</span>
              </DialogTitle>
            </DialogHeader>

            <div className="py-2 flex items-center justify-center">
              {activeMedia.type === "image" ? (
                <img
                  src={activeMedia.url}
                  alt={activeMedia.title}
                  className="max-h-[75vh] w-auto max-w-full rounded-xl object-contain border border-white/10"
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
