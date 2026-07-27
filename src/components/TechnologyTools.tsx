import { useState, useEffect, useRef } from 'react';
import { Code, Smartphone, Brain, BarChart3, Wrench, Users, Loader2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

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
      { name: 'Frontend', technologies: ['React.js', 'Next.js', 'HTML5', 'CSS3', 'Tailwind CSS', 'JavaScript (ES6+)'] },
      { name: 'Backend & APIs', technologies: ['Node.js', 'Express.js', 'REST APIs', 'AJAX', 'PHP', 'XAMPP'] },
      { name: 'Database', technologies: ['MySQL', 'MongoDB', 'Supabase', 'PostgreSQL'] },
    ]
  },
  { id: 'app', title: 'App & Mobile', icon: 'Smartphone', color: 'from-emerald-500 to-emerald-700',
    subcategories: [
      { name: 'Frameworks', technologies: ['React Native', 'Flutter', 'PWA'] },
      { name: 'State Management', technologies: ['Redux', 'Context API'] },
      { name: 'Backend Integration', technologies: ['Firebase', 'RESTful Services', 'GraphQL'] },
    ]
  },
  { id: 'ml', title: 'AI / ML & IoT', icon: 'Brain', color: 'from-purple-500 to-purple-700',
    subcategories: [
      { name: 'Machine Learning', technologies: ['Python', 'Scikit-Learn', 'Pandas', 'NumPy'] },
      { name: 'NLP & Vision', technologies: ['Sentiment Analysis', 'OpenCV', 'NLTK', 'Flask APIs'] },
      { name: 'IoT & Hardware', technologies: ['Arduino', 'C++', 'Microcontrollers', 'Sensor Integration'] },
    ]
  },
  { id: 'data', title: 'Data Analytics', icon: 'BarChart3', color: 'from-amber-500 to-amber-700',
    subcategories: [
      { name: 'Business Intelligence', technologies: ['Power BI', 'Excel Advanced', 'DAX'] },
      { name: 'Visualization', technologies: ['Matplotlib', 'Seaborn', 'Chart.js', 'Power BI Dashboards'] },
      { name: 'Data Prep', technologies: ['Data Cleaning', 'ETL Pipelines', 'SQL Queries'] },
    ]
  },
  { id: 'tools', title: 'Developer Tools', icon: 'Wrench', color: 'from-rose-500 to-rose-700',
    subcategories: [
      { name: 'Version Control', technologies: ['Git', 'GitHub', 'GitLab'] },
      { name: 'IDE & Environment', technologies: ['VS Code', 'Jupyter Notebook', 'Postman', 'Vite'] },
      { name: 'Deployment', technologies: ['Vercel', 'Netlify', 'Render', 'Hostinger'] },
    ]
  },
  { id: 'soft', title: 'Soft Skills', icon: 'Users', color: 'from-indigo-500 to-indigo-700',
    subcategories: [
      { name: 'Professional', technologies: ['Problem Solving', 'Team Collaboration', 'Agile / Scrum', 'Technical Writing'] },
      { name: 'Personal', technologies: ['Time Management', 'Continuous Learning', 'Adaptability', 'Project Management'] },
    ]
  },
];

const TechnologyTools = () => {
  const [techCategories, setTechCategories] = useState<TechCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>('web');
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

      if (!error && data && data.length > 0) {
        setTechCategories(data as TechCategory[]);
        setActiveCategory(data[0].id);
      } else {
        setTechCategories(fallbackCategories);
        setActiveCategory('web');
      }
      setLoading(false);
    };

    fetchCategories();
  }, []);

  return (
    <section
      id="technology"
      ref={sectionRef}
      className="relative py-28 overflow-hidden"
      style={{ background: "#0a0a0a" }}
    >
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid pointer-events-none" style={{ opacity: 0.4 }} />

      {/* Decorative text */}
      <div
        className="decorative-bg-text pointer-events-none select-none"
        style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
      >
        STACK
      </div>

      {/* Glow blob */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-100px", right: "-100px",
          width: "500px", height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, hsl(199,89%,48%,0.06) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div
          className="text-center mb-16 transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <div className="section-badge justify-center mx-auto w-fit mb-4">
            Tech Ecosystem
          </div>
          <h2 className="section-title mb-4">Technology & Tools</h2>
          <p className="section-subtitle mx-auto text-center">
            Comprehensive breakdown of my technical stack across domains
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "hsl(199,89%,48%)" }} />
          </div>
        ) : (
          <>
            {/* Category Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
              {techCategories.map((category, i) => {
                const IconComponent = iconMap[category.icon] || Code;
                const isActive = activeCategory === category.id;
                const accent = categoryAccents[category.id] || categoryAccents.web;
                const subcats = Array.isArray(category.subcategories) ? category.subcategories : [];
                const techCount = subcats.reduce((acc, s) => acc + (Array.isArray(s.technologies) ? s.technologies.length : 0), 0);

                return (
                  <div
                    key={category.id}
                    onClick={() => setActiveCategory(isActive ? null : category.id)}
                    className="glass-card cursor-pointer group"
                    style={{
                      opacity: visible ? 1 : 0,
                      transition: `all 0.5s ease ${i * 60}ms`,
                      background: isActive ? accent.bg : "rgba(255,255,255,0.03)",
                      borderColor: isActive ? accent.border : "rgba(255,255,255,0.07)",
                      boxShadow: isActive ? `0 0 30px ${accent.glow}, 0 8px 32px rgba(0,0,0,0.4)` : undefined,
                      transform: isActive ? "translateY(-4px) scale(1.02)" : visible ? "translateY(0)" : "translateY(24px)",
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
                        {techCount} technologies
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
                    const subcats = Array.isArray(category.subcategories) ? category.subcategories : [];

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
                          {subcats.map((subcategory, index) => {
                            const techList = Array.isArray(subcategory.technologies) ? subcategory.technologies : [];
                            return (
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
                                  {techList.map((tech) => (
                                    <span
                                      key={tech}
                                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                                      style={{
                                        background: "rgba(255,255,255,0.04)",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                        color: "rgba(255,255,255,0.75)",
                                      }}
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default TechnologyTools;
