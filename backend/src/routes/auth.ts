import { Router, Request, Response } from 'express';
import { memoryStore } from '../services/db';
import { UserProfile } from '../types';

const router = Router();

// Login
router.post('/login', (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Look for existing user or create a session
  let user: UserProfile | undefined = memoryStore.profiles.find(p => p.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    // If logging in with admin credentials or role specified
    const isAdmin = email.toLowerCase().includes('admin');
    user = {
      id: `user-${Date.now()}`,
      email: email.toLowerCase(),
      full_name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
      role: isAdmin ? 'admin' : 'student',
      college: 'NexPrep Engineering Academy',
      degree: 'B.Tech',
      branch: 'Computer Science',
      graduation_year: 2026,
      cgpa: 8.5,
      phone: '+91 98765 43210',
      skills: ['Java', 'Python', 'React', 'Data Structures'],
      target_role: 'Full Stack Engineer',
      bio: 'Ready to learn and excel in campus placements.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    memoryStore.profiles.push(user);
  }

  return res.json({
    token: `token-${user.id}`,
    user
  });
});

// Register
router.post('/register', (req: Request, res: Response) => {
  const { email, full_name, role = 'student', target_role = 'Full Stack Engineer' } = req.body;

  if (!email || !full_name) {
    return res.status(400).json({ error: 'Email and Full Name are required' });
  }

  const existing = memoryStore.profiles.find(p => p.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'User with this email already exists' });
  }

  const newUser: UserProfile = {
    id: `user-${Date.now()}`,
    email: email.toLowerCase(),
    full_name,
    role: role === 'admin' ? 'admin' : 'student',
    college: req.body.college || 'Engineering Institute',
    degree: req.body.degree || 'B.Tech',
    branch: req.body.branch || 'Computer Science',
    graduation_year: req.body.graduation_year || 2026,
    cgpa: req.body.cgpa || 8.0,
    phone: req.body.phone || '',
    skills: req.body.skills || ['Python', 'Problem Solving'],
    target_role,
    bio: req.body.bio || 'Aspiring software developer preparing for top tech opportunities.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  memoryStore.profiles.push(newUser);

  return res.status(201).json({
    token: `token-${newUser.id}`,
    user: newUser
  });
});

// Get Profile
router.get('/profile/:id', (req: Request, res: Response) => {
  const user = memoryStore.profiles.find(p => p.id === req.params.id) || memoryStore.profiles[0];
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

  return res.json(memoryStore.profiles[idx]);
});

export default router;
