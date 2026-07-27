import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProjects, Project } from "@/hooks/useProjects";
import { useResume } from "@/hooks/useResume";
import { useTechnology, TechnologyCategory, Subcategory } from "@/hooks/useTechnology";
import { useEducation, Education } from "@/hooks/useEducation";
import { useExperience, Experience } from "@/hooks/useExperience";
import { useProfileInfo } from "@/hooks/useProfileInfo";
import { useSocialLinks, SocialLink } from "@/hooks/useSocialLinks";
import { useAchievements, Achievement } from "@/hooks/useAchievements";
import { useSkills, Skill } from "@/hooks/useSkills";
import { ImageCropperModal } from "@/components/ImageCropperModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, Pencil, Trash2, LogOut, Home, LayoutDashboard, FileText, Code, GraduationCap, Briefcase, User, Upload, Link, Share2, Sliders, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ICON_OPTIONS = [
  { value: "Linkedin", label: "LinkedIn" },
  { value: "Github", label: "GitHub" },
  { value: "Mail", label: "Email/Gmail" },
  { value: "Instagram", label: "Instagram" },
  { value: "Facebook", label: "Facebook" },
  { value: "Twitter", label: "Twitter/X" },
  { value: "Youtube", label: "YouTube" },
  { value: "MessageCircle", label: "WhatsApp" },
  { value: "Globe", label: "Website" },
  { value: "Phone", label: "Phone" },
];

const AdminDashboard = () => {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const { projects, loading: projectsLoading, addProject, updateProject, deleteProject, uploadImage } = useProjects();
  const { resume, loading: resumeLoading, uploadResume, saveResume, deleteResume } = useResume();
  const { categories, loading: techLoading, addCategory, updateCategory, deleteCategory } = useTechnology();
  const { education, loading: eduLoading, addEducation, updateEducation, deleteEducation } = useEducation();
  const { experiences, loading: expLoading, addExperience, updateExperience, deleteExperience } = useExperience();
  const { profileInfo, loading: profileLoading, uploadProfileImage, saveProfileInfo } = useProfileInfo();
  const { socialLinks, loading: socialLoading, addSocialLink, updateSocialLink, deleteSocialLink } = useSocialLinks();
  const { achievements, loading: achLoading, addAchievement, updateAchievement, deleteAchievement, uploadAchievementMedia } = useAchievements();
  const { skills, loading: skillsLoading, addSkill, updateSkill, deleteSkill } = useSkills();
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [formLoading, setFormLoading] = useState(false);

  // Project form state
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectTechStack, setProjectTechStack] = useState("");
  const [projectGithub, setProjectGithub] = useState("");
  const [projectLive, setProjectLive] = useState("");
  const [projectOrder, setProjectOrder] = useState(0);
  const [projectImage, setProjectImage] = useState<File | null>(null);
  const [projectImagePreview, setProjectImagePreview] = useState<string | null>(null);

  // Education form state
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [eduDialogOpen, setEduDialogOpen] = useState(false);
  const [eduYear, setEduYear] = useState("");
  const [eduInstitution, setEduInstitution] = useState("");
  const [eduLocation, setEduLocation] = useState("");
  const [eduDegree, setEduDegree] = useState("");
  const [eduPeriod, setEduPeriod] = useState("");
  const [eduOrder, setEduOrder] = useState(0);

  // Experience form state
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [expDialogOpen, setExpDialogOpen] = useState(false);
  const [expTitle, setExpTitle] = useState("");
  const [expCompany, setExpCompany] = useState("");
  const [expLocation, setExpLocation] = useState("");
  const [expPeriod, setExpPeriod] = useState("");
  const [expDescription, setExpDescription] = useState("");
  const [expOrder, setExpOrder] = useState(0);

  // Technology form state
  const [editingTech, setEditingTech] = useState<TechnologyCategory | null>(null);
  const [techDialogOpen, setTechDialogOpen] = useState(false);
  const [techTitle, setTechTitle] = useState("");
  const [techIcon, setTechIcon] = useState("Code");
  const [techColor, setTechColor] = useState("from-blue-500 to-blue-700");
  const [techSubcategories, setTechSubcategories] = useState("");
  const [techOrder, setTechOrder] = useState(0);

  // Profile form state
  const [profileName, setProfileName] = useState("");
  const [profileTitle, setProfileTitle] = useState("");
  const [profileDescription, setProfileDescription] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);

  // Social link form state
  const [editingSocial, setEditingSocial] = useState<SocialLink | null>(null);
  const [socialDialogOpen, setSocialDialogOpen] = useState(false);
  const [socialPlatform, setSocialPlatform] = useState("");
  const [socialUrl, setSocialUrl] = useState("");
  const [socialIcon, setSocialIcon] = useState("Globe");
  const [socialOrder, setSocialOrder] = useState(0);

  // Resume state
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  // Achievement form state
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [achDialogOpen, setAchDialogOpen] = useState(false);
  const [achTitle, setAchTitle] = useState("");
  const [achCategory, setAchCategory] = useState("Certificate");
  const [achIssuer, setAchIssuer] = useState("");
  const [achDate, setAchDate] = useState("");
  const [achDescription, setAchDescription] = useState("");
  const [achVideoUrl, setAchVideoUrl] = useState("");
  const [achLinkUrl, setAchLinkUrl] = useState("");
  const [achOrder, setAchOrder] = useState(0);
  const [achMediaFile, setAchMediaFile] = useState<File | null>(null);
  const [achImagePreview, setAchImagePreview] = useState<string | null>(null);

  // Skill form state
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [skillDialogOpen, setSkillDialogOpen] = useState(false);
  const [skillName, setSkillName] = useState("");
  const [skillLevel, setSkillLevel] = useState(80);
  const [skillCategory, setSkillCategory] = useState("Frontend");
  const [skillOrder, setSkillOrder] = useState(0);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate("/admin/login");
    }
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (profileInfo) {
      setProfileName(profileInfo.name);
      setProfileTitle(profileInfo.title);
      setProfileDescription(profileInfo.description);
      setProfileImagePreview(profileInfo.profile_image_url);
    }
  }, [profileInfo]);

  // Reset functions
  const resetProjectForm = () => {
    setProjectTitle(""); setProjectDescription(""); setProjectTechStack("");
    setProjectGithub(""); setProjectLive(""); setProjectOrder(0);
    setProjectImage(null); setProjectImagePreview(null); setEditingProject(null);
  };

  const resetEducationForm = () => {
    setEduYear(""); setEduInstitution(""); setEduLocation("");
    setEduDegree(""); setEduPeriod(""); setEduOrder(0); setEditingEducation(null);
  };

  const resetExperienceForm = () => {
    setExpTitle(""); setExpCompany(""); setExpLocation("");
    setExpPeriod(""); setExpDescription(""); setExpOrder(0); setEditingExperience(null);
  };

  const resetTechForm = () => {
    setTechTitle(""); setTechIcon("Code"); setTechColor("from-blue-500 to-blue-700");
    setTechSubcategories(""); setTechOrder(0); setEditingTech(null);
  };

  const resetSocialForm = () => {
    setSocialPlatform(""); setSocialUrl(""); setSocialIcon("Globe");
    setSocialOrder(0); setEditingSocial(null);
  };

  const resetAchievementForm = () => {
    setAchTitle(""); setAchCategory("Certificate"); setAchIssuer("");
    setAchDate(""); setAchDescription(""); setAchVideoUrl("");
    setAchLinkUrl(""); setAchOrder(0); setAchMediaFile(null);
    setAchImagePreview(null); setEditingAchievement(null);
  };

  const resetSkillForm = () => {
    setSkillName(""); setSkillLevel(80); setSkillCategory("Frontend");
    setSkillOrder(0); setEditingSkill(null);
  };

  // Handle functions
  const handleProjectImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProjectImage(file);
      const reader = new FileReader();
      reader.onload = () => setProjectImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setRawImageSrc(reader.result as string);
        setCropperOpen(true);
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    }
  };

  const handleCropComplete = (croppedFile: File, croppedPreviewUrl: string) => {
    setProfileImage(croppedFile);
    setProfileImagePreview(croppedPreviewUrl);
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      let imageUrl = editingProject?.image_url || null;
      if (projectImage) imageUrl = await uploadImage(projectImage);
      const projectData = {
        title: projectTitle,
        description: projectDescription.split("\n").filter(line => line.trim()),
        tech_stack: projectTechStack,
        github_link: projectGithub || null,
        live_link: projectLive || null,
        display_order: projectOrder,
        image_url: imageUrl,
      };
      if (editingProject) await updateProject(editingProject.id, projectData);
      else await addProject(projectData);
      resetProjectForm(); setProjectDialogOpen(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally { setFormLoading(false); }
  };

  const handleEducationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const eduData = { year: eduYear, institution: eduInstitution, location: eduLocation, degree: eduDegree, period: eduPeriod, display_order: eduOrder };
      if (editingEducation) await updateEducation(editingEducation.id, eduData);
      else await addEducation(eduData);
      resetEducationForm(); setEduDialogOpen(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally { setFormLoading(false); }
  };

  const handleExperienceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const expData = { title: expTitle, company: expCompany, location: expLocation, period: expPeriod, description: expDescription.split("\n").filter(line => line.trim()), display_order: expOrder };
      if (editingExperience) await updateExperience(editingExperience.id, expData);
      else await addExperience(expData);
      resetExperienceForm(); setExpDialogOpen(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally { setFormLoading(false); }
  };

  const handleTechSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const subcats: Subcategory[] = techSubcategories.split("\n\n").filter(s => s.trim()).map(block => {
        const lines = block.split("\n");
        const name = lines[0]?.replace(":", "").trim() || "";
        const technologies = lines.slice(1).map(t => t.trim()).filter(t => t);
        return { name, technologies };
      });
      const techData = { title: techTitle, icon: techIcon, color: techColor, subcategories: subcats, display_order: techOrder };
      if (editingTech) await updateCategory(editingTech.id, techData);
      else await addCategory(techData);
      resetTechForm(); setTechDialogOpen(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally { setFormLoading(false); }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      let imageUrl = profileInfo?.profile_image_url || null;
      if (profileImage) imageUrl = await uploadProfileImage(profileImage);
      await saveProfileInfo({ profile_image_url: imageUrl, name: profileName, title: profileTitle, description: profileDescription });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally { setFormLoading(false); }
  };

  const handleSocialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const data = { platform: socialPlatform, url: socialUrl, icon: socialIcon, display_order: socialOrder };
      if (editingSocial) await updateSocialLink(editingSocial.id, data);
      else await addSocialLink(data);
      resetSocialForm(); setSocialDialogOpen(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally { setFormLoading(false); }
  };

  const handleAchievementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      let imageUrl = editingAchievement?.image_url || null;
      if (achMediaFile) {
        imageUrl = await uploadAchievementMedia(achMediaFile);
      }
      const data = {
        title: achTitle,
        category: achCategory,
        issuer: achIssuer,
        date: achDate,
        description: achDescription,
        image_url: imageUrl,
        video_url: achVideoUrl || null,
        link_url: achLinkUrl || null,
        display_order: achOrder,
      };
      if (editingAchievement) await updateAchievement(editingAchievement.id, data);
      else await addAchievement(data);
      resetAchievementForm(); setAchDialogOpen(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally { setFormLoading(false); }
  };

  const handleSkillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const data = { name: skillName, level: skillLevel, category: skillCategory, display_order: skillOrder };
      if (editingSkill) await updateSkill(editingSkill.id, data);
      else await addSkill(data);
      resetSkillForm(); setSkillDialogOpen(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally { setFormLoading(false); }
  };

  const handleEditSkill = (skill: Skill) => {
    setEditingSkill(skill); setSkillName(skill.name);
    setSkillLevel(skill.level); setSkillCategory(skill.category);
    setSkillOrder(skill.display_order || 0); setSkillDialogOpen(true);
  };

  const handleEditAchievement = (ach: Achievement) => {
    setEditingAchievement(ach);
    setAchTitle(ach.title);
    setAchCategory(ach.category);
    setAchIssuer(ach.issuer);
    setAchDate(ach.date);
    setAchDescription(ach.description);
    setAchVideoUrl(ach.video_url || "");
    setAchLinkUrl(ach.link_url || "");
    setAchOrder(ach.display_order);
    setAchImagePreview(ach.image_url || null);
    setAchDialogOpen(true);
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) return;
    setFormLoading(true);
    try {
      const fileUrl = await uploadResume(resumeFile);
      if (fileUrl) { await saveResume(fileUrl, resumeFile.name); setResumeFile(null); }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally { setFormLoading(false); }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project); setProjectTitle(project.title);
    setProjectDescription(project.description.join("\n")); setProjectTechStack(project.tech_stack);
    setProjectGithub(project.github_link || ""); setProjectLive(project.live_link || "");
    setProjectOrder(project.display_order); setProjectImagePreview(project.image_url);
    setProjectDialogOpen(true);
  };

  const handleEditEducation = (edu: Education) => {
    setEditingEducation(edu); setEduYear(edu.year); setEduInstitution(edu.institution);
    setEduLocation(edu.location); setEduDegree(edu.degree); setEduPeriod(edu.period);
    setEduOrder(edu.display_order); setEduDialogOpen(true);
  };

  const handleEditExperience = (exp: Experience) => {
    setEditingExperience(exp); setExpTitle(exp.title); setExpCompany(exp.company);
    setExpLocation(exp.location); setExpPeriod(exp.period);
    setExpDescription(exp.description.join("\n")); setExpOrder(exp.display_order);
    setExpDialogOpen(true);
  };

  const handleEditTech = (tech: TechnologyCategory) => {
    setEditingTech(tech); setTechTitle(tech.title); setTechIcon(tech.icon);
    setTechColor(tech.color);
    setTechSubcategories(tech.subcategories.map(s => `${s.name}:\n${s.technologies.join("\n")}`).join("\n\n"));
    setTechOrder(tech.display_order); setTechDialogOpen(true);
  };

  const handleEditSocial = (link: SocialLink) => {
    setEditingSocial(link); setSocialPlatform(link.platform); setSocialUrl(link.url);
    setSocialIcon(link.icon); setSocialOrder(link.display_order); setSocialDialogOpen(true);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "profile", label: "Profile", icon: User },
    { id: "social", label: "Social Links", icon: Share2 },
    { id: "resume", label: "Resume", icon: FileText },
    { id: "projects", label: "Projects", icon: Code },
    { id: "skills", label: "Skills", icon: Sliders },
    { id: "technology", label: "Technology", icon: Code },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "achievements", label: "Achievements", icon: Award },
  ];

  return (
    <div className="min-h-screen flex bg-muted">
      {/* Sidebar - Desktop */}
      <aside className="w-64 bg-card border-r min-h-screen p-4 hidden lg:block fixed left-0 top-0 bottom-0 overflow-y-auto">
        <div className="mb-8">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon className="w-4 h-4 mr-2" />
              {item.label}
            </Button>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/")}>
            <Home className="w-4 h-4 mr-2" />
            View Portfolio
          </Button>
          <Button variant="destructive" className="w-full justify-start" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-card border-b p-4 z-50 flex justify-between items-center">
        <h2 className="font-bold">Admin</h2>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => navigate("/")}>
            <Home className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="destructive" onClick={handleSignOut}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t p-2 z-50 overflow-x-auto">
        <div className="flex justify-around min-w-max px-2 gap-1">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              size="sm"
              className="flex-shrink-0"
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon className="w-4 h-4" />
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8 lg:ml-64 pt-20 lg:pt-8 pb-20 lg:pb-8">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">Projects</CardTitle></CardHeader>
                <CardContent><p className="text-3xl font-bold text-primary">{projects.length}</p></CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">Technologies</CardTitle></CardHeader>
                <CardContent><p className="text-3xl font-bold text-primary">{categories.length}</p></CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">Education</CardTitle></CardHeader>
                <CardContent><p className="text-3xl font-bold text-primary">{education.length}</p></CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">Skills</CardTitle></CardHeader>
                <CardContent><p className="text-3xl font-bold text-primary">{skills.length}</p></CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">Social Links</CardTitle></CardHeader>
                <CardContent><p className="text-3xl font-bold text-primary">{socialLinks.length}</p></CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">Achievements</CardTitle></CardHeader>
                <CardContent><p className="text-3xl font-bold text-primary">{achievements.length}</p></CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-6">Profile Settings</h1>
            <Card className="max-w-2xl">
              <CardContent className="pt-6">
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div>
                    <Label>Profile Picture</Label>
                    <Input type="file" accept="image/*" onChange={handleProfileImageChange} />
                    {profileImagePreview && (
                      <div className="mt-3 flex items-center gap-4">
                        <img src={profileImagePreview} alt="Profile" className="w-28 h-28 rounded-full object-cover border-2 border-primary/50 shadow-md" />
                        {rawImageSrc && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setCropperOpen(true)}
                          >
                            Adjust Crop / Reposition
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label>Name</Label>
                    <Input value={profileName} onChange={(e) => setProfileName(e.target.value)} required />
                  </div>
                  <div>
                    <Label>Title / Position</Label>
                    <Input value={profileTitle} onChange={(e) => setProfileTitle(e.target.value)} placeholder="e.g. Web Developer, Full Stack Developer" required />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea value={profileDescription} onChange={(e) => setProfileDescription(e.target.value)} rows={3} required />
                  </div>
                  <Button type="submit" disabled={formLoading}>
                    {formLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Save Profile
                  </Button>
                </form>
              </CardContent>
            </Card>
            <ImageCropperModal
              isOpen={cropperOpen}
              imageSrc={rawImageSrc}
              onClose={() => setCropperOpen(false)}
              onCropComplete={handleCropComplete}
            />
          </div>
        )}

        {/* Social Links Tab */}
        {activeTab === "social" && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h1 className="text-2xl lg:text-3xl font-bold">Social Links</h1>
              <Dialog open={socialDialogOpen} onOpenChange={(open) => { setSocialDialogOpen(open); if (!open) resetSocialForm(); }}>
                <DialogTrigger asChild>
                  <Button><Plus className="w-4 h-4 mr-2" /> Add Social Link</Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingSocial ? "Edit Social Link" : "Add Social Link"}</DialogTitle>
                    <DialogDescription>Add your social media or contact links</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSocialSubmit} className="space-y-4">
                    <div>
                      <Label>Platform Name *</Label>
                      <Input value={socialPlatform} onChange={(e) => setSocialPlatform(e.target.value)} placeholder="e.g. LinkedIn, YouTube, WhatsApp" required />
                    </div>
                    <div>
                      <Label>URL *</Label>
                      <Input value={socialUrl} onChange={(e) => setSocialUrl(e.target.value)} placeholder="https://..." required />
                    </div>
                    <div>
                      <Label>Icon</Label>
                      <Select value={socialIcon} onValueChange={setSocialIcon}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select icon" />
                        </SelectTrigger>
                        <SelectContent>
                          {ICON_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Display Order</Label>
                      <Input type="number" value={socialOrder} onChange={(e) => setSocialOrder(parseInt(e.target.value) || 0)} />
                    </div>
                    <Button type="submit" disabled={formLoading} className="w-full">
                      {formLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                      {editingSocial ? "Update" : "Add"} Social Link
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {socialLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin" /></div>
            ) : socialLinks.length === 0 ? (
              <Card><CardContent className="py-8 text-center text-muted-foreground">No social links yet. Add LinkedIn, GitHub, YouTube, WhatsApp, etc.</CardContent></Card>
            ) : (
              <div className="space-y-3">
                {socialLinks.map((link) => (
                  <Card key={link.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                          <h3 className="font-bold">{link.platform}</h3>
                          <p className="text-sm text-muted-foreground truncate max-w-md">{link.url}</p>
                          <p className="text-xs text-muted-foreground">Icon: {link.icon} • Order: {link.display_order}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEditSocial(link)}><Pencil className="w-4 h-4" /></Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild><Button size="sm" variant="destructive"><Trash2 className="w-4 h-4" /></Button></AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader><AlertDialogTitle>Delete {link.platform}?</AlertDialogTitle></AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteSocialLink(link.id)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Resume Tab */}
        {activeTab === "resume" && (
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-6">Resume Management</h1>
            <Card className="max-w-2xl">
              <CardContent className="pt-6 space-y-4">
                {resume ? (
                  <div className="p-4 bg-muted rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="font-medium">{resume.file_name}</p>
                      <a href={resume.file_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">View Resume</a>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button variant="destructive" size="sm"><Trash2 className="w-4 h-4 mr-1" /> Delete</Button></AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader><AlertDialogTitle>Delete Resume?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                        <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={deleteResume}>Delete</AlertDialogAction></AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No resume uploaded yet.</p>
                )}
                <div className="border-t pt-4">
                  <Label>Upload New Resume</Label>
                  <div className="flex flex-col sm:flex-row gap-2 mt-2">
                    <Input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files?.[0] || null)} />
                    <Button onClick={handleResumeUpload} disabled={!resumeFile || formLoading}>
                      {formLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                      Upload
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === "projects" && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h1 className="text-2xl lg:text-3xl font-bold">Projects</h1>
              <Dialog open={projectDialogOpen} onOpenChange={(open) => { setProjectDialogOpen(open); if (!open) resetProjectForm(); }}>
                <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" /> Add Project</Button></DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingProject ? "Edit Project" : "Add Project"}</DialogTitle>
                    <DialogDescription>Fill in the project details</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleProjectSubmit} className="space-y-4">
                    <div><Label>Title *</Label><Input value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} required /></div>
                    <div><Label>Description (one per line) *</Label><Textarea value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} rows={4} required /></div>
                    <div><Label>Tech Stack *</Label><Input value={projectTechStack} onChange={(e) => setProjectTechStack(e.target.value)} required /></div>
                    <div><Label>Image</Label><Input type="file" accept="image/*" onChange={handleProjectImageChange} />
                      {projectImagePreview && <img src={projectImagePreview} alt="Preview" className="mt-2 w-full max-w-xs rounded-lg" />}
                    </div>
                    <div><Label>GitHub Link</Label><Input value={projectGithub} onChange={(e) => setProjectGithub(e.target.value)} /></div>
                    <div><Label>Live Demo Link</Label><Input value={projectLive} onChange={(e) => setProjectLive(e.target.value)} /></div>
                    <div><Label>Display Order</Label><Input type="number" value={projectOrder} onChange={(e) => setProjectOrder(parseInt(e.target.value) || 0)} /></div>
                    <Button type="submit" disabled={formLoading} className="w-full">
                      {formLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                      {editingProject ? "Update" : "Add"} Project
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            {projectsLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin" /></div>
            ) : projects.length === 0 ? (
              <Card><CardContent className="py-8 text-center text-muted-foreground">No projects yet</CardContent></Card>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                  <Card key={project.id}>
                    {project.image_url && <img src={project.image_url} alt={project.title} className="w-full h-40 object-cover rounded-t-lg" />}
                    <CardContent className="p-4">
                      <h3 className="font-bold mb-1">{project.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{project.tech_stack}</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEditProject(project)}><Pencil className="w-4 h-4" /></Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild><Button size="sm" variant="destructive"><Trash2 className="w-4 h-4" /></Button></AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader><AlertDialogTitle>Delete Project?</AlertDialogTitle></AlertDialogHeader>
                            <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => deleteProject(project.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Technology Tab */}
        {activeTab === "technology" && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h1 className="text-2xl lg:text-3xl font-bold">Technology & Tools</h1>
              <Dialog open={techDialogOpen} onOpenChange={(open) => { setTechDialogOpen(open); if (!open) resetTechForm(); }}>
                <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" /> Add Category</Button></DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingTech ? "Edit Category" : "Add Category"}</DialogTitle>
                    <DialogDescription>Fill in the technology category details</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleTechSubmit} className="space-y-4">
                    <div><Label>Title *</Label><Input value={techTitle} onChange={(e) => setTechTitle(e.target.value)} required /></div>
                    <div><Label>Icon Name</Label><Input value={techIcon} onChange={(e) => setTechIcon(e.target.value)} placeholder="Code, Smartphone, Brain, etc." /></div>
                    <div><Label>Color Gradient</Label><Input value={techColor} onChange={(e) => setTechColor(e.target.value)} placeholder="from-blue-500 to-blue-700" /></div>
                    <div>
                      <Label>Subcategories (format: Name:\nTech1\nTech2\n\nName2:\nTech3)</Label>
                      <Textarea value={techSubcategories} onChange={(e) => setTechSubcategories(e.target.value)} rows={8} placeholder="Frontend Technologies:
HTML
CSS
JavaScript

Backend Technologies:
Node.js
PHP" />
                    </div>
                    <div><Label>Display Order</Label><Input type="number" value={techOrder} onChange={(e) => setTechOrder(parseInt(e.target.value) || 0)} /></div>
                    <Button type="submit" disabled={formLoading} className="w-full">
                      {formLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                      {editingTech ? "Update" : "Add"} Category
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            {techLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin" /></div>
            ) : categories.length === 0 ? (
              <Card><CardContent className="py-8 text-center text-muted-foreground">No categories yet</CardContent></Card>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => (
                  <Card key={cat.id}>
                    <CardHeader className="pb-2"><CardTitle className="text-lg">{cat.title}</CardTitle></CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{cat.subcategories.length} subcategories</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEditTech(cat)}><Pencil className="w-4 h-4" /></Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild><Button size="sm" variant="destructive"><Trash2 className="w-4 h-4" /></Button></AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader><AlertDialogTitle>Delete Category?</AlertDialogTitle></AlertDialogHeader>
                            <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => deleteCategory(cat.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Experience Tab */}
        {activeTab === "experience" && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h1 className="text-2xl lg:text-3xl font-bold">Professional Experience</h1>
              <Dialog open={expDialogOpen} onOpenChange={(open) => { setExpDialogOpen(open); if (!open) resetExperienceForm(); }}>
                <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" /> Add Experience</Button></DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingExperience ? "Edit Experience" : "Add Experience"}</DialogTitle>
                    <DialogDescription>Fill in the experience details</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleExperienceSubmit} className="space-y-4">
                    <div><Label>Title *</Label><Input value={expTitle} onChange={(e) => setExpTitle(e.target.value)} required /></div>
                    <div><Label>Company *</Label><Input value={expCompany} onChange={(e) => setExpCompany(e.target.value)} required /></div>
                    <div><Label>Location *</Label><Input value={expLocation} onChange={(e) => setExpLocation(e.target.value)} required /></div>
                    <div><Label>Period *</Label><Input value={expPeriod} onChange={(e) => setExpPeriod(e.target.value)} placeholder="Jan 2023 - Present" required /></div>
                    <div><Label>Description (one per line) *</Label><Textarea value={expDescription} onChange={(e) => setExpDescription(e.target.value)} rows={4} required /></div>
                    <div><Label>Display Order</Label><Input type="number" value={expOrder} onChange={(e) => setExpOrder(parseInt(e.target.value) || 0)} /></div>
                    <Button type="submit" disabled={formLoading} className="w-full">
                      {formLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                      {editingExperience ? "Update" : "Add"} Experience
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            {expLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin" /></div>
            ) : experiences.length === 0 ? (
              <Card><CardContent className="py-8 text-center text-muted-foreground">No experiences yet</CardContent></Card>
            ) : (
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <Card key={exp.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div>
                          <h3 className="font-bold">{exp.title}</h3>
                          <p className="text-sm text-muted-foreground">{exp.company} • {exp.location}</p>
                          <p className="text-sm text-primary">{exp.period}</p>
                        </div>
                        <div className="flex gap-2 self-start">
                          <Button size="sm" variant="outline" onClick={() => handleEditExperience(exp)}><Pencil className="w-4 h-4" /></Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild><Button size="sm" variant="destructive"><Trash2 className="w-4 h-4" /></Button></AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader><AlertDialogTitle>Delete Experience?</AlertDialogTitle></AlertDialogHeader>
                              <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => deleteExperience(exp.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Education Tab */}
        {activeTab === "education" && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h1 className="text-2xl lg:text-3xl font-bold">Education</h1>
              <Dialog open={eduDialogOpen} onOpenChange={(open) => { setEduDialogOpen(open); if (!open) resetEducationForm(); }}>
                <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" /> Add Education</Button></DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingEducation ? "Edit Education" : "Add Education"}</DialogTitle>
                    <DialogDescription>Fill in the education details</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleEducationSubmit} className="space-y-4">
                    <div><Label>Year *</Label><Input value={eduYear} onChange={(e) => setEduYear(e.target.value)} placeholder="2022 to 2026" required /></div>
                    <div><Label>Institution *</Label><Input value={eduInstitution} onChange={(e) => setEduInstitution(e.target.value)} required /></div>
                    <div><Label>Location *</Label><Input value={eduLocation} onChange={(e) => setEduLocation(e.target.value)} required /></div>
                    <div><Label>Degree *</Label><Input value={eduDegree} onChange={(e) => setEduDegree(e.target.value)} required /></div>
                    <div><Label>Period *</Label><Input value={eduPeriod} onChange={(e) => setEduPeriod(e.target.value)} placeholder="2023 - 2026" required /></div>
                    <div><Label>Display Order</Label><Input type="number" value={eduOrder} onChange={(e) => setEduOrder(parseInt(e.target.value) || 0)} /></div>
                    <Button type="submit" disabled={formLoading} className="w-full">
                      {formLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                      {editingEducation ? "Update" : "Add"} Education
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            {eduLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin" /></div>
            ) : education.length === 0 ? (
              <Card><CardContent className="py-8 text-center text-muted-foreground">No education records yet</CardContent></Card>
            ) : (
              <div className="space-y-4">
                {education.map((edu) => (
                  <Card key={edu.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div>
                          <p className="text-sm font-bold text-primary">{edu.year}</p>
                          <h3 className="font-bold">{edu.institution}</h3>
                          <p className="text-sm text-muted-foreground">{edu.location}</p>
                          <p className="text-sm">{edu.degree}</p>
                        </div>
                        <div className="flex gap-2 self-start">
                          <Button size="sm" variant="outline" onClick={() => handleEditEducation(edu)}><Pencil className="w-4 h-4" /></Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild><Button size="sm" variant="destructive"><Trash2 className="w-4 h-4" /></Button></AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader><AlertDialogTitle>Delete Education?</AlertDialogTitle></AlertDialogHeader>
                              <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => deleteEducation(edu.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === "achievements" && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h1 className="text-2xl lg:text-3xl font-bold">Achievements & Certificates</h1>
              <Dialog open={achDialogOpen} onOpenChange={(open) => { setAchDialogOpen(open); if (!open) resetAchievementForm(); }}>
                <DialogTrigger asChild>
                  <Button><Plus className="w-4 h-4 mr-2" /> Add Achievement</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingAchievement ? "Edit Achievement" : "Add Achievement"}</DialogTitle>
                    <DialogDescription>Add certificates, awards, presentations, hackathons, or honors</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAchievementSubmit} className="space-y-4">
                    <div>
                      <Label>Title *</Label>
                      <Input value={achTitle} onChange={(e) => setAchTitle(e.target.value)} placeholder="e.g. AI & ML Certification" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Category *</Label>
                        <Select value={achCategory} onValueChange={setAchCategory}>
                          <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Certificate">Certificate</SelectItem>
                            <SelectItem value="Award">Award</SelectItem>
                            <SelectItem value="Presentation">Presentation</SelectItem>
                            <SelectItem value="Hackathon">Hackathon</SelectItem>
                            <SelectItem value="Event">Event</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Date / Year *</Label>
                        <Input value={achDate} onChange={(e) => setAchDate(e.target.value)} placeholder="e.g. 2024" required />
                      </div>
                    </div>
                    <div>
                      <Label>Issuer / Organization *</Label>
                      <Input value={achIssuer} onChange={(e) => setAchIssuer(e.target.value)} placeholder="e.g. Coursera / Stanford / University" required />
                    </div>
                    <div>
                      <Label>Description *</Label>
                      <Textarea value={achDescription} onChange={(e) => setAchDescription(e.target.value)} rows={3} placeholder="Brief details about the certificate or presentation..." required />
                    </div>
                    <div>
                      <Label>Certificate Image (Optional)</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setAchMediaFile(file);
                            const reader = new FileReader();
                            reader.onload = () => setAchImagePreview(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      {achImagePreview && (
                        <img src={achImagePreview} alt="Preview" className="mt-2 h-24 w-auto rounded border object-cover" />
                      )}
                    </div>
                    <div>
                      <Label>Video Presentation URL (Optional)</Label>
                      <Input value={achVideoUrl} onChange={(e) => setAchVideoUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
                    </div>
                    <div>
                      <Label>Verification / Credential Link (Optional)</Label>
                      <Input value={achLinkUrl} onChange={(e) => setAchLinkUrl(e.target.value)} placeholder="https://coursera.org/verify/..." />
                    </div>
                    <div>
                      <Label>Display Order</Label>
                      <Input type="number" value={achOrder} onChange={(e) => setAchOrder(parseInt(e.target.value) || 0)} />
                    </div>
                    <Button type="submit" disabled={formLoading} className="w-full">
                      {formLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                      {editingAchievement ? "Update" : "Add"} Achievement
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {achLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin" /></div>
            ) : achievements.length === 0 ? (
              <Card><CardContent className="py-8 text-center text-muted-foreground">No achievements yet. Click Add Achievement to add your certificates, awards, and presentations.</CardContent></Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {achievements.map((ach) => (
                  <Card key={ach.id} className="relative flex flex-col justify-between">
                    <CardContent className="p-4 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <span className="px-2 py-0.5 rounded text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                            {ach.category}
                          </span>
                          <span className="text-xs text-muted-foreground">{ach.date}</span>
                        </div>
                        <h3 className="font-bold text-lg mb-1">{ach.title}</h3>
                        <p className="text-sm font-medium text-muted-foreground mb-2">{ach.issuer}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{ach.description}</p>
                        {ach.image_url && (
                          <img src={ach.image_url} alt={ach.title} className="h-24 w-full object-cover rounded mb-2 border" />
                        )}
                      </div>
                      <div className="flex justify-end gap-2 pt-2 border-t mt-2">
                        <Button size="sm" variant="outline" onClick={() => handleEditAchievement(ach)}><Pencil className="w-4 h-4" /></Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild><Button size="sm" variant="destructive"><Trash2 className="w-4 h-4" /></Button></AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader><AlertDialogTitle>Delete Achievement?</AlertDialogTitle></AlertDialogHeader>
                            <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => deleteAchievement(ach.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            )}
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === "skills" && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h1 className="text-2xl lg:text-3xl font-bold">Skills Management</h1>
              <Dialog open={skillDialogOpen} onOpenChange={(open) => { setSkillDialogOpen(open); if (!open) resetSkillForm(); }}>
                <DialogTrigger asChild>
                  <Button><Plus className="w-4 h-4 mr-2" /> Add Skill</Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{editingSkill ? "Edit Skill" : "Add Skill"}</DialogTitle>
                    <DialogDescription>Add or update technical skills and proficiency level</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSkillSubmit} className="space-y-4">
                    <div>
                      <Label>Skill Name *</Label>
                      <Input value={skillName} onChange={(e) => setSkillName(e.target.value)} placeholder="e.g. React.js, Python, C++" required />
                    </div>
                    <div>
                      <Label>Proficiency Level (%) * ({skillLevel}%)</Label>
                      <div className="flex items-center gap-3">
                        <Input
                          type="number"
                          min={1}
                          max={100}
                          value={skillLevel}
                          onChange={(e) => setSkillLevel(Math.min(100, Math.max(1, parseInt(e.target.value) || 0)))}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Category *</Label>
                      <Select value={skillCategory} onValueChange={setSkillCategory}>
                        <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Frontend">Frontend</SelectItem>
                          <SelectItem value="Backend">Backend</SelectItem>
                          <SelectItem value="Languages">Languages</SelectItem>
                          <SelectItem value="Database">Database</SelectItem>
                          <SelectItem value="AI/ML">AI/ML</SelectItem>
                          <SelectItem value="Tools">Tools</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Display Order</Label>
                      <Input type="number" value={skillOrder} onChange={(e) => setSkillOrder(parseInt(e.target.value) || 0)} />
                    </div>
                    <Button type="submit" disabled={formLoading} className="w-full">
                      {formLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                      {editingSkill ? "Update" : "Add"} Skill
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {skillsLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin" /></div>
            ) : skills.length === 0 ? (
              <Card><CardContent className="py-8 text-center text-muted-foreground">No skills added yet. Click Add Skill to add your technical skills.</CardContent></Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {skills.map((s) => (
                  <Card key={s.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                              {s.category}
                            </span>
                            <span className="font-bold">{s.name}</span>
                          </div>
                          <p className="text-sm font-semibold text-primary">{s.level}%</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEditSkill(s)}><Pencil className="w-4 h-4" /></Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild><Button size="sm" variant="destructive"><Trash2 className="w-4 h-4" /></Button></AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader><AlertDialogTitle>Delete Skill?</AlertDialogTitle></AlertDialogHeader>
                              <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => deleteSkill(s.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                      <div className="w-full bg-muted h-2 rounded-full overflow-hidden mt-2">
                        <div className="bg-primary h-full rounded-full" style={{ width: `${s.level}%` }} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
