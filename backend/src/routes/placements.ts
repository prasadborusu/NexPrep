import { Router, Request, Response } from 'express';
import { memoryStore } from '../services/db';
import { PlacementDrive, PlacementApplication } from '../types';

const router = Router();

// List active placement drives
router.get('/', (req: Request, res: Response) => {
  return res.json(memoryStore.placement_drives);
});

// Admin: Create new placement drive
router.post('/', (req: Request, res: Response) => {
  const { company_name, role_title, location, ctc_range, eligibility, job_description, rounds, deadline, apply_url, company_logo } = req.body;

  if (!company_name || !role_title || !apply_url) {
    return res.status(400).json({ error: 'Company name, role title, and apply URL are required.' });
  }

  const newDrive: PlacementDrive = {
    id: `drive-${Date.now()}`,
    company_name,
    company_logo: company_logo || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&q=80',
    role_title,
    location: location || 'Bangalore / Remote',
    ctc_range: ctc_range || '12 - 20 LPA',
    eligibility: eligibility || { min_cgpa: 7.0, allowed_branches: ['CSE', 'IT'], allowed_batches: [2025, 2026], backlogs_allowed: false },
    job_description: job_description || 'Software Engineering placement drive.',
    rounds: rounds || ['Aptitude & Coding', 'Technical Interview', 'HR Interview'],
    deadline: deadline || new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
    apply_url,
    is_active: true,
    created_at: new Date().toISOString()
  };

  memoryStore.placement_drives.unshift(newDrive);
  return res.status(201).json(newDrive);
});

// Student: Apply to a placement drive
router.post('/:driveId/apply', (req: Request, res: Response) => {
  const driveId = String(req.params.driveId);
  const { student_id = 'demo-student-id' } = req.body;

  const drive = memoryStore.placement_drives.find(d => d.id === driveId);
  if (!drive) {
    return res.status(404).json({ error: 'Placement drive not found' });
  }

  const existing = memoryStore.placement_applications.find(
    a => a.drive_id === driveId && a.student_id === student_id
  );

  if (existing) {
    return res.status(409).json({ error: 'You have already applied to this drive.' });
  }

  const application: PlacementApplication = {
    id: `app-${Date.now()}`,
    drive_id: driveId,
    student_id,
    status: 'applied',
    applied_at: new Date().toISOString()
  };

  memoryStore.placement_applications.push(application);

  return res.status(201).json({
    message: 'Application recorded successfully',
    application: {
      ...application,
      drive
    }
  });
});

// Student: Get all applications
router.get('/applications/:studentId', (req: Request, res: Response) => {
  const studentId = String(req.params.studentId);
  const apps = memoryStore.placement_applications
    .filter(a => a.student_id === studentId)
    .map(a => {
      const drive = memoryStore.placement_drives.find(d => d.id === a.drive_id);
      return {
        ...a,
        drive
      };
    });

  return res.json(apps);
});

export default router;
