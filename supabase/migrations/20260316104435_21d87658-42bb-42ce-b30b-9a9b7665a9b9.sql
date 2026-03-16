
CREATE TABLE public.social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  url text NOT NULL,
  icon text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view social_links" ON public.social_links FOR SELECT USING (true);

CREATE POLICY "Admin can insert social_links" ON public.social_links FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "Admin can update social_links" ON public.social_links FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "Admin can delete social_links" ON public.social_links FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE TRIGGER update_social_links_updated_at
  BEFORE UPDATE ON public.social_links
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
