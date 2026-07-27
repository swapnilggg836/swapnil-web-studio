import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ProfileInfo {
  id?: string;
  profile_image_url: string | null;
  name: string;
  title: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export const fallbackProfileInfo: ProfileInfo = {
  id: "1",
  name: "Swapnil Gaikwad",
  title: "Web Developer & AI Engineer",
  description: "To create dynamic, responsive, and secure web applications that enhance user experience and meet business goals.",
  profile_image_url: "/profile-photo.jpg",
};

const LOCAL_STORAGE_KEY = "portfolio_profile_info_v1";

export const useProfileInfo = () => {
  const [profileInfo, setProfileInfo] = useState<ProfileInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfileInfo = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profile_info")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        setProfileInfo(data as ProfileInfo);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      } else {
        const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (localData !== null) {
          setProfileInfo(JSON.parse(localData));
        } else {
          setProfileInfo(fallbackProfileInfo);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fallbackProfileInfo));
        }
      }
    } catch {
      const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (localData !== null) {
        setProfileInfo(JSON.parse(localData));
      } else {
        setProfileInfo(fallbackProfileInfo);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fallbackProfileInfo));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileInfo();
  }, []);

  const uploadProfileImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `profile_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("profile-images")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("profile-images")
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (err) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }
  };

  const saveProfileInfo = async (info: Omit<ProfileInfo, "id" | "created_at" | "updated_at">) => {
    const updatedProfile: ProfileInfo = {
      ...profileInfo,
      ...info,
      id: profileInfo?.id || Date.now().toString(),
    };

    try {
      if (profileInfo?.id && !isNaN(Number(profileInfo.id))) {
        await supabase.from("profile_info").update(info).eq("id", profileInfo.id);
      } else {
        await supabase.from("profile_info").insert(info);
      }
    } catch (err) {
      console.warn("Supabase profile save warning, saving locally.");
    }

    setProfileInfo(updatedProfile);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedProfile));

    toast({
      title: "Success",
      description: "Profile updated successfully!",
    });
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
