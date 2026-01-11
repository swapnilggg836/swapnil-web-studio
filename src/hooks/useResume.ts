import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Resume {
  id: string;
  file_url: string;
  file_name: string;
  created_at: string;
  updated_at: string;
}

export const useResume = () => {
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchResume = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("resume")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error fetching resume:", error);
    } else {
      setResume(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchResume();
  }, []);

  const uploadResume = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `resume_${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("resume-files")
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      toast({
        title: "Error",
        description: "Failed to upload resume",
        variant: "destructive",
      });
      return null;
    }

    const { data } = supabase.storage
      .from("resume-files")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const saveResume = async (fileUrl: string, fileName: string) => {
    // First, delete existing resume if any
    if (resume) {
      await supabase.from("resume").delete().eq("id", resume.id);
    }

    const { data, error } = await supabase
      .from("resume")
      .insert({ file_url: fileUrl, file_name: fileName })
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
      description: "Resume uploaded successfully!",
    });
    await fetchResume();
    return data;
  };

  const deleteResume = async () => {
    if (!resume) return false;

    const { error } = await supabase
      .from("resume")
      .delete()
      .eq("id", resume.id);

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
      description: "Resume deleted successfully!",
    });
    setResume(null);
    return true;
  };

  return {
    resume,
    loading,
    fetchResume,
    uploadResume,
    saveResume,
    deleteResume,
  };
};
