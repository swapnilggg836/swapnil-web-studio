import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ProfileInfo {
  id: string;
  profile_image_url: string | null;
  name: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export const useProfileInfo = () => {
  const [profileInfo, setProfileInfo] = useState<ProfileInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfileInfo = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profile_info")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error fetching profile info:", error);
    } else {
      setProfileInfo(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfileInfo();
  }, []);

  const uploadProfileImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `profile_${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("profile-images")
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      toast({
        title: "Error",
        description: "Failed to upload profile image",
        variant: "destructive",
      });
      return null;
    }

    const { data } = supabase.storage
      .from("profile-images")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const saveProfileInfo = async (info: Omit<ProfileInfo, "id" | "created_at" | "updated_at">) => {
    if (profileInfo) {
      // Update existing
      const { error } = await supabase
        .from("profile_info")
        .update(info)
        .eq("id", profileInfo.id);

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }
    } else {
      // Insert new
      const { error } = await supabase
        .from("profile_info")
        .insert(info);

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }
    }

    toast({
      title: "Success",
      description: "Profile updated successfully!",
    });
    await fetchProfileInfo();
    return true;
  };

  return {
    profileInfo,
    loading,
    fetchProfileInfo,
    uploadProfileImage,
    saveProfileInfo,
  };
};
