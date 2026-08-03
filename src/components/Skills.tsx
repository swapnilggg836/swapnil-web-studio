import { useEffect, useRef, useState } from "react";
import { useSkills } from "@/hooks/useSkills";
import { Loader2 } from "lucide-react";

/* Animated counter hook */
const useCounter = (target: number, duration: number, start: boolean) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration, start]);
  return count;
};

const SkillBar = ({
  name,
  level,
  category,
  index,
}: {
  name: string;
  level: number;
  category: string;
  index: number;
}) => {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = useCounter(level, 1200, animated);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="space-y-3 group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
            style={{
              background: "hsl(199,89%,48%,0.1)",
              color: "hsl(199,89%,60%)",
              border: "1px solid hsl(199,89%,48%,0.2)",
            }}
          >
            {category}
          </span>
          <span
            className="font-semibold text-white text-base group-hover:text-gradient-cyan transition-all"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {name}
          </span>
        </div>
        <span
          className="font-bold text-sm tabular-nums"
          style={{
            color: "hsl(199,89%,60%)",
            fontFamily: "'Space Grotesk', sans-serif",
            minWidth: "3ch",
            textAlign: "right",
          }}
        >
          {count}%
        </span>
      </div>

      <div className="skill-bar-track">
        <div
          className="skill-bar-fill"
          style={{
            width: animated ? `${level}%` : "0%",
            transition: `width 1.3s cubic-bezier(0.25, 1, 0.5, 1) ${index * 55}ms`,
          }}
        />
      </div>
    </div>
  );
};

/* Stat counter card */
const StatCard = ({
  value,
  label,
  index,
  visible,
}: {
  value: string;
  label: string;
  index: number;
  visible: boolean;
}) => {
  const numericTarget = parseInt(value.replace(/\D/g, ""), 10) || 0;
  const suffix = value.replace(/[0-9]/g, "");
  const count = useCounter(numericTarget, 1200, visible);

  return (
    <div
      className="glass-card p-5 text-center shimmer-card"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `all 0.65s cubic-bezier(.16,1,.3,1) ${0.3 + index * 0.1}s`,
      }}
    >
      <div
        className="font-black text-3xl mb-1 text-gradient-cyan"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        {numericTarget > 0 ? `${count}${suffix}` : value}
      </div>
      <div className="text-white/40 text-sm">{label}</div>
    </div>
  );
};

const Skills = () => {
  const { skills, loading } = useSkills();
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const stats = [
    { value: `${skills.length > 0 ? skills.length : 16}+`, label: "Skills Mastered" },
    { value: "8+", label: "Projects Built" },
    { value: "3+", label: "Years Learning" },
  ];

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative py-28 overflow-hidden"
      style={{ background: "#080808" }}
    >
      <div className="absolute inset-0 bg-grid pointer-events-none" style={{ opacity: 0.35 }} />

      <div
        className="decorative-bg-text pointer-events-none select-none"
        style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
      >
        SKILLS
      </div>

      {/* Glow blob */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "-100px", right: "-100px",
          width: "600px", height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, hsl(199,89%,48%,0.07) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <div
          className="text-center mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(28px)",
            transition: "all 0.65s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <div className="section-badge justify-center mx-auto w-fit mb-4">Technical Expertise</div>
          <h2 className="section-title mb-4">My Skills</h2>
          <p className="section-subtitle mx-auto text-center">
            Technologies I've worked with throughout my academic and project journey
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "hsl(199,89%,48%)" }} />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div
              className="glass-card p-8 md:p-12"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(32px)",
                transition: "all 0.7s cubic-bezier(.16,1,.3,1) 0.1s",
                borderColor: "rgba(255,255,255,0.07)",
              }}
            >
              <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                {skills.map((skill, index) => (
                  <SkillBar
                    key={skill.id || skill.name}
                    name={skill.name}
                    level={skill.level}
                    category={skill.category}
                    index={index}
                  />
                ))}
              </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              {stats.map((stat, i) => (
                <StatCard
                  key={stat.label}
                  value={stat.value}
                  label={stat.label}
                  index={i}
                  visible={visible}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;