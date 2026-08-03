import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Fallback images
import tourTravelImg from "@/assets/tour-travel.jpg";
import digitalBoardImg from "@/assets/digital-board.jpg";
import sentimentAnalysisImg from "@/assets/sentiment-analysis.jpg";
import tiffinEliteImg from "@/assets/tiffin-elite.jpg";
import chatbotImg from "@/assets/chatbot.jpg";
import paithaniSreeImg from "@/assets/paithani-sree.jpg";
import salesAnalysisImg from "@/assets/sales-analysis.jpg";
import smartRoverImg from "@/assets/smart-rover.jpg";

export interface Project {
  id: string;
  title: string;
  description: string[];
  tech_stack: string;
  image_url: string | null;
  images?: string[];
  video_url?: string | null;
  github_link: string | null;
  live_link: string | null;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export const fallbackProjects: Project[] = [
  { id: "1", title: "Tour & Travel", image_url: tourTravelImg, images: [tourTravelImg], video_url: null, description: ["Information portal for tourists", "Built with HTML, CSS, and PHP", "XAMPP server backend"], tech_stack: "HTML, CSS, PHP", github_link: "https://github.com/swapnilggg836/tour-travel", live_link: "", display_order: 0 },
  { id: "2", title: "Digital Board", image_url: digitalBoardImg, images: [digitalBoardImg], video_url: null, description: ["Scrolling Digital Display Board", "IoT Based, C++ and IC used", "C++ library used"], tech_stack: "C++, IoT", github_link: "https://github.com/swapnilggg836/digital-board", live_link: "", display_order: 1 },
  { id: "3", title: "Sentiment Analysis", image_url: sentimentAnalysisImg, images: [sentimentAnalysisImg], video_url: null, description: ["Analyzes YouTube comment sentiment", "Built with Python + Flask", "Shows positive, negative & neutral graphs"], tech_stack: "Python, Flask", github_link: "https://github.com/swapnilggg836/sentiment-analysis", live_link: "", display_order: 2 },
  { id: "4", title: "Tiffin Elite", image_url: tiffinEliteImg, images: [tiffinEliteImg], video_url: null, description: ["Full-stack tiffin service app", "PHP, AJAX, HTML, CSS + MySQL", "Login/Signup and ordering system"], tech_stack: "PHP, AJAX, MySQL", github_link: "https://github.com/swapnilggg836/tiffin-elite", live_link: "", display_order: 3 },
  { id: "5", title: "Chatbot", image_url: chatbotImg, images: [chatbotImg], video_url: null, description: ["Interactive chatbot with natural flow", "HTML, CSS, Flask (Python), Node.js", "Flask-based API for backend logic"], tech_stack: "Flask, Python, Node.js", github_link: "https://github.com/swapnilggg836/chatbot-flask", live_link: "", display_order: 4 },
  { id: "6", title: "Paithani Sree", image_url: paithaniSreeImg, images: [paithaniSreeImg], video_url: null, description: ["E-commerce site for Paithani sarees", "React.js, Next.js, Tailwind CSS", "Product listings with admin panel"], tech_stack: "React, Next.js, Tailwind", github_link: "https://github.com/swapnilggg836/paithani-sree", live_link: "https://paithani-sree.com", display_order: 5 },
  { id: "7", title: "Electronics Sales Analysis", image_url: salesAnalysisImg, images: [salesAnalysisImg], video_url: null, description: ["Business data analysis with Power BI", "Multiple charts and dashboards", "Customer segmentation & sales trends"], tech_stack: "Power BI, Excel", github_link: "https://github.com/swapnilggg836/sales-analysis", live_link: "", display_order: 6 },
  { id: "8", title: "Smart Rover", image_url: smartRoverImg, images: [smartRoverImg], video_url: null, description: ["Arduino-based rover for competitions", "Ultrasonic & Color sensors integrated", "Obstacle detection and automation"], tech_stack: "Arduino, C++, IoT", github_link: "https://github.com/swapnilggg836/smart-rover", live_link: "", display_order: 7 },
];

const LOCAL_STORAGE_KEY = "portfolio_projects_v1";

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        setProjects(data as Project[]);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      } else {
        const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (localData !== null) {
          setProjects(JSON.parse(localData));
        } else {
          setProjects(fallbackProjects);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fallbackProjects));
        }
      }
    } catch {
      const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (localData !== null) {
        setProjects(JSON.parse(localData));
      } else {
        setProjects(fallbackProjects);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fallbackProjects));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const addProject = async (project: Omit<Project, "id" | "created_at" | "updated_at">) => {
    const newProj: Project = { ...project, id: Date.now().toString() };
    try {
      const { data, error } = await supabase
        .from("projects")
        .insert(project)
        .select()
        .single();

      if (!error && data) {
        newProj.id = data.id;
      }
    } catch (err) {
      console.warn("Supabase add project warning, saving locally.");
    }

    setProjects(prev => {
      const updated = [newProj, ...prev];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    toast({ title: "Success", description: "Project added successfully!" });
    return newProj;
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      await supabase
        .from("projects")
        .update(updates)
        .eq("id", id);
    } catch (err) {
      console.warn("Supabase update project warning, updating locally.");
    }

    setProjects(prev => {
      const updated = prev.map(p => (p.id === id ? { ...p, ...updates } : p));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    toast({ title: "Success", description: "Project updated successfully!" });
    return true;
  };

  const deleteProject = async (id: string) => {
    try {
      await supabase
        .from("projects")
        .delete()
        .eq("id", id);
    } catch (err) {
      console.warn("Supabase delete project warning, removing locally.");
    }

    setProjects(prev => {
      const updated = prev.filter(p => p.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    toast({ title: "Success", description: "Project deleted!" });
    return true;
  };

  const uploadMedia = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `projects/${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const bucketName = file.type.startsWith("video/") ? "project-videos" : "project-images";
      
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file);

      if (uploadError) {
        // Fallback to project-images if project-videos bucket doesn't exist
        const { error: fallbackUploadError } = await supabase.storage
          .from("project-images")
          .upload(fileName, file);
        
        if (fallbackUploadError) throw fallbackUploadError;
        const { data } = supabase.storage.from("project-images").getPublicUrl(fileName);
        return data.publicUrl;
      }

      const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName);
      return data.publicUrl;
    } catch (err) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }
  };

  const uploadImage = uploadMedia;

  return {
    projects,
    loading,
    fetchProjects,
    addProject,
    updateProject,
    deleteProject,
    uploadImage,
    uploadMedia,
  };
};
