import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Briefcase, MapPin, Calendar, Building2, CheckCircle2 } from "lucide-react";

interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  location: string;
  period: string;
  description: string[] | string;
  display_order: number;
}

const fallbackExperiences: ExperienceItem[] = [
  {
    id: "1",
    title: "Full-Stack Web Developer Intern",
    company: "Tech Solutions Pvt. Ltd.",
    location: "Nashik, Maharashtra",
    period: "2024 – Present",
    description: [
      "Developing responsive full-stack web applications using React.js, Tailwind CSS, and Node.js.",
      "Integrated RESTful APIs and database management systems (MySQL / Supabase).",
      "Collaborated with cross-functional teams to design high-performance user interfaces.",
    ],
    display_order: 0,
  },
  {
    id: "2",
    title: "AI & Data Science Trainee",
    company: "SNJB AI Research Lab",
    location: "Chandwad, Nashik",
    period: "2023 – 2024",
    description: [
      "Built Machine Learning models for sentiment analysis on social media comment streams.",
      "Utilized Python, Flask, Pandas, and Scikit-Learn for data preprocessing and predictive analytics.",
      "Developed IoT embedded projects using Arduino and sensor integration for automated rovers.",
    ],
    display_order: 1,
  },
];

const ExperienceCard = ({ exp, index }: { exp: ExperienceItem; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setShow(true);
            observer.disconnect();
          }
        },
        { threshold: 0.05, rootMargin: "0px 0px -50px 0px" }
      );
      if (ref.current) observer.observe(ref.current);
      return () => observer.disconnect();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const descList = Array.isArray(exp.description)
    ? exp.description
    : typeof exp.description === "string"
    ? [exp.description]
    : [];

  return (
    <div ref={ref} className="relative flex gap-6 md:gap-8">
      {/* Timeline column */}
      <div className="flex flex-col items-center flex-shrink-0">
        {/* Dot with ripple rings */}
        <div
          className="timeline-dot-outer w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 z-10"
          style={{
            background: "linear-gradient(135deg, hsl(199,89%,18%), hsl(199,89%,44%))",
            border: "2px solid hsl(199,89%,55%)",
            boxShadow: "0 0 22px hsl(199,89%,48%,0.5)",
          }}
        >
          <Briefcase size={19} style={{ color: "#fff" }} />
        </div>

        {/* Animated connector line */}
        <div
          ref={lineRef}
          className="flex-1 w-px mt-2 origin-top"
          style={{
            background: "linear-gradient(to bottom, hsl(199,89%,48%,0.5), transparent)",
            minHeight: "3rem",
            transform: show ? "scaleY(1)" : "scaleY(0)",
            transition: "transform 0.8s cubic-bezier(.16,1,.3,1) 0.3s",
          }}
        />
      </div>

      {/* Card */}
      <div
        className="flex-1 mb-10 rounded-2xl p-6 md:p-8 shimmer-card"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          opacity: show ? 1 : 0,
          transform: show ? "translateX(0)" : "translateX(28px)",
          transition: `all 0.65s cubic-bezier(.16,1,.3,1) ${index * 120}ms`,
          borderLeft: "2px solid hsl(199,89%,48%,0.3)",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor = "hsl(199,89%,48%,0.35)";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 40px rgba(0,0,0,0.4), 0 0 25px hsl(199,89%,48%,0.1)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
          (e.currentTarget as HTMLElement).style.boxShadow = "none";
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
            style={{
              background: "hsl(199,89%,48%,0.12)",
              border: "1px solid hsl(199,89%,48%,0.3)",
              color: "hsl(199,89%,65%)",
            }}
          >
            <Calendar size={11} />
            {exp.period}
          </div>

          <div className="flex items-center gap-1.5 text-white/40 text-xs font-medium">
            <MapPin size={11} />
            {exp.location}
          </div>
        </div>

        <h3
          className="font-black text-white text-xl md:text-2xl leading-tight mb-1"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {exp.title}
        </h3>

        <div className="flex items-center gap-2 mb-5" style={{ color: "hsl(199,89%,58%)" }}>
          <Building2 size={14} />
          <span className="font-bold text-sm">{exp.company}</span>
        </div>

        <div className="space-y-2.5">
          {descList.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <CheckCircle2
                size={15}
                className="mt-0.5 flex-shrink-0"
                style={{ color: "hsl(199,89%,48%)" }}
              />
              <span className="text-white/60 text-sm leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Experience = () => {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [headerVisible, setHeaderVisible] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHeaderVisible(true); },
      { threshold: 0.1 }
    );
    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchExperiences = async () => {
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .order("display_order", { ascending: true });

      if (error || !data || data.length === 0) {
        setExperiences(fallbackExperiences);
      } else {
        setExperiences(data as ExperienceItem[]);
      }
      setLoading(false);
    };
    fetchExperiences();
  }, []);

  return (
    <section
      id="experience"
      className="relative py-28 overflow-hidden"
      style={{ background: "#0a0a0a" }}
    >
      <div className="absolute inset-0 bg-grid pointer-events-none" style={{ opacity: 0.3 }} />

      <div
        className="decorative-bg-text pointer-events-none select-none"
        style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
      >
        CAREER
      </div>

      <div
        className="absolute pointer-events-none"
        style={{
          top: "-100px", left: "-100px",
          width: "500px", height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, hsl(199,89%,48%,0.06) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div
          ref={headerRef}
          className="text-center mb-20"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(28px)",
            transition: "all 0.65s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <div className="section-badge justify-center mx-auto w-fit mb-4">Professional Track</div>
          <h2 className="section-title mb-4">Work Experience</h2>
          <p className="section-subtitle mx-auto text-center">
            My professional journey, internships, and key engineering roles
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "hsl(199,89%,48%)" }} />
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            {experiences.map((exp, index) => (
              <ExperienceCard key={exp.id || index} exp={exp} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Experience;
