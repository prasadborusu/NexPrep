import {
  UserProfile,
  Assessment,
  Question,
  AssessmentSubmission,
  CodingProblem,
  CodingTopic,
  CodeSubmission,
  ResumeData,
  ResumeTemplateId,
  ResumeVersion,
  JobMatchAnalysis,
  ATSAnalysisResult,
  SkillGapData,
  StudentRoadmap,
  InterviewSession,
  PlacementDrive,
  PlacementApplication,
  BulkEmailLog,
  Course,
  CourseEnrollment
} from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function fetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // If BASE_URL already ends with /api and url starts with /api, remove duplicate /api
  const cleanBase = BASE_URL.replace(/\/+$/, '');
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  const fullUrl = `${cleanBase}${cleanPath}`;

  const res = await fetch(fullUrl, {
    ...options,
    headers
  });

  const rawText = await res.text();
  let data: any = null;
  try {
    data = JSON.parse(rawText);
  } catch {
    // raw response is HTML or plaintext
  }

  if (!res.ok) {
    const errMessage = data?.error || data?.message || (rawText.length < 200 ? rawText : `Request failed with status ${res.status}`);
    throw new Error(errMessage);
  }

  return data as T;
}

export const api = {
  // Auth
  auth: {
    login: (email: string, password?: string) => fetchJson<{ token: string; user: UserProfile }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),
    register: (data: Partial<UserProfile> & { password?: string }) => fetchJson<{ otp_required: boolean; email: string; message: string; otp_fallback?: string; email_sent?: boolean }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    verifyOtp: (data: { email: string; otp: string }) => fetchJson<{ success: boolean; token: string; user: UserProfile; message: string }>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    resendOtp: (email: string) => fetchJson<{ success: boolean; message: string; otp_fallback?: string; email_sent?: boolean }>('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email })
    }),
    getProfile: (id: string) => fetchJson<UserProfile>(`/auth/profile/${id}`),
    updateProfile: (id: string, data: Partial<UserProfile>) => fetchJson<UserProfile>(`/auth/profile/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    sendMagicLink: (email: string, role: 'student' | 'admin' = 'student') => fetchJson<{ success: boolean; message: string }>('/auth/magic-link', {
      method: 'POST',
      body: JSON.stringify({ email, role })
    })
  },

  // Assessments
  assessments: {
    list: () => fetchJson<Assessment[]>('/assessments'),
    listAdmin: () => fetchJson<Assessment[]>('/assessments/admin/all'),
    get: (id: string) => fetchJson<{ assessment: Assessment; questions: Question[] }>(`/assessments/${id}`),
    submit: (id: string, data: { student_id: string; answers: any; is_final_submit?: boolean }) =>
      fetchJson<{ message: string; submission: AssessmentSubmission }>(`/assessments/${id}/submit`, {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    getResult: (id: string, studentId: string) =>
      fetchJson<{ submission: AssessmentSubmission; questions: Question[] }>(`/assessments/${id}/result/${studentId}`),
    getStudentSubmissions: (studentId: string) =>
      fetchJson<AssessmentSubmission[]>(`/assessments/submissions/student/${studentId}`),
    create: (data: Partial<Assessment>) => fetchJson<Assessment>('/assessments', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    verifyPasskey: (id: string, passkey: string) => fetchJson<{ success: boolean; message: string }>(`/assessments/${id}/verify-passkey`, {
      method: 'POST',
      body: JSON.stringify({ passkey })
    }),
    updatePasskey: (id: string, passkey?: string) => fetchJson<{ success: boolean; passkey: string }>(`/assessments/${id}/passkey`, {
      method: 'POST',
      body: JSON.stringify({ passkey })
    }),
    getAdmin: (id: string) => fetchJson<{ assessment: Assessment; questions: Question[] }>(`/assessments/${id}/admin`),
    update: (id: string, data: Partial<Assessment>) => fetchJson<Assessment>(`/assessments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (id: string) => fetchJson<{ message: string }>(`/assessments/${id}`, {
      method: 'DELETE'
    }),
    addQuestion: (assessmentId: string, question: Partial<Question>) =>
      fetchJson<Question>(`/assessments/${assessmentId}/questions`, {
        method: 'POST',
        body: JSON.stringify(question)
      }),
    deleteQuestion: (assessmentId: string, questionId: string) =>
      fetchJson<{ message: string }>(`/assessments/${assessmentId}/questions/${questionId}`, {
        method: 'DELETE'
      })
  },

  // Coding Practice
  coding: {
    getTopics: (studentId?: string) =>
      fetchJson<CodingTopic[]>('/coding/topics' + (studentId ? `?student_id=${studentId}` : '')),
    getTopicDetail: (topicId: string, studentId?: string) =>
      fetchJson<{ topic: CodingTopic; problems: CodingProblem[] }>(`/coding/topics/${topicId}` + (studentId ? `?student_id=${studentId}` : '')),
    listProblems: (studentId?: string) =>
      fetchJson<CodingProblem[]>('/coding/problems' + (studentId ? `?student_id=${studentId}` : '')),
    getProblem: (idOrSlug: string, studentId?: string) =>
      fetchJson<CodingProblem>(`/coding/problems/${idOrSlug}` + (studentId ? `?student_id=${studentId}` : '')),
    runCode: (language: string, code: string, stdin?: string) =>
      fetchJson<any>('/coding/run', {
        method: 'POST',
        body: JSON.stringify({ language, code, stdin })
      }),
    submitCode: (data: { student_id: string; problem_id: string; language: string; code: string }) =>
      fetchJson<{ submission: CodeSubmission; evaluation: any }>('/coding/submit', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    getSubmissions: (studentId: string, params?: { problem_id?: string; language?: string; status?: string }) => {
      const q = new URLSearchParams();
      if (params?.problem_id) q.set('problem_id', params.problem_id);
      if (params?.language) q.set('language', params.language);
      if (params?.status) q.set('status', params.status);
      const queryStr = q.toString() ? `?${q.toString()}` : '';
      return fetchJson<CodeSubmission[]>(`/coding/submissions/${studentId}${queryStr}`);
    },
    createProblem: (data: Partial<CodingProblem>) => fetchJson<CodingProblem>('/coding/problems', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  // Resume
  resume: {
    getTemplates: () =>
      fetchJson<Array<{ id: ResumeTemplateId; name: string; description: string; category: string; isPopular?: boolean }>>('/resume/templates'),
    listForStudent: (studentId: string) =>
      fetchJson<ResumeData[]>(`/resume/student/${studentId}/all`),
    getById: (resumeId: string) =>
      fetchJson<ResumeData>(`/resume/item/${resumeId}`),
    create: (data: { student_id: string; template_id?: ResumeTemplateId; title?: string; target_role?: string }) =>
      fetchJson<ResumeData>('/resume/create', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    get: (studentId: string) => fetchJson<ResumeData>(`/resume/${studentId}`),
    save: (resume: ResumeData) => fetchJson<{ message: string; resume: ResumeData }>('/resume', {
      method: 'POST',
      body: JSON.stringify(resume)
    }),
    saveVersion: (data: { student_id: string; version_name?: string; resume_data: ResumeData }) =>
      fetchJson<{ message: string; version: ResumeVersion }>('/resume/version', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    getVersions: (studentId: string) => fetchJson<ResumeVersion[]>(`/resume/versions/${studentId}`),
    restoreVersion: (student_id: string, version_id: string) =>
      fetchJson<{ message: string; resume: ResumeData }>('/resume/version/restore', {
        method: 'POST',
        body: JSON.stringify({ student_id, version_id })
      }),
    deleteVersion: (student_id: string, version_id: string) =>
      fetchJson<{ message: string; remaining_versions: ResumeVersion[] }>(`/resume/version/${student_id}/${version_id}`, {
        method: 'DELETE'
      }),
    generateSummary: (data: {
      fullName: string;
      targetRole: string;
      skills: string[];
      education?: string;
      projects?: string[];
      experience?: string[];
    }) =>
      fetchJson<{ original: string; suggested: string; explanation: string }>('/resume/ai/summary', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    improveProject: (data: {
      title: string;
      currentDescription: string;
      technologies: string[];
      contributions?: string[];
    }) =>
      fetchJson<{ improvedDescription: string; bullets: string[]; explanation: string; original?: string; suggested?: string }>('/resume/ai/improve-project', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    improveExperience: (data: {
      company: string;
      role: string;
      currentDescription?: string;
      currentBullets?: string[];
      responsibilities?: string[];
      achievements?: string[];
      technologies?: string[];
    }) =>
      fetchJson<{ improvedDescription: string; bullets: string[]; explanation: string; improvedBullets?: string[] }>('/resume/ai/improve-experience', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    analyzeJobMatch: (data: { job_description: string; resume_data?: ResumeData; resume?: ResumeData }) =>
      fetchJson<JobMatchAnalysis>('/resume/ai/analyze-job', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    getATSScore: (data: { resume: ResumeData; job_description?: string }) =>
      fetchJson<{
        overallScore: number;
        checks: Array<{ category: string; max: number; score: number; feedback: string }>;
        calculatedAt: string;
      }>('/resume/ai/ats-score', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    checkStructure: (data: { resume_data: ResumeData }) =>
      fetchJson<{ audit: Array<{ section: string; status: 'good' | 'warning' | 'tip'; message: string }> }>('/resume/ai/check-structure', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    suggestKeywords: (data: { target_role: string; job_description?: string; current_skills?: string[] }) =>
      fetchJson<{ suggestions: Array<{ keyword: string; category: string; reason: string }> }>('/resume/ai/suggest-keywords', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    generateBullets: (data: { title: string; technologies: string[]; description?: string }) =>
      fetchJson<{ bullets: string[] }>('/resume/ai/bullets', {
        method: 'POST',
        body: JSON.stringify(data)
      })
  },

  // ATS Analyzer
  ats: {
    analyze: (formData: FormData) => fetchJson<ATSAnalysisResult>('/ats/analyze', {
      method: 'POST',
      body: formData
    }),
    analyzeText: (data: { resume_text: string; job_description: string; target_role: string; student_id: string }) =>
      fetchJson<ATSAnalysisResult>('/ats/analyze', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    getHistory: (studentId: string) => fetchJson<ATSAnalysisResult[]>(`/ats/history/${studentId}`)
  },

  // Skill Gap Analysis
  skillGap: {
    get: (studentId: string, targetRole?: string) =>
      fetchJson<SkillGapData>(`/skill-gap/${studentId}${targetRole ? `?targetRole=${encodeURIComponent(targetRole)}` : ''}`)
  },

  // Roadmap
  roadmap: {
    get: (studentId: string) => fetchJson<StudentRoadmap>(`/roadmap/${studentId}`),
    generate: (studentId: string, targetRole: string) =>
      fetchJson<StudentRoadmap>(`/roadmap/${studentId}/generate`, {
        method: 'POST',
        body: JSON.stringify({ targetRole })
      }),
    toggleItem: (studentId: string, itemId: string) =>
      fetchJson<StudentRoadmap>(`/roadmap/${studentId}/item/${itemId}`, {
        method: 'PATCH'
      })
  },

  // Interview Prep
  interview: {
    start: (student_id: string, target_role?: string, domain?: string) =>
      fetchJson<InterviewSession>('/interview/start', {
        method: 'POST',
        body: JSON.stringify({ student_id, target_role, domain })
      }),
    evaluate: (sessionId: string, questionId: string, userAnswer: string) =>
      fetchJson<{ question: any; session: InterviewSession }>(`/interview/${sessionId}/evaluate`, {
        method: 'POST',
        body: JSON.stringify({ questionId, userAnswer })
      }),
    get: (sessionId: string) => fetchJson<InterviewSession>(`/interview/${sessionId}`),
    getHistory: (studentId: string) => fetchJson<InterviewSession[]>(`/interview/history/${studentId}`)
  },

  // Placement Drives
  placements: {
    list: () => fetchJson<PlacementDrive[]>('/placements'),
    apply: (driveId: string, student_id: string) =>
      fetchJson<{ message: string; application: PlacementApplication }>(`/placements/${driveId}/apply`, {
        method: 'POST',
        body: JSON.stringify({ student_id })
      }),
    getApplications: (studentId: string) => fetchJson<PlacementApplication[]>(`/placements/applications/${studentId}`),
    create: (data: Partial<PlacementDrive>) => fetchJson<PlacementDrive>('/placements', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  // Bulk Email
  bulkEmail: {
    getTemplates: () => fetchJson<Record<string, { subject: string; body: string }>>('/bulk-email/templates'),
    parseCsv: (file: File) => {
      const fd = new FormData();
      fd.append('file', file);
      return fetchJson<{ total_parsed: number; headers: string[]; recipients: any[] }>('/bulk-email/parse-csv', {
        method: 'POST',
        body: fd
      });
    },
    preview: (data: { template_key: string; variables?: any; custom_subject?: string; custom_body?: string }) =>
      fetchJson<{ subject: string; body: string }>('/bulk-email/preview', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    send: (data: { admin_id?: string; template_name: string; subject: string; recipients: any[] }) =>
      fetchJson<{ message: string; log: BulkEmailLog }>('/bulk-email/send', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    getLogs: () => fetchJson<BulkEmailLog[]>('/bulk-email/logs')
  },

  // Admin
  admin: {
    getAnalytics: () => fetchJson<{
      metrics: {
        total_students: number;
        active_assessments: number;
        total_assessment_submissions: number;
        assessment_pass_rate: number;
        coding_problems_count: number;
        total_code_submissions: number;
        coding_acceptance_rate: number;
        active_drives: number;
        total_applications: number;
      };
      recent_submissions: AssessmentSubmission[];
      recent_code_submissions: CodeSubmission[];
      recent_applications: PlacementApplication[];
    }>('/admin/analytics'),
    getStudents: () => fetchJson<any[]>('/admin/students')
  },

  // Company Interview Prep
  companies: {
    list: (params?: { category?: string; search?: string }) => {
      const q = new URLSearchParams();
      if (params?.category) q.set('category', params.category);
      if (params?.search) q.set('search', params.search);
      const qs = q.toString() ? `?${q.toString()}` : '';
      return fetchJson<any[]>(`/companies${qs}`);
    },
    getById: (companyId: string) => fetchJson<any>(`/companies/${companyId}`),
    getTheory: (companyId: string, topic?: string) => {
      const qs = topic ? `?topic=${encodeURIComponent(topic)}` : '';
      return fetchJson<{ questions: any[]; available_topics: string[] }>(`/companies/${companyId}/theory${qs}`);
    },
    evaluateTheory: (companyId: string, questionId: string, userAnswer: string, studentId: string) =>
      fetchJson<{ feedback: any; question_id: string; expected_concepts: string[] }>(
        `/companies/${companyId}/theory/${questionId}/evaluate`,
        { method: 'POST', body: JSON.stringify({ userAnswer, student_id: studentId }) }
      ),
    getAptitude: (companyId: string, category?: string) => {
      const qs = category ? `?category=${encodeURIComponent(category)}` : '';
      return fetchJson<{ questions: any[] }>(`/companies/${companyId}/aptitude${qs}`);
    },
    submitAptitude: (companyId: string, answers: Record<string, string>) =>
      fetchJson<{ score: number; correct: number; total: number; results: any[] }>(
        `/companies/${companyId}/aptitude/submit`,
        { method: 'POST', body: JSON.stringify({ answers }) }
      ),
    getHR: (companyId: string) => fetchJson<{ questions: any[]; company: any }>(`/companies/${companyId}/hr`),
    evaluateHR: (companyId: string, questionId: string, userAnswer: string) =>
      fetchJson<{ feedback: any; tips: string[] }>(
        `/companies/${companyId}/hr/${questionId}/evaluate`,
        { method: 'POST', body: JSON.stringify({ userAnswer }) }
      ),
    getCoding: (companyId: string) => fetchJson<{ problems: any[]; company: any }>(`/companies/${companyId}/coding`),
    getProgress: (companyId: string, studentId: string) =>
      fetchJson<any>(`/companies/${companyId}/progress/${studentId}`)
  },

  // Courses & Learning System
  courses: {
    list: (params?: { category?: string; level?: string; search?: string; include_drafts?: boolean }) => {
      const q = new URLSearchParams();
      if (params?.category) q.set('category', params.category);
      if (params?.level) q.set('level', params.level);
      if (params?.search) q.set('search', params.search);
      if (params?.include_drafts) q.set('include_drafts', 'true');
      const qs = q.toString() ? `?${q.toString()}` : '';
      return fetchJson<Course[]>(`/courses${qs}`);
    },
    getById: (courseId: string) => fetchJson<Course>(`/courses/${courseId}`),
    enroll: (courseId: string, studentId: string) =>
      fetchJson<{ message: string; enrollment: CourseEnrollment; course: Course }>(
        `/courses/${courseId}/enroll`,
        { method: 'POST', body: JSON.stringify({ student_id: studentId }) }
      ),
    getProgress: (courseId: string, studentId: string) =>
      fetchJson<{ enrolled: boolean; completed_lessons: string[]; progress_percentage: number }>(
        `/courses/${courseId}/progress/${studentId}`
      ),
    completeLesson: (courseId: string, lessonId: string, studentId: string) =>
      fetchJson<{ message: string; enrollment: CourseEnrollment }>(
        `/courses/${courseId}/lessons/${lessonId}/complete`,
        { method: 'POST', body: JSON.stringify({ student_id: studentId }) }
      ),
    getEnrolled: (studentId: string) =>
      fetchJson<Array<{ enrollment: CourseEnrollment; course: Course }>>(`/courses/student/${studentId}/enrolled`),
    // Admin Course Management
    create: (courseData: Partial<Course>) =>
      fetchJson<Course>('/courses', { method: 'POST', body: JSON.stringify(courseData) }),
    update: (courseId: string, courseData: Partial<Course>) =>
      fetchJson<Course>(`/courses/${courseId}`, { method: 'PUT', body: JSON.stringify(courseData) }),
    togglePublish: (courseId: string) =>
      fetchJson<{ is_published: boolean; course: Course }>(`/courses/${courseId}/publish`, { method: 'PATCH' }),
    delete: (courseId: string) =>
      fetchJson<{ message: string }>(`/courses/${courseId}`, { method: 'DELETE' }),
    getStats: () =>
      fetchJson<{
        total_courses: number;
        published_courses: number;
        draft_courses: number;
        total_enrollments: number;
        total_completed: number;
        completion_rate: number;
      }>('/courses/admin/stats')
  }
};
