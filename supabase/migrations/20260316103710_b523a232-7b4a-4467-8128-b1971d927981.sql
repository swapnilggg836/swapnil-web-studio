
-- Allow first admin registration: if no admin exists, allow insert
-- Drop existing insert policy and replace with a smarter one
DROP POLICY IF EXISTS "Admin can insert admin_users" ON public.admin_users;

-- Create a function to check if this is the first admin signup
CREATE OR REPLACE FUNCTION public.is_first_admin_or_is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    (SELECT count(*) FROM public.admin_users) = 0
    OR
    EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
$$;

-- Allow insert if no admin exists (first signup) OR if user is already admin
CREATE POLICY "First admin or existing admin can insert"
ON public.admin_users
FOR INSERT
TO authenticated
WITH CHECK (public.is_first_admin_or_is_admin());
