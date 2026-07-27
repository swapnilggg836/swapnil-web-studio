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

      if (error || !data || data.length === 0) {
        setSkills(fallbackSkills);
      } else {
        setSkills(data as Skill[]);
      }
    } catch {
      setSkills(fallbackSkills);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const addSkill = async (skill: Omit<Skill, "id" | "created_at" | "updated_at">) => {
    try {
      const { data, error } = await supabase
        .from("skills")
        .insert(skill)
        .select()
        .single();

      if (error) throw error;

      toast({ title: "Success", description: "Skill added successfully!" });
      await fetchSkills();
      return data;
    } catch (err: any) {
      const newSkill: Skill = { ...skill, id: Date.now().toString() };
      setSkills(prev => [...prev, newSkill]);
      toast({ title: "Saved", description: "Skill added locally!" });
      return newSkill;
    }
  };

  const updateSkill = async (id: string, updates: Partial<Skill>) => {
    try {
      const { error } = await supabase
        .from("skills")
        .update(updates)
        .eq("id", id);

      if (error) throw error;

      toast({ title: "Success", description: "Skill updated successfully!" });
      await fetchSkills();
      return true;
    } catch (err: any) {
      setSkills(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
      toast({ title: "Updated", description: "Skill updated locally!" });
      return true;
    }
  };

  const deleteSkill = async (id: string) => {
    try {
      const { error } = await supabase
        .from("skills")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({ title: "Success", description: "Skill deleted successfully!" });
      await fetchSkills();
      return true;
    } catch (err: any) {
      setSkills(prev => prev.filter(s => s.id !== id));
      toast({ title: "Deleted", description: "Skill removed!" });
      return true;
    }
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
