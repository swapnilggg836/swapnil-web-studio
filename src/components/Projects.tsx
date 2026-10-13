import { useEffect, useRef, useState, useCallback } from "react";
import { ExternalLink, Github, Loader2, ChevronLeft, ChevronRight, Video, Image as ImageIcon, Maximize2 } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { getVideoSource } from "@/lib/media";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import tourTravelImg from "@/assets/tour-travel.jpg";
import digitalBoardImg from "@/assets/digital-board.jpg";
import sentimentAnalysisImg from "@/assets/sentiment-analysis.jpg";
import tiffinEliteImg from "@/assets/tiffin-elite.jpg";
import chatbotImg from "@/assets/chatbot.jpg";
import paithaniSreeImg from "@/assets/paithani-sree.jpg";
import salesAnalysisImg from "@/assets/sales-analysis.jpg";
import smartRoverImg from "@/assets/smart-rover.jpg";

interface ProjectItem {
  id: string;
  title: string;
  image_url?: string | null;
  images?: string[];           // ← array of image URLs
  video_url?: string | null;   // ← video URL / embed link
  description: string[] | string;
  tech_stack: string;
  github_link?: string | null;
  live_link?: string | null;
}

const fallbackProjects: ProjectItem[] = [
  { id: "1", title: "Tour & Travel", image_url: tourTravelImg, description: ["Information portal for tourists", "Built with HTML, CSS, and PHP", "XAMPP server backend"], tech_stack: "HTML, CSS, PHP", github_link: "https://github.com/swapnilggg836/tour-travel", live_link: "" },
  { id: "2", title: "Digital Board", image_url: digitalBoardImg, description: ["Scrolling Digital Display Board", "IoT Based, C++ and IC used", "C++ library used"], tech_stack: "C++, IoT", github_link: "https://github.com/swapnilggg836/digital-board", live_link: "" },
  { id: "3", title: "Sentiment Analysis", image_url: sentimentAnalysisImg, description: ["Analyzes YouTube comment sentiment", "Built with Python + Flask", "Shows positive, negative & neutral graphs"], tech_stack: "Python, Flask", github_link: "https://github.com/swapnilggg836/sentiment-analysis", live_link: "" },
  { id: "4", title: "Tiffin Elite", image_url: tiffinEliteImg, description: ["Full-stack tiffin service app", "PHP, AJAX, HTML, CSS + MySQL", "Login/Signup and ordering system"], tech_stack: "PHP, AJAX, MySQL", github_link: "https://github.com/swapnilggg836/tiffin-elite", live_link: "" },
  { id: "5", title: "Chatbot", image_url: chatbotImg, description: ["Interactive chatbot with natural flow", "HTML, CSS, Flask (Python), Node.js", "Flask-based API for backend logic"], tech_stack: "Flask, Python, Node.js", github_link: "https://github.com/swapnilggg836/chatbot-flask", live_link: "" },
  { id: "6", title: "Paithani Sree", image_url: paithaniSreeImg, description: ["E-commerce site for Paithani sarees", "React.js, Next.js, Tailwind CSS", "Product listings with admin panel"], tech_stack: "React, Next.js, Tailwind", github_link: "https://github.com/swapnilggg836/paithani-sree", live_link: "https://paithani-sree.com" },
  { id: "7", title: "Electronics Sales Analysis", image_url: salesAnalysisImg, description: ["Business data analysis with Power BI", "Multiple charts and dashboards", "Customer segmentation & sales trends"], tech_stack: "Power BI, Excel", github_link: "https://github.com/swapnilggg836/sales-analysis", live_link: "" },
  { id: "8", title: "Smart Rover", image_url: smartRoverImg, description: ["Arduino-based rover for competitions", "Ultrasonic & Color sensors integrated", "Obstacle detection and automation"], tech_stack: "Arduino, C++, IoT", github_link: "https://github.com/swapnilggg836/smart-rover", live_link: "" },
];

/* ====================================================
   IMAGE CAROUSEL — handles 1 or many images
   ==================================================== */
const ImageCarousel = ({
  images,
  title,
  activeIdx,
  setActiveIdx,
  onOpen,
}: {
  images: string[];
  title: string;
  activeIdx: number;
  setActiveIdx: (index: number) => void;
  onOpen: () => void;
}) => {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  // Auto-advance when multiple images
  useEffect(() => {
    if (images.length <= 1) return;
    timerRef.current = setTimeout(() => {
      setActiveIdx(i => (i + 1) % images.length);
    }, 3200);
    return () => clearTimeout(timerRef.current);
  }, [activeIdx, images.length]);

  const goTo = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIdx(idx);
    clearTimeout(timerRef.current);
  };
  const prev = (e: React.MouseEvent) => goTo((activeIdx - 1 + images.length) % images.length, e);
  const next = (e: React.MouseEvent) => goTo((activeIdx + 1) % images.length, e);

  return (
    <div className="relative h-[200px] w-full overflow-hidden group/img">
      {images.map((src, i) => (
        <button
          key={i}
          type="button"
          onClick={onOpen}
          aria-label={`Open ${title} photo ${i + 1} in the viewer`}
          tabIndex={i === activeIdx ? 0 : -1}
          className={`absolute inset-0 h-full w-full cursor-zoom-in transition-opacity duration-700 ${i === activeIdx ? "opacity-100" : "pointer-events-none opacity-0"}`}
        >
          <img
            src={src}
            alt={`${title} screenshot ${i + 1}`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </button>
      ))}

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)" }}
      />

      {/* Prev / Next arrows — only when multiple images */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            type="button"
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all duration-200"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          >
            <ChevronLeft size={14} className="text-white" />
          </button>
          <button
            onClick={next}
            type="button"
            aria-label="Next photo"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all duration-200"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          >
            <ChevronRight size={14} className="text-white" />
          </button>

          {/* Dot navigation */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={e => goTo(i, e)}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === activeIdx}
                style={{
                  height: "5px",
                  borderRadius: "9999px",
                  background: i === activeIdx ? "hsl(199,89%,60%)" : "rgba(255,255,255,0.35)",
                  width: i === activeIdx ? "18px" : "5px",
                  transition: "all 0.3s ease",
                  border: "none",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

/* ====================================================
   MEDIA VIEWER — inline preview plus large photo/video viewer
   ==================================================== */
const MediaViewer = ({ images, videoUrl, title }: { images: string[]; videoUrl?: string | null; title: string }) => {
  const videoData = getVideoSource(videoUrl);
  const [activeMedia, setActiveMedia] = useState<"video" | "images">("images");
  const [activeIdx, setActiveIdx] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);

  const renderVideo = (large = false) => {
    if (!videoData) return null;
    if (videoData.type === "iframe") {
      return (
        <iframe
          src={videoData.src}
          title={`${title} demo video`}
          className="h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
        />
      );
    }
    return (
      <video
        src={videoData.src}
        controls
        playsInline
        className={`h-full w-full ${large ? "object-contain" : "object-cover"}`}
      />
    );
  };

  const openViewer = (media: "video" | "images") => {
    setActiveMedia(media);
    setViewerOpen(true);
  };

  const stepImage = (delta: number) => {
    setActiveIdx((index) => (index + delta + images.length) % images.length);
  };

  return (
    <>
    <div className="relative h-[200px] w-full overflow-hidden group/media">
      {activeMedia === "video" && videoData ? (
        <div className="relative flex h-full w-full items-center justify-center bg-background">
          {renderVideo()}
          <Button
            type="button"
            variant="secondary"
            size="icon"
            aria-label={`Open ${title} video in large viewer`}
            title="Expand video"
            className="absolute right-2 bottom-2 z-10 h-9 w-9 opacity-90"
            onClick={() => openViewer("video")}
          >
            <Maximize2 />
          </Button>
        </div>
      ) : (
        <ImageCarousel
          images={images}
          title={title}
          activeIdx={activeIdx}
          setActiveIdx={setActiveIdx}
          onOpen={() => openViewer("images")}
        />
      )}

      {/* Switcher toggle if both video and images exist */}
      {videoData && images.length > 0 && (
        <div className="absolute top-2 left-2 z-20 flex gap-1 rounded-full border border-white/10 bg-background/90 p-1 backdrop-blur-md">
          <Button
            type="button"
            onClick={(e) => { e.stopPropagation(); setActiveMedia("video"); }}
            size="sm"
            variant={activeMedia === "video" ? "default" : "ghost"}
            className={`h-7 rounded-full px-2 text-[10px] font-semibold ${
              activeMedia === "video"
                ? "shadow"
                : "text-foreground"
            }`}
          >
            <Video size={11} /> Video
          </Button>
          <Button
            type="button"
            onClick={(e) => { e.stopPropagation(); setActiveMedia("images"); }}
            size="sm"
            variant={activeMedia === "images" ? "default" : "ghost"}
            className="h-7 rounded-full px-2 text-[10px] font-semibold"
          >
            <ImageIcon size={11} /> Photos ({images.length})
          </Button>
        </div>
      )}
    </div>
    <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-6xl overflow-y-auto border-border bg-background p-4 sm:p-6">
        <DialogHeader className="pr-8">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{activeMedia === "video" ? "Project video" : `Photo ${activeIdx + 1} of ${images.length}`}</DialogDescription>
        </DialogHeader>
        {videoData && (
          <div className="flex gap-2 border-b border-border pb-3">
            <Button type="button" size="sm" variant={activeMedia === "images" ? "default" : "outline"} onClick={() => setActiveMedia("images")}>
              <ImageIcon /> Photos ({images.length})
            </Button>
            <Button type="button" size="sm" variant={activeMedia === "video" ? "default" : "outline"} onClick={() => setActiveMedia("video")}>
              <Video /> Video
            </Button>
          </div>
        )}
        {activeMedia === "video" && videoData ? (
          <div className="mx-auto aspect-video max-h-[72dvh] w-full overflow-hidden rounded-md bg-background">
            {renderVideo(true)}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="relative mx-auto flex h-[min(65dvh,760px)] w-full items-center justify-center overflow-hidden rounded-md bg-background">
              <img src={images[activeIdx]} alt={`${title} photo ${activeIdx + 1}`} className="h-full w-full object-contain" />
              {images.length > 1 && (
                <>
                  <Button type="button" variant="secondary" size="icon" aria-label="Previous photo" onClick={() => stepImage(-1)} className="absolute left-3 top-1/2 -translate-y-1/2">
                    <ChevronLeft />
                  </Button>
                  <Button type="button" variant="secondary" size="icon" aria-label="Next photo" onClick={() => stepImage(1)} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <ChevronRight />
                  </Button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex justify-center gap-2 overflow-x-auto py-1">
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    aria-label={`Show photo ${index + 1}`}
                    aria-current={index === activeIdx}
                    onClick={() => setActiveIdx(index)}
                    className={`h-14 w-20 shrink-0 overflow-hidden rounded-sm border-2 transition-colors ${index === activeIdx ? "border-primary" : "border-border"}`}
                  >
                    <img src={image} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
    </>
  );
};

/* ====================================================
   3D TILT CARD
   ==================================================== */
const useTilt = () => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-4px)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)";
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return ref;
};

/* ====================================================
   PROJECT CARD
   ==================================================== */
const ProjectCard = ({
  project,
  index,
  isFlagship,
}: {
  project: ProjectItem;
  index: number;
  isFlagship: boolean;
}) => {
  const revealRef = useRef<HTMLDivElement>(null);
  const tiltRef = useTilt();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.12 }
    );
    if (revealRef.current) observer.observe(revealRef.current);
    return () => observer.disconnect();
  }, []);

  const rawTech = typeof project.tech_stack === "string" ? project.tech_stack : "";
  const tags = rawTech ? rawTech.split(",").map(t => t.trim()).filter(Boolean) : [];
  const descList = Array.isArray(project.description)
    ? project.description
    : typeof project.description === "string"
    ? [project.description]
    : [];

  // Collect all images: prefer images[] array, fall back to image_url
  const allImages: string[] = [];
  if (Array.isArray(project.images) && project.images.length > 0) {
    allImages.push(...project.images.filter(Boolean));
  }
  if (allImages.length === 0 && project.image_url) {
    allImages.push(project.image_url);
  }
  if (allImages.length === 0) {
    allImages.push("/placeholder.svg");
  }

  const num = String(index + 1).padStart(2, "0");

  const cardInner = (
    <div
      ref={tiltRef}
      className="shimmer-card group rounded-2xl overflow-hidden flex flex-col h-full cursor-pointer"
      style={{
        background: "rgba(12,12,12,0.95)",
        border: "1px solid rgba(255,255,255,0.07)",
        transition: "box-shadow 0.35s ease, transform 0.15s ease",
        willChange: "transform",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = isFlagship
          ? "0 24px 80px rgba(0,0,0,0.7), 0 0 40px hsl(199,89%,48%,0.2)"
          : "0 16px 50px rgba(0,0,0,0.6), 0 0 25px hsl(199,89%,48%,0.1)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      {/* Media section (Video & Images) */}
      <div className="relative">
        <MediaViewer images={allImages} videoUrl={project.video_url} title={project.title} />

        {/* Number badge */}
        <div
          className="absolute bottom-4 left-4 font-black text-4xl leading-none select-none pointer-events-none"
          style={{
            color: isFlagship ? "hsl(199,89%,48%)" : "rgba(255,255,255,0.12)",
            fontFamily: "'Space Grotesk', sans-serif",
            letterSpacing: "-0.04em",
          }}
        >
          {num}
        </div>

        {isFlagship && (
          <div
            className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
            style={{
              background: "hsl(199,89%,48%,0.2)",
              border: "1px solid hsl(199,89%,48%,0.5)",
              color: "hsl(199,89%,70%)",
              animation: "glowPulse 2s ease-in-out infinite",
            }}
          >
            ★ Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3
          className="font-black text-xl text-white mb-3 tracking-tight group-hover:text-gradient-cyan transition-all"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {project.title}
        </h3>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map(tag => (
            <span
              key={tag}
              className="px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all duration-200 hover:scale-105"
              style={{
                background: "hsl(199,89%,48%,0.09)",
                border: "1px solid hsl(199,89%,48%,0.2)",
                color: "hsl(199,89%,60%)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Description bullets */}
        <div className="space-y-1.5 mb-5 flex-1">
          {descList.slice(0, 3).map((desc, i) => (
            <div key={i} className="flex items-start gap-2">
              <span
                className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: "hsl(199,89%,48%)" }}
              />
              <span className="text-white/55 text-xs leading-relaxed">{desc}</span>
            </div>
          ))}
        </div>

        {/* Links */}
        <div className="flex items-center gap-3 pt-3 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          {project.github_link && (
            <a
              href={project.github_link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill btn-pill-outline text-xs flex-1 justify-center py-2"
              onClick={e => e.stopPropagation()}
            >
              <Github size={13} />
              GitHub
            </a>
          )}
          {project.live_link && (
            <a
              href={project.live_link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill btn-pill-primary text-xs flex-1 justify-center py-2"
              onClick={e => e.stopPropagation()}
            >
              <ExternalLink size={13} />
              Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div
      ref={revealRef}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(36px)",
        transition: `opacity 0.65s cubic-bezier(.16,1,.3,1) ${(index % 3) * 90}ms, transform 0.65s cubic-bezier(.16,1,.3,1) ${(index % 3) * 90}ms`,
      }}
    >
      <div className="rainbow-border-wrap h-full">
        <div className="rounded-2xl overflow-hidden h-full" style={{ background: "#0d0d0d" }}>
          {cardInner}
        </div>
      </div>
    </div>
  );
};

/* ====================================================
   PROJECTS SECTION
   ==================================================== */
const Projects = () => {
  const { projects: dbProjects, loading } = useProjects();
  const [projectsList, setProjectsList] = useState<ProjectItem[]>(fallbackProjects);
  const sectionRef = useRef<HTMLElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHeaderVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (dbProjects && dbProjects.length > 0) {
      setProjectsList(dbProjects as any);
    } else {
      setProjectsList(fallbackProjects);
    }
  }, [dbProjects]);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative py-28 overflow-hidden"
      style={{ background: "#050505" }}
    >
      <div className="absolute inset-0 bg-grid pointer-events-none" style={{ opacity: 0.4 }} />

      <div
        className="decorative-bg-text pointer-events-none select-none"
        style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
      >
        WORK
      </div>

      {/* Glow blob */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "20%", left: "-10%",
          width: "700px", height: "700px",
          borderRadius: "50%",
          background: "radial-gradient(circle, hsl(199,89%,48%,0.06) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "10%", right: "-10%",
          width: "500px", height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, hsl(270,70%,60%,0.05) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <div
          className="text-center mb-16 transition-all duration-700"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(28px)",
          }}
        >
          <div className="section-badge justify-center mx-auto w-fit mb-4">Featured Creations</div>
          <h2 className="section-title mb-4">Selected Projects</h2>
          <p className="section-subtitle mx-auto text-center">
            A showcase of web applications, AI projects, and engineering solutions I've built
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "hsl(199,89%,48%)" }} />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projectsList.map((project, index) => (
              <ProjectCard
                key={project.id || index}
                project={project}
                index={index}
                isFlagship={index === 0}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
