import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSkills, Skill } from "@/hooks/useSkills";
import { useProjects } from "@/hooks/useProjects";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { categoryLabel, categoryRank } from "@/lib/skillCategories";

const AUTO_INTERVAL = 5000;
const RESUME_DELAY = 12000;

/* Animated counter hook */
const useCounter = (target: number, duration: number, start: boolean) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration, start]);
  return count;
};

/* A single skill row: name + percentage + glowing progress bar */
const SkillRow = ({ skill, index, animate }: { skill: Skill; index: number; animate: boolean }) => (
  <div className="w-full">
    <div className="flex items-baseline justify-between gap-4 mb-2">
      <span
        className="font-medium text-sm md:text-base text-white/90 break-words"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        {skill.name}
      </span>
      <span
        className="text-sm font-semibold shrink-0"
        style={{ color: "hsl(199,89%,60%)", fontFamily: "'Space Grotesk', sans-serif" }}
      >
        {skill.level}%
      </span>
    </div>
    <div
      className="h-2 w-full rounded-full overflow-hidden"
      style={{ background: "rgba(255,255,255,0.06)" }}
      role="progressbar"
      aria-label={skill.name}
      aria-valuenow={skill.level}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full"
        style={{
          width: animate ? `${Math.min(Math.max(skill.level, 0), 100)}%` : "0%",
          background: "linear-gradient(90deg, hsl(199,89%,48%), hsl(186,90%,58%))",
          boxShadow: "0 0 12px hsl(199,89%,48%,0.55)",
          transition: `width 0.9s cubic-bezier(.16,1,.3,1) ${0.05 + index * 0.06}s`,
        }}
      />
    </div>
  </div>
);

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

  /* Group individual skill records by category, sorted by display order */
  const groups = useMemo(() => {
    const map = new Map<string, Skill[]>();
    skills.forEach((s) => {
      const key = s.category || "Other";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s);
    });
    return Array.from(map.entries())
      .map(([category, items]) => ({
        category,
        items: [...items].sort(
          (a, b) =>
            (a.display_order ?? 0) - (b.display_order ?? 0) || a.name.localeCompare(b.name)
        ),
      }))
      .sort(
        (a, b) =>
          categoryRank(a.category) - categoryRank(b.category) ||
          a.category.localeCompare(b.category)
      );
  }, [skills]);

  const stats = [
    { value: `${skills.length > 0 ? skills.length : 16}+`, label: "Skills Mastered" },
    { value: `${groups.length > 0 ? groups.length : 8}`, label: "Skill Areas" },
    { value: "8+", label: "Projects Built" },
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
          <TooltipProvider>
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {groups.map((g, i) => (
                  <CategoryCard
                    key={g.category}
                    category={g.category}
                    items={g.items}
                    index={i}
                    visible={visible}
                  />
                ))}
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
          </TooltipProvider>
        )}
      </div>
    </section>
  );
};

export default Skills;
