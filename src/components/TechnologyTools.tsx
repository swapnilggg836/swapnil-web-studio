
import { useState } from 'react';
import { Code, Smartphone, Brain, BarChart3, Wrench, Users } from 'lucide-react';

interface TechCategory {
  id: string;
  title: string;
  icon: any;
  color: string;
  subcategories: {
    name: string;
    technologies: string[];
  }[];
}

const TechnologyTools = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const techCategories: TechCategory[] = [
    {
      id: 'web',
      title: 'Web Development',
      icon: Code,
      color: 'from-blue-500 to-blue-700',
      subcategories: [
        {
          name: 'Frontend Technologies',
          technologies: ['HTML', 'CSS', 'JavaScript', 'React.js', 'Tailwind CSS', 'Next.js', 'Bootstrap']
        },
        {
          name: 'Backend Technologies',
          technologies: ['PHP', 'Node.js', 'Flask (Python)', 'Express.js']
        },
        {
          name: 'Database Technologies',
          technologies: ['MySQL', 'MongoDB', 'JSON (Local Storage)']
        },
        {
          name: 'Full Stack Development',
          technologies: ['MERN Stack', 'MongoDB', 'Express.js', 'React', 'Node.js', 'Java Full Stack']
        }
      ]
    },
    {
      id: 'app',
      title: 'App Development',
      icon: Smartphone,
      color: 'from-green-500 to-green-700',
      subcategories: [
        {
          name: 'Mobile Technologies',
          technologies: ['React Native', 'Android Development', 'Cross-Platform Apps']
        },
        {
          name: 'Development Tools',
          technologies: ['Android Studio', 'Expo', 'Mobile UI/UX Design']
        }
      ]
    },
    {
      id: 'ml',
      title: 'Machine Learning',
      icon: Brain,
      color: 'from-purple-500 to-purple-700',
      subcategories: [
        {
          name: 'ML Libraries & Frameworks',
          technologies: ['scikit-learn', 'TensorFlow', 'Keras', 'PyTorch']
        },
        {
          name: 'ML Applications',
          technologies: ['Sentiment Analysis', 'Predictive Modeling', 'Classification', 'Regression']
        }
      ]
    },
    {
      id: 'data',
      title: 'Data Science',
      icon: BarChart3,
      color: 'from-orange-500 to-orange-700',
      subcategories: [
        {
          name: 'Data Analysis Tools',
          technologies: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Power BI']
        },
        {
          name: 'Data Handling',
          technologies: ['CSV Processing', 'JSON Data Handling', 'Data Visualization', 'Statistical Analysis']
        }
      ]
    },
    {
      id: 'tools',
      title: 'Other Tools',
      icon: Wrench,
      color: 'from-red-500 to-red-700',
      subcategories: [
        {
          name: 'Development Tools',
          technologies: ['VS Code', 'Git & GitHub', 'Postman', 'XAMPP']
        },
        {
          name: 'Embedded & IoT',
          technologies: ['Arduino Uno', 'C/C++', 'Ultrasonic Sensor', 'LDR Sensor', 'Color Sensor', 'Motor Control']
        },
        {
          name: 'Hosting & Deployment',
          technologies: ['Hostinger', 'Web Hosting', 'Domain Management']
        }
      ]
    },
    {
      id: 'soft',
      title: 'Soft Skills',
      icon: Users,
      color: 'from-indigo-500 to-indigo-700',
      subcategories: [
        {
          name: 'Communication Skills',
          technologies: ['Strong Communication', 'Presentation Skills', 'Technical Writing']
        },
        {
          name: 'Leadership & Management',
          technologies: ['Teamwork', 'Leadership', 'Project Management', 'Problem Solving']
        },
        {
          name: 'Personal Qualities',
          technologies: ['Fast Learner', 'Adaptability', 'Critical Thinking', 'Time Management']
        }
      ]
    }
  ];

  return (
    <section id="technology" className="py-20 bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Technology & Tools
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive overview of my technical expertise and skill set
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {techCategories.map((category) => {
            const IconComponent = category.icon;
            const isActive = activeCategory === category.id;
            
            return (
              <div
                key={category.id}
                className={`relative group cursor-pointer transform transition-all duration-300 ${
                  isActive ? 'scale-105' : 'hover:scale-105'
                }`}
                onClick={() => setActiveCategory(isActive ? null : category.id)}
              >
                <div className={`
                  bg-gradient-to-r ${category.color} p-8 rounded-2xl text-white
                  shadow-lg hover:shadow-2xl transition-all duration-300
                  border-2 border-transparent hover:border-white/20
                  ${isActive ? 'ring-4 ring-secondary/50 shadow-2xl' : ''}
                `}>
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className={`
                      p-4 rounded-full bg-white/20 backdrop-blur-sm
                      transition-all duration-300 group-hover:bg-white/30
                      ${isActive ? 'animate-pulse' : ''}
                    `}>
                      <IconComponent size={40} />
                    </div>
                    <h3 className="text-xl font-bold">{category.title}</h3>
                    <div className={`
                      w-8 h-1 bg-white/50 rounded-full transition-all duration-300
                      ${isActive ? 'w-16 bg-white' : 'group-hover:w-12 group-hover:bg-white/70'}
                    `} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Category Details */}
        {activeCategory && (
          <div className="animate-fade-in">
            {techCategories
              .filter(cat => cat.id === activeCategory)
              .map(category => (
                <div key={category.id} className="bg-card border border-border rounded-2xl p-8 shadow-glow-sm">
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold text-foreground mb-2">
                      {category.title} Details
                    </h3>
                    <div className={`w-24 h-1 bg-gradient-to-r ${category.color} mx-auto rounded-full`} />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {category.subcategories.map((subcategory, index) => (
                      <div 
                        key={index}
                        className="bg-muted/50 rounded-xl p-6 hover:bg-muted/70 transition-all duration-300 hover:shadow-lg"
                      >
                        <h4 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                          <div className={`w-3 h-3 bg-gradient-to-r ${category.color} rounded-full mr-3`} />
                          {subcategory.name}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {subcategory.technologies.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="px-3 py-1 bg-background border border-border rounded-full text-sm text-foreground hover:border-secondary hover:text-secondary transition-all duration-200 cursor-default"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-center mt-8">
                    <button
                      onClick={() => setActiveCategory(null)}
                      className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-all duration-200"
                    >
                      Close Details
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TechnologyTools;
