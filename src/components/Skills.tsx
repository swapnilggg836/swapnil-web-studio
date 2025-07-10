import { Progress } from "@/components/ui/progress";

const Skills = () => {
  const skills = [
    { name: "HTML", level: 90, icon: "🌐" },
    { name: "CSS", level: 80, icon: "🎨" },
    { name: "C++", level: 70, icon: "⚡" },
    { name: "Python", level: 70, icon: "🐍" },
    { name: "PHP", level: 30, icon: "💻" },
    { name: "MySQL", level: 70, icon: "🗄️" },
    { name: "JavaScript", level: 50, icon: "📜" },
  ];

  return (
    <section id="skills" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Skills
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-glow-sm hover:shadow-glow transition-all duration-300">
            <div className="space-y-8">
              {skills.map((skill, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{skill.icon}</span>
                      <span className="font-semibold text-foreground text-lg">
                        {skill.name}
                      </span>
                    </div>
                    <span className="text-muted-foreground font-medium">
                      {skill.level}%
                    </span>
                  </div>
                  <div className="relative">
                    <Progress 
                      value={skill.level} 
                      className="h-3 bg-muted"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary to-hero-start rounded-full opacity-80" 
                         style={{ width: `${skill.level}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;