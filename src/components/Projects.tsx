import { useEffect, useRef, useState } from "react";
import { ExternalLink, Github, Loader2 } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";

// Fallback images for projects without uploaded images
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

const ProjectCard = ({
  project,
  index,
  isFlagship,
}: {
  project: ProjectItem;
  index: number;
  isFlagship: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const num = String(index + 1).padStart(2, "0");
  const rawTech = typeof project.tech_stack === "string" ? project.tech_stack : "";
  const tags = rawTech ? rawTech.split(",").map(t => t.trim()).filter(Boolean) : [];
  const descList = Array.isArray(project.description)
    ? project.description
    : typeof project.description === "string"
    ? [project.description]
    : [];

  return (
    <div
      ref={ref}
      className="group relative"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `all 0.6s ease ${(index % 3) * 80}ms`,
      }}
    >
      {/* Flagship gradient border */}
      {isFlagship ? (
        <div
          className="rounded-2xl p-px"
          style={{
            background: "linear-gradient(135deg, hsl(199,89%,48%), hsl(199,89%,20%), hsl(270,70%,60%), hsl(199,89%,48%))",
          }}
        >
          <div className="rounded-2xl overflow-hidden" style={{ background: "#0d0d0d" }}>
            <CardInner project={project} num={num} tags={tags} descList={descList} isFlagship={isFlagship} />
          </div>
        </div>
      ) : (
        <div
          className="rounded-2xl overflow-hidden glass-card"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <CardInner project={project} num={num} tags={tags} descList={descList} isFlagship={isFlagship} />
        </div>
      )}
    </div>
  );
};

const CardInner = ({
  project,
  num,
  tags,
  descList,
  isFlagship,
}: {
  project: ProjectItem;
  num: string;
  tags: string[];
  descList: string[];
  isFlagship: boolean;
}) => (
  <>
    {/* Image */}
    <div className="relative overflow-hidden" style={{ height: "200px" }}>
      <img
        src={project.image_url || "/placeholder.svg"}
        alt={project.title || "Project"}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)",
        }}
      />
      {/* Number badge */}
      <div
        className="absolute top-4 left-4 font-black text-4xl leading-none"
        style={{
          color: isFlagship ? "hsl(199,89%,48%)" : "rgba(255,255,255,0.15)",
          fontFamily: "'Inter', sans-serif",
          letterSpacing: "-0.04em",
        }}
      >
        {num}
      </div>
      {isFlagship && (
        <div
          className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{
            background: "hsl(199,89%,48%,0.2)",
            border: "1px solid hsl(199,89%,48%,0.5)",
            color: "hsl(199,89%,70%)",
          }}
        >
          ★ Featured
        </div>
      )}
    </div>

    {/* Content */}
    <div className="p-6">
      <h3 className="font-black text-xl text-white mb-3 tracking-tight">{project.title}</h3>

      {/* Tech tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
            style={{
              background: "hsl(199,89%,48%,0.1)",
              border: "1px solid hsl(199,89%,48%,0.2)",
              color: "hsl(199,89%,60%)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Description */}
      <div className="space-y-1.5 mb-5">
        {descList.slice(0, 3).map((desc, i) => (
          <div key={i} className="flex items-start gap-2">
            <span
              className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: "hsl(199,89%,48%)" }}
            />
            <span className="text-white/60 text-xs leading-relaxed">{desc}</span>
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
          >
            <ExternalLink size={13} />
            Live Demo
          </a>
        )}
      </div>
    </div>
  </>
);

const Projects = () => {
  const { projects: dbProjects, loading } = useProjects();
  const [projectsList, setProjectsList] = useState<ProjectItem[]>(fallbackProjects);
  const sectionRef = useRef<HTMLElement>(null);
  const [headerVisible, setHeaderVisible] = useState(true);

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
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid pointer-events-none" style={{ opacity: 0.5 }} />

      {/* Parallax background text */}
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
          top: "30%", left: "-10%",
          width: "600px", height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, hsl(199,89%,48%,0.07) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div
          className="text-center mb-16 transition-all duration-700"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <div className="section-badge justify-center mx-auto w-fit mb-4">
            Featured Creations
          </div>
          <h2 className="section-title mb-4">Selected Projects</h2>
          <p className="section-subtitle mx-auto text-center">
            A showcase of web applications, AI projects, and engineering solutions I've built
          </p>
        </div>

        {/* Loading */}
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
