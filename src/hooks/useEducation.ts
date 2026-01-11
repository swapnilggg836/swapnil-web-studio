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
  created_at: string;
  updated_at: string;
}

export const useEducation = () => {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchEducation = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("education")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching education:", error);
    } else {
      setEducation(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  const addEducation = async (edu: Omit<Education, "id" | "created_at" | "updated_at">) => {
    const { data, error } = await supabase
      .from("education")
      .insert(edu)
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
      description: "Education added successfully!",
    });
    await fetchEducation();
    return data;
  };

  const updateEducation = async (id: string, updates: Partial<Education>) => {
    const { error } = await supabase
      .from("education")
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
      description: "Education updated successfully!",
    });
    await fetchEducation();
    return true;
  };

  const deleteEducation = async (id: string) => {
    const { error } = await supabase
      .from("education")
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
      description: "Education deleted successfully!",
    });
    await fetchEducation();
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
