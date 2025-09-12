-- Create user roles enum
CREATE TYPE public.user_role AS ENUM ('admin', 'faculty', 'student');

-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create departments table
CREATE TABLE public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  head_of_department UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  credits INTEGER NOT NULL DEFAULT 3,
  department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
  semester INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create students table
CREATE TABLE public.students (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL UNIQUE,
  department_id UUID REFERENCES public.departments(id),
  admission_year INTEGER NOT NULL,
  current_semester INTEGER DEFAULT 1,
  graduation_year INTEGER,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'graduated', 'suspended', 'withdrawn')),
  gpa DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create faculty table
CREATE TABLE public.faculty (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  employee_id TEXT NOT NULL UNIQUE,
  department_id UUID REFERENCES public.departments(id),
  designation TEXT NOT NULL,
  qualification TEXT,
  experience_years INTEGER,
  specialization TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create enrollments table
CREATE TABLE public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  faculty_id UUID REFERENCES public.faculty(id),
  enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  grade TEXT CHECK (grade IN ('A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F', 'I', 'W')),
  status TEXT DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'completed', 'dropped')),
  UNIQUE(student_id, course_id)
);

-- Create notices table
CREATE TABLE public.notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('notice', 'event', 'announcement', 'urgent')),
  author_id UUID REFERENCES public.profiles(id),
  target_audience TEXT DEFAULT 'all' CHECK (target_audience IN ('all', 'students', 'faculty', 'admin')),
  is_published BOOLEAN DEFAULT FALSE,
  publish_date TIMESTAMP WITH TIME ZONE,
  expire_date TIMESTAMP WITH TIME ZONE,
  priority INTEGER DEFAULT 1 CHECK (priority BETWEEN 1 AND 5),
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admissions table
CREATE TABLE public.admissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  date_of_birth DATE,
  department_id UUID REFERENCES public.departments(id),
  course_type TEXT NOT NULL CHECK (course_type IN ('undergraduate', 'postgraduate', 'diploma')),
  previous_qualification TEXT,
  marks_percentage DECIMAL(5,2),
  application_status TEXT DEFAULT 'pending' CHECK (application_status IN ('pending', 'approved', 'rejected', 'waitlisted')),
  documents JSONB DEFAULT '[]',
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Create grades table
CREATE TABLE public.grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID REFERENCES public.enrollments(id) ON DELETE CASCADE,
  assessment_type TEXT NOT NULL CHECK (assessment_type IN ('assignment', 'quiz', 'midterm', 'final', 'project')),
  marks_obtained DECIMAL(5,2) NOT NULL,
  max_marks DECIMAL(5,2) NOT NULL,
  grade TEXT,
  remarks TEXT,
  graded_by UUID REFERENCES public.faculty(id),
  graded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS user_role
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for departments
CREATE POLICY "Everyone can view departments" ON public.departments
  FOR SELECT USING (true);

CREATE POLICY "Only admins can modify departments" ON public.departments
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for courses
CREATE POLICY "Everyone can view courses" ON public.courses
  FOR SELECT USING (true);

CREATE POLICY "Faculty and admins can modify courses" ON public.courses
  FOR ALL USING (public.get_user_role(auth.uid()) IN ('admin', 'faculty'));

-- RLS Policies for students
CREATE POLICY "Students can view their own data" ON public.students
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Faculty and admins can view all students" ON public.students
  FOR SELECT USING (public.get_user_role(auth.uid()) IN ('admin', 'faculty'));

CREATE POLICY "Admins can modify student data" ON public.students
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for faculty
CREATE POLICY "Faculty can view their own data" ON public.faculty
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Everyone can view faculty profiles" ON public.faculty
  FOR SELECT USING (true);

CREATE POLICY "Admins can modify faculty data" ON public.faculty
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for enrollments
CREATE POLICY "Students can view their enrollments" ON public.enrollments
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Faculty can view their course enrollments" ON public.enrollments
  FOR SELECT USING (faculty_id = auth.uid());

CREATE POLICY "Admins can view all enrollments" ON public.enrollments
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Faculty can update their course enrollments" ON public.enrollments
  FOR UPDATE USING (faculty_id = auth.uid());

-- RLS Policies for notices
CREATE POLICY "Published notices are viewable by target audience" ON public.notices
  FOR SELECT USING (
    is_published = true AND 
    (expire_date IS NULL OR expire_date > NOW()) AND
    (target_audience = 'all' OR target_audience = public.get_user_role(auth.uid())::text)
  );

CREATE POLICY "Faculty and admins can create notices" ON public.notices
  FOR INSERT WITH CHECK (public.get_user_role(auth.uid()) IN ('admin', 'faculty'));

CREATE POLICY "Authors and admins can update notices" ON public.notices
  FOR UPDATE USING (
    author_id = auth.uid() OR 
    public.get_user_role(auth.uid()) = 'admin'
  );

-- RLS Policies for admissions
CREATE POLICY "Admins can view all applications" ON public.admissions
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Anyone can create admission applications" ON public.admissions
  FOR INSERT WITH CHECK (true);

-- RLS Policies for grades
CREATE POLICY "Students can view their grades" ON public.grades
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.enrollments e 
      WHERE e.id = enrollment_id AND e.student_id = auth.uid()
    )
  );

CREATE POLICY "Faculty can manage grades for their courses" ON public.grades
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.enrollments e 
      WHERE e.id = enrollment_id AND e.faculty_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all grades" ON public.grades
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student')
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notices_updated_at
  BEFORE UPDATE ON public.notices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample departments
INSERT INTO public.departments (name, code, description) VALUES
('Computer Science', 'CS', 'Department of Computer Science and Engineering'),
('Mathematics', 'MATH', 'Department of Mathematics'),
('Physics', 'PHY', 'Department of Physics'),
('Chemistry', 'CHEM', 'Department of Chemistry'),
('English', 'ENG', 'Department of English Literature'),
('Commerce', 'COM', 'Department of Commerce and Business'),
('Economics', 'ECO', 'Department of Economics');

-- Insert sample courses
INSERT INTO public.courses (name, code, description, credits, department_id, semester) 
SELECT 
  'Introduction to Programming', 'CS101', 'Basic programming concepts and problem solving', 4, d.id, 1
FROM public.departments d WHERE d.code = 'CS'
UNION ALL
SELECT 
  'Data Structures', 'CS201', 'Fundamental data structures and algorithms', 4, d.id, 3
FROM public.departments d WHERE d.code = 'CS'
UNION ALL
SELECT 
  'Calculus I', 'MATH101', 'Differential and integral calculus', 3, d.id, 1
FROM public.departments d WHERE d.code = 'MATH'
UNION ALL
SELECT 
  'Linear Algebra', 'MATH201', 'Vector spaces and linear transformations', 3, d.id, 2
FROM public.departments d WHERE d.code = 'MATH';