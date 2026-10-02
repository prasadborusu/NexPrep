import { Router, Request, Response } from 'express';
import { computeSkillGap } from '../services/skillGap';

const router = Router();

router.get('/:studentId', (req: Request, res: Response) => {
  const targetRole = (req.query.targetRole as string) || 'Full Stack Engineer';
  const studentId = String(req.params.studentId);
  const report = computeSkillGap(studentId, targetRole);
  return res.json(report);
});

export default router;
