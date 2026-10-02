import { Router, Request, Response } from 'express';
import { memoryStore, persistStore } from '../services/db';
import { aiService } from '../services/ai';
import { ResumeData, ResumeTemplateId, ResumeVersion } from '../types';

const router = Router();

// 1. GET ALL 5 RESUME TEMPLATES
router.get('/templates', (req: Request, res: Response) => {
  const templates = [
    {
      id: 'minimal' as ResumeTemplateId,
      name: 'Minimal',
      description: 'Streamlined single-column layout prioritizing clean typography and high-density ATS readability.',
      category: 'ATS Optimized',
      isPopular: true
    },
    {
      id: 'modern' as ResumeTemplateId,
      name: 'Modern',
      description: 'Contemporary design featuring elegant section badges, structured column flow, and polished hierarchy.',
      category: 'Creative Tech',
      isPopular: true
    },
    {
      id: 'classic' as ResumeTemplateId,
      name: 'Classic',
      description: 'Traditional academic styling with formal serif typography, centered header, and standardized rules.',
      category: 'Traditional',
      isPopular: false
    },
    {
      id: 'technical' as ResumeTemplateId,
      name: 'Technical',
      description: 'Tailored for software engineers: highlighted GitHub/LeetCode links, stack matrices, and architecture bullets.',
      category: 'Software Engineering',
      isPopular: true
    },
    {
      id: 'executive' as ResumeTemplateId,
      name: 'Executive',
      description: 'Distinguished executive layout emphasizing core leadership, team impact, and end-to-end project ownership.',
      category: 'Leadership & Product',
      isPopular: false
    }
  ];

  return res.json(templates);
});

// 2. GET ALL RESUMES FOR STUDENT ("My Resumes" list)
router.get('/student/:studentId/all', (req: Request, res: Response) => {
  const studentId = String(req.params.studentId);
  const resumes = memoryStore.resumes.filter(r => r.student_id === studentId);
  return res.json(resumes);
});

// 3. GET SINGLE RESUME BY ID
router.get('/item/:resumeId', (req: Request, res: Response) => {
  const { resumeId } = req.params;
  const resume = memoryStore.resumes.find(r => r.id === resumeId);
  if (!resume) {
    return res.status(404).json({ error: 'Resume not found' });
  }
  return res.json(resume);
});

// 4. GET OR INITIALIZE DEFAULT RESUME FOR STUDENT
router.get('/:studentId', (req: Request, res: Response) => {
  const studentId = String(req.params.studentId);
  let resume = memoryStore.resumes.find(r => r.student_id === studentId);

  if (!resume) {
    const student = memoryStore.profiles.find(p => p.id === studentId);
    resume = {
      id: `resume-${studentId}-${Date.now().toString(36)}`,
      student_id: studentId,
      title: `${student?.target_role || 'Software Engineering'} Resume`,
      template: 'modern',
      template_id: 'modern',
      section_order: [
        'personal_info',
        'summary',
        'skills',
        'projects',
        'experience',
        'education',
        'certifications',
        'achievements',
        'responsibilities',
        'links',
        'languages'
      ],
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
      responsibilities: [],
      languages: [],
      links: [],
      versions: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    memoryStore.resumes.push(resume);
    persistStore();
  }

  // Ensure safe default schema
  if (!resume.template) resume.template = 'modern';
  if (!resume.template_id) resume.template_id = resume.template;
  if (!resume.section_order) {
    resume.section_order = [
      'personal_info',
      'summary',
      'skills',
      'projects',
      'experience',
      'education',
      'certifications',
      'achievements',
      'responsibilities',
      'links',
      'languages'
    ];
  }
  if (!resume.responsibilities) resume.responsibilities = [];
  if (!resume.languages) resume.languages = [];

  return res.json(resume);
});

// 5. CREATE NEW RESUME WITH SELECTED TEMPLATE
router.post('/create', (req: Request, res: Response) => {
  const { student_id, template_id = 'modern', title, target_role } = req.body;
  if (!student_id) {
    return res.status(400).json({ error: 'student_id is required' });
  }

  const student = memoryStore.profiles.find(p => p.id === student_id);
  const newResume: ResumeData = {
    id: `resume-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    student_id,
    title: title || `${target_role || student?.target_role || 'Engineering'} Resume`,
    template: template_id,
    template_id,
    section_order: [
      'personal_info',
      'summary',
      'skills',
      'projects',
      'experience',
      'education',
      'certifications',
      'achievements',
      'responsibilities',
      'links',
      'languages'
    ],
    personal_info: {
      full_name: student?.full_name || '',
      email: student?.email || '',
      phone: student?.phone || '',
      location: '',
      linkedin_url: student?.linkedin_url || '',
      github_url: student?.github_url || '',
      portfolio_url: ''
    },
    target_role: target_role || student?.target_role || 'Software Engineer',
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
    responsibilities: [],
    languages: [],
    links: [],
    versions: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  memoryStore.resumes.push(newResume);
  persistStore();

  return res.status(201).json(newResume);
});

// 6. SAVE / UPDATE RESUME
router.post('/', (req: Request, res: Response) => {
  const resumeData: ResumeData = req.body;
  if (!resumeData.student_id) {
    return res.status(400).json({ error: 'student_id is required' });
  }

  resumeData.updated_at = new Date().toISOString();

  // Match by id or by student_id
  let existingIdx = -1;
  if (resumeData.id) {
    existingIdx = memoryStore.resumes.findIndex(r => r.id === resumeData.id);
  }
  if (existingIdx === -1) {
    existingIdx = memoryStore.resumes.findIndex(r => r.student_id === resumeData.student_id);
  }

  if (existingIdx >= 0) {
    if (!resumeData.versions && memoryStore.resumes[existingIdx].versions) {
      resumeData.versions = memoryStore.resumes[existingIdx].versions;
    }
    memoryStore.resumes[existingIdx] = resumeData;
  } else {
    if (!resumeData.id) {
      resumeData.id = `resume-${Date.now().toString(36)}`;
    }
    memoryStore.resumes.push(resumeData);
  }

  persistStore();
  return res.json({ message: 'Resume saved successfully', resume: resumeData });
});

// 7. SAVE A VERSION SNAPSHOT
router.post('/version', (req: Request, res: Response) => {
  const { student_id, version_name, resume_data } = req.body;
  if (!student_id || !resume_data) {
    return res.status(400).json({ error: 'student_id and resume_data are required' });
  }

  const resume = memoryStore.resumes.find(r => r.id === resume_data.id || r.student_id === student_id);
  if (!resume) {
    return res.status(404).json({ error: 'Resume not found' });
  }

  const version: ResumeVersion = {
    id: `ver-${Date.now().toString(36)}`,
    name: version_name || `Version ${new Date().toLocaleDateString()}`,
    created_at: new Date().toISOString(),
    target_role: resume_data.target_role || resume.target_role,
    template: resume_data.template || resume.template || 'modern',
    data: JSON.parse(JSON.stringify(resume_data))
  };

  if (!resume.versions) resume.versions = [];
  resume.versions.unshift(version);
  persistStore();

  return res.json({ message: 'Version saved successfully', version });
});

// 8. AI: PROFESSIONAL SUMMARY GENERATOR (Qwen3.5-9B)
router.post('/ai/summary', async (req: Request, res: Response) => {
  try {
    const { fullName, targetRole, skills, education, projects, experience } = req.body;
    const result = await aiService.generateSummary({
      fullName: fullName || '',
      targetRole: targetRole || 'Software Engineer',
      skills: Array.isArray(skills) ? skills : [],
      education,
      projects,
      experience
    });
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to generate summary' });
  }
});

// 9. AI: IMPROVE PROJECT DESCRIPTION
router.post('/ai/improve-project', async (req: Request, res: Response) => {
  try {
    const { title, currentDescription, technologies, contributions } = req.body;
    if (!title || !currentDescription) {
      return res.status(400).json({ error: 'Project title and current description are required' });
    }
    const result = await aiService.improveProject({
      title,
      currentDescription,
      technologies: Array.isArray(technologies) ? technologies : [],
      contributions
    });
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to improve project' });
  }
});

// 10. AI: IMPROVE EXPERIENCE BULLETS
router.post('/ai/improve-experience', async (req: Request, res: Response) => {
  try {
    const { role, company, currentBullets, technologies } = req.body;
    if (!role || !company || !Array.isArray(currentBullets)) {
      return res.status(400).json({ error: 'Role, company, and currentBullets array are required' });
    }
    const result = await aiService.improveExperience({
      role,
      company,
      currentBullets,
      technologies
    });
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to improve experience' });
  }
});

// 11. AI: TARGET JOB DESCRIPTION ANALYSIS (Matched vs Missing vs Needs Review)
router.post('/ai/analyze-job', (req: Request, res: Response) => {
  const { resume, job_description } = req.body;
  if (!resume || !job_description) {
    return res.status(400).json({ error: 'Resume data and job_description are required' });
  }

  const analysis = aiService.analyzeJobMatch(resume, job_description);
  return res.json(analysis);
});

// 12. ATS: DETERMINISTIC ATS SCORING
router.post('/ai/ats-score', (req: Request, res: Response) => {
  const { resume, job_description } = req.body;
  if (!resume) {
    return res.status(400).json({ error: 'Resume data is required' });
  }

  const result = aiService.calculateDeterministicATS(resume, job_description);
  return res.json(result);
});

export default router;
