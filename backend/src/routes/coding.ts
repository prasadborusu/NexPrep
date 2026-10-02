import { Router, Request, Response } from 'express';
import { memoryStore, persistStore } from '../services/db';
import { runCodeWithPiston, testCodeAgainstCases } from '../services/compiler';
import { CodeSubmission } from '../types';

const router = Router();

// List all coding problems
router.get('/problems', (req: Request, res: Response) => {
  const problems = memoryStore.coding_problems.map(p => {
    // Strip hidden test cases from the public problem list
    const safeTestCases = p.test_cases.filter(tc => !tc.is_hidden);
    return {
      ...p,
      test_cases: safeTestCases
    };
  });
  return res.json(problems);
});

// Get single problem by ID or slug
router.get('/problems/:idOrSlug', (req: Request, res: Response) => {
  const param = req.params.idOrSlug;
  const problem = memoryStore.coding_problems.find(p => p.id === param || p.slug === param);

  if (!problem) {
    return res.status(404).json({ error: 'Problem not found' });
  }

  // Return problem with only non-hidden test cases for the user editor view
  const safeTestCases = problem.test_cases.filter(tc => !tc.is_hidden);
  return res.json({
    ...problem,
    test_cases: safeTestCases
  });
});

// Run Code (on custom input or test case)
router.post('/run', async (req: Request, res: Response) => {
  const { language, code, stdin = '' } = req.body;

  if (!language || !code) {
    return res.status(400).json({ error: 'Language and code are required' });
  }

  const result = await runCodeWithPiston(language, code, stdin);
  return res.json(result);
});

// Submit Code (evaluates against ALL test cases including hidden ones)
router.post('/submit', async (req: Request, res: Response) => {
  const { student_id, problem_id, language, code } = req.body;

  if (!problem_id || !code || !language) {
    return res.status(400).json({ error: 'problem_id, language, and code are required' });
  }

  const problem = memoryStore.coding_problems.find(p => p.id === problem_id || p.slug === problem_id);
  if (!problem) {
    return res.status(404).json({ error: 'Problem not found' });
  }

  const evaluation = await testCodeAgainstCases(language, code, problem.test_cases);

  const submission: CodeSubmission = {
    id: `csub-${Date.now()}`,
    student_id: student_id || 'unassigned',
    problem_id: problem.id,
    language,
    code,
    status: evaluation.status as any,
    passed_test_cases: evaluation.passed_test_cases,
    total_test_cases: evaluation.total_test_cases,
    execution_time_ms: evaluation.results.reduce((acc, r) => acc + (r.executionTimeMs || 0), 0),
    created_at: new Date().toISOString()
  };

  memoryStore.code_submissions.unshift(submission);

  // Update problem stats
  problem.total_submissions = (problem.total_submissions || 0) + 1;
  const allForProb = memoryStore.code_submissions.filter(s => s.problem_id === problem.id);
  const acceptedForProb = allForProb.filter(s => s.status === 'Accepted').length;
  problem.acceptance_rate = Math.round((acceptedForProb / allForProb.length) * 100);

  persistStore();

  return res.json({
    submission,
    evaluation: {
      status: evaluation.status,
      passed_test_cases: evaluation.passed_test_cases,
      total_test_cases: evaluation.total_test_cases,
      test_case_results: evaluation.results
    }
  });
});

// Get submissions for student
router.get('/submissions/:studentId', (req: Request, res: Response) => {
  const subs = memoryStore.code_submissions
    .filter(s => s.student_id === req.params.studentId)
    .map(s => {
      const prob = memoryStore.coding_problems.find(p => p.id === s.problem_id);
      return {
        ...s,
        problem_title: prob?.title || 'Unknown Problem',
        difficulty: prob?.difficulty || 'easy'
      };
    });

  return res.json(subs);
});

// Admin: Create new coding problem
router.post('/problems', (req: Request, res: Response) => {
  const { title, difficulty, category, tags, description, examples, constraints, starter_code, test_cases } = req.body;

  if (!title || !description || !starter_code) {
    return res.status(400).json({ error: 'Title, description, and starter_code are required' });
  }

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const newProblem = {
    id: `prob-${Date.now()}`,
    title,
    slug,
    difficulty: difficulty || 'medium',
    category: category || 'Algorithms',
    tags: tags || ['Algorithms'],
    description,
    examples: examples || [],
    constraints: constraints || [],
    starter_code,
    test_cases: test_cases || [],
    acceptance_rate: 100,
    total_submissions: 0,
    created_at: new Date().toISOString()
  };

  memoryStore.coding_problems.push(newProblem);
  return res.status(201).json(newProblem);
});

export default router;
