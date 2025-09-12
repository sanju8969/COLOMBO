-- Create gallery table for college images
CREATE TABLE public.gallery (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- Create policies for gallery
CREATE POLICY "Everyone can view gallery images" 
ON public.gallery 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage gallery images" 
ON public.gallery 
FOR ALL 
USING (get_current_user_role() = 'admin'::text);

-- Create alumni table for alumni profiles
CREATE TABLE public.alumni (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  graduation_year INTEGER NOT NULL,
  course TEXT NOT NULL,
  current_position TEXT,
  company TEXT,
  email TEXT,
  phone TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.alumni ENABLE ROW LEVEL SECURITY;

-- Create policies for alumni
CREATE POLICY "Everyone can view alumni profiles" 
ON public.alumni 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage alumni profiles" 
ON public.alumni 
FOR ALL 
USING (get_current_user_role() = 'admin'::text);