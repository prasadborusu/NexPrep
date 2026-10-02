import { Router, Request, Response } from 'express';
import { memoryStore } from '../services/db';
import { generateInterviewFeedback } from '../services/ai';
import { InterviewSession, InterviewQuestion } from '../types';

const router = Router();

const QUESTION_BANK: Record<string, InterviewQuestion[]> = {
  technical: [
    {
      id: 'iq-t1',
      type: 'technical',
      question: 'Explain how the Java Virtual Machine (JVM) manages memory, specifically contrasting the Stack and Heap, and how the Garbage Collector determines unreachable objects.',
      expected_keywords: ['stack', 'heap', 'garbage collection', 'mark-and-sweep', 'eden space', 'memory leak', 'references'],
      sample_answer: 'Stack memory stores method call frames and local primitive variables with LIFO allocation, while Heap memory accommodates dynamically allocated objects. The GC uses root reachability analysis (tracing active references from GC roots) rather than simple reference counts to reclaim orphaned memory blocks.'
    },
    {
      id: 'iq-t2',
      type: 'technical',
      question: 'How do database indexes improve query execution speed, and what are the trade-offs regarding write operations (INSERT, UPDATE, DELETE)?',
      expected_keywords: ['b-tree', 'index', 'lookup', 'time complexity', 'write overhead', 'disk i/o', 'page splits'],
      sample_answer: 'Indexes (predominantly B-Trees) enable O(log N) search lookups by keeping pointers organized in balanced tree structures. However, every INSERT or UPDATE requires updating the auxiliary B-Tree index pages, causing write amplification and increased storage consumption.'
    },
    {
      id: 'iq-t3',
      type: 'technical',
      question: 'What is the Event Loop in Node.js/JavaScript, and how does it process microtasks (Promises) versus macrotasks (setTimeout)?',
      expected_keywords: ['event loop', 'call stack', 'microtask queue', 'macrotask queue', 'promises', 'non-blocking', 'single threaded'],
      sample_answer: 'Node.js is single-threaded using libuv. When the call stack empties, the engine drains the microtask queue (Promise callbacks and process.nextTick) before moving to subsequent phases of the event loop (timers, I/O polling, setImmediate).'
    }
  ],
  hr: [
    {
      id: 'iq-h1',
      type: 'hr',
      question: 'Describe a situation where you had a disagreement with a team member regarding a technical decision or deadline. How did you resolve it?',
      expected_keywords: ['communication', 'listen', 'objective criteria', 'trade-offs', 'compromise', 'outcome', 'alignment'],
      sample_answer: 'During a hackathon, our teammate preferred a NoSQL database while I advocated PostgreSQL for schema relations. I set up a quick 15-minute spike comparing query requirements. Once we realized our data was highly relational with transactional constraints, we aligned on Postgres and shipped 2 hours ahead of schedule.'
    },
    {
      id: 'iq-h2',
      type: 'hr',
      question: 'Tell me about a time you faced a critical roadblock or bug close to a submission deadline. How did you handle the pressure?',
      expected_keywords: ['prioritization', 'debugging', 'root cause', 'collaboration', 'calm', 'solution', 'testing'],
      sample_answer: 'I systematically decomposed the error logs, isolated the failure to a missing CORS header on the proxy, wrote a reproducible integration test, and deployed the patch with 30 minutes to spare while keeping the team informed.'
    }
  ],
  project: [
    {
      id: 'iq-p1',
      type: 'project',
      question: 'Walk me through the most technically challenging component in your primary project. What architecture decisions did you make and why?',
      expected_keywords: ['architecture', 'scalability', 'latency', 'trade-offs', 'database', 'caching', 'resilience'],
      sample_answer: 'The core challenge was orchestrating sandboxed code execution without security vulnerabilities. We used isolated container runners with CPU/memory limits and timeout hooks, decoupled from our Express API through a message broker.'
    },
    {
      id: 'iq-p2',
      type: 'project',
      question: 'If you had to scale your application to handle 100,000 concurrent daily active users, what would fail first and how would you redesign it?',
      expected_keywords: ['database bottleneck', 'connection pooling', 'caching', 'redis', 'cdn', 'horizontal scaling', 'load balancer'],
      sample_answer: 'The relational database write throughput and connection limit would bottleneck first. I would add Redis caching for read queries, read replicas, and connection pooling with PgBouncer, plus horizontal autoscaling behind a reverse proxy.'
    }
  ]
};

// Start a new mock interview session
router.post('/start', (req: Request, res: Response) => {
  const { student_id = 'demo-student-id', target_role = 'Full Stack Engineer', domain = 'Core Software Engineering' } = req.body;

  const sessionQuestions: InterviewQuestion[] = [
    ...QUESTION_BANK.technical.slice(0, 2),
    ...QUESTION_BANK.project.slice(0, 1),
    ...QUESTION_BANK.hr.slice(0, 1)
  ];

  const session: InterviewSession = {
    id: `interview-${Date.now()}`,
    student_id,
    target_role,
    domain,
    difficulty: 'fresher',
    questions: sessionQuestions,
    created_at: new Date().toISOString(),
    status: 'ongoing'
  };

  memoryStore.interview_sessions.unshift(session);
  return res.status(201).json(session);
});

// Evaluate an answer for a specific question in a session
router.post('/:sessionId/evaluate', async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const { questionId, userAnswer } = req.body;

  const session = memoryStore.interview_sessions.find(s => s.id === sessionId);
  if (!session) {
    return res.status(404).json({ error: 'Interview session not found' });
  }

  const question = session.questions.find((q: InterviewQuestion) => q.id === questionId);
  if (!question) {
    return res.status(404).json({ error: 'Question not found in this session' });
  }

  question.user_answer = userAnswer;

  const feedback = await generateInterviewFeedback({
    question: question.question,
    category: question.type,
    expectedKeywords: question.expected_keywords,
    userAnswer
  });

  question.feedback = feedback;

  // Calculate overall session score if all answered
  const answered = session.questions.filter((q: InterviewQuestion) => q.feedback);
  if (answered.length === session.questions.length) {
    session.status = 'completed';
    session.overall_score = Math.round(answered.reduce((acc: number, q: InterviewQuestion) => acc + (q.feedback?.score || 0), 0) / answered.length);
    session.summary_feedback = (session.overall_score || 0) >= 75
      ? 'Outstanding interview performance! Demonstrated structured communication, relevant technical terminology, and clear trade-off evaluation.'
      : 'Good effort. Strengthen your responses by mentioning specific architectural trade-offs, standard metrics, and concrete project anecdotes.';
  }

  return res.json({ question, session });
});

// Get session details
router.get('/:sessionId', (req: Request, res: Response) => {
  const session = memoryStore.interview_sessions.find(s => s.id === req.params.sessionId);
  if (!session) {
    return res.status(404).json({ error: 'Interview session not found' });
  }
  return res.json(session);
});

// List student's interview history
router.get('/history/:studentId', (req: Request, res: Response) => {
  const history = memoryStore.interview_sessions.filter(s => s.student_id === req.params.studentId);
  return res.json(history);
});

export default router;
