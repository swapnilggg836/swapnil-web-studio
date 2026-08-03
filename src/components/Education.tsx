import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, GraduationCap, MapPin, Calendar } from "lucide-react";

interface EducationItem {
  id: string;
  year: string;
  institution: string;
  location: string;
  degree: string;
  period: string;
  display_order: number;
}

const fallbackEducation: EducationItem[] = [
  { id: "1", year: "2022 – 2026", institution: "SNJB's Late Sau KBJ College of Engineering", location: "Chandwad, Nashik – 423101", degree: "TE in Artificial Intelligence and Data Science", period: "2023 – 2026", display_order: 0 },
  { id: "2", year: "2021 – 2022", institution: "Swami Muktanand Sec. School", location: "Yeola, Nashik – 423401", degree: "HSC (Class XII) — 79.50%", period: "2021 – 2022", display_order: 1 },
  { id: "3", year: "2019 – 2020", institution: "Janta Vidyalaya Yeola", location: "Yeola, Nashik – 423401", degree: "SSC (Class X) — 89.20%", period: "2019 – 2020", display_order: 2 },
];

// Extract a score from degree string to show a small bar (optional visual)
const extractScore = (degree: string): number | null => {
  const match = degree.match(/(\d+\.?\d*)%/);
  return match ? parseFloat(match[1]) : null;
};

const EducationCard = ({ edu, index }: { edu: EducationItem; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const score = extractScore(edu.degree);

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

  return (
    <div ref={ref} className="relative flex gap-6 md:gap-8">
      {/* Timeline column */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          className="timeline-dot-outer w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 z-10"
          style={{
            background: "linear-gradient(135deg, hsl(199,89%,14%), hsl(199,89%,36%))",
            border: "2px solid hsl(199,89%,48%)",
            boxShadow: "0 0 18px hsl(199,89%,48%,0.45)",
          }}
        >
          <GraduationCap size={19} style={{ color: "hsl(199,89%,70%)" }} />
        </div>

        {/* Animated connector */}
        <div
          className="flex-1 w-px mt-2 origin-top"
          style={{
            background: "linear-gradient(to bottom, hsl(199,89%,48%,0.45), transparent)",
            minHeight: "2rem",
            transform: show ? "scaleY(1)" : "scaleY(0)",
            transition: "transform 0.8s cubic-bezier(.16,1,.3,1) 0.3s",
          }}
        />
      </div>

      {/* Card — slides in from LEFT (opposite to experience for visual rhythm) */}
      <div
        className="flex-1 mb-10 rounded-2xl p-6 shimmer-card"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderLeft: "2px solid hsl(270,70%,60%,0.35)",
          opacity: show ? 1 : 0,
          transform: show ? "translateX(0)" : "translateX(-28px)",
          transition: `all 0.65s cubic-bezier(.16,1,.3,1) ${index * 120}ms`,
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor = "hsl(270,70%,60%,0.35)";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 40px rgba(0,0,0,0.4), 0 0 25px hsl(270,70%,60%,0.1)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
          (e.currentTarget as HTMLElement).style.boxShadow = "none";
        }}
      >
        {/* Year badge */}
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4"
          style={{
            background: "hsl(199,89%,48%,0.1)",
            border: "1px solid hsl(199,89%,48%,0.25)",
            color: "hsl(199,89%,62%)",
          }}
        >
          <Calendar size={11} />
          {edu.year}
        </div>

        <h3
          className="font-black text-white text-lg leading-tight mb-2"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {edu.institution}
        </h3>

        <div className="flex items-center gap-1.5 mb-3">
          <MapPin size={12} style={{ color: "rgba(255,255,255,0.3)" }} />
          <p className="text-white/35 text-sm">{edu.location}</p>
        </div>

        <div
          className="inline-block px-3 py-1.5 rounded-lg text-sm font-semibold mb-4"
          style={{
            background: "rgba(255,255,255,0.05)",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          {edu.degree}
        </div>

        {/* Score bar for graded entries */}
        {score !== null && (
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-white/30 text-xs">Performance</span>
              <span className="text-xs font-bold" style={{ color: "hsl(199,89%,60%)" }}>{score}%</span>
            </div>
            <div className="skill-bar-track">
              <div
                className="skill-bar-fill"
                style={{
                  width: show ? `${score}%` : "0%",
                  transition: "width 1.2s cubic-bezier(0.25,1,0.5,1) 0.4s",
                  background: "linear-gradient(90deg, hsl(270,70%,45%), hsl(199,89%,55%))",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Education = () => {
  const [educationData, setEducationData] = useState<EducationItem[]>([]);
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
    const fetchEducation = async () => {
      const { data, error } = await supabase
        .from("education")
        .select("*")
        .order("display_order", { ascending: true });

      if (error || !data || data.length === 0) {
        setEducationData(fallbackEducation);
      } else {
        setEducationData(data as EducationItem[]);
      }
      setLoading(false);
    };
    fetchEducation();
  }, []);

  return (
    <section
      id="education"
      className="relative py-28 overflow-hidden"
      style={{ background: "#080808" }}
    >
      <div className="absolute inset-0 bg-dots pointer-events-none" style={{ opacity: 0.35 }} />

      <div
        className="decorative-bg-text pointer-events-none select-none"
        style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
      >
        EDU
      </div>

      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "-100px", right: "-100px",
          width: "500px", height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, hsl(270,70%,60%,0.06) 0%, transparent 70%)",
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
          <div className="section-badge justify-center mx-auto w-fit mb-4">Academic Background</div>
          <h2 className="section-title mb-4">Education</h2>
          <p className="section-subtitle mx-auto text-center">
            My academic journey that shaped my knowledge and skills
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "hsl(199,89%,48%)" }} />
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            {educationData.map((edu, index) => (
              <EducationCard key={edu.id} edu={edu} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Education;
