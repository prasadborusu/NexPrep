import { StudentRoadmap, RoadmapWeek } from '../types';
import { memoryStore } from './db';

export function generatePersonalizedRoadmap(
  studentId: string,
  targetRole: string = 'Full Stack Engineer'
): StudentRoadmap {
  const weeks: RoadmapWeek[] = [
    {
      week_number: 1,
      theme: 'Core Language Fundamentals & Memory Model',
      focus: 'Syntax, Type Systems, Pointers/References & Runtime Semantics',
      items: [
        { id: 'w1-1', title: 'Language Basics & Data Types', description: 'Review primitive vs reference types, immutability, and scopes.', category: 'core', completed: true },
        { id: 'w1-2', title: 'Memory Management & Garbage Collection', description: 'Understand heap vs stack, lifecycle of objects, and memory leaks.', category: 'core', completed: true },
        { id: 'w1-3', title: 'Practice 5 Warmup Algorithmic Problems', description: 'Solve string manipulation and two-pointer problems on NexPrep.', category: 'practice', completed: false }
      ]
    },
    {
      week_number: 2,
      theme: 'Object-Oriented Programming & Clean Architecture',
      focus: 'Inheritance, Polymorphism, Encapsulation, Abstraction & SOLID',
      items: [
        { id: 'w2-1', title: 'SOLID Design Principles', description: 'Study Single Responsibility, Open/Closed, and Dependency Inversion patterns.', category: 'core', completed: false },
        { id: 'w2-2', title: 'Design Patterns Deep-Dive', description: 'Implement Singleton, Factory, and Observer patterns in idiomatic code.', category: 'core', completed: false },
        { id: 'w2-3', title: 'Refactor Monolithic Module', description: 'Separate data access, service layer, and controller logic.', category: 'project', completed: false }
      ]
    },
    {
      week_number: 3,
      theme: 'Collections Framework & Standard Libraries',
      focus: 'Lists, Sets, Maps, Queues, Iterators & Complexity Analysis',
      items: [
        { id: 'w3-1', title: 'Internal Working of HashMaps', description: 'Hash functions, bucket arrays, collision resolution and load factor.', category: 'core', completed: false },
        { id: 'w3-2', title: 'PriorityQueue & Tree Structures', description: 'Understand binary heaps and red-black tree ordering invariants.', category: 'core', completed: false },
        { id: 'w3-3', title: 'Solve 6 Hashing & Heap Problems', description: 'Focus on Top-K elements, frequency sorting, and sliding window maximum.', category: 'practice', completed: false }
      ]
    },
    {
      week_number: 4,
      theme: 'Data Structures & Algorithms Mastery',
      focus: 'Trees, Graphs, Dynamic Programming & Backtracking',
      items: [
        { id: 'w4-1', title: 'Binary Search Tree & Graph Traversals', description: 'Master BFS, DFS, Dijkstra, and cycle detection in directed graphs.', category: 'core', completed: false },
        { id: 'w4-2', title: 'Dynamic Programming Patterns', description: '0/1 Knapsack, Longest Common Subsequence, and state memoization.', category: 'practice', completed: false },
        { id: 'w4-3', title: 'Timed Mock Assessment', description: 'Complete a 60-minute mixed coding test on NexPrep with hidden test suites.', category: 'practice', completed: false }
      ]
    },
    {
      week_number: 5,
      theme: 'Production Projects & System Integration',
      focus: 'REST APIs, Databases, Caching, Authentication & Deployment',
      items: [
        { id: 'w5-1', title: 'Database Optimization & Indexing', description: 'Write optimized SQL queries, composite indexes, and prevent N+1 queries.', category: 'core', completed: false },
        { id: 'w5-2', title: 'Build Full Stack Capstone Project', description: 'Integrate real authentication, state management, and cloud deployment.', category: 'project', completed: false },
        { id: 'w5-3', title: 'Update ATS-Friendly Resume', description: 'Use NexPrep AI Resume Builder to generate quantifiable bullet points.', category: 'project', completed: false }
      ]
    },
    {
      week_number: 6,
      theme: 'Placement Drives & Mock Technical Interviews',
      focus: 'System Design, Behavioral STAR Method & High-Stakes Drills',
      items: [
        { id: 'w6-1', title: 'System Design Fundamentals', description: 'Horizontal scaling, load balancers, CDN, caching and CAP theorem.', category: 'core', completed: false },
        { id: 'w6-2', title: 'AI Mock Interview Simulator', description: 'Complete 3 technical and HR interview sessions on NexPrep with feedback.', category: 'interview', completed: false },
        { id: 'w6-3', title: 'Apply to Active Placement Drives', description: 'Review eligibility criteria and submit verified applications.', category: 'interview', completed: false }
      ]
    }
  ];

  // Calculate initial progress
  let total = 0;
  let done = 0;
  weeks.forEach((w: RoadmapWeek) => w.items.forEach((i: any) => {
    total++;
    if (i.completed) done++;
  }));
  const progress = Math.round((done / Math.max(1, total)) * 100);

  const roadmap: StudentRoadmap = {
    id: `rm-${studentId}`,
    student_id: studentId,
    target_role: targetRole,
    duration_weeks: 6,
    weeks,
    progress_percentage: progress,
    updated_at: new Date().toISOString()
  };

  // Upsert in store
  const existingIdx = memoryStore.roadmaps.findIndex(r => r.student_id === studentId);
  if (existingIdx >= 0) {
    memoryStore.roadmaps[existingIdx] = roadmap;
  } else {
    memoryStore.roadmaps.push(roadmap);
  }

  return roadmap;
}
