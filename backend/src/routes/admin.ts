import { Router, Request, Response } from 'express';
import { memoryStore } from '../services/db';

const router = Router();

// Platform analytics based on real store
router.get('/analytics', (req: Request, res: Response) => {
  const students = memoryStore.profiles.filter(p => p.role === 'student');
  const assessments = memoryStore.assessments;
  const submissions = memoryStore.assessment_submissions;
  const codeProblems = memoryStore.coding_problems;
  const codeSubmissions = memoryStore.code_submissions;
  const drives = memoryStore.placement_drives;
  const applications = memoryStore.placement_applications;

  // Real calculations
  const totalSubmissions = submissions.length;
  const passedSubmissions = submissions.filter(s => s.passed).length;
  const assessmentPassRate = totalSubmissions > 0
    ? Math.round((passedSubmissions / totalSubmissions) * 100)
    : 0;

  const totalCodeSubmissions = codeSubmissions.length;
  const acceptedCodeSubmissions = codeSubmissions.filter(s => s.status === 'Accepted').length;
  const codingAcceptanceRate = totalCodeSubmissions > 0
    ? Math.round((acceptedCodeSubmissions / totalCodeSubmissions) * 100)
    : 0;

  return res.json({
    metrics: {
      total_students: students.length,
      active_assessments: assessments.length,
      total_assessment_submissions: totalSubmissions,
      assessment_pass_rate: assessmentPassRate,
      coding_problems_count: codeProblems.length,
      total_code_submissions: totalCodeSubmissions,
      coding_acceptance_rate: codingAcceptanceRate,
      active_drives: drives.length,
      total_applications: applications.length
    },
    recent_submissions: submissions.slice(0, 10),
    recent_code_submissions: codeSubmissions.slice(0, 10),
    recent_applications: applications.slice(0, 10)
  });
});

// List all students
router.get('/students', (req: Request, res: Response) => {
  const students = memoryStore.profiles
    .filter(p => p.role === 'student')
    .map(p => {
      const studentSubs = memoryStore.assessment_submissions.filter(s => s.student_id === p.id);
      const studentCodeSubs = memoryStore.code_submissions.filter(s => s.student_id === p.id);
      const studentApps = memoryStore.placement_applications.filter(a => a.student_id === p.id);

      return {
        ...p,
        assessments_taken: studentSubs.length,
        code_problems_solved: studentCodeSubs.filter(s => s.status === 'Accepted').length,
        drives_applied: studentApps.length
      };
    });

  return res.json(students);
});

export default router;
