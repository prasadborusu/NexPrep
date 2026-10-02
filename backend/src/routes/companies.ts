import { Router, Request, Response } from 'express';
import {
  COMPANIES,
  THEORY_QUESTIONS,
  APTITUDE_QUESTIONS,
  HR_QUESTIONS,
  getCompanyById,
  getTheoryQuestionsByCompany,
  getAptitudeByCompany,
  getHRByCompany,
  getAllTopics
} from '../services/companyRepo';
import { generateInterviewFeedback } from '../services/ai';
import { memoryStore, persistStore } from '../services/db';

const router = Router();

// ─── GET ALL COMPANIES ────────────────────────────────
router.get('/', (req: Request, res: Response) => {
  const { category, search } = req.query;
  let result = COMPANIES;
  if (category) result = result.filter(c => c.category === category);
  if (search) {
    const q = (search as string).toLowerCase();
    result = result.filter(c => c.name.toLowerCase().includes(q));
  }
  return res.json(result);
});

// ─── GET COMPANY BY ID ────────────────────────────────
router.get('/:companyId', (req: Request, res: Response) => {
  const companyId = req.params.companyId as string;
  const company = getCompanyById(companyId);
  if (!company) return res.status(404).json({ error: 'Company not found' });
  return res.json(company);
});

// ─── GET COMPANY THEORY QUESTIONS ────────────────────
router.get('/:companyId/theory', (req: Request, res: Response) => {
  const companyId = req.params.companyId as string;
  const company = getCompanyById(companyId);
  if (!company) return res.status(404).json({ error: 'Company not found' });

  const { topic } = req.query;
  const questions = getTheoryQuestionsByCompany(companyId, topic ? String(topic) : undefined);
  const topics = getAllTopics();
  return res.json({ questions, available_topics: topics });
});

// ─── GET THEORY QUESTION BY ID ────────────────────────
router.get('/:companyId/theory/:questionId', (req: Request, res: Response) => {
  const question = THEORY_QUESTIONS.find(q =>
    q.id === req.params.questionId && q.company_id === req.params.companyId
  );
  if (!question) return res.status(404).json({ error: 'Question not found' });
  return res.json(question);
});

// ─── EVALUATE THEORY ANSWER WITH AI ─────────────────
router.post('/:companyId/theory/:questionId/evaluate', async (req: Request, res: Response) => {
  const question = THEORY_QUESTIONS.find(q =>
    q.id === req.params.questionId && q.company_id === req.params.companyId
  );
  if (!question) return res.status(404).json({ error: 'Question not found' });

  const { userAnswer, student_id } = req.body;
  if (!userAnswer || !userAnswer.trim()) {
    return res.status(400).json({ error: 'Answer is required' });
  }

  try {
    const feedback = await generateInterviewFeedback({
      question: question.question,
      category: 'technical',
      expectedKeywords: question.expected_concepts,
      userAnswer
    });

    // Track progress if student_id provided
    if (student_id) {
      const progressKey = `theory_${question.id}`;
      if (!memoryStore.interview_sessions) {
        (memoryStore as any).company_progress = {};
      }
      // Store as interview session for progress tracking
      const existing = memoryStore.interview_sessions.find(
        s => s.student_id === student_id && s.id === `theory-practice-${student_id}`
      );
      if (!existing) {
        memoryStore.interview_sessions.push({
          id: `theory-practice-${student_id}`,
          student_id,
          target_role: 'General',
          domain: 'theory',
          difficulty: 'fresher',
          questions: [],
          status: 'ongoing',
          created_at: new Date().toISOString()
        });
      }
      persistStore();
    }

    return res.json({
      feedback,
      question_id: question.id,
      expected_concepts: question.expected_concepts
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'AI evaluation failed' });
  }
});

// ─── GET APTITUDE QUESTIONS ───────────────────────────
router.get('/:companyId/aptitude', (req: Request, res: Response) => {
  const companyId = req.params.companyId as string;
  const company = getCompanyById(companyId);
  if (!company) return res.status(404).json({ error: 'Company not found' });

  const { category } = req.query;
  const questions = getAptitudeByCompany(companyId, category ? String(category) : undefined);
  return res.json({ questions });
});

// ─── SUBMIT APTITUDE ATTEMPT ─────────────────────────
router.post('/:companyId/aptitude/submit', (req: Request, res: Response) => {
  const companyId = req.params.companyId as string;
  const { answers, student_id } = req.body;
  // answers: { questionId: selectedOptionId }
  if (!answers) return res.status(400).json({ error: 'answers required' });

  const companyAptitude = getAptitudeByCompany(companyId);
  let correct = 0;
  const results: any[] = [];

  for (const q of companyAptitude) {
    const selected = answers[q.id];
    const isCorrect = selected === q.correct_option_id;
    if (isCorrect) correct++;
    results.push({
      question_id: q.id,
      selected_option_id: selected,
      correct_option_id: q.correct_option_id,
      is_correct: isCorrect,
      explanation: q.explanation
    });
  }

  const score = companyAptitude.length > 0
    ? Math.round((correct / companyAptitude.length) * 100)
    : 0;

  return res.json({
    score,
    correct,
    total: companyAptitude.length,
    results
  });
});

// ─── GET HR QUESTIONS ─────────────────────────────────
router.get('/:companyId/hr', (req: Request, res: Response) => {
  const companyId = req.params.companyId as string;
  const company = getCompanyById(companyId);
  if (!company) return res.status(404).json({ error: 'Company not found' });

  const questions = getHRByCompany(companyId);
  return res.json({ questions, company });
});

// ─── EVALUATE HR ANSWER WITH AI ──────────────────────
router.post('/:companyId/hr/:questionId/evaluate', async (req: Request, res: Response) => {
  const companyId = req.params.companyId as string;
  const questionId = req.params.questionId as string;
  const question = HR_QUESTIONS.find(q =>
    q.id === questionId && q.company_id === companyId
  );
  if (!question) return res.status(404).json({ error: 'Question not found' });

  const { userAnswer } = req.body;
  if (!userAnswer?.trim()) {
    return res.status(400).json({ error: 'Answer is required' });
  }

  try {
    const feedback = await generateInterviewFeedback({
      question: question.question,
      category: 'hr',
      expectedKeywords: question.tips.flatMap(t => t.split(' ').slice(0, 2)),
      userAnswer
    });
    return res.json({ feedback, tips: question.tips });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'AI evaluation failed' });
  }
});

// ─── GET CODING PROBLEMS FOR COMPANY ─────────────────
// Reuses main coding problem pool, filtered by difficulty
router.get('/:companyId/coding', (req: Request, res: Response) => {
  const companyId = req.params.companyId as string;
  const company = getCompanyById(companyId);
  if (!company) return res.status(404).json({ error: 'Company not found' });

  // Map company to relevant coding difficulties
  const productCompanies = ['google', 'amazon', 'microsoft', 'flipkart'];
  const isProduct = productCompanies.includes(companyId);

  const allProblems = memoryStore.coding_problems;
  let problems;
  if (isProduct) {
    // For product companies: medium + hard problems
    problems = allProblems.filter(p => p.difficulty === 'medium' || p.difficulty === 'hard').slice(0, 10);
  } else {
    // For service companies: easy + medium problems
    problems = allProblems.filter(p => p.difficulty === 'easy' || p.difficulty === 'medium').slice(0, 8);
  }

  return res.json({
    problems: problems.map(p => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      difficulty: p.difficulty,
      category: p.category,
      tags: p.tags,
      leetcode_url: (p as any).leetcode_url || null,
      acceptance_rate: p.acceptance_rate,
      total_submissions: p.total_submissions
    })),
    company
  });
});

// ─── GET COMPANY PROGRESS FOR STUDENT ────────────────
router.get('/:companyId/progress/:studentId', (req: Request, res: Response) => {
  const companyId = req.params.companyId as string;
  const studentId = req.params.studentId as string;

  // Theory progress: count AI-evaluated theory answers
  const theoryQuestions = getTheoryQuestionsByCompany(companyId);
  const aptitudeQuestions = getAptitudeByCompany(companyId);
  const hrQuestions = getHRByCompany(companyId);

  // Coding: look at code_submissions for this student
  const codingAttempts = memoryStore.code_submissions.filter(
    s => s.student_id === studentId && s.status === 'Accepted'
  ).length;

  return res.json({
    company_id: companyId,
    student_id: studentId,
    theory: { total: theoryQuestions.length, completed: 0 },
    coding: { total: 5, solved: Math.min(codingAttempts, 5) },
    aptitude: { total: aptitudeQuestions.length, completed: 0 },
    hr: { total: hrQuestions.length, completed: 0 }
  });
});

export default router;
