import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
  icon?: string;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

export const fallbackSkills: Skill[] = [
  { id: "1", name: "HTML", level: 90, category: "Frontend", display_order: 0 },
  { id: "2", name: "CSS", level: 80, category: "Frontend", display_order: 1 },
  { id: "3", name: "JavaScript", level: 65, category: "Frontend", display_order: 2 },
  { id: "4", name: "Python", level: 75, category: "Backend", display_order: 3 },
  { id: "5", name: "C++", level: 70, category: "Languages", display_order: 4 },
  { id: "6", name: "MySQL", level: 70, category: "Database", display_order: 5 },
  { id: "7", name: "React.js", level: 60, category: "Frontend", display_order: 6 },
  { id: "8", name: "PHP", level: 40, category: "Backend", display_order: 7 },
];

const LOCAL_STORAGE_KEY = "portfolio_skills_v1";

export const useSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        setSkills(data as Skill[]);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      } else {
        const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (localData !== null) {
          setSkills(JSON.parse(localData));
        } else {
          setSkills(fallbackSkills);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fallbackSkills));
        }
      }
    } catch {
      const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (localData !== null) {
        setSkills(JSON.parse(localData));
      } else {
        setSkills(fallbackSkills);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fallbackSkills));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const addSkill = async (skill: Omit<Skill, "id" | "created_at" | "updated_at">) => {
    const newSkill: Skill = { ...skill, id: Date.now().toString() };
    try {
      const { data, error } = await supabase
        .from("skills")
        .insert(skill)
        .select()
        .single();

      if (!error && data) {
        newSkill.id = data.id;
      }
    } catch (err) {
      console.warn("Supabase add skill warning, saving locally.");
    }

    setSkills(prev => {
      const updated = [...prev, newSkill];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    toast({ title: "Success", description: "Skill added successfully!" });
    return newSkill;
  };

  const updateSkill = async (id: string, updates: Partial<Skill>) => {
    try {
      await supabase
        .from("skills")
        .update(updates)
        .eq("id", id);
    } catch (err) {
      console.warn("Supabase update skill warning, updating locally.");
    }

    setSkills(prev => {
      const updated = prev.map(s => (s.id === id ? { ...s, ...updates } : s));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    toast({ title: "Success", description: "Skill updated successfully!" });
    return true;
  };

  const deleteSkill = async (id: string) => {
    try {
      await supabase
        .from("skills")
        .delete()
        .eq("id", id);
    } catch (err) {
      console.warn("Supabase delete skill warning, removing locally.");
    }

    setSkills(prev => {
      const updated = prev.filter(s => s.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    toast({ title: "Success", description: "Skill deleted!" });
    return true;
  };

  return {
    skills,
    loading,
    fetchSkills,
    addSkill,
    updateSkill,
    deleteSkill,
  };
};
