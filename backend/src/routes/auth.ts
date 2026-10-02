import { Router, Request, Response } from 'express';
import { memoryStore, persistStore, supabase } from '../services/db';
import { UserProfile } from '../types';

const router = Router();

// Login
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Valid email address is required' });
  }

  const normalized = email.trim().toLowerCase();

  // 1. If live Supabase is connected, attempt Supabase Auth first
  if (supabase) {
    if (password && typeof password === 'string' && password.trim().length > 0) {
      try {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: normalized,
          password: password.trim()
        });

        if (!signInError && signInData?.user) {
          const authUser = signInData.user;
          // Retrieve or upsert profile in public.profiles
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();

          let userProfile: UserProfile;
          if (profile) {
            userProfile = {
              id: profile.id,
              email: profile.email,
              full_name: profile.full_name || authUser.user_metadata?.full_name || 'Candidate',
              role: (profile.role === 'admin' ? 'admin' : 'student') as 'student' | 'admin',
              college: profile.college || '',
              degree: profile.degree || 'B.Tech',
              branch: profile.branch || 'Computer Science',
              graduation_year: profile.graduation_year || 2026,
              cgpa: profile.cgpa ? parseFloat(profile.cgpa) : undefined,
              phone: profile.phone || '',
              skills: profile.skills || [],
              target_role: profile.target_role || 'Software Engineer',
              bio: profile.bio || '',
              created_at: profile.created_at || new Date().toISOString(),
              updated_at: profile.updated_at || new Date().toISOString()
            };
          } else {
            // Create default profile for this authenticated user
            userProfile = {
              id: authUser.id,
              email: normalized,
              full_name: authUser.user_metadata?.full_name || 'Candidate',
              role: (authUser.user_metadata?.role === 'admin' ? 'admin' : 'student') as 'student' | 'admin',
              skills: [],
              target_role: 'Software Engineer',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            await supabase.from('profiles').upsert(userProfile);
          }

          // Sync into memory store
          const existingIdx = memoryStore.profiles.findIndex(p => p.email.toLowerCase() === normalized);
          if (existingIdx >= 0) {
            memoryStore.profiles[existingIdx] = userProfile;
          } else {
            memoryStore.profiles.push(userProfile);
          }
          persistStore();

          return res.json({
            token: signInData.session?.access_token || `token-${userProfile.id}`,
            user: userProfile
          });
        }
      } catch (authErr) {
        console.warn('Supabase signInWithPassword fallback:', authErr);
      }
    }

    // Try finding by email in Supabase profiles table
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', normalized)
        .maybeSingle();

      if (profile) {
        const userProfile: UserProfile = {
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name,
          role: profile.role === 'admin' ? 'admin' : 'student',
          college: profile.college || '',
          degree: profile.degree || 'B.Tech',
          branch: profile.branch || 'Computer Science',
          graduation_year: profile.graduation_year || 2026,
          cgpa: profile.cgpa ? parseFloat(profile.cgpa) : undefined,
          phone: profile.phone || '',
          skills: profile.skills || [],
          target_role: profile.target_role || 'Software Engineer',
          bio: profile.bio || '',
          created_at: profile.created_at || new Date().toISOString(),
          updated_at: profile.updated_at || new Date().toISOString()
        };

        const existingIdx = memoryStore.profiles.findIndex(p => p.email.toLowerCase() === normalized);
        if (existingIdx >= 0) {
          memoryStore.profiles[existingIdx] = userProfile;
        } else {
          memoryStore.profiles.push(userProfile);
        }
        persistStore();

        return res.json({
          token: `token-${userProfile.id}`,
          user: userProfile
        });
      }
    } catch (dbErr) {
      console.warn('Supabase profile query fallback:', dbErr);
    }
  }

  // 2. Fallback / Check memory store
  const user = memoryStore.profiles.find(p => p.email.toLowerCase() === normalized);

  if (!user) {
    return res.status(401).json({
      error: 'No account registered with this email. Please check your email or click Register to create an account.'
    });
  }

  return res.json({
    token: `token-${user.id}`,
    user
  });
});

// Register
router.post('/register', async (req: Request, res: Response) => {
  const { email, password, full_name, role = 'student', target_role = 'Software Engineer' } = req.body;

  if (!email || !full_name) {
    return res.status(400).json({ error: 'Email and Full Name are required' });
  }

  const normalized = email.trim().toLowerCase();
  const existingLocal = memoryStore.profiles.find(p => p.email.toLowerCase() === normalized);

  let userId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  // If live Supabase is connected, create user in Supabase Auth & public.profiles
  if (supabase) {
    try {
      const userPassword = password && password.trim().length >= 6 ? password.trim() : 'NexPrep@2026';
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: normalized,
        password: userPassword,
        email_confirm: true,
        user_metadata: { full_name: full_name.trim(), role: role === 'admin' ? 'admin' : 'student' }
      });

      if (authData?.user) {
        userId = authData.user.id;
      } else if (authError && authError.message.includes('already exists')) {
        // User already exists in Supabase Auth, lookup profile
        const { data: existingProf } = await supabase.from('profiles').select('id').eq('email', normalized).maybeSingle();
        if (existingProf) {
          userId = existingProf.id;
        }
      }
    } catch (e) {
      console.warn('Supabase auth.admin.createUser notice:', e);
    }
  } else if (existingLocal) {
    return res.status(409).json({ error: 'An account with this email address already exists. Please sign in.' });
  }

  const newUser: UserProfile = {
    id: userId,
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

  // Sync to Supabase profiles table
  if (supabase) {
    try {
      await supabase.from('profiles').upsert(newUser);
    } catch (e) {
      console.warn('Failed to upsert to Supabase profiles:', e);
    }
  }

  // Update memory store
  const existingIdx = memoryStore.profiles.findIndex(p => p.email.toLowerCase() === normalized);
  if (existingIdx >= 0) {
    memoryStore.profiles[existingIdx] = newUser;
  } else {
    memoryStore.profiles.push(newUser);
  }
  persistStore();

  return res.status(201).json({
    token: `token-${newUser.id}`,
    user: newUser
  });
});

// Get Profile
router.get('/profile/:id', async (req: Request, res: Response) => {
  const profileId = req.params.id;

  if (supabase) {
    try {
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', profileId).maybeSingle();
      if (profile) {
        return res.json(profile);
      }
    } catch (e) {
      console.warn('Supabase getProfile error:', e);
    }
  }

  const user = memoryStore.profiles.find(p => p.id === profileId);
  if (!user) {
    return res.status(404).json({ error: 'Profile not found' });
  }
  return res.json(user);
});

// Update Profile
router.put('/profile/:id', async (req: Request, res: Response) => {
  const profileId = req.params.id;
  const updates = req.body;

  if (supabase) {
    try {
      await supabase.from('profiles').update({
        ...updates,
        updated_at: new Date().toISOString()
      }).eq('id', profileId);
    } catch (e) {
      console.warn('Supabase updateProfile error:', e);
    }
  }

  const idx = memoryStore.profiles.findIndex(p => p.id === profileId);
  if (idx !== -1) {
    memoryStore.profiles[idx] = {
      ...memoryStore.profiles[idx],
      ...updates,
      updated_at: new Date().toISOString()
    };
    persistStore();
    return res.json(memoryStore.profiles[idx]);
  }

  return res.json({ id: profileId, ...updates });
});

export default router;
