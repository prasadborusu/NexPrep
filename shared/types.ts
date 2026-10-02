export type UserRole = 'student' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  college?: string;
  degree?: string;
  branch?: string;
  graduation_year?: number;
  cgpa?: number;
  phone?: string;
  github_url?: string;
  linkedin_url?: string;
  skills: string[];
  target_role?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export type AssessmentType = 'mcq' | 'coding' | 'mixed';

export interface Assessment {
  id: string;
  title: string;
  description: string;
  type: AssessmentType;
  duration_minutes: number;
  total_marks: number;
  pass_percentage: number;
  is_active: boolean;
  scheduled_at?: string;
  expires_at?: string;
  created_by?: string;
  created_at: string;
  questions_count?: number;
}

export type QuestionType = 'mcq' | 'coding';

export interface QuestionOption {
  id: string;
  text: string;
}

export interface TestCase {
  id: string;
  input: string;
  expected_output: string;
  is_hidden: boolean;
  explanation?: string;
}

export interface Question {
  id: string;
  assessment_id?: string;
  title: string;
  description: string;
  type: QuestionType;
  marks: number;
  // MCQ specific
  options?: QuestionOption[];
  correct_option_id?: string;
  explanation?: string;
  // Coding specific
  allowed_languages?: string[];
  starter_code?: Record<string, string>; // lang -> code
  test_cases?: TestCase[];
  constraints?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  category?: string;
  created_at: string;
}

export interface StudentAssessmentAnswer {
  question_id: string;
  selected_option_id?: string;
  code_content?: string;
  language?: string;
  is_marked_for_review: boolean;
  saved_at?: string;
}

export interface AssessmentSubmission {
  id: string;
  assessment_id: string;
  student_id: string;
  student_name?: string;
  student_email?: string;
  assessment_title?: string;
  status: 'in_progress' | 'submitted' | 'evaluated';
  score: number;
  total_marks: number;
  percentage: number;
  passed: boolean;
  answers: Record<string, StudentAssessmentAnswer>;
  question_results?: Record<string, {
    correct: boolean;
    marks_obtained: number;
    feedback?: string;
  }>;
  started_at: string;
  submitted_at?: string;
}

export interface CodingProblem {
  id: string;
  title: string;
  slug: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  tags: string[];
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints: string[];
  starter_code: Record<string, string>;
  solution_code?: Record<string, string>;
  test_cases: TestCase[];
  acceptance_rate?: number;
  total_submissions?: number;
  created_at: string;
}

export interface CodeSubmission {
  id: string;
  student_id: string;
  problem_id: string;
  language: string;
  code: string;
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Compilation Error' | 'Runtime Error';
  passed_test_cases: number;
  total_test_cases: number;
  execution_time_ms?: number;
  memory_kb?: number;
  error_message?: string;
  created_at: string;
}

export interface ResumeData {
  id?: string;
  student_id: string;
  title: string;
  personal_info: {
    full_name: string;
    email: string;
    phone: string;
    location: string;
    linkedin_url?: string;
    github_url?: string;
    portfolio_url?: string;
  };
  target_role: string;
  summary: string;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    start_date: string;
    end_date: string;
    score: string;
    highlights?: string[];
  }>;
  experience: Array<{
    id: string;
    company: string;
    role: string;
    location: string;
    start_date: string;
    end_date: string;
    is_current: boolean;
    bullets: string[];
  }>;
  projects: Array<{
    id: string;
    title: string;
    technologies: string[];
    link?: string;
    bullets: string[];
  }>;
  skills: {
    languages: string[];
    frameworks: string[];
    tools_databases: string[];
    core_concepts: string[];
  };
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    issue_date: string;
    url?: string;
  }>;
  updated_at: string;
}

export interface ATSAnalysisResult {
  id?: string;
  student_id: string;
  target_role: string;
  job_description: string;
  overall_score: number; // 0 - 100
  breakdown: {
    keyword_match_score: number;
    formatting_score: number;
    structure_score: number;
    impact_metrics_score: number;
  };
  matched_keywords: string[];
  missing_skills: string[];
  formatting_feedback: Array<{
    type: 'pass' | 'warning' | 'fail';
    message: string;
  }>;
  structure_feedback: Array<{
    section: string;
    status: 'present' | 'missing' | 'needs_improvement';
    tip: string;
  }>;
  actionable_recommendations: string[];
  analyzed_at: string;
}

export interface SkillGapData {
  student_id: string;
  target_role: string;
  strong_skills: Array<{ skill: string; proficiency: number; source: string }>;
  weak_skills: Array<{ skill: string; proficiency: number; reason: string }>;
  missing_skills: Array<{ skill: string; importance: 'high' | 'medium' | 'low'; recommended_resource: string }>;
  learning_suggestions: string[];
  readiness_percentage: number;
  calculated_at: string;
}

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  category: 'core' | 'practice' | 'project' | 'interview';
  completed: boolean;
  resource_url?: string;
}

export interface RoadmapWeek {
  week_number: number;
  theme: string;
  focus: string;
  items: RoadmapItem[];
}

export interface StudentRoadmap {
  id?: string;
  student_id: string;
  target_role: string;
  duration_weeks: number;
  weeks: RoadmapWeek[];
  progress_percentage: number;
  updated_at: string;
}

export interface InterviewQuestion {
  id: string;
  type: 'technical' | 'hr' | 'project';
  question: string;
  context?: string;
  expected_keywords: string[];
  sample_answer?: string;
  user_answer?: string;
  feedback?: {
    score: number; // 0 - 100
    strengths: string[];
    improvements: string[];
    better_phrasing?: string;
  };
}

export interface InterviewSession {
  id: string;
  student_id: string;
  target_role: string;
  domain: string;
  difficulty: 'fresher' | 'intermediate' | 'experienced';
  questions: InterviewQuestion[];
  overall_score?: number;
  summary_feedback?: string;
  created_at: string;
  status: 'ongoing' | 'completed';
}

export interface PlacementDrive {
  id: string;
  company_name: string;
  company_logo?: string;
  role_title: string;
  location: string;
  ctc_range: string;
  eligibility: {
    min_cgpa: number;
    allowed_branches: string[];
    allowed_batches: number[];
    backlogs_allowed: boolean;
  };
  job_description: string;
  rounds: string[];
  deadline: string;
  apply_url: string;
  is_active: boolean;
  created_at: string;
}

export interface PlacementApplication {
  id: string;
  drive_id: string;
  student_id: string;
  status: 'applied' | 'shortlisted' | 'interview_scheduled' | 'selected' | 'rejected';
  applied_at: string;
  drive?: PlacementDrive;
}

export interface BulkEmailLog {
  id: string;
  admin_id: string;
  subject: string;
  template_name: string;
  recipients_count: number;
  success_count: number;
  failed_count: number;
  recipients_preview: Array<{ email: string; name: string; status: 'sent' | 'failed' }>;
  sent_at: string;
}
