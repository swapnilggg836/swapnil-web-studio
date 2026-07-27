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

const EducationCard = ({ edu, index }: { edu: EducationItem; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Small timeout to ensure DOM is ready, then observe
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
      {/* Timeline dot + line */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 z-10"
          style={{
            background: "linear-gradient(135deg, hsl(199,89%,20%), hsl(199,89%,35%))",
            border: "2px solid hsl(199,89%,48%)",
            boxShadow: "0 0 16px hsl(199,89%,48%,0.4)",
          }}
        >
          <GraduationCap size={20} style={{ color: "hsl(199,89%,70%)" }} />
        </div>
        {/* Connecting line */}
        <div
          className="flex-1 w-px mt-2"
          style={{ background: "linear-gradient(to bottom, hsl(199,89%,48%,0.4), transparent)", minHeight: "2rem" }}
        />
      </div>

      {/* Card */}
      <div
        className="flex-1 mb-10 rounded-2xl p-6 transition-all duration-700"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          opacity: show ? 1 : 0,
          transform: show ? "translateX(0)" : "translateX(-24px)",
          transitionDelay: `${index * 120}ms`,
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor = "hsl(199,89%,48%,0.35)";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 0 30px hsl(199,89%,48%,0.1)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
          (e.currentTarget as HTMLElement).style.boxShadow = "none";
        }}
      >
        {/* Year badge */}
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4"
          style={{
            background: "hsl(199,89%,48%,0.12)",
            border: "1px solid hsl(199,89%,48%,0.3)",
            color: "hsl(199,89%,65%)",
          }}
        >
          <Calendar size={11} />
          {edu.year}
        </div>

        <h3 className="font-black text-white text-lg leading-tight mb-2">
          {edu.institution}
        </h3>

        <div className="flex items-center gap-1.5 mb-3">
          <MapPin size={13} style={{ color: "rgba(255,255,255,0.35)" }} />
          <p className="text-white/40 text-sm">{edu.location}</p>
        </div>

        <div
          className="inline-block px-3 py-1.5 rounded-lg text-sm font-semibold"
          style={{
            background: "rgba(255,255,255,0.06)",
            color: "rgba(255,255,255,0.75)",
          }}
        >
          {edu.degree}
        </div>
      </div>
    </div>
  );
};

const Education = () => {
  const [educationData, setEducationData] = useState<EducationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [headerVisible, setHeaderVisible] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  // Header animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHeaderVisible(true); },
      { threshold: 0.1 }
    );
    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  // Fetch from Supabase
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
      {/* Background dots */}
      <div className="absolute inset-0 bg-dots pointer-events-none" style={{ opacity: 0.4 }} />

      {/* Decorative background text */}
      <div
        className="decorative-bg-text pointer-events-none select-none"
        style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
      >
        EDU
      </div>

      {/* Glow blob */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "-100px", right: "-100px",
          width: "500px", height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, hsl(199,89%,48%,0.06) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div
          ref={headerRef}
          className="text-center mb-20 transition-all duration-700"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <div className="section-badge justify-center mx-auto w-fit mb-4">
            Academic Background
          </div>
          <h2 className="section-title mb-4">Education</h2>
          <p className="section-subtitle mx-auto text-center">
            My academic journey that shaped my knowledge and skills
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2
              className="w-8 h-8 animate-spin"
              style={{ color: "hsl(199,89%,48%)" }}
            />
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
