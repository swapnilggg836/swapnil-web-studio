import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  period: string;
  description: string[];
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export const fallbackExperiences: Experience[] = [
  {
    id: "1",
    title: "Full-Stack Web Developer Intern",
    company: "Tech Solutions Pvt. Ltd.",
    location: "Nashik, Maharashtra",
    period: "2024 – Present",
    description: [
      "Developing responsive full-stack web applications using React.js, Tailwind CSS, and Node.js.",
      "Integrated RESTful APIs and database management systems (MySQL / Supabase).",
      "Collaborated with cross-functional teams to design high-performance user interfaces.",
    ],
    display_order: 0,
  },
  {
    id: "2",
    title: "AI & Data Science Trainee",
    company: "SNJB AI Research Lab",
    location: "Chandwad, Nashik",
    period: "2023 – 2024",
    description: [
      "Built Machine Learning models for sentiment analysis on social media comment streams.",
      "Utilized Python, Flask, Pandas, and Scikit-Learn for data preprocessing and predictive analytics.",
      "Developed IoT embedded projects using Arduino and sensor integration for automated rovers.",
    ],
    display_order: 1,
  },
];

const LOCAL_STORAGE_KEY = "portfolio_experience_v1";

export const useExperience = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        setExperiences(data as Experience[]);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      } else {
        const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (localData !== null) {
          setExperiences(JSON.parse(localData));
        } else {
          setExperiences(fallbackExperiences);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fallbackExperiences));
        }
      }
    } catch {
      const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (localData !== null) {
        setExperiences(JSON.parse(localData));
      } else {
        setExperiences(fallbackExperiences);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fallbackExperiences));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const addExperience = async (exp: Omit<Experience, "id" | "created_at" | "updated_at">) => {
    const newExp: Experience = { ...exp, id: Date.now().toString() };
    try {
      const { data, error } = await supabase
        .from("experiences")
        .insert(exp)
        .select()
        .single();

      if (!error && data) {
        newExp.id = data.id;
      }
    } catch (err) {
      console.warn("Supabase add experience warning, saving locally.");
    }

    setExperiences(prev => {
      const updated = [newExp, ...prev];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    toast({ title: "Success", description: "Experience added successfully!" });
    return newExp;
  };

  const updateExperience = async (id: string, updates: Partial<Experience>) => {
    try {
      await supabase
        .from("experiences")
        .update(updates)
        .eq("id", id);
    } catch (err) {
      console.warn("Supabase update experience warning, updating locally.");
    }

    setExperiences(prev => {
      const updated = prev.map(e => (e.id === id ? { ...e, ...updates } : e));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    toast({ title: "Success", description: "Experience updated!" });
    return true;
  };

  const deleteExperience = async (id: string) => {
    try {
      await supabase
        .from("experiences")
        .delete()
        .eq("id", id);
    } catch (err) {
      console.warn("Supabase delete experience warning, removing locally.");
    }

    setExperiences(prev => {
      const updated = prev.filter(e => e.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    toast({ title: "Success", description: "Experience deleted!" });
    return true;
  };

  return {
    experiences,
    loading,
    fetchExperiences,
    addExperience,
    updateExperience,
    deleteExperience,
  };
};
