import { Router, Request, Response } from 'express';
import { memoryStore, persistStore } from '../services/db';
import {
  generateResumeSummary,
  improveProjectDescription,
  improveExperienceDescription,
  analyzeJobDescriptionMatch,
  checkResumeStructure,
  suggestKeywords
} from '../services/ai';
import { ResumeData, ResumeVersion } from '../types';

const router = Router();

// GET active resume for student
router.get('/:studentId', (req: Request, res: Response) => {
  const studentId = String(req.params.studentId);
  const resume = memoryStore.resumes.find(r => r.student_id === studentId);

  if (!resume) {
    const student = memoryStore.profiles.find(p => p.id === studentId);
    const initialResume: ResumeData = {
      id: `resume-${studentId}`,
      student_id: studentId,
      title: `${student?.target_role || 'Software Engineering'} Resume`,
      template: 'minimal',
      personal_info: {
        full_name: student?.full_name || '',
        email: student?.email || '',
        phone: student?.phone || '',
        location: '',
        linkedin_url: student?.linkedin_url || '',
        github_url: student?.github_url || '',
        portfolio_url: ''
      },
      target_role: student?.target_role || 'Software Engineer',
      target_industry: 'Technology',
      job_description: '',
      summary: student?.bio || '',
      education: student?.college ? [
        {
          id: `edu-${Date.now()}`,
          institution: student.college,
          degree: student.degree || 'B.Tech',
          field: student.branch || 'Computer Science',
          start_year: '',
          end_year: student.graduation_year ? String(student.graduation_year) : '',
          score: student.cgpa !== undefined && student.cgpa !== null ? `${student.cgpa} CGPA` : '',
          location: ''
        }
      ] : [],
      experience: [],
      projects: [],
      skills: {
        languages: student?.skills || [],
        frameworks: [],
        libraries: [],
        databases: [],
        tools: [],
        cloud: [],
        other: []
      },
      certifications: [],
      achievements: [],
      links: [],
      versions: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    memoryStore.resumes.push(initialResume);
    persistStore();
    return res.json(initialResume);
  }

  // Ensure all new schema fields exist safely
  if (!resume.skills.libraries) resume.skills.libraries = [];
  if (!resume.skills.databases) resume.skills.databases = [];
  if (!resume.skills.tools) resume.skills.tools = [];
  if (!resume.skills.cloud) resume.skills.cloud = [];
  if (!resume.skills.other) resume.skills.other = [];
  if (!resume.achievements) resume.achievements = [];
  if (!resume.links) resume.links = [];
  if (!resume.versions) resume.versions = [];
  if (!resume.template) resume.template = 'minimal';

  return res.json(resume);
});

// SAVE / UPDATE Draft
router.post('/', (req: Request, res: Response) => {
  const resumeData: ResumeData = req.body;
  if (!resumeData.student_id) {
    return res.status(400).json({ error: 'student_id is required' });
  }

  const existingIdx = memoryStore.resumes.findIndex(r => r.student_id === resumeData.student_id);
  resumeData.updated_at = new Date().toISOString();

  if (existingIdx >= 0) {
    // preserve existing versions if not passed
    if (!resumeData.versions && memoryStore.resumes[existingIdx].versions) {
      resumeData.versions = memoryStore.resumes[existingIdx].versions;
    }
    memoryStore.resumes[existingIdx] = resumeData;
  } else {
    memoryStore.resumes.push(resumeData);
  }

  persistStore();
  return res.json({ message: 'Draft saved successfully', resume: resumeData });
});

// SAVE A NAMED VERSION SNAPSHOT
router.post('/version', (req: Request, res: Response) => {
  const { student_id, version_name, resume_data } = req.body;
  if (!student_id || !resume_data) {
    return res.status(400).json({ error: 'student_id and resume_data are required' });
  }

  const resume = memoryStore.resumes.find(r => r.student_id === student_id);
  if (!resume) {
    return res.status(404).json({ error: 'Resume not found' });
  }

  if (!resume.versions) resume.versions = [];

  const newVersion: ResumeVersion = {
    id: `ver-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: version_name?.trim() || `Version ${resume.versions.length + 1} (${resume_data.target_role || 'Target Role'})`,
    created_at: new Date().toISOString(),
    target_role: resume_data.target_role || resume.target_role,
    template: resume_data.template || resume.template || 'minimal',
    data: JSON.parse(JSON.stringify(resume_data))
  };

  resume.versions.unshift(newVersion);
  persistStore();

  return res.status(201).json({ message: 'Version created', version: newVersion });
});

// GET VERSIONS
router.get('/versions/:studentId', (req: Request, res: Response) => {
  const studentId = String(req.params.studentId);
  const resume = memoryStore.resumes.find(r => r.student_id === studentId);
  return res.json(resume?.versions || []);
});

// RESTORE VERSION
router.post('/version/restore', (req: Request, res: Response) => {
  const { student_id, version_id } = req.body;
  const resumeIdx = memoryStore.resumes.findIndex(r => r.student_id === student_id);

  if (resumeIdx === -1) {
    return res.status(404).json({ error: 'Resume not found' });
  }

  const resume = memoryStore.resumes[resumeIdx];
  const version = resume.versions?.find(v => v.id === version_id);

  if (!version) {
    return res.status(404).json({ error: 'Version not found' });
  }

  const restoredData: ResumeData = {
    ...version.data,
    student_id,
    versions: resume.versions, // preserve versions list
    updated_at: new Date().toISOString()
  };

  memoryStore.resumes[resumeIdx] = restoredData;
  persistStore();

  return res.json({ message: 'Version restored successfully', resume: restoredData });
});

// DELETE VERSION
router.delete('/version/:studentId/:versionId', (req: Request, res: Response) => {
  const studentId = String(req.params.studentId);
  const versionId = String(req.params.versionId);
  const resume = memoryStore.resumes.find(r => r.student_id === studentId);

  if (!resume || !resume.versions) {
    return res.status(404).json({ error: 'Version not found' });
  }

  resume.versions = resume.versions.filter(v => v.id !== versionId);
  persistStore();

  return res.json({ message: 'Version deleted', remaining_versions: resume.versions });
});

// AI Generate / Regenerate Summary
router.post('/ai/summary', async (req: Request, res: Response) => {
  const { fullName, targetRole, skills, education, projects, experience } = req.body;
  const summary = await generateResumeSummary({
    fullName: fullName || '',
    targetRole: targetRole || 'Software Engineer',
    skills: Array.isArray(skills) ? skills : [],
    education,
    projects: Array.isArray(projects) ? projects : [],
    experience: Array.isArray(experience) ? experience : []
  });

  return res.json({ summary });
});

// AI Improve Project Description
router.post('/ai/improve-project', async (req: Request, res: Response) => {
  const { title, currentDescription, technologies, contributions } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Project title is required' });
  }

  const result = await improveProjectDescription({
    title,
    currentDescription: currentDescription || '',
    technologies: Array.isArray(technologies) ? technologies : [],
    contributions: Array.isArray(contributions) ? contributions : []
  });

  return res.json(result);
});

// AI Improve Experience Description
router.post('/ai/improve-experience', async (req: Request, res: Response) => {
  const { company, role, currentDescription, responsibilities, achievements } = req.body;
  if (!company || !role) {
    return res.status(400).json({ error: 'Company and Role are required' });
  }

  const result = await improveExperienceDescription({
    company,
    role,
    currentDescription: currentDescription || '',
    responsibilities: Array.isArray(responsibilities) ? responsibilities : [],
    achievements: Array.isArray(achievements) ? achievements : []
  });

  return res.json(result);
});

// AI Analyze Job Description Match (No fake ATS score)
router.post('/ai/analyze-job', (req: Request, res: Response) => {
  const { job_description, resume_data } = req.body;
  if (!job_description) {
    return res.status(400).json({ error: 'Job description is required' });
  }

  const analysis = analyzeJobDescriptionMatch(job_description, resume_data || {});
  return res.json(analysis);
});

// AI Check Resume Structure
router.post('/ai/check-structure', (req: Request, res: Response) => {
  const { resume_data } = req.body;
  const audit = checkResumeStructure(resume_data || {});
  return res.json({ audit });
});

// AI Suggest Keywords
router.post('/ai/suggest-keywords', (req: Request, res: Response) => {
  const { target_role, job_description, current_skills } = req.body;
  const suggestions = suggestKeywords(
    target_role || 'Software Engineer',
    job_description,
    Array.isArray(current_skills) ? current_skills : []
  );
  return res.json({ suggestions });
});

export default router;
