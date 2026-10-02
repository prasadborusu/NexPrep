import { Router, Request, Response } from 'express';
import { memoryStore, persistStore } from '../services/db';
import { testCodeAgainstCases } from '../services/compiler';
import { Assessment, AssessmentSubmission } from '../types';

const router = Router();

// List active assessments
router.get('/', (req: Request, res: Response) => {
  const list = memoryStore.assessments.map(a => {
    const qCount = memoryStore.questions.filter(q => q.assessment_id === a.id).length;
    return { ...a, questions_count: qCount };
  });
  return res.json(list);
});

// Get assessment details by id with questions (strip correct options for students)
router.get('/:id', (req: Request, res: Response) => {
  const assessment = memoryStore.assessments.find(a => a.id === req.params.id);
  if (!assessment) {
    return res.status(404).json({ error: 'Assessment not found' });
  }

  const questions = memoryStore.questions
    .filter(q => q.assessment_id === assessment.id)
    .map(q => {
      // Don't expose correct_option_id or hidden test cases during exam taking
      const { correct_option_id, test_cases, ...safeQuestion } = q as any;
      const safeTestCases = (test_cases || []).map((tc: any) => ({
        id: tc.id,
        input: tc.is_hidden ? '[Hidden]' : tc.input,
        expected_output: tc.is_hidden ? '[Hidden]' : tc.expected_output,
        is_hidden: tc.is_hidden
      }));
      return {
        ...safeQuestion,
        test_cases: safeTestCases
      };
    });

  return res.json({
    assessment,
    questions
  });
});

// Submit / Autosave assessment answers
router.post('/:id/submit', async (req: Request, res: Response) => {
  const { student_id, answers, is_final_submit = true } = req.body;
  const assessment = memoryStore.assessments.find(a => a.id === req.params.id);
  if (!assessment) {
    return res.status(404).json({ error: 'Assessment not found' });
  }

  const questions = memoryStore.questions.filter(q => q.assessment_id === assessment.id);
  let totalScore = 0;
  let totalMarks = 0;
  const questionResults: Record<string, any> = {};

  for (const q of questions) {
    totalMarks += q.marks;
    const studentAns = answers?.[q.id];

    if (q.type === 'mcq') {
      const isCorrect = studentAns && studentAns.selected_option_id === q.correct_option_id;
      const marksObtained = isCorrect ? q.marks : 0;
      totalScore += marksObtained;
      questionResults[q.id] = {
        correct: Boolean(isCorrect),
        marks_obtained: marksObtained,
        correct_option_id: q.correct_option_id,
        explanation: q.explanation || 'Reviewed based on canonical answer key.'
      };
    } else if (q.type === 'coding') {
      // Run against test cases
      if (studentAns && studentAns.code_content) {
        const testCases = (q as any).test_cases || [];
        const lang = studentAns.language || 'python';
        const evaluation = await testCodeAgainstCases(lang, studentAns.code_content, testCases);
        
        const marksObtained = Math.round((evaluation.passed_test_cases / Math.max(1, testCases.length)) * q.marks);
        totalScore += marksObtained;
        questionResults[q.id] = {
          correct: evaluation.status === 'Accepted',
          marks_obtained: marksObtained,
          passed_cases: evaluation.passed_test_cases,
          total_cases: testCases.length,
          status: evaluation.status
        };
      } else {
        questionResults[q.id] = {
          correct: false,
          marks_obtained: 0,
          status: 'Not Attempted'
        };
      }
    }
  }

  const percentage = Math.round((totalScore / Math.max(1, totalMarks)) * 100);
  const passed = percentage >= assessment.pass_percentage;

  const student = memoryStore.profiles.find(p => p.id === student_id);

  const submission: AssessmentSubmission = {
    id: `sub-${Date.now()}`,
    assessment_id: assessment.id,
    student_id: student_id || (student ? student.id : 'unassigned'),
    student_name: student?.full_name || 'Candidate',
    student_email: student?.email || '',
    assessment_title: assessment.title,
    status: is_final_submit ? 'evaluated' : 'in_progress',
    score: totalScore,
    total_marks: totalMarks,
    percentage,
    passed,
    answers: answers || {},
    question_results: questionResults,
    started_at: req.body.started_at || new Date().toISOString(),
    submitted_at: new Date().toISOString()
  };

  // Upsert submission
  const existingIdx = memoryStore.assessment_submissions.findIndex(
    s => s.assessment_id === assessment.id && s.student_id === submission.student_id
  );
  if (existingIdx >= 0) {
    memoryStore.assessment_submissions[existingIdx] = submission;
  } else {
    memoryStore.assessment_submissions.push(submission);
  }

  persistStore();

  return res.json({
    message: is_final_submit ? 'Assessment submitted successfully' : 'Autosaved progress',
    submission
  });
});

// Get user result for an assessment
router.get('/:id/result/:studentId', (req: Request, res: Response) => {
  const submission = memoryStore.assessment_submissions.find(
    s => s.assessment_id === req.params.id && s.student_id === req.params.studentId
  );

  if (!submission) {
    return res.status(404).json({ error: 'No submission found for this assessment' });
  }

  const questions = memoryStore.questions.filter(q => q.assessment_id === req.params.id);

  return res.json({
    submission,
    questions
  });
});

// Get all submissions for a student
router.get('/submissions/student/:studentId', (req: Request, res: Response) => {
  const list = memoryStore.assessment_submissions.filter(s => s.student_id === req.params.studentId);
  return res.json(list);
});

// Verify Assessment Passkey (Called when student attempts to start)
router.post('/:id/verify-passkey', (req: Request, res: Response) => {
  const { passkey } = req.body;
  const assessment = memoryStore.assessments.find(a => a.id === req.params.id);
  if (!assessment) {
    return res.status(404).json({ error: 'Assessment not found' });
  }

  // If assessment has no passkey configured, auto-authorize
  if (!assessment.passkey) {
    return res.json({ success: true, message: 'Assessment unlocked' });
  }

  const expectedKey = assessment.passkey.trim().toUpperCase();
  const inputKey = String(passkey || '').trim().toUpperCase();

  if (expectedKey === inputKey) {
    return res.json({ success: true, message: 'Passkey verified successfully' });
  }

  return res.status(403).json({
    success: false,
    error: 'Invalid assessment passkey. Please check with your exam administrator or proctor.'
  });
});

// Admin: Update or Regenerate Passkey for an assessment
router.post('/:id/passkey', (req: Request, res: Response) => {
  const assessment = memoryStore.assessments.find(a => a.id === req.params.id);
  if (!assessment) {
    return res.status(404).json({ error: 'Assessment not found' });
  }

  const customKey = req.body.passkey ? String(req.body.passkey).trim().toUpperCase() : null;
  const newPasskey = customKey || `NEX-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  assessment.passkey = newPasskey;
  persistStore();

  return res.json({ success: true, passkey: newPasskey });
});

// Admin: Create assessment
router.post('/', (req: Request, res: Response) => {
  const { title, description, type, duration_minutes, total_marks, pass_percentage, scheduled_at, passkey } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const generatedPasskey = passkey ? String(passkey).trim().toUpperCase() : `NEX-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newAssessment: Assessment = {
    id: `assessment-${Date.now()}`,
    title,
    description: description || '',
    type: type || 'mcq',
    duration_minutes: Number(duration_minutes) || 45,
    total_marks: Number(total_marks) || 100,
    pass_percentage: Number(pass_percentage) || 60,
    is_active: true,
    scheduled_at: scheduled_at || new Date().toISOString(),
    passkey: generatedPasskey,
    created_by: 'admin',
    created_at: new Date().toISOString()
  };

  memoryStore.assessments.unshift(newAssessment);
  persistStore();
  return res.status(201).json(newAssessment);
});

// Admin: Add question to assessment
router.post('/:id/questions', (req: Request, res: Response) => {
  const assessment = memoryStore.assessments.find(a => a.id === req.params.id);
  if (!assessment) {
    return res.status(404).json({ error: 'Assessment not found' });
  }

  const newQuestion = {
    id: `q-${Date.now()}`,
    assessment_id: assessment.id,
    title: req.body.title,
    description: req.body.description,
    type: req.body.type || 'mcq',
    marks: Number(req.body.marks) || 10,
    options: req.body.options || [],
    correct_option_id: req.body.correct_option_id,
    explanation: req.body.explanation,
    allowed_languages: req.body.allowed_languages || ['python', 'javascript', 'java', 'cpp'],
    starter_code: req.body.starter_code || {},
    test_cases: req.body.test_cases || [],
    constraints: req.body.constraints || '',
    difficulty: req.body.difficulty || 'medium',
    category: req.body.category || 'General',
    created_at: new Date().toISOString()
  };

  memoryStore.questions.push(newQuestion);
  persistStore();
  return res.status(201).json(newQuestion);
});

export default router;
