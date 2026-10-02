import {
  UserProfile,
  Assessment,
  Question,
  AssessmentSubmission,
  CodingProblem,
  CodeSubmission,
  ResumeData,
  ATSAnalysisResult,
  SkillGapData,
  StudentRoadmap,
  InterviewSession,
  PlacementDrive,
  PlacementApplication,
  BulkEmailLog
} from '../types';

const BASE_URL = '/api';

async function fetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers
  });

  if (!res.ok) {
    let errMessage = 'Request failed';
    try {
      const err = await res.json();
      errMessage = err.error || err.message || errMessage;
    } catch {
      errMessage = await res.text();
    }
    throw new Error(errMessage);
  }

  return res.json();
}

export const api = {
  // Auth
  auth: {
    login: (email: string) => fetchJson<{ token: string; user: UserProfile }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email })
    }),
    register: (data: Partial<UserProfile>) => fetchJson<{ token: string; user: UserProfile }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    getProfile: (id: string) => fetchJson<UserProfile>(`/auth/profile/${id}`),
    updateProfile: (id: string, data: Partial<UserProfile>) => fetchJson<UserProfile>(`/auth/profile/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },

  // Assessments
  assessments: {
    list: () => fetchJson<Assessment[]>('/assessments'),
    get: (id: string) => fetchJson<{ assessment: Assessment; questions: Question[] }>(`/assessments/${id}`),
    submit: (id: string, data: { student_id: string; answers: any; is_final_submit?: boolean }) =>
      fetchJson<{ message: string; submission: AssessmentSubmission }>(`/assessments/${id}/submit`, {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    getResult: (id: string, studentId: string) =>
      fetchJson<{ submission: AssessmentSubmission; questions: Question[] }>(`/assessments/${id}/result/${studentId}`),
    create: (data: Partial<Assessment>) => fetchJson<Assessment>('/assessments', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    addQuestion: (assessmentId: string, question: Partial<Question>) =>
      fetchJson<Question>(`/assessments/${assessmentId}/questions`, {
        method: 'POST',
        body: JSON.stringify(question)
      })
  },

  // Coding Practice
  coding: {
    listProblems: () => fetchJson<CodingProblem[]>('/coding/problems'),
    getProblem: (idOrSlug: string) => fetchJson<CodingProblem>(`/coding/problems/${idOrSlug}`),
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
    getSubmissions: (studentId: string) => fetchJson<CodeSubmission[]>(`/coding/submissions/${studentId}`),
    createProblem: (data: Partial<CodingProblem>) => fetchJson<CodingProblem>('/coding/problems', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  // Resume
  resume: {
    get: (studentId: string) => fetchJson<ResumeData>(`/resume/${studentId}`),
    save: (resume: ResumeData) => fetchJson<{ message: string; resume: ResumeData }>('/resume', {
      method: 'POST',
      body: JSON.stringify(resume)
    }),
    generateSummary: (data: { fullName: string; targetRole: string; skills: string[]; education?: string }) =>
      fetchJson<{ summary: string }>('/resume/ai/summary', {
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
  }
};
