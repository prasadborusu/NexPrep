import { Router, Request, Response } from 'express';
import { memoryStore, persistStore } from '../services/db';
import { UserProfile } from '../types';

const router = Router();

// Login
router.post('/login', (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Valid email address is required' });
  }

  const normalized = email.trim().toLowerCase();
  const user = memoryStore.profiles.find(p => p.email.toLowerCase() === normalized);

  if (!user) {
    return res.status(401).json({
      error: 'No account registered with this email. Please create your account first.'
    });
  }

  return res.json({
    token: `token-${user.id}`,
    user
  });
});

// Register
router.post('/register', (req: Request, res: Response) => {
  const { email, full_name, role = 'student', target_role = 'Software Engineer' } = req.body;

  if (!email || !full_name) {
    return res.status(400).json({ error: 'Email and Full Name are required' });
  }

  const normalized = email.trim().toLowerCase();
  const existing = memoryStore.profiles.find(p => p.email.toLowerCase() === normalized);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email address already exists. Please sign in.' });
  }

  const newUser: UserProfile = {
    id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    email: normalized,
    full_name: full_name.trim(),
    role: role === 'admin' ? 'admin' : 'student',
    college: req.body.college ? req.body.college.trim() : '',
    degree: req.body.degree ? req.body.degree.trim() : 'B.Tech',
    branch: req.body.branch ? req.body.branch.trim() : 'Computer Science',
    graduation_year: req.body.graduation_year ? parseInt(req.body.graduation_year, 10) : new Date().getFullYear(),
    cgpa: req.body.cgpa ? parseFloat(req.body.cgpa) : undefined,
    phone: req.body.phone ? req.body.phone.trim() : '',
    skills: Array.isArray(req.body.skills) ? req.body.skills : [],
    target_role: target_role.trim(),
    bio: req.body.bio ? req.body.bio.trim() : '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  memoryStore.profiles.push(newUser);
  persistStore();

  return res.status(201).json({
    token: `token-${newUser.id}`,
    user: newUser
  });
});

// Get Profile
router.get('/profile/:id', (req: Request, res: Response) => {
  const user = memoryStore.profiles.find(p => p.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'Profile not found' });
  }
  return res.json(user);
});

// Update Profile
router.put('/profile/:id', (req: Request, res: Response) => {
  const idx = memoryStore.profiles.findIndex(p => p.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Profile not found' });
  }

  memoryStore.profiles[idx] = {
    ...memoryStore.profiles[idx],
    ...req.body,
    updated_at: new Date().toISOString()
  };

  persistStore();

  return res.json(memoryStore.profiles[idx]);
});

export default router;
