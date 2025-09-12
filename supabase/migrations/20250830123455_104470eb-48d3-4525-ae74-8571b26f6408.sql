-- Create security definer function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role::text FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create RLS policies for notices table
CREATE POLICY "Everyone can view published notices"
ON public.notices
FOR SELECT
USING (is_published = true);

CREATE POLICY "Admins can manage all notices"
ON public.notices
FOR ALL
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Faculty can manage their own notices"
ON public.notices
FOR ALL
USING (author_id = auth.uid() AND public.get_current_user_role() = 'faculty');