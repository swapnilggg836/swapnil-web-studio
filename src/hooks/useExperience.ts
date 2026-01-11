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
  created_at: string;
  updated_at: string;
}

export const useExperience = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchExperiences = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("experiences")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching experiences:", error);
    } else {
      setExperiences(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const addExperience = async (exp: Omit<Experience, "id" | "created_at" | "updated_at">) => {
    const { data, error } = await supabase
      .from("experiences")
      .insert(exp)
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    toast({
      title: "Success",
      description: "Experience added successfully!",
    });
    await fetchExperiences();
    return data;
  };

  const updateExperience = async (id: string, updates: Partial<Experience>) => {
    const { error } = await supabase
      .from("experiences")
      .update(updates)
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Success",
      description: "Experience updated successfully!",
    });
    await fetchExperiences();
    return true;
  };

  const deleteExperience = async (id: string) => {
    const { error } = await supabase
      .from("experiences")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Success",
      description: "Experience deleted successfully!",
    });
    await fetchExperiences();
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
