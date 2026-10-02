import { Router, Request, Response } from 'express';
import { memoryStore, persistStore } from '../services/db';
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
    return res.status(400).json({ error: 'Company name, role title, and application link are required.' });
  }

  const newDrive: PlacementDrive = {
    id: `drive-${Date.now()}`,
    company_name: company_name.trim(),
    company_logo: company_logo || '',
    role_title: role_title.trim(),
    location: location ? location.trim() : 'On-Campus / Hybrid',
    ctc_range: ctc_range ? ctc_range.trim() : '',
    eligibility: eligibility || { min_cgpa: 7.0, allowed_branches: ['CSE', 'IT', 'ECE'], allowed_batches: [2026], backlogs_allowed: false },
    job_description: job_description || '',
    rounds: rounds || ['Online Assessment', 'Technical Interview', 'HR Interview'],
    deadline: deadline || new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
    apply_url: apply_url.trim(),
    is_active: true,
    created_at: new Date().toISOString()
  };

  memoryStore.placement_drives.unshift(newDrive);
  persistStore();

  return res.status(201).json(newDrive);
});

// Student: Apply to a placement drive
router.post('/:driveId/apply', (req: Request, res: Response) => {
  const driveId = String(req.params.driveId);
  const { student_id } = req.body;

  if (!student_id) {
    return res.status(400).json({ error: 'student_id is required' });
  }

  const drive = memoryStore.placement_drives.find(d => d.id === driveId);
  if (!drive) {
    return res.status(404).json({ error: 'Placement drive not found' });
  }

  const existing = memoryStore.placement_applications.find(
    a => a.drive_id === driveId && a.student_id === student_id
  );

  if (existing) {
    return res.status(409).json({ error: 'You have already applied to this placement drive.' });
  }

  const application: PlacementApplication = {
    id: `app-${Date.now()}`,
    drive_id: driveId,
    student_id,
    status: 'applied',
    applied_at: new Date().toISOString()
  };

  memoryStore.placement_applications.push(application);
  persistStore();

  return res.status(201).json({
    message: 'Application registered successfully',
    application
  });
});

// Get user applications
router.get('/applications/:studentId', (req: Request, res: Response) => {
  const apps = memoryStore.placement_applications.filter(a => a.student_id === req.params.studentId);
  return res.json(apps);
});

// Admin: Get all applications for a drive
router.get('/:driveId/applications', (req: Request, res: Response) => {
  const apps = memoryStore.placement_applications.filter(a => a.drive_id === req.params.driveId);
  return res.json(apps);
});

export default router;
