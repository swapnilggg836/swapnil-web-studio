import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Briefcase } from "lucide-react";

interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  location: string;
  period: string;
  description: string[];
  display_order: number;
}

const Experience = () => {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .order("display_order", { ascending: true });

      if (!error && data) {
        setExperiences(data);
      }
      setLoading(false);
    };

    fetchExperiences();
  }, []);

  if (loading) {
    return (
      <section id="experience" className="py-20 bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="container mx-auto px-4 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  // Don't render if no experiences
  if (experiences.length === 0) {
    return null;
  }

  return (
    <section id="experience" className="py-20 bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Professional Experience
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            My professional journey and work experience
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-12 top-0 bottom-0 w-0.5 bg-primary/30"></div>

            <div className="space-y-8">
              {experiences.map((exp) => (
                <div key={exp.id} className="relative pl-20 md:pl-28">
                  {/* Timeline icon */}
                  <div className="absolute left-4 md:left-8 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-glow-sm">
                    <Briefcase className="w-4 h-4 text-primary-foreground" />
                  </div>

                  <Card className="group hover:shadow-glow transition-all duration-300 transform hover:-translate-y-1 border-2 hover:border-primary/50">
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <CardTitle className="text-xl font-bold text-foreground">
                            {exp.title}
                          </CardTitle>
                          <CardDescription className="text-primary font-medium">
                            {exp.company}
                          </CardDescription>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>{exp.period}</p>
                          <p>{exp.location}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        {exp.description.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
