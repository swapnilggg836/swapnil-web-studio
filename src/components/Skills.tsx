import { useEffect, useMemo, useRef, useState } from "react";
import { useSkills, Skill } from "@/hooks/useSkills";
import { Loader2 } from "lucide-react";
import { categoryLabel, categoryRank } from "@/lib/skillCategories";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

/* Compact skill badge with proficiency tooltip */
const SkillBadge = ({ skill }: { skill: Skill }) => (
  <Tooltip delayDuration={120}>
    <TooltipTrigger asChild>
      <span
        className="px-3 py-1.5 rounded-full text-sm font-medium cursor-default transition-all duration-300 hover:-translate-y-0.5"
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          background: "hsl(199,89%,48%,0.07)",
          border: "1px solid hsl(199,89%,48%,0.22)",
          color: "rgba(255,255,255,0.85)",
        }}
      >
        {skill.name}
      </span>
    </TooltipTrigger>
    <TooltipContent>Proficiency: {skill.level}%</TooltipContent>
  </Tooltip>
);

/* One card per category */
const CategoryCard = ({
  category,
  items,
  index,
  visible,
}: {
  category: string;
  items: Skill[];
  index: number;
  visible: boolean;
}) => (
  <div
    className="glass-card p-6 md:p-7"
    style={{
      borderColor: "rgba(255,255,255,0.07)",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(28px)",
      transition: `all 0.6s cubic-bezier(.16,1,.3,1) ${0.08 + index * 0.07}s`,
    }}
  >
    <div className="flex items-center justify-between gap-3 mb-5">
      <h3
        className="font-bold text-lg text-white"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        {categoryLabel(category)}
      </h3>
      <span
        className="px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0"
        style={{
          background: "hsl(199,89%,48%,0.1)",
          color: "hsl(199,89%,60%)",
          border: "1px solid hsl(199,89%,48%,0.2)",
        }}
      >
        {items.length}
      </span>
    </div>
    <div className="flex flex-wrap gap-2">
      {items.map((s) => (
        <SkillBadge key={s.id || `${category}-${s.name}`} skill={s} />
      ))}
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
