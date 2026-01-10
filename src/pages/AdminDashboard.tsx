import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProjects, Project } from "@/hooks/useProjects";
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
import { Loader2, Plus, Pencil, Trash2, LogOut, Home, LayoutDashboard, FolderPlus, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const { projects, loading: projectsLoading, addProject, updateProject, deleteProject, uploadImage } = useProjects();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"dashboard" | "add" | "manage">("dashboard");
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [liveLink, setLiveLink] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate("/admin/login");
    }
  }, [isAdmin, authLoading, navigate]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setTechStack("");
    setGithubLink("");
    setLiveLink("");
    setDisplayOrder(0);
    setImageFile(null);
    setImagePreview(null);
    setEditingProject(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      let imageUrl = editingProject?.image_url || null;
      
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const projectData = {
        title,
        description: description.split("\n").filter(line => line.trim()),
        tech_stack: techStack,
        github_link: githubLink || null,
        live_link: liveLink || null,
        display_order: displayOrder,
        image_url: imageUrl,
      };

      if (editingProject) {
        await updateProject(editingProject.id, projectData);
      } else {
        await addProject(projectData);
      }

      resetForm();
      setActiveTab("manage");
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setTitle(project.title);
    setDescription(project.description.join("\n"));
    setTechStack(project.tech_stack);
    setGithubLink(project.github_link || "");
    setLiveLink(project.live_link || "");
    setDisplayOrder(project.display_order);
    setImagePreview(project.image_url);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteProject(id);
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

  return (
    <div className="min-h-screen flex bg-muted">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r min-h-screen p-4 hidden md:block">
        <div className="mb-8">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>

        <nav className="space-y-2">
          <Button
            variant={activeTab === "dashboard" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("dashboard")}
          >
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          <Button
            variant={activeTab === "add" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => {
              resetForm();
              setActiveTab("add");
            }}
          >
            <FolderPlus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
          <Button
            variant={activeTab === "manage" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("manage")}
          >
            <Settings className="w-4 h-4 mr-2" />
            Manage Projects
          </Button>
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
      <div className="md:hidden fixed top-0 left-0 right-0 bg-card border-b p-4 z-50 flex justify-between items-center">
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
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t p-2 z-50 flex justify-around">
        <Button
          variant={activeTab === "dashboard" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("dashboard")}
        >
          <LayoutDashboard className="w-4 h-4" />
        </Button>
        <Button
          variant={activeTab === "add" ? "default" : "ghost"}
          size="sm"
          onClick={() => {
            resetForm();
            setActiveTab("add");
          }}
        >
          <Plus className="w-4 h-4" />
        </Button>
        <Button
          variant={activeTab === "manage" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("manage")}
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 md:pt-8 pt-20 pb-20 md:pb-8">
        {activeTab === "dashboard" && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Total Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-secondary">{projects.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Live Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-green-600">
                    {projects.filter(p => p.live_link).length}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>With Images</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-blue-600">
                    {projects.filter(p => p.image_url).length}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "add" && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Add New Project</h1>
            <Card className="max-w-2xl">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Project Title *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description (one point per line) *</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      placeholder="HTML, CSS, and PHP used&#10;Responsive design&#10;User authentication"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="techStack">Tech Stack *</Label>
                    <Input
                      id="techStack"
                      value={techStack}
                      onChange={(e) => setTechStack(e.target.value)}
                      placeholder="React, Node.js, MongoDB"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="image">Project Image</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mt-2 w-full max-w-xs rounded-lg"
                      />
                    )}
                  </div>

                  <div>
                    <Label htmlFor="githubLink">GitHub Link</Label>
                    <Input
                      id="githubLink"
                      value={githubLink}
                      onChange={(e) => setGithubLink(e.target.value)}
                      placeholder="https://github.com/..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="liveLink">Live Demo Link</Label>
                    <Input
                      id="liveLink"
                      value={liveLink}
                      onChange={(e) => setLiveLink(e.target.value)}
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="displayOrder">Display Order</Label>
                    <Input
                      id="displayOrder"
                      type="number"
                      value={displayOrder}
                      onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                    />
                  </div>

                  <Button type="submit" disabled={formLoading} className="w-full">
                    {formLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Project
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "manage" && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Manage Projects</h1>
            
            {projectsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : projects.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground mb-4">No projects yet</p>
                  <Button onClick={() => setActiveTab("add")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Project
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                  <Card key={project.id}>
                    {project.image_url && (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-40 object-cover rounded-t-lg"
                      />
                    )}
                    <CardContent className="p-4">
                      <h3 className="font-bold mb-2">{project.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{project.tech_stack}</p>
                      <div className="flex gap-2">
                        <Dialog open={isDialogOpen && editingProject?.id === project.id} onOpenChange={(open) => {
                          setIsDialogOpen(open);
                          if (!open) resetForm();
                        }}>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => handleEdit(project)}>
                              <Pencil className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Edit Project</DialogTitle>
                              <DialogDescription>Update project details</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                              <div>
                                <Label htmlFor="edit-title">Title</Label>
                                <Input
                                  id="edit-title"
                                  value={title}
                                  onChange={(e) => setTitle(e.target.value)}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit-description">Description</Label>
                                <Textarea
                                  id="edit-description"
                                  value={description}
                                  onChange={(e) => setDescription(e.target.value)}
                                  rows={4}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit-techStack">Tech Stack</Label>
                                <Input
                                  id="edit-techStack"
                                  value={techStack}
                                  onChange={(e) => setTechStack(e.target.value)}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit-image">Image</Label>
                                <Input
                                  id="edit-image"
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageChange}
                                />
                                {imagePreview && (
                                  <img src={imagePreview} alt="Preview" className="mt-2 w-full max-w-xs rounded-lg" />
                                )}
                              </div>
                              <div>
                                <Label htmlFor="edit-githubLink">GitHub Link</Label>
                                <Input
                                  id="edit-githubLink"
                                  value={githubLink}
                                  onChange={(e) => setGithubLink(e.target.value)}
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit-liveLink">Live Link</Label>
                                <Input
                                  id="edit-liveLink"
                                  value={liveLink}
                                  onChange={(e) => setLiveLink(e.target.value)}
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit-displayOrder">Display Order</Label>
                                <Input
                                  id="edit-displayOrder"
                                  type="number"
                                  value={displayOrder}
                                  onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                                />
                              </div>
                              <Button type="submit" disabled={formLoading} className="w-full">
                                {formLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Project"}
                              </Button>
                            </form>
                          </DialogContent>
                        </Dialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Project?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. "{project.title}" will be permanently deleted.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(project.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
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
      </main>
    </div>
  );
};

export default AdminDashboard;
