import { Router, Request, Response } from 'express';
import { memoryStore, persistStore } from '../services/db';
import { runCodeWithPiston, testCodeAgainstCases } from '../services/compiler';
import { CodeSubmission, CodingTopic, CodingProblem } from '../types';
import { CODING_TOPICS } from '../services/codingRepo';

const router = Router();

// 1. List all coding topics with problem counts & student progress
router.get('/topics', (req: Request, res: Response) => {
  const studentId = (req.query.student_id as string) || '';

  // Calculate solved problem IDs for student
  const solvedProblemIds = new Set<string>();
  if (studentId) {
    memoryStore.code_submissions
      .filter(s => s.student_id === studentId && s.status === 'Accepted')
      .forEach(s => solvedProblemIds.add(s.problem_id));
  }

  const topics: CodingTopic[] = CODING_TOPICS.map((topic) => {
    const problems = memoryStore.coding_problems.filter(p => p.topic_id === topic.id);
    const solvedCount = problems.filter(p => solvedProblemIds.has(p.id) || solvedProblemIds.has(p.slug)).length;
    const easyCount = problems.filter(p => p.difficulty === 'easy').length;
    const mediumCount = problems.filter(p => p.difficulty === 'medium').length;
    const hardCount = problems.filter(p => p.difficulty === 'hard').length;

    return {
      ...topic,
      total_problems: problems.length,
      solved_problems: solvedCount,
      easy_count: easyCount,
      medium_count: mediumCount,
      hard_count: hardCount
    };
  });

  return res.json(topics);
});

// 2. Get single topic details and problem list
router.get('/topics/:topicId', (req: Request, res: Response) => {
  const { topicId } = req.params;
  const studentId = (req.query.student_id as string) || '';

  const topicMeta = CODING_TOPICS.find(t => t.id === topicId || t.slug === topicId);
  if (!topicMeta) {
    return res.status(404).json({ error: 'Topic not found' });
  }

  // Calculate solved problem IDs for student
  const solvedProblemIds = new Set<string>();
  if (studentId) {
    memoryStore.code_submissions
      .filter(s => s.student_id === studentId && s.status === 'Accepted')
      .forEach(s => solvedProblemIds.add(s.problem_id));
  }

  const problemsInTopic = memoryStore.coding_problems
    .filter(p => p.topic_id === topicMeta.id)
    .map(p => {
      const safeTestCases = (p.test_cases || []).filter(tc => !tc.is_hidden);
      const isSolved = solvedProblemIds.has(p.id) || solvedProblemIds.has(p.slug);
      return {
        ...p,
        test_cases: safeTestCases,
        solved: isSolved
      };
    });

  const easyCount = problemsInTopic.filter(p => p.difficulty === 'easy').length;
  const mediumCount = problemsInTopic.filter(p => p.difficulty === 'medium').length;
  const hardCount = problemsInTopic.filter(p => p.difficulty === 'hard').length;
  const solvedCount = problemsInTopic.filter(p => p.solved).length;

  const topic: CodingTopic = {
    ...topicMeta,
    total_problems: problemsInTopic.length,
    solved_problems: solvedCount,
    easy_count: easyCount,
    medium_count: mediumCount,
    hard_count: hardCount
  };

  return res.json({
    topic,
    problems: problemsInTopic
  });
});

// 3. List all coding problems (global search/list)
router.get('/problems', (req: Request, res: Response) => {
  const studentId = (req.query.student_id as string) || '';
  const solvedProblemIds = new Set<string>();
  if (studentId) {
    memoryStore.code_submissions
      .filter(s => s.student_id === studentId && s.status === 'Accepted')
      .forEach(s => solvedProblemIds.add(s.problem_id));
  }

  const problems = memoryStore.coding_problems.map(p => {
    const safeTestCases = (p.test_cases || []).filter(tc => !tc.is_hidden);
    return {
      ...p,
      test_cases: safeTestCases,
      solved: solvedProblemIds.has(p.id) || solvedProblemIds.has(p.slug)
    };
  });
  return res.json(problems);
});

// 4. Get single problem by ID or slug (never sending hidden test cases)
router.get('/problems/:idOrSlug', (req: Request, res: Response) => {
  const param = req.params.idOrSlug;
  const studentId = (req.query.student_id as string) || '';

  const problem = memoryStore.coding_problems.find(p => p.id === param || p.slug === param);
  if (!problem) {
    return res.status(404).json({ error: 'Problem not found' });
  }

  let isSolved = false;
  if (studentId) {
    isSolved = memoryStore.code_submissions.some(
      s => s.student_id === studentId && (s.problem_id === problem.id || s.problem_id === problem.slug) && s.status === 'Accepted'
    );
  }

  const safeTestCases = (problem.test_cases || []).filter(tc => !tc.is_hidden);
  return res.json({
    ...problem,
    test_cases: safeTestCases,
    solved: isSolved
  });
});

// 5. Run Code (sample tests / custom test case)
router.post('/run', async (req: Request, res: Response) => {
  const { language, code, stdin = '' } = req.body;

  if (!language || !code) {
    return res.status(400).json({ error: 'Language and code are required' });
  }

  const result = await runCodeWithPiston(language, code, stdin);
  return res.json(result);
});

// 6. Submit Code (evaluates against ALL test cases including hidden ones)
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
    problem_title: problem.title,
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

// 7. Get submissions for student with filters
router.get('/submissions/:studentId', (req: Request, res: Response) => {
  const { studentId } = req.params;
  const { problem_id, language, status } = req.query;

  let subs = memoryStore.code_submissions
    .filter(s => s.student_id === studentId)
    .map(s => {
      const prob = memoryStore.coding_problems.find(p => p.id === s.problem_id);
      return {
        ...s,
        problem_title: prob?.title || s.problem_title || 'Unknown Problem',
        difficulty: prob?.difficulty || 'easy',
        topic: prob?.topic || 'Algorithms'
      };
    });

  if (problem_id) {
    subs = subs.filter(s => s.problem_id === problem_id);
  }
  if (language) {
    subs = subs.filter(s => s.language.toLowerCase() === String(language).toLowerCase());
  }
  if (status) {
    subs = subs.filter(s => s.status.toLowerCase() === String(status).toLowerCase());
  }

  return res.json(subs);
});

export default router;
