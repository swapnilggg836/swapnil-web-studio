
import { Github, Linkedin, Instagram, Facebook, Download, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import profilePhoto from "@/assets/profile-photo.jpg";

const Hero = () => {
  const socialLinks = [
    { icon: Linkedin, href: "https://linkedin.com/in/your-profile", label: "LinkedIn", className: "hover:text-blue-600" },
    { icon: Github, href: "https://github.com/your-username", label: "GitHub", className: "hover:text-gray-800" },
    { icon: Mail, href: "mailto:your-email@gmail.com", label: "Gmail", className: "hover:text-red-600" },
    { icon: Instagram, href: "https://instagram.com/your-profile", label: "Instagram", className: "hover:text-pink-600" },
    { icon: Facebook, href: "https://facebook.com/your-profile", label: "Facebook", className: "hover:text-blue-500" },
  ];

  const handleDownloadResume = () => {
    // Create a link element and trigger download
    const link = document.createElement('a');
    link.href = '/resume.pdf'; // Place your resume.pdf file in the public folder
    link.download = 'Swapnil_Gaikwad_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="about" className="min-h-screen flex items-center bg-hero-gradient text-white pt-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="space-y-2">
              <p className="text-xl text-blue-200">Hi,</p>
              <p className="text-xl text-blue-200">I am</p>
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                Swapnil Gaikwad
              </h1>
              <h2 className="text-2xl md:text-3xl font-semibold text-blue-200">
                Web Developer
              </h2>
            </div>
            
            <p className="text-lg text-blue-100 max-w-2xl">
              To create dynamic, responsive, and secure web applications that enhance
              user experience and meet business goals.
            </p>

            {/* Social Links */}
            <div className="flex justify-center lg:justify-start space-x-4">
              {socialLinks.map((social, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="icon"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:shadow-glow-sm transition-all duration-300"
                  asChild
                >
                  <a href={social.href} aria-label={social.label} target="_blank" rel="noopener noreferrer">
                    <social.icon size={20} />
                  </a>
                </Button>
              ))}
            </div>

            {/* Download Resume Button */}
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

          {/* Profile Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-80 h-80 rounded-full overflow-hidden border-4 border-white/20 shadow-glow hover:shadow-glow transition-all duration-300 transform hover:scale-105">
                <img
                  src={profilePhoto}
                  alt="Swapnil Gaikwad"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
