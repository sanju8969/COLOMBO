-- Ensure user_role enum exists
DO $$ BEGIN
IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
  CREATE TYPE public.user_role AS ENUM ('admin', 'faculty', 'student');
END IF;
END $$;

-- Add role column to profiles if missing
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS role public.user_role NOT NULL DEFAULT 'student';

-- Backfill any null roles to the default
UPDATE public.profiles SET role = 'student' WHERE role IS NULL;

-- Create trigger to insert into profiles on new auth user sign-up
DO $$ BEGIN
IF NOT EXISTS (
  SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
) THEN
  CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
END IF;
END $$;

-- Ensure updated_at auto-update trigger for profiles
DO $$ BEGIN
IF NOT EXISTS (
  SELECT 1 FROM pg_trigger WHERE tgname = 'update_profiles_updated_at'
) THEN
  CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
END IF;
END $$;