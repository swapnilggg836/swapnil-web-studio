-- Migration to create achievements table in Supabase
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  issuer TEXT,
  date TEXT,
  description TEXT,
  image_url TEXT,
  video_url TEXT,
  link_url TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON public.achievements
  FOR SELECT USING (true);

-- Allow authenticated admin write access
CREATE POLICY "Allow authenticated insert" ON public.achievements
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON public.achievements
  FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated delete" ON public.achievements
  FOR DELETE USING (true);
