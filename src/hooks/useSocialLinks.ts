import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export const fallbackSocialLinks: SocialLink[] = [
  { id: "1", platform: "GitHub", url: "https://github.com/swapnilggg836", icon: "Github", display_order: 0 },
  { id: "2", platform: "LinkedIn", url: "https://www.linkedin.com/in/swapnil-gaikwad-3136a4275/", icon: "Linkedin", display_order: 1 },
  { id: "3", platform: "Gmail", url: "mailto:swapnilg836@gmail.com", icon: "Mail", display_order: 2 },
  { id: "4", platform: "WhatsApp", url: "https://wa.me/918605887561", icon: "MessageCircle", display_order: 3 },
  { id: "5", platform: "Outlook", url: "mailto:swapnilg836@outlook.com", icon: "Mail", display_order: 4 },
];

const LOCAL_STORAGE_KEY = "portfolio_social_links_v1";

export const useSocialLinks = () => {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSocialLinks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("social_links")
        .select("*")
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        setSocialLinks(data as SocialLink[]);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      } else {
        const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (localData !== null) {
          setSocialLinks(JSON.parse(localData));
        } else {
          setSocialLinks(fallbackSocialLinks);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fallbackSocialLinks));
        }
      }
    } catch {
      const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (localData !== null) {
        setSocialLinks(JSON.parse(localData));
      } else {
        setSocialLinks(fallbackSocialLinks);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fallbackSocialLinks));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const addSocialLink = async (link: Omit<SocialLink, "id" | "created_at" | "updated_at">) => {
    const newLink: SocialLink = { ...link, id: Date.now().toString() };
    try {
      const { data, error } = await supabase.from("social_links").insert(link).select().single();
      if (!error && data) {
        newLink.id = data.id;
      }
    } catch (err) {
      console.warn("Supabase add social link warning, saving locally.");
    }

    setSocialLinks(prev => {
      const updated = [...prev, newLink];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    toast({ title: "Success", description: "Social link added!" });
    return true;
  };

  const updateSocialLink = async (id: string, updates: Partial<SocialLink>) => {
    try {
      await supabase.from("social_links").update(updates).eq("id", id);
    } catch (err) {
      console.warn("Supabase update social link warning, updating locally.");
    }

    setSocialLinks(prev => {
      const updated = prev.map(l => (l.id === id ? { ...l, ...updates } : l));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    toast({ title: "Success", description: "Social link updated!" });
    return true;
  };

  const deleteSocialLink = async (id: string) => {
    try {
      await supabase.from("social_links").delete().eq("id", id);
    } catch (err) {
      console.warn("Supabase delete social link warning, removing locally.");
    }

    setSocialLinks(prev => {
      const updated = prev.filter(l => l.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    toast({ title: "Success", description: "Social link deleted!" });
    return true;
  };

  return { socialLinks, loading, addSocialLink, updateSocialLink, deleteSocialLink };
};
