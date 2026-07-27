import { useEffect, useRef, useState } from "react";

const skills = [
  { name: "HTML", level: 90, category: "Frontend" },
  { name: "CSS", level: 80, category: "Frontend" },
  { name: "JavaScript", level: 65, category: "Frontend" },
  { name: "Python", level: 75, category: "Backend" },
  { name: "C++", level: 70, category: "Languages" },
  { name: "MySQL", level: 70, category: "Database" },
  { name: "React.js", level: 60, category: "Frontend" },
  { name: "PHP", level: 40, category: "Backend" },
];

const SkillBar = ({ name, level, category, index }: { name: string; level: number; category: string; index: number }) => {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setAnimated(true), index * 80);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [index]);

  return (
    <div ref={ref} className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
            style={{
              background: "hsl(199,89%,48%,0.12)",
              color: "hsl(199,89%,60%)",
              border: "1px solid hsl(199,89%,48%,0.2)",
            }}
          >
            {category}
          </span>
          <span className="font-semibold text-white text-base">{name}</span>
        </div>
        <span className="font-bold text-sm" style={{ color: "hsl(199,89%,60%)" }}>
          {level}%
        </span>
      </div>
      <div className="skill-bar-track">
        <div
          className="skill-bar-fill"
          style={{
            width: animated ? `${level}%` : "0%",
            transition: `width 1.3s cubic-bezier(0.25, 1, 0.5, 1) ${index * 80}ms`,
          }}
        />
      </div>
    </div>
  );
};

const Skills = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative py-28 overflow-hidden"
      style={{ background: "#080808" }}
    >
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid pointer-events-none" style={{ opacity: 0.4 }} />

      {/* Decorative background text */}
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
          width: "500px", height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, hsl(199,89%,48%,0.06) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <div
          className="text-center mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "all 0.6s ease",
          }}
        >
          <div className="section-badge justify-center mx-auto w-fit mb-4">
            Technical Expertise
          </div>
          <h2 className="section-title mb-4">My Skills</h2>
          <p className="section-subtitle mx-auto text-center">
            Technologies I've worked with throughout my academic and project journey
          </p>
        </div>

        {/* Skills grid */}
        <div className="max-w-4xl mx-auto">
          <div
            className="glass-card p-8 md:p-12"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(30px)",
              transition: "all 0.7s ease 0.1s",
            }}
          >
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
              {skills.map((skill, index) => (
                <SkillBar key={skill.name} {...skill} index={index} />
              ))}
            </div>
          </div>

          {/* Extra stats */}
          <div
            className="grid grid-cols-3 gap-4 mt-8"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.7s ease 0.3s",
            }}
          >
            {[
              { value: "8+", label: "Projects Built" },
              { value: "5+", label: "Technologies" },
              { value: "3+", label: "Years Learning" },
            ].map((stat) => (
              <div key={stat.label} className="glass-card p-5 text-center">
                <div
                  className="font-black text-3xl mb-1"
                  style={{ color: "hsl(199,89%,48%)" }}
                >
                  {stat.value}
                </div>
                <div className="text-white/40 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;