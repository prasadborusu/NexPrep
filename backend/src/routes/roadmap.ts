import { Router, Request, Response } from 'express';
import { memoryStore, persistStore } from '../services/db';
import { generatePersonalizedRoadmap } from '../services/roadmap';

const router = Router();

// Get student roadmap (generates initial if none exists)
router.get('/:studentId', (req: Request, res: Response) => {
  const studentId = String(req.params.studentId);
  let roadmap = memoryStore.roadmaps.find(r => r.student_id === studentId);

  if (!roadmap) {
    const student = memoryStore.profiles.find(p => p.id === studentId);
    roadmap = generatePersonalizedRoadmap(studentId, student?.target_role || 'Full Stack Engineer');
  }

  return res.json(roadmap);
});

// Regenerate roadmap
router.post('/:studentId/generate', (req: Request, res: Response) => {
  const { targetRole } = req.body;
  const studentId = String(req.params.studentId);
  const roadmap = generatePersonalizedRoadmap(studentId, targetRole);
  persistStore();
  return res.json(roadmap);
});

// Toggle item completion
router.patch('/:studentId/item/:itemId', (req: Request, res: Response) => {
  const { studentId, itemId } = req.params;
  const roadmap = memoryStore.roadmaps.find(r => r.student_id === studentId);

  if (!roadmap) {
    return res.status(404).json({ error: 'Roadmap not found' });
  }

  let found = false;
  let totalItems = 0;
  let completedItems = 0;

  for (const week of roadmap.weeks) {
    for (const item of week.items) {
      if (item.id === itemId) {
        item.completed = !item.completed;
        found = true;
      }
      totalItems++;
      if (item.completed) completedItems++;
    }
  }

  if (!found) {
    return res.status(404).json({ error: 'Roadmap item not found' });
  }

  roadmap.progress_percentage = Math.round((completedItems / Math.max(1, totalItems)) * 100);
  roadmap.updated_at = new Date().toISOString();
  persistStore();

  return res.json(roadmap);
});

export default router;
