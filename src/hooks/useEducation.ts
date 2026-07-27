import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Education {
  id: string;
  year: string;
  institution: string;
  location: string;
  degree: string;
  period: string;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export const fallbackEducation: Education[] = [
  { id: "1", year: "2022 – 2026", institution: "SNJB's Late Sau KBJ College of Engineering", location: "Chandwad, Nashik – 423101", degree: "TE in Artificial Intelligence and Data Science", period: "2023 – 2026", display_order: 0 },
  { id: "2", year: "2021 – 2022", institution: "Swami Muktanand Sec. School", location: "Yeola, Nashik – 423401", degree: "HSC (Class XII) — 79.50%", period: "2021 – 2022", display_order: 1 },
  { id: "3", year: "2019 – 2020", institution: "Janta Vidyalaya Yeola", location: "Yeola, Nashik – 423401", degree: "SSC (Class X) — 89.20%", period: "2019 – 2020", display_order: 2 },
];

const LOCAL_STORAGE_KEY = "portfolio_education_v1";

export const useEducation = () => {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchEducation = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("education")
        .select("*")
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        setEducation(data as Education[]);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      } else {
        const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (localData !== null) {
          setEducation(JSON.parse(localData));
        } else {
          setEducation(fallbackEducation);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fallbackEducation));
        }
      }
    } catch {
      const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (localData !== null) {
        setEducation(JSON.parse(localData));
      } else {
        setEducation(fallbackEducation);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fallbackEducation));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  const addEducation = async (edu: Omit<Education, "id" | "created_at" | "updated_at">) => {
    const newEdu: Education = { ...edu, id: Date.now().toString() };
    try {
      const { data, error } = await supabase
        .from("education")
        .insert(edu)
        .select()
        .single();

      if (!error && data) {
        newEdu.id = data.id;
      }
    } catch (err) {
      console.warn("Supabase add education warning, saving locally.");
    }

    setEducation(prev => {
      const updated = [...prev, newEdu];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    toast({ title: "Success", description: "Education added successfully!" });
    return newEdu;
  };

  const updateEducation = async (id: string, updates: Partial<Education>) => {
    try {
      await supabase
        .from("education")
        .update(updates)
        .eq("id", id);
    } catch (err) {
      console.warn("Supabase update education warning, updating locally.");
    }

    setEducation(prev => {
      const updated = prev.map(e => (e.id === id ? { ...e, ...updates } : e));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    toast({ title: "Success", description: "Education updated!" });
    return true;
  };

  const deleteEducation = async (id: string) => {
    try {
      await supabase
        .from("education")
        .delete()
        .eq("id", id);
    } catch (err) {
      console.warn("Supabase delete education warning, removing locally.");
    }

    setEducation(prev => {
      const updated = prev.filter(e => e.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    toast({ title: "Success", description: "Education deleted!" });
    return true;
  };

  return {
    education,
    loading,
    fetchEducation,
    addEducation,
    updateEducation,
    deleteEducation,
  };
};
