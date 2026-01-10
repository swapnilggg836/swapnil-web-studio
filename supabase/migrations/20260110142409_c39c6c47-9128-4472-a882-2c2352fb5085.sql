-- Create admin_users table for single admin authentication
CREATE TABLE public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Admin can only read their own record
CREATE POLICY "Admin can view own record"
ON public.admin_users
FOR SELECT
USING (auth.uid() = id);

-- Create projects table
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT[] NOT NULL DEFAULT '{}',
    tech_stack TEXT NOT NULL,
    image_url TEXT,
    github_link TEXT,
    live_link TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Public can read projects
CREATE POLICY "Anyone can view projects"
ON public.projects
FOR SELECT
USING (true);

-- Only authenticated admin can insert projects
CREATE POLICY "Admin can insert projects"
ON public.projects
FOR INSERT
WITH CHECK (
    EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

-- Only authenticated admin can update projects
CREATE POLICY "Admin can update projects"
ON public.projects
FOR UPDATE
USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

-- Only authenticated admin can delete projects
CREATE POLICY "Admin can delete projects"
ON public.projects
FOR DELETE
USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for project images
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true);

-- Storage policies for project images
CREATE POLICY "Anyone can view project images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'project-images');

CREATE POLICY "Admin can upload project images"
ON storage.objects
FOR INSERT
WITH CHECK (
    bucket_id = 'project-images' AND
    EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

CREATE POLICY "Admin can update project images"
ON storage.objects
FOR UPDATE
USING (
    bucket_id = 'project-images' AND
    EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

CREATE POLICY "Admin can delete project images"
ON storage.objects
FOR DELETE
USING (
    bucket_id = 'project-images' AND
    EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);