import { Router, Request, Response } from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import { analyzeResumeATS } from '../services/ats';
import { memoryStore } from '../services/db';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// Analyze Resume vs Job Description
router.post('/analyze', upload.single('resume_file'), async (req: Request, res: Response) => {
  try {
    let resumeText = (req.body.resume_text || '').trim();
    const jobDescription = (req.body.job_description || '').trim();
    const targetRole = req.body.target_role || 'Software Engineer';
    const studentId = req.body.student_id || 'demo-student-id';

    // If PDF uploaded, extract text
    if (req.file) {
      if (req.file.mimetype === 'application/pdf') {
        const parsed = await pdfParse(req.file.buffer);
        resumeText = parsed.text || '';
      } else {
        // Plain text file
        resumeText = req.file.buffer.toString('utf-8');
      }
    }

    if (!resumeText) {
      return res.status(400).json({ error: 'Please provide resume text or upload a resume file.' });
    }

    if (!jobDescription) {
      return res.status(400).json({ error: 'Please provide the Job Description to benchmark against.' });
    }

    const analysis = analyzeResumeATS(resumeText, jobDescription, targetRole, studentId);
    analysis.id = `ats-${Date.now()}`;

    // Store in memory
    memoryStore.ats_analyses.unshift(analysis);

    return res.json(analysis);
  } catch (err: any) {
    console.error('ATS Analysis Error:', err);
    return res.status(500).json({ error: 'Failed to parse resume: ' + err.message });
  }
});

// Get past ATS analyses for student
router.get('/history/:studentId', (req: Request, res: Response) => {
  const history = memoryStore.ats_analyses.filter(a => a.student_id === req.params.studentId);
  return res.json(history);
});

export default router;
