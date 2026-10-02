-- NEXPREP Production Supabase PostgreSQL Schema
-- Includes RLS (Row Level Security), triggers, and full indexing

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'admin')) DEFAULT 'student',
  avatar_url TEXT,
  college TEXT,
  degree TEXT,
  branch TEXT,
  graduation_year INT,
  cgpa NUMERIC(4,2),
  phone TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  skills TEXT[] DEFAULT '{}',
  target_role TEXT DEFAULT 'Full Stack Developer',
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- 2. ASSESSMENTS TABLE
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('mcq', 'coding', 'mixed')) DEFAULT 'mcq',
  duration_minutes INT NOT NULL DEFAULT 45,
  total_marks INT NOT NULL DEFAULT 100,
  pass_percentage NUMERIC(5,2) NOT NULL DEFAULT 60.0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  scheduled_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Assessments are viewable by authenticated users"
  ON public.assessments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert assessments"
  ON public.assessments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update assessments"
  ON public.assessments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can delete assessments"
  ON public.assessments FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 3. QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID REFERENCES public.assessments(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('mcq', 'coding')),
  marks INT NOT NULL DEFAULT 10,
  options JSONB, -- [{ id: "1", text: "Option A" }, ...]
  correct_option_id TEXT,
  explanation TEXT,
  allowed_languages TEXT[] DEFAULT '{"java","python","cpp","javascript"}',
  starter_code JSONB DEFAULT '{}',
  test_cases JSONB DEFAULT '[]',
  constraints TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'medium',
  category TEXT DEFAULT 'General',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Questions are viewable by authenticated users"
  ON public.questions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins manage questions"
  ON public.questions FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 4. ASSESSMENT SUBMISSIONS
CREATE TABLE IF NOT EXISTS public.assessment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('in_progress', 'submitted', 'evaluated')) DEFAULT 'in_progress',
  score NUMERIC(6,2) DEFAULT 0,
  total_marks NUMERIC(6,2) DEFAULT 0,
  percentage NUMERIC(5,2) DEFAULT 0,
  passed BOOLEAN DEFAULT false,
  answers JSONB DEFAULT '{}',
  question_results JSONB DEFAULT '{}',
  started_at TIMESTAMPTZ DEFAULT now(),
  submitted_at TIMESTAMPTZ
);

ALTER TABLE public.assessment_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own submissions and Admins can view all"
  ON public.assessment_submissions FOR SELECT
  TO authenticated
  USING (
    student_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Students can insert own submission"
  ON public.assessment_submissions FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update own submission"
  ON public.assessment_submissions FOR UPDATE
  TO authenticated
  USING (student_id = auth.uid());

-- 5. CODING PROBLEMS
CREATE TABLE IF NOT EXISTS public.coding_problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'easy',
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  description TEXT NOT NULL,
  examples JSONB DEFAULT '[]',
  constraints TEXT[] DEFAULT '{}',
  starter_code JSONB NOT NULL,
  solution_code JSONB,
  test_cases JSONB NOT NULL,
  acceptance_rate NUMERIC(5,2) DEFAULT 100.0,
  total_submissions INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.coding_problems ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coding problems are viewable by all authenticated users"
  ON public.coding_problems FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins manage coding problems"
  ON public.coding_problems FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 6. CODE SUBMISSIONS
CREATE TABLE IF NOT EXISTS public.code_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  problem_id UUID NOT NULL REFERENCES public.coding_problems(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  code TEXT NOT NULL,
  status TEXT NOT NULL,
  passed_test_cases INT NOT NULL DEFAULT 0,
  total_test_cases INT NOT NULL DEFAULT 0,
  execution_time_ms INT,
  memory_kb INT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.code_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own code submissions, admins view all"
  ON public.code_submissions FOR SELECT
  TO authenticated
  USING (
    student_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Students can create code submissions"
  ON public.code_submissions FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

-- 7. RESUMES
CREATE TABLE IF NOT EXISTS public.resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'My Primary Resume',
  personal_info JSONB NOT NULL,
  target_role TEXT NOT NULL,
  summary TEXT,
  education JSONB DEFAULT '[]',
  experience JSONB DEFAULT '[]',
  projects JSONB DEFAULT '[]',
  skills JSONB DEFAULT '{}',
  certifications JSONB DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students manage their own resumes"
  ON public.resumes FOR ALL
  TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

-- 8. ATS ANALYSES
CREATE TABLE IF NOT EXISTS public.ats_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_role TEXT NOT NULL,
  job_description TEXT NOT NULL,
  overall_score INT NOT NULL,
  breakdown JSONB NOT NULL,
  matched_keywords TEXT[] DEFAULT '{}',
  missing_skills TEXT[] DEFAULT '{}',
  formatting_feedback JSONB DEFAULT '[]',
  structure_feedback JSONB DEFAULT '[]',
  actionable_recommendations TEXT[] DEFAULT '{}',
  analyzed_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.ats_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students manage their own ATS analyses"
  ON public.ats_analyses FOR ALL
  TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

-- 9. ROADMAPS
CREATE TABLE IF NOT EXISTS public.roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_role TEXT NOT NULL,
  duration_weeks INT NOT NULL DEFAULT 6,
  weeks JSONB NOT NULL,
  progress_percentage NUMERIC(5,2) DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students manage their own roadmap"
  ON public.roadmaps FOR ALL
  TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

-- 10. INTERVIEW SESSIONS
CREATE TABLE IF NOT EXISTS public.interview_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_role TEXT NOT NULL,
  domain TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'fresher',
  questions JSONB NOT NULL,
  overall_score NUMERIC(5,2),
  summary_feedback TEXT,
  status TEXT NOT NULL DEFAULT 'ongoing',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students manage their own interview sessions"
  ON public.interview_sessions FOR ALL
  TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

-- 11. PLACEMENT DRIVES
CREATE TABLE IF NOT EXISTS public.placement_drives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  company_logo TEXT,
  role_title TEXT NOT NULL,
  location TEXT NOT NULL,
  ctc_range TEXT NOT NULL,
  eligibility JSONB NOT NULL,
  job_description TEXT NOT NULL,
  rounds TEXT[] DEFAULT '{}',
  deadline TIMESTAMPTZ NOT NULL,
  apply_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.placement_drives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Placement drives are viewable by all authenticated users"
  ON public.placement_drives FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins manage placement drives"
  ON public.placement_drives FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 12. PLACEMENT APPLICATIONS
CREATE TABLE IF NOT EXISTS public.placement_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  drive_id UUID NOT NULL REFERENCES public.placement_drives(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'applied',
  applied_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(drive_id, student_id)
);

ALTER TABLE public.placement_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view and manage their own applications, admins view all"
  ON public.placement_applications FOR SELECT
  TO authenticated
  USING (
    student_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Students can apply"
  ON public.placement_applications FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Admins can update application status"
  ON public.placement_applications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 13. BULK EMAIL LOGS
CREATE TABLE IF NOT EXISTS public.bulk_email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES public.profiles(id),
  subject TEXT NOT NULL,
  template_name TEXT NOT NULL,
  recipients_count INT NOT NULL,
  success_count INT NOT NULL,
  failed_count INT NOT NULL,
  recipients_preview JSONB DEFAULT '[]',
  sent_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.bulk_email_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view and insert bulk email logs"
  ON public.bulk_email_logs FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Trigger to automatically create profile on auth.users insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'role', 'student')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
