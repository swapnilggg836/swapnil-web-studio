import { useState, useEffect, useRef } from 'react';
import { Code, Smartphone, Brain, BarChart3, Wrench, Users } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface Subcategory {
  name: string;
  technologies: string[];
}

interface TechCategory {
  id: string;
  title: string;
  icon: string;
  color: string;
  subcategories: Subcategory[];
}

const iconMap: Record<string, typeof Code> = {
  Code, Smartphone, Brain, BarChart3, Wrench, Users,
};

// Accent colors per category (dark-theme friendly)
const categoryAccents: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  web:    { bg: "hsl(199,89%,48%,0.1)",  border: "hsl(199,89%,48%,0.3)",  text: "hsl(199,89%,65%)",  glow: "hsl(199,89%,48%,0.2)" },
  app:    { bg: "hsl(142,70%,45%,0.1)",  border: "hsl(142,70%,45%,0.3)",  text: "hsl(142,70%,60%)",  glow: "hsl(142,70%,45%,0.2)" },
  ml:     { bg: "hsl(270,70%,60%,0.1)",  border: "hsl(270,70%,60%,0.3)",  text: "hsl(270,70%,75%)",  glow: "hsl(270,70%,60%,0.2)" },
  data:   { bg: "hsl(35,90%,55%,0.1)",   border: "hsl(35,90%,55%,0.3)",   text: "hsl(35,90%,70%)",   glow: "hsl(35,90%,55%,0.2)" },
  tools:  { bg: "hsl(0,80%,60%,0.1)",    border: "hsl(0,80%,60%,0.3)",    text: "hsl(0,80%,75%)",    glow: "hsl(0,80%,60%,0.2)" },
  soft:   { bg: "hsl(220,70%,60%,0.1)",  border: "hsl(220,70%,60%,0.3)",  text: "hsl(220,70%,75%)",  glow: "hsl(220,70%,60%,0.2)" },
  skills: { bg: "hsl(175,70%,45%,0.1)",  border: "hsl(175,70%,45%,0.3)",  text: "hsl(175,70%,60%)",  glow: "hsl(175,70%,45%,0.2)" },
};

const fallbackCategories: TechCategory[] = [
  { id: 'web', title: 'Web Development', icon: 'Code', color: 'from-blue-500 to-blue-700',
    subcategories: [
      { name: 'Frontend', technologies: ['HTML', 'CSS', 'JavaScript', 'React.js', 'Tailwind CSS', 'Next.js', 'Bootstrap'] },
      { name: 'Backend', technologies: ['PHP', 'Node.js', 'Flask (Python)', 'Express.js'] },
      { name: 'Database', technologies: ['MySQL', 'MongoDB', 'JSON (Local Storage)'] },
      { name: 'Full Stack', technologies: ['MERN Stack', 'MongoDB', 'Express.js', 'React', 'Node.js'] }
    ]
  },
  { id: 'app', title: 'App Development', icon: 'Smartphone', color: 'from-green-500 to-green-700',
    subcategories: [
      { name: 'Mobile', technologies: ['React Native', 'Android Development', 'Cross-Platform Apps'] },
      { name: 'Tools', technologies: ['Android Studio', 'Expo', 'Mobile UI/UX Design'] }
    ]
  },
  { id: 'ml', title: 'Machine Learning', icon: 'Brain', color: 'from-purple-500 to-purple-700',
    subcategories: [
      { name: 'Frameworks', technologies: ['scikit-learn', 'TensorFlow', 'Keras', 'PyTorch'] },
      { name: 'Applications', technologies: ['Sentiment Analysis', 'Predictive Modeling', 'Classification', 'Regression'] }
    ]
  },
  { id: 'data', title: 'Data Science', icon: 'BarChart3', color: 'from-orange-500 to-orange-700',
    subcategories: [
      { name: 'Tools', technologies: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Power BI'] },
      { name: 'Analysis', technologies: ['CSV Processing', 'Data Visualization', 'Statistical Analysis'] }
    ]
  },
  { id: 'tools', title: 'Other Tools', icon: 'Wrench', color: 'from-red-500 to-red-700',
    subcategories: [
      { name: 'Dev Tools', technologies: ['VS Code', 'Git & GitHub', 'Postman', 'XAMPP'] },
      { name: 'Embedded & IoT', technologies: ['Arduino Uno', 'C/C++', 'Ultrasonic Sensor', 'LDR Sensor', 'Motor Control'] },
      { name: 'Hosting', technologies: ['Hostinger', 'Web Hosting', 'Domain Management'] }
    ]
  },
  { id: 'soft', title: 'Soft Skills', icon: 'Users', color: 'from-indigo-500 to-indigo-700',
    subcategories: [
      { name: 'Communication', technologies: ['Strong Communication', 'Presentation Skills', 'Technical Writing'] },
      { name: 'Leadership', technologies: ['Teamwork', 'Leadership', 'Project Management', 'Problem Solving'] },
      { name: 'Personal', technologies: ['Fast Learner', 'Adaptability', 'Critical Thinking', 'Time Management'] }
    ]
  },
  { id: 'skills', title: 'Programming Skills', icon: 'Code', color: 'from-teal-500 to-teal-700',
    subcategories: [
      { name: 'Languages', technologies: ['Python', 'Java', 'C++', 'JavaScript', 'PHP', 'C'] },
      { name: 'Concepts', technologies: ['OOP', 'Data Structures', 'Algorithms', 'Design Patterns'] },
      { name: 'Database', technologies: ['MySQL', 'MongoDB', 'SQLite', 'Database Design'] }
    ]
  }
];

const TechnologyTools = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [techCategories, setTechCategories] = useState<TechCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("technology_categories")
        .select("*")
        .order("display_order", { ascending: true });
      if (error || !data || data.length === 0) {
        setTechCategories(fallbackCategories);
      } else {
        const transformed = data.map(item => ({
          id: item.id,
          title: item.title,
          icon: item.icon,
          color: item.color,
          subcategories: (item.subcategories as unknown as Subcategory[]) || []
        }));
        setTechCategories(transformed);
      }
      setLoading(false);
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section id="technology" className="py-28" style={{ background: "#060606" }}>
        <div className="container mx-auto px-6 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: "hsl(199,89%,48%)" }} />
        </div>
      </section>
    );
  }

  return (
    <section
      id="technology"
      ref={sectionRef}
      className="relative py-28 overflow-hidden"
      style={{ background: "#060606" }}
    >
      {/* Background dots */}
      <div className="absolute inset-0 bg-dots pointer-events-none" style={{ opacity: 0.5 }} />

      {/* Glow blob */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-100px", left: "50%", transform: "translateX(-50%)",
          width: "800px", height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(ellipse, hsl(199,89%,48%,0.05) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div
          className="text-center mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "all 0.6s ease",
          }}
        >
          <div className="section-badge justify-center mx-auto w-fit mb-4">
            Tech Stack
          </div>
          <h2 className="section-title mb-4">Technology & Tools</h2>
          <p className="section-subtitle mx-auto text-center">
            Comprehensive overview of my technical expertise — click any card to explore
          </p>
        </div>

        {/* Category cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {techCategories.map((category, i) => {
            const IconComponent = iconMap[category.icon] || Code;
            const isActive = activeCategory === category.id;
            const accent = categoryAccents[category.id] || categoryAccents.web;

            return (
              <div
                key={category.id}
                onClick={() => setActiveCategory(isActive ? null : category.id)}
                className="glass-card cursor-pointer group"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(24px)",
                  transition: `all 0.5s ease ${i * 60}ms`,
                  background: isActive ? accent.bg : "rgba(255,255,255,0.03)",
                  borderColor: isActive ? accent.border : "rgba(255,255,255,0.07)",
                  boxShadow: isActive ? `0 0 30px ${accent.glow}, 0 8px 32px rgba(0,0,0,0.4)` : undefined,
                  transform: isActive ? "translateY(-4px) scale(1.02)" : undefined,
                }}
              >
                <div className="p-6 flex flex-col items-center text-center gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300"
                    style={{
                      background: isActive ? accent.bg : "rgba(255,255,255,0.05)",
                      border: `1px solid ${isActive ? accent.border : "rgba(255,255,255,0.1)"}`,
                    }}
                  >
                    <IconComponent
                      size={26}
                      style={{ color: isActive ? accent.text : "rgba(255,255,255,0.5)" }}
                    />
                  </div>
                  <h3
                    className="font-bold text-base leading-tight"
                    style={{ color: isActive ? accent.text : "rgba(255,255,255,0.8)" }}
                  >
                    {category.title}
                  </h3>
                  <div
                    className="text-xs transition-all duration-300"
                    style={{ color: isActive ? accent.text : "rgba(255,255,255,0.3)" }}
                  >
                    {category.subcategories.reduce((acc, s) => acc + s.technologies.length, 0)} technologies
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active category detail panel */}
        {activeCategory && (
          <div
            className="glass-card animate-fade-up"
            style={{ padding: "2rem" }}
          >
            {techCategories
              .filter(cat => cat.id === activeCategory)
              .map(category => {
                const accent = categoryAccents[category.id] || categoryAccents.web;
                return (
                  <div key={category.id}>
                    <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                      <div>
                        <h3 className="text-2xl font-black text-white mb-1">{category.title}</h3>
                        <div
                          className="w-16 h-1 rounded-full"
                          style={{ background: accent.text }}
                        />
                      </div>
                      <button
                        onClick={() => setActiveCategory(null)}
                        className="btn-pill btn-pill-outline text-sm"
                        style={{ padding: "0.4rem 1rem" }}
                      >
                        Close ✕
                      </button>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {category.subcategories.map((subcategory, index) => (
                        <div
                          key={index}
                          className="rounded-xl p-5"
                          style={{
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.06)",
                          }}
                        >
                          <h4 className="font-semibold text-white/80 mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
                            <span
                              className="w-2 h-2 rounded-full inline-block flex-shrink-0"
                              style={{ background: accent.text }}
                            />
                            {subcategory.name}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {subcategory.technologies.map((tech, techIndex) => (
                              <span
                                key={techIndex}
                                className="px-3 py-1 rounded-full text-xs font-medium transition-all duration-200"
                                style={{
                                  background: accent.bg,
                                  border: `1px solid ${accent.border}`,
                                  color: accent.text,
                                }}
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </section>
  );
};

export default TechnologyTools;
