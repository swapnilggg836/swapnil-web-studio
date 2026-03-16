import { useState, useEffect } from "react";
import { Github, Linkedin, Instagram, Facebook, Download, Mail, Twitter, Youtube, MessageCircle, Globe, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import profilePhotoFallback from "@/assets/profile-photo.jpg";

interface ProfileInfo {
  profile_image_url: string | null;
  name: string;
  title: string;
  description: string;
}

interface Resume {
  file_url: string;
  file_name: string;
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  display_order: number;
}

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  Linkedin,
  Github,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  MessageCircle,
  Globe,
  Phone,
};

const colorMap: Record<string, string> = {
  Linkedin: "hover:text-blue-600",
  Github: "hover:text-gray-800",
  Mail: "hover:text-red-600",
  Instagram: "hover:text-pink-600",
  Facebook: "hover:text-blue-500",
  Twitter: "hover:text-sky-500",
  Youtube: "hover:text-red-500",
  MessageCircle: "hover:text-green-500",
  Globe: "hover:text-indigo-500",
  Phone: "hover:text-green-600",
};

const Hero = () => {
  const [profileInfo, setProfileInfo] = useState<ProfileInfo | null>(null);
  const [resume, setResume] = useState<Resume | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [profileRes, resumeRes, socialRes] = await Promise.all([
        supabase.from("profile_info").select("*").limit(1).maybeSingle(),
        supabase.from("resume").select("*").limit(1).maybeSingle(),
        supabase.from("social_links").select("*").order("display_order", { ascending: true }),
      ]);

      if (profileRes.data) setProfileInfo(profileRes.data);
      if (resumeRes.data) setResume(resumeRes.data);
      if (socialRes.data) setSocialLinks(socialRes.data);
    };

    fetchData();
  }, []);

  const handleDownloadResume = () => {
    if (resume?.file_url) {
      window.open(resume.file_url, "_blank");
    } else {
      const link = document.createElement('a');
      link.href = '/resume.pdf';
      link.download = 'Swapnil_Gaikwad_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const name = profileInfo?.name || "Swapnil Gaikwad";
  const title = profileInfo?.title || "Web Developer";
  const description = profileInfo?.description || "To create dynamic, responsive, and secure web applications that enhance user experience and meet business goals.";
  const profileImage = profileInfo?.profile_image_url || profilePhotoFallback;

  return (
    <section id="about" className="min-h-screen flex items-center bg-hero-gradient text-white pt-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <div className="space-y-2">
              <p className="text-xl text-blue-200">Hi,</p>
              <p className="text-xl text-blue-200">I am</p>
              <h1 className="text-4xl md:text-6xl font-bold text-white">{name}</h1>
              <h2 className="text-2xl md:text-3xl font-semibold text-blue-200">{title}</h2>
            </div>
            
            <p className="text-lg text-blue-100 max-w-2xl">{description}</p>

            {/* Social Links - Dynamic */}
            {socialLinks.length > 0 && (
              <div className="flex justify-center lg:justify-start space-x-4">
                {socialLinks.map((link) => {
                  const IconComponent = iconMap[link.icon] || Globe;
                  return (
                    <Button
                      key={link.id}
                      variant="outline"
                      size="icon"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:shadow-glow-sm transition-all duration-300"
                      asChild
                    >
                      <a href={link.url} aria-label={link.platform} target="_blank" rel="noopener noreferrer">
                        <IconComponent size={20} />
                      </a>
                    </Button>
                  );
                })}
              </div>
            )}

            <div className="pt-4">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-blue-50 shadow-glow-sm hover:shadow-glow transition-all duration-300"
                onClick={handleDownloadResume}
              >
                <Download className="mr-2" size={20} />
                Download Resume
              </Button>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-80 h-80 rounded-full overflow-hidden border-4 border-white/20 shadow-glow hover:shadow-glow transition-all duration-300 transform hover:scale-105">
                <img src={profileImage} alt={name} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
