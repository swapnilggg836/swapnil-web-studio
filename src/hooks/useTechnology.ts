import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Subcategory {
  name: string;
  technologies: string[];
}

export interface TechnologyCategory {
  id: string;
  title: string;
  icon: string;
  color: string;
  subcategories: Subcategory[];
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const useTechnology = () => {
  const [categories, setCategories] = useState<TechnologyCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("technology_categories")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching technology categories:", error);
    } else {
      // Transform the data to match our interface
      const transformed = (data || []).map(item => ({
        ...item,
        subcategories: (item.subcategories as unknown as Subcategory[]) || []
      }));
      setCategories(transformed);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async (category: Omit<TechnologyCategory, "id" | "created_at" | "updated_at">) => {
    const insertData = {
      title: category.title,
      icon: category.icon,
      color: category.color,
      subcategories: JSON.parse(JSON.stringify(category.subcategories)),
      display_order: category.display_order
    };

    const { data, error } = await supabase
      .from("technology_categories")
      .insert(insertData)
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
      description: "Technology category added successfully!",
    });
    await fetchCategories();
    return data;
  };

  const updateCategory = async (id: string, updates: Partial<TechnologyCategory>) => {
    const updateData: Record<string, unknown> = {};
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.icon !== undefined) updateData.icon = updates.icon;
    if (updates.color !== undefined) updateData.color = updates.color;
    if (updates.display_order !== undefined) updateData.display_order = updates.display_order;
    if (updates.subcategories !== undefined) updateData.subcategories = updates.subcategories as unknown as Record<string, unknown>[];

    const { error } = await supabase
      .from("technology_categories")
      .update(updateData)
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
      description: "Technology category updated successfully!",
    });
    await fetchCategories();
    return true;
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase
      .from("technology_categories")
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
      description: "Technology category deleted successfully!",
    });
    await fetchCategories();
    return true;
  };

  return {
    categories,
    loading,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  };
};
