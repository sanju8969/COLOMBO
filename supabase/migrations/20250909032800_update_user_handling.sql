-- Update the handle_new_user function to populate role-specific tables
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role text := NEW.raw_user_meta_data->>'role';
  profile_department_id uuid;
  user_semester integer;
BEGIN
  -- Extract department and semester, casting them to the correct types
  profile_department_id := (NEW.raw_user_meta_data->>'department')::uuid;
  user_semester := (NEW.raw_user_meta_data->>'semester')::integer;

  -- Insert into the public.profiles table
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    (user_role)::user_role
  );

  -- Create corresponding entries in students or faculty tables
  IF user_role = 'student' THEN
    INSERT INTO public.students (id, student_id, department_id, admission_year, current_semester)
    VALUES (
      NEW.id,
      'STU-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8), -- Generate a unique student ID
      profile_department_id,
      EXTRACT(YEAR FROM NOW()),
      user_semester
    );
  ELSIF user_role = 'faculty' THEN
    INSERT INTO public.faculty (id, employee_id, department_id, designation)
    VALUES (
      NEW.id,
      'FAC-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8), -- Generate a unique employee ID
      profile_department_id,
      'Assistant Professor' -- Assign a default designation
    );
  END IF;

  RETURN NEW;
END;
$$;