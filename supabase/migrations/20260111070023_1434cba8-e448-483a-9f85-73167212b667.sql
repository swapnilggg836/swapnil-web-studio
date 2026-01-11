-- Create profile_info table for storing profile picture and about info
CREATE TABLE public.profile_info (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_image_url text,
    name text NOT NULL DEFAULT 'Swapnil Gaikwad',
    title text NOT NULL DEFAULT 'Web Developer',
    description text NOT NULL DEFAULT 'To create dynamic, responsive, and secure web applications that enhance user experience and meet business goals.',
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profile_info ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view profile_info" 
ON public.profile_info 
FOR SELECT 
USING (true);

CREATE POLICY "Admin can insert profile_info" 
ON public.profile_info 
FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()));

CREATE POLICY "Admin can update profile_info" 
ON public.profile_info 
FOR UPDATE 
USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()));

CREATE POLICY "Admin can delete profile_info" 
ON public.profile_info 
FOR DELETE 
USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()));

-- Create trigger for updated_at
CREATE TRIGGER update_profile_info_updated_at
BEFORE UPDATE ON public.profile_info
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for profile images
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-images', 'profile-images', true);

-- Create storage bucket for resume files
INSERT INTO storage.buckets (id, name, public) VALUES ('resume-files', 'resume-files', true);

-- Storage policies for profile-images bucket
CREATE POLICY "Profile images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'profile-images');

CREATE POLICY "Admin can upload profile images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'profile-images' AND EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()));

CREATE POLICY "Admin can update profile images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'profile-images' AND EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()));

CREATE POLICY "Admin can delete profile images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'profile-images' AND EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()));

-- Storage policies for resume-files bucket
CREATE POLICY "Resume files are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'resume-files');

CREATE POLICY "Admin can upload resume files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'resume-files' AND EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()));

CREATE POLICY "Admin can update resume files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'resume-files' AND EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()));

CREATE POLICY "Admin can delete resume files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'resume-files' AND EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()));