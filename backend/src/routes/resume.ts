import { Router, Request, Response } from 'express';
import { memoryStore, persistStore } from '../services/db';
import { generateResumeSummary, generateProjectBulletPoints } from '../services/ai';
import { ResumeData } from '../types';

const router = Router();

// Get resume for student
router.get('/:studentId', (req: Request, res: Response) => {
  const studentId = String(req.params.studentId);
  const resume = memoryStore.resumes.find(r => r.student_id === studentId);
  if (!resume) {
    const student = memoryStore.profiles.find(p => p.id === studentId);
    const initialResume: ResumeData = {
      id: `resume-${studentId}`,
      student_id: studentId,
      title: `${student?.target_role || 'Software Engineering'} Resume`,
      personal_info: {
        full_name: student?.full_name || '',
        email: student?.email || '',
        phone: student?.phone || '',
        location: '',
        linkedin_url: student?.linkedin_url || '',
        github_url: student?.github_url || ''
      },
      target_role: student?.target_role || 'Software Engineer',
      summary: student?.bio || '',
      education: student?.college ? [
        {
          id: 'edu-1',
          institution: student.college,
          degree: student.degree || 'B.Tech',
          field: student.branch || 'Computer Science',
          start_date: '',
          end_date: student.graduation_year ? String(student.graduation_year) : '',
          score: student.cgpa ? `${student.cgpa} CGPA` : '',
          highlights: []
        }
      ] : [],
      experience: [],
      projects: [],
      skills: {
        languages: student?.skills || [],
        frameworks: [],
        tools_databases: [],
        core_concepts: []
      },
      certifications: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    memoryStore.resumes.push(initialResume);
    persistStore();
    return res.json(initialResume);
  }
  return res.json(resume);
});

// Save / Update resume
router.post('/', (req: Request, res: Response) => {
  const resumeData: ResumeData = req.body;
  if (!resumeData.student_id) {
    return res.status(400).json({ error: 'student_id is required' });
  }

  const existingIdx = memoryStore.resumes.findIndex(r => r.student_id === resumeData.student_id);
  resumeData.updated_at = new Date().toISOString();

  if (existingIdx >= 0) {
    memoryStore.resumes[existingIdx] = resumeData;
  } else {
    memoryStore.resumes.push(resumeData);
  }

  persistStore();

  return res.json({ message: 'Resume saved successfully', resume: resumeData });
});

// AI Generate Summary (Qwen3-8B)
router.post('/ai/summary', async (req: Request, res: Response) => {
  const { fullName, targetRole, skills, education } = req.body;
  const summary = await generateResumeSummary({
    fullName: fullName || 'Candidate',
    targetRole: targetRole || 'Software Engineer',
    skills: skills || ['Java', 'React', 'Problem Solving'],
    education
  });
  return res.json({ summary });
});

// AI Generate Project Bullet Points (Qwen3-8B)
router.post('/ai/bullets', async (req: Request, res: Response) => {
  const { title, technologies, description } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Project title is required' });
  }

  const bullets = await generateProjectBulletPoints({
    title,
    technologies: technologies || ['JavaScript', 'API'],
    description
  });

  return res.json({ bullets });
});

export default router;
