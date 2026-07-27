import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Achievement {
  id: string;
  title: string;
  category: "Certificate" | "Award" | "Presentation" | "Hackathon" | "Event" | string;
  issuer: string;
  date: string;
  description: string;
  image_url?: string | null;
  video_url?: string | null;
  link_url?: string | null;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export const fallbackAchievements: Achievement[] = [
  {
    id: "1",
    title: "AI & Machine Learning Certification",
    category: "Certificate",
    issuer: "Coursera / Stanford Online",
    date: "2024",
    description: "Completed comprehensive training in Neural Networks, Deep Learning algorithms, Supervised and Unsupervised Learning.",
    image_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
    video_url: "",
    link_url: "https://coursera.org",
    display_order: 0,
  },
  {
    id: "2",
    title: "1st Prize — State Level Web & AI Hackathon",
    category: "Award",
    issuer: "Savitribai Phule Pune University",
    date: "2024",
    description: "Secured 1st rank for building an AI-powered smart rover assistant with real-time computer vision and obstacle detection.",
    image_url: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800&q=80",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    link_url: "",
    display_order: 1,
  },
  {
    id: "3",
    title: "Technical Paper Presentation on Sentiment AI",
    category: "Presentation",
    issuer: "National Conference on Emerging Tech",
    date: "2023",
    description: "Presented research paper titled 'YouTube Comment Sentiment Analytics using Flask and NLP Machine Learning Classifiers'.",
    image_url: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    link_url: "",
    display_order: 2,
  },
  {
    id: "4",
    title: "Full Stack Java & React Development Specialist",
    category: "Certificate",
    issuer: "Udemy Certified Masterclass",
    date: "2023",
    description: "Mastered full-stack enterprise web development using React.js, Spring Boot, Node.js, and SQL database design.",
    image_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
    video_url: "",
    link_url: "https://udemy.com",
    display_order: 3,
  },
];

const LOCAL_STORAGE_KEY = "portfolio_achievements_v1";

export const useAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAchievements = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        setAchievements(data as Achievement[]);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      } else {
        const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (localData !== null) {
          setAchievements(JSON.parse(localData));
        } else {
          setAchievements(fallbackAchievements);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fallbackAchievements));
        }
      }
    } catch {
      const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (localData !== null) {
        setAchievements(JSON.parse(localData));
      } else {
        setAchievements(fallbackAchievements);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fallbackAchievements));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const uploadAchievementMedia = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `achievements/${Math.random().toString(36).substring(2)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("portfolio-assets")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("portfolio-assets").getPublicUrl(fileName);
      return data.publicUrl;
    } catch (err: any) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }
  };

  const addAchievement = async (achievement: Omit<Achievement, "id" | "created_at" | "updated_at">) => {
    const newAch: Achievement = {
      ...achievement,
      id: Date.now().toString(),
    };

    try {
      const { data, error } = await supabase
        .from("achievements")
        .insert(achievement)
        .select()
        .single();

      if (!error && data) {
        newAch.id = data.id;
      }
    } catch (err) {
      console.warn("Supabase add achievement warning, saving locally.");
    }

    setAchievements(prev => {
      const updated = [newAch, ...prev];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    toast({ title: "Success", description: "Achievement added successfully!" });
    return newAch;
  };

  const updateAchievement = async (id: string, updates: Partial<Achievement>) => {
    try {
      await supabase
        .from("achievements")
        .update(updates)
        .eq("id", id);
    } catch (err) {
      console.warn("Supabase update achievement warning, updating locally.");
    }

    setAchievements(prev => {
      const updated = prev.map(a => (a.id === id ? { ...a, ...updates } : a));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    toast({ title: "Success", description: "Achievement updated!" });
    return true;
  };

  const deleteAchievement = async (id: string) => {
    try {
      await supabase
        .from("achievements")
        .delete()
        .eq("id", id);
    } catch (err) {
      console.warn("Supabase delete achievement warning, removing locally.");
    }

    setAchievements(prev => {
      const updated = prev.filter(a => a.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    toast({ title: "Deleted", description: "Achievement removed!" });
    return true;
  };

  return {
    achievements,
    loading,
    fetchAchievements,
    addAchievement,
    updateAchievement,
    deleteAchievement,
    uploadAchievementMedia,
  };
};
