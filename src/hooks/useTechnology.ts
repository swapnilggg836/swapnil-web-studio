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
  created_at?: string;
  updated_at?: string;
}

export const fallbackCategories: TechnologyCategory[] = [
  { id: 'web', title: 'Web Development', icon: 'Code', color: 'from-blue-500 to-blue-700', display_order: 0,
    subcategories: [
      { name: 'Frontend', technologies: ['React.js', 'Next.js', 'HTML5', 'CSS3', 'Tailwind CSS', 'JavaScript (ES6+)'] },
      { name: 'Backend & APIs', technologies: ['Node.js', 'Express.js', 'REST APIs', 'AJAX', 'PHP', 'XAMPP'] },
      { name: 'Database', technologies: ['MySQL', 'MongoDB', 'Supabase', 'PostgreSQL'] },
    ]
  },
  { id: 'app', title: 'App & Mobile', icon: 'Smartphone', color: 'from-emerald-500 to-emerald-700', display_order: 1,
    subcategories: [
      { name: 'Frameworks', technologies: ['React Native', 'Flutter', 'PWA'] },
      { name: 'State Management', technologies: ['Redux', 'Context API'] },
      { name: 'Backend Integration', technologies: ['Firebase', 'RESTful Services', 'GraphQL'] },
    ]
  },
  { id: 'ml', title: 'AI / ML & IoT', icon: 'Brain', color: 'from-purple-500 to-purple-700', display_order: 2,
    subcategories: [
      { name: 'Machine Learning', technologies: ['Python', 'Scikit-Learn', 'Pandas', 'NumPy'] },
      { name: 'NLP & Vision', technologies: ['Sentiment Analysis', 'OpenCV', 'NLTK', 'Flask APIs'] },
      { name: 'IoT & Hardware', technologies: ['Arduino', 'C++', 'Microcontrollers', 'Sensor Integration'] },
    ]
  },
  { id: 'data', title: 'Data Analytics', icon: 'BarChart3', color: 'from-amber-500 to-amber-700', display_order: 3,
    subcategories: [
      { name: 'Business Intelligence', technologies: ['Power BI', 'Excel Advanced', 'DAX'] },
      { name: 'Visualization', technologies: ['Matplotlib', 'Seaborn', 'Chart.js', 'Power BI Dashboards'] },
      { name: 'Data Prep', technologies: ['Data Cleaning', 'ETL Pipelines', 'SQL Queries'] },
    ]
  },
  { id: 'tools', title: 'Developer Tools', icon: 'Wrench', color: 'from-rose-500 to-rose-700', display_order: 4,
    subcategories: [
      { name: 'Version Control', technologies: ['Git', 'GitHub', 'GitLab'] },
      { name: 'IDE & Environment', technologies: ['VS Code', 'Jupyter Notebook', 'Postman', 'Vite'] },
      { name: 'Deployment', technologies: ['Vercel', 'Netlify', 'Render', 'Hostinger'] },
    ]
  },
  { id: 'soft', title: 'Soft Skills', icon: 'Users', color: 'from-indigo-500 to-indigo-700', display_order: 5,
    subcategories: [
      { name: 'Professional', technologies: ['Problem Solving', 'Team Collaboration', 'Agile / Scrum', 'Technical Writing'] },
      { name: 'Personal', technologies: ['Time Management', 'Continuous Learning', 'Adaptability', 'Project Management'] },
    ]
  },
];

const LOCAL_STORAGE_KEY = "portfolio_technology_v1";

export const useTechnology = () => {
  const [categories, setCategories] = useState<TechnologyCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("technology_categories")
        .select("*")
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        const transformed = data.map(item => ({
          ...item,
          subcategories: (item.subcategories as unknown as Subcategory[]) || []
        }));
        setCategories(transformed);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(transformed));
      } else {
        const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (localData !== null) {
          setCategories(JSON.parse(localData));
        } else {
          setCategories(fallbackCategories);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fallbackCategories));
        }
      }
    } catch {
      const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (localData !== null) {
        setCategories(JSON.parse(localData));
      } else {
        setCategories(fallbackCategories);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fallbackCategories));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async (category: Omit<TechnologyCategory, "id" | "created_at" | "updated_at">) => {
    const newCat: TechnologyCategory = { ...category, id: Date.now().toString() };
    try {
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

      if (!error && data) {
        newCat.id = data.id;
      }
    } catch (err) {
      console.warn("Supabase add tech category warning, saving locally.");
    }

    setCategories(prev => {
      const updated = [...prev, newCat];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    toast({ title: "Success", description: "Technology category added!" });
    return newCat;
  };

  const updateCategory = async (id: string, updates: Partial<TechnologyCategory>) => {
    try {
      const updateData: Record<string, unknown> = {};
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.icon !== undefined) updateData.icon = updates.icon;
      if (updates.color !== undefined) updateData.color = updates.color;
      if (updates.display_order !== undefined) updateData.display_order = updates.display_order;
      if (updates.subcategories !== undefined) updateData.subcategories = updates.subcategories as unknown as Record<string, unknown>[];

      await supabase
        .from("technology_categories")
        .update(updateData)
        .eq("id", id);
    } catch (err) {
      console.warn("Supabase update tech category warning, updating locally.");
    }

    setCategories(prev => {
      const updated = prev.map(c => (c.id === id ? { ...c, ...updates } : c));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    toast({ title: "Success", description: "Technology category updated!" });
    return true;
  };

  const deleteCategory = async (id: string) => {
    try {
      await supabase
        .from("technology_categories")
        .delete()
        .eq("id", id);
    } catch (err) {
      console.warn("Supabase delete tech category warning, removing locally.");
    }

    setCategories(prev => {
      const updated = prev.filter(c => c.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    toast({ title: "Success", description: "Technology category deleted!" });
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
