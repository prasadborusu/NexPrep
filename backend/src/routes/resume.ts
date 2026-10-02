import { Router, Request, Response } from 'express';
import { memoryStore } from '../services/db';
import { generateResumeSummary, generateProjectBulletPoints } from '../services/ai';
import { ResumeData } from '../types';

const router = Router();

// Get resume for student
router.get('/:studentId', (req: Request, res: Response) => {
  const resume = memoryStore.resumes.find(r => r.student_id === req.params.studentId);
  if (!resume) {
    // Generate default structured starter resume
    const student = memoryStore.profiles.find(p => p.id === req.params.studentId) || memoryStore.profiles[0];
    const initialResume: ResumeData = {
      id: `resume-${student.id}`,
      student_id: student.id,
      title: 'Software Engineering Resume',
      personal_info: {
        full_name: student.full_name || 'Alex Johnson',
        email: student.email || 'alex.johnson@example.com',
        phone: student.phone || '+91 98765 43210',
        location: 'Bengaluru, India',
        linkedin_url: student.linkedin_url || 'https://linkedin.com/in/alexjohnson',
        github_url: student.github_url || 'https://github.com/alexjohnson'
      },
      target_role: student.target_role || 'Full Stack Engineer',
      summary: 'Passionate and detail-oriented Full Stack Software Engineer with deep expertise in modern web architectures, algorithm design, and microservices. Experienced in engineering low-latency REST APIs, reactive state management, and high-performance relational databases.',
      education: [
        {
          id: 'edu-1',
          institution: student.college || 'National Institute of Technology',
          degree: student.degree || 'B.Tech',
          field: student.branch || 'Computer Science & Engineering',
          start_date: '2022',
          end_date: '2026',
          score: `${student.cgpa || 8.75} CGPA`,
          highlights: ['Dean’s Merit List', 'Specialized in Distributed Computing and Database Systems']
        }
      ],
      experience: [
        {
          id: 'exp-1',
          company: 'TechNovation Labs',
          role: 'Software Development Engineering Intern',
          location: 'Remote',
          start_date: 'May 2024',
          end_date: 'July 2024',
          is_current: false,
          bullets: [
            'Architected asynchronous messaging worker queue using Redis and Node.js, reducing background notification latency by 45%.',
            'Implemented comprehensive unit and integration test coverage using Jest, increasing test coverage from 62% to 91%.',
            'Collaborated with senior product engineers in two-week agile sprint cycles to deploy containerized microservices to cloud staging.'
          ]
        }
      ],
      projects: [
        {
          id: 'proj-1',
          title: 'NexPrep Collaborative Assessment Platform',
          technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'TailwindCSS'],
          link: 'https://github.com/alexjohnson/nexprep',
          bullets: [
            'Engineered full-stack career preparation portal featuring real-time code compilation across 4 programming languages via sandboxed API.',
            'Implemented deterministic keyword-matching ATS analyzer evaluating candidate resumes against live job descriptions.',
            'Structured database schema with Row Level Security (RLS) in PostgreSQL, safeguarding student submissions and sensitive evaluation metrics.'
          ]
        },
        {
          id: 'proj-2',
          title: 'Distributed Distributed KV Store with Raft Consensus',
          technologies: ['Java', 'gRPC', 'Concurrency', 'Docker'],
          link: 'https://github.com/alexjohnson/raft-kv',
          bullets: [
            'Implemented leader election and log replication algorithms following Raft consensus specification, withstanding up to 2 simultaneous node crashes.',
            'Benchmarked client read throughput under concurrent threads, achieving 12,000+ queries per second with sub-5ms roundtrip latency.'
          ]
        }
      ],
      skills: {
        languages: ['Java', 'Python', 'TypeScript', 'JavaScript', 'SQL', 'C++'],
        frameworks: ['React', 'Node.js', 'Express', 'Spring Boot', 'TailwindCSS'],
        tools_databases: ['PostgreSQL', 'Redis', 'Docker', 'Git', 'Linux', 'AWS'],
        core_concepts: ['Data Structures & Algorithms', 'System Design', 'OOP', 'RESTful APIs', 'CI/CD']
      },
      certifications: [
        {
          id: 'cert-1',
          name: 'AWS Certified Cloud Practitioner',
          issuer: 'Amazon Web Services',
          issue_date: '2024',
          url: 'https://aws.amazon.com/certification/'
        }
      ],
      updated_at: new Date().toISOString()
    };

    memoryStore.resumes.push(initialResume);
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
