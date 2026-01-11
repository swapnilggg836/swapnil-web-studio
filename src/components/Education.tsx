import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface EducationItem {
  id: string;
  year: string;
  institution: string;
  location: string;
  degree: string;
  period: string;
  display_order: number;
}

// Fallback data
const fallbackEducation = [
  {
    id: "1",
    year: "2022 to 2026",
    institution: "SNJB's Late Sau KBJ College of Engineering",
    location: "Chandwad, Nashik - 423101",
    degree: "TE in Artificial Intelligence and Data Science",
    period: "2023 - 2026",
    display_order: 0
  },
  {
    id: "2",
    year: "2021 to 2022",
    institution: "Swami Muktanand Sec. School",
    location: "Yeola, Nashik - 423401",
    degree: "HSC (Class XII), 79.50%",
    period: "2021 - 2022",
    display_order: 1
  },
  {
    id: "3",
    year: "2019 to 2020",
    institution: "Janta Vidyalaya Yeola",
    location: "Yeola, Nashik - 423401",
    degree: "SSC (Class X), 89.20%",
    period: "2019 - 2020",
    display_order: 2
  }
];

const Education = () => {
  const [educationData, setEducationData] = useState<EducationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEducation = async () => {
      const { data, error } = await supabase
        .from("education")
        .select("*")
        .order("display_order", { ascending: true });

      if (error || !data || data.length === 0) {
        setEducationData(fallbackEducation);
      } else {
        setEducationData(data);
      }
      setLoading(false);
    };

    fetchEducation();
  }, []);

  if (loading) {
    return (
      <section id="education" className="py-20 bg-section-bg">
        <div className="container mx-auto px-4 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  return (
    <section id="education" className="py-20 bg-section-bg">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Education
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 transform md:-translate-x-px top-0 bottom-0 w-0.5 bg-secondary"></div>

            <div className="space-y-12">
              {educationData.map((education, index) => (
                <div key={education.id} className="relative">
                  {/* Timeline dot */}
                  <div className="absolute left-6 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 bg-secondary rounded-full shadow-glow-sm border-4 border-white"></div>

                  {/* Content */}
                  <div className={`ml-16 md:ml-0 ${index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8'} md:w-1/2 ${index % 2 === 0 ? '' : 'md:ml-auto'}`}>
                    <Card className="group hover:shadow-glow transition-all duration-300 transform hover:-translate-y-1 border-2 hover:border-secondary/50">
                      <CardHeader>
                        <div className="text-sm font-bold text-secondary mb-2">
                          {education.year}
                        </div>
                        <CardTitle className="text-xl font-bold text-foreground">
                          {education.institution}
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                          {education.location}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="font-medium text-foreground">
                          {education.degree}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {education.period}
                        </p>
                      </CardContent>
                    </Card>
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

export default Education;
