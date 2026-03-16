import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const useSocialLinks = () => {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSocialLinks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("social_links")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching social links:", error);
    } else {
      setSocialLinks(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const addSocialLink = async (link: Omit<SocialLink, "id" | "created_at" | "updated_at">) => {
    const { error } = await supabase.from("social_links").insert(link);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return false;
    }
    toast({ title: "Success", description: "Social link added!" });
    await fetchSocialLinks();
    return true;
  };

  const updateSocialLink = async (id: string, link: Partial<SocialLink>) => {
    const { error } = await supabase.from("social_links").update(link).eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return false;
    }
    toast({ title: "Success", description: "Social link updated!" });
    await fetchSocialLinks();
    return true;
  };

  const deleteSocialLink = async (id: string) => {
    const { error } = await supabase.from("social_links").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return false;
    }
    toast({ title: "Success", description: "Social link deleted!" });
    await fetchSocialLinks();
    return true;
  };

  return { socialLinks, loading, addSocialLink, updateSocialLink, deleteSocialLink };
};
