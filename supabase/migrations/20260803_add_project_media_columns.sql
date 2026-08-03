-- Add images and video_url columns to projects table
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS video_url text NULL;
