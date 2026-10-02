// Company Interview Repository
// Source: Curated from public interview experience reports
// All questions sourced from community-shared interview experiences or AI-generated practice
// Source types: 'community_report' | 'ai_generated'

export interface Company {
  id: string;
  name: string;
  slug: string;
  category: 'product' | 'service' | 'consulting' | 'finance' | 'startup';
  description: string;
  website?: string;
  logo_emoji: string;
  interview_rounds: string[];
  interview_disclaimer: string;
}

export interface TheoryQuestion {
  id: string;
  company_id: string;
  question: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  expected_concepts: string[];
  sample_answer?: string;
  source_type: 'community_report' | 'ai_generated';
  source_note: string;
}

export interface AptitudeQuestion {
  id: string;
  company_id: string;
  question: string;
  options: { id: string; text: string }[];
  correct_option_id: string;
  explanation: string;
  category: 'quantitative' | 'logical' | 'verbal' | 'data_interpretation';
  difficulty: 'easy' | 'medium' | 'hard';
  source_type: 'community_report' | 'ai_generated';
  source_note: string;
}

export interface HRQuestion {
  id: string;
  company_id: string;
  question: string;
  category: 'behavioral' | 'situational' | 'company_specific' | 'general';
  tips: string[];
  source_type: 'community_report' | 'ai_generated';
  source_note: string;
}

// ═══════════════════════════════════════════════
// COMPANIES
// ═══════════════════════════════════════════════
export const COMPANIES: Company[] = [
  {
    id: 'tcs',
    name: 'TCS',
    slug: 'tcs',
    category: 'service',
    description: 'Tata Consultancy Services — India\'s largest IT services company with global presence across 46 countries.',
    website: 'https://www.tcs.com',
    logo_emoji: '🔵',
    interview_rounds: ['Online Test (Aptitude + Technical)', 'Technical Interview', 'Managerial Round', 'HR Round'],
    interview_disclaimer: 'Interview structure may vary by role, batch, and hiring cycle. This content is based on publicly shared interview experiences from the community and AI-generated practice questions.'
  },
  {
    id: 'infosys',
    name: 'Infosys',
    slug: 'infosys',
    category: 'service',
    description: 'Infosys — Global leader in next-generation digital services and consulting.',
    website: 'https://www.infosys.com',
    logo_emoji: '🟣',
    interview_rounds: ['InfyTQ Assessment', 'Coding Round', 'Technical Interview', 'HR Interview'],
    interview_disclaimer: 'Interview pattern may differ by role and recruiting cycle. Questions are based on community-shared experiences and AI-generated practice content.'
  },
  {
    id: 'wipro',
    name: 'Wipro',
    slug: 'wipro',
    category: 'service',
    description: 'Wipro — Leading technology services and consulting company.',
    website: 'https://www.wipro.com',
    logo_emoji: '🟤',
    interview_rounds: ['Online Test', 'Technical Interview', 'HR Interview'],
    interview_disclaimer: 'Interview content sourced from publicly available community reports and AI-generated practice questions. Not official company material.'
  },
  {
    id: 'amazon',
    name: 'Amazon',
    slug: 'amazon',
    category: 'product',
    description: 'Amazon — Global technology and e-commerce leader known for its Leadership Principles and Bar Raiser process.',
    website: 'https://www.amazon.jobs',
    logo_emoji: '🟠',
    interview_rounds: ['Online Assessment (DSA)', 'Phone Screen', 'Onsite Loop (4-5 rounds)', 'Bar Raiser'],
    interview_disclaimer: 'Amazon\'s interview process emphasizes Leadership Principles (LPs). Content is based on community-shared experiences and AI-generated practice. Not official Amazon content.'
  },
  {
    id: 'google',
    name: 'Google',
    slug: 'google',
    category: 'product',
    description: 'Google — World-leading tech company focusing on search, cloud, AI and consumer products.',
    website: 'https://careers.google.com',
    logo_emoji: '🔴',
    interview_rounds: ['Phone Screen (1-2)', 'Onsite (4-5 rounds: Coding + System Design + Behavioral)'],
    interview_disclaimer: 'Google interview content is AI-generated for practice. Actual interview questions are confidential. This is not official Google material.'
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    slug: 'microsoft',
    category: 'product',
    description: 'Microsoft — Global technology company known for Windows, Azure, Office 365, and developer tools.',
    website: 'https://careers.microsoft.com',
    logo_emoji: '🔷',
    interview_rounds: ['Online Assessment', 'Phone Screen', 'Onsite (3-5 rounds: Coding + Design + Behavioral)'],
    interview_disclaimer: 'Interview questions are AI-generated for practice purposes. Microsoft\'s actual interview questions are confidential. Not official Microsoft content.'
  },
  {
    id: 'accenture',
    name: 'Accenture',
    slug: 'accenture',
    category: 'consulting',
    description: 'Accenture — Global professional services company with capabilities in digital, cloud, and security.',
    website: 'https://www.accenture.com/careers',
    logo_emoji: '🟡',
    interview_rounds: ['Online Test (Cognitive + Technical)', 'Communication Test', 'Technical Interview', 'HR Interview'],
    interview_disclaimer: 'Content sourced from publicly available community interview experience reports and AI-generated practice questions.'
  },
  {
    id: 'cognizant',
    name: 'Cognizant',
    slug: 'cognizant',
    category: 'service',
    description: 'Cognizant — IT services and consulting company with strong presence in digital engineering.',
    website: 'https://careers.cognizant.com',
    logo_emoji: '🔵',
    interview_rounds: ['CCAT Test', 'Technical Interview', 'HR Interview'],
    interview_disclaimer: 'Interview questions sourced from community-shared experiences and AI-generated practice. Not official Cognizant material.'
  },
  {
    id: 'flipkart',
    name: 'Flipkart',
    slug: 'flipkart',
    category: 'product',
    description: 'Flipkart — India\'s leading e-commerce marketplace focusing on scale, reliability, and innovation.',
    website: 'https://www.flipkartcareers.com',
    logo_emoji: '🟡',
    interview_rounds: ['Online Coding Test', 'Technical Phone Screen', 'Onsite (3-4 rounds: Coding + LLD + HLD)'],
    interview_disclaimer: 'Content is AI-generated for practice. Actual Flipkart interview questions are confidential. Not official Flipkart material.'
  },
  {
    id: 'hcl',
    name: 'HCL Technologies',
    slug: 'hcl',
    category: 'service',
    description: 'HCL Technologies — Global technology company delivering enterprise digital transformation.',
    website: 'https://www.hcltech.com/careers',
    logo_emoji: '🟢',
    interview_rounds: ['Online Assessment', 'Technical Interview (1-2)', 'HR Interview'],
    interview_disclaimer: 'Interview preparation content sourced from community reports and AI-generated practice questions. Not official HCL material.'
  }
];

// ═══════════════════════════════════════════════
// THEORY QUESTIONS BY TOPIC
// ═══════════════════════════════════════════════
export const THEORY_QUESTIONS: TheoryQuestion[] = [
  // ───── OOP ─────
  {
    id: 'tq-oop-1',
    company_id: 'tcs',
    question: 'Explain the four pillars of Object-Oriented Programming with real-world examples.',
    topic: 'OOP',
    difficulty: 'easy',
    expected_concepts: ['encapsulation', 'inheritance', 'polymorphism', 'abstraction', 'example'],
    source_type: 'ai_generated',
    source_note: 'AI-generated practice question — not an official TCS question.'
  },
  {
    id: 'tq-oop-2',
    company_id: 'infosys',
    question: 'What is the difference between method overloading and method overriding? Provide code examples.',
    topic: 'OOP',
    difficulty: 'easy',
    expected_concepts: ['compile-time polymorphism', 'runtime polymorphism', 'signature', 'inheritance', 'example'],
    source_type: 'ai_generated',
    source_note: 'AI-generated practice question — not an official Infosys question.'
  },
  {
    id: 'tq-oop-3',
    company_id: 'amazon',
    question: 'Explain SOLID principles. How do you apply the Open/Closed Principle in a real system?',
    topic: 'OOP',
    difficulty: 'hard',
    expected_concepts: ['single responsibility', 'open/closed', 'liskov', 'interface segregation', 'dependency inversion', 'extensibility'],
    source_type: 'ai_generated',
    source_note: 'AI-generated practice question — not an official Amazon question.'
  },
  {
    id: 'tq-oop-4',
    company_id: 'microsoft',
    question: 'What is the difference between abstract class and interface? When would you use each?',
    topic: 'OOP',
    difficulty: 'medium',
    expected_concepts: ['abstract class', 'interface', 'multiple inheritance', 'default methods', 'partial implementation'],
    source_type: 'ai_generated',
    source_note: 'AI-generated practice question — not an official Microsoft question.'
  },

  // ───── Java ─────
  {
    id: 'tq-java-1',
    company_id: 'tcs',
    question: 'How does the Java Virtual Machine (JVM) manage memory? Explain the Heap vs Stack and Garbage Collection.',
    topic: 'Java',
    difficulty: 'medium',
    expected_concepts: ['heap', 'stack', 'garbage collection', 'gc roots', 'mark and sweep', 'eden space', 'memory leak'],
    source_type: 'ai_generated',
    source_note: 'AI-generated practice question based on common Java interview topics.'
  },
  {
    id: 'tq-java-2',
    company_id: 'wipro',
    question: 'What is the Java Collections Framework? Compare ArrayList, LinkedList, HashMap, and HashSet.',
    topic: 'Java',
    difficulty: 'medium',
    expected_concepts: ['list', 'map', 'set', 'arraylist', 'linkedlist', 'hashmap', 'time complexity', 'thread safety'],
    source_type: 'ai_generated',
    source_note: 'AI-generated practice question — not an official Wipro question.'
  },
  {
    id: 'tq-java-3',
    company_id: 'cognizant',
    question: 'What is the difference between `==` and `.equals()` in Java? What is `hashCode()`?',
    topic: 'Java',
    difficulty: 'easy',
    expected_concepts: ['reference equality', 'value equality', 'hashcode contract', 'string pool', 'override'],
    source_type: 'ai_generated',
    source_note: 'AI-generated practice question — not an official Cognizant question.'
  },
  {
    id: 'tq-java-4',
    company_id: 'flipkart',
    question: 'Explain Java Generics. Why are they used? What is type erasure?',
    topic: 'Java',
    difficulty: 'hard',
    expected_concepts: ['type safety', 'generics', 'wildcards', 'bounded type', 'type erasure', 'raw types'],
    source_type: 'ai_generated',
    source_note: 'AI-generated practice question — not an official Flipkart question.'
  },

  // ───── DBMS ─────
  {
    id: 'tq-dbms-1',
    company_id: 'accenture',
    question: 'Explain ACID properties in database transactions with examples.',
    topic: 'DBMS',
    difficulty: 'medium',
    expected_concepts: ['atomicity', 'consistency', 'isolation', 'durability', 'transaction', 'rollback'],
    source_type: 'ai_generated',
    source_note: 'AI-generated practice question — not an official Accenture question.'
  },
  {
    id: 'tq-dbms-2',
    company_id: 'tcs',
    question: 'What are database indexes? How do B-Tree indexes work, and what are their trade-offs?',
    topic: 'DBMS',
    difficulty: 'medium',
    expected_concepts: ['b-tree', 'index', 'query optimization', 'write overhead', 'selectivity', 'clustered index'],
    source_type: 'ai_generated',
    source_note: 'AI-generated practice question — not an official TCS question.'
  },
  {
    id: 'tq-dbms-3',
    company_id: 'infosys',
    question: 'Explain normalization: 1NF, 2NF, 3NF, and BCNF with examples.',
    topic: 'DBMS',
    difficulty: 'hard',
    expected_concepts: ['1nf', '2nf', '3nf', 'bcnf', 'functional dependency', 'partial dependency', 'transitive dependency'],
    source_type: 'ai_generated',
    source_note: 'AI-generated practice question — not an official Infosys question.'
  },
  {
    id: 'tq-dbms-4',
    company_id: 'amazon',
    question: 'When would you choose SQL over NoSQL? Explain CAP theorem.',
    topic: 'DBMS',
    difficulty: 'hard',
    expected_concepts: ['cap theorem', 'consistency', 'availability', 'partition tolerance', 'sql vs nosql', 'use cases'],
    source_type: 'ai_generated',
    source_note: 'AI-generated practice question — not an official Amazon question.'
  },

  // ───── OS ─────
  {
    id: 'tq-os-1',
    company_id: 'microsoft',
    question: 'What is a deadlock? What are the four necessary conditions? How can it be prevented?',
    topic: 'Operating Systems',
    difficulty: 'medium',
    expected_concepts: ['mutual exclusion', 'hold and wait', 'no preemption', 'circular wait', 'prevention', 'banker algorithm'],
    source_type: 'ai_generated',
    source_note: 'AI-generated practice question — not an official Microsoft question.'
  },
  {
    id: 'tq-os-2',
    company_id: 'google',
    question: 'Explain the difference between a process and a thread. What is context switching?',
    topic: 'Operating Systems',
    difficulty: 'easy',
    expected_concepts: ['process', 'thread', 'pcb', 'context switch', 'overhead', 'memory isolation', 'lightweight'],
    source_type: 'ai_generated',
    source_note: 'AI-generated practice question — not an official Google question.'
  },
  {
    id: 'tq-os-3',
    company_id: 'wipro',
    question: 'What is virtual memory? Explain paging and page faults.',
    topic: 'Operating Systems',
    difficulty: 'medium',
    expected_concepts: ['virtual memory', 'paging', 'page table', 'page fault', 'swap', 'tlb'],
    source_type: 'ai_generated',
    source_note: 'AI-generated practice question — not an official Wipro question.'
  },

  // ───── CN ─────
  {
    id: 'tq-cn-1',
    company_id: 'tcs',
    question: 'What happens when you type a URL in a browser? Explain the complete request-response cycle.',
    topic: 'Computer Networks',
    difficulty: 'medium',
    expected_concepts: ['dns', 'tcp handshake', 'http request', 'server response', 'tls', 'rendering'],
    source_type: 'ai_generated',
    source_note: 'AI-generated practice question — not an official TCS question.'
  },
  {
    id: 'tq-cn-2',
    company_id: 'infosys',
    question: 'Explain the OSI model with all 7 layers and their functions.',
    topic: 'Computer Networks',
    difficulty: 'easy',
    expected_concepts: ['physical', 'data link', 'network', 'transport', 'session', 'presentation', 'application', 'tcp/ip'],
    source_type: 'ai_generated',
    source_note: 'AI-generated practice question — not an official Infosys question.'
  },
  {
    id: 'tq-cn-3',
    company_id: 'amazon',
    question: 'What is the difference between HTTP and HTTPS? How does TLS work?',
    topic: 'Computer Networks',
    difficulty: 'medium',
    expected_concepts: ['encryption', 'tls handshake', 'certificate', 'public key', 'private key', 'https security'],
    source_type: 'ai_generated',
    source_note: 'AI-generated practice question — not an official Amazon question.'
  },

  // ───── DSA ─────
  {
    id: 'tq-dsa-1',
    company_id: 'google',
    question: 'Explain Big O notation. What is the time and space complexity of common sorting algorithms?',
    topic: 'DSA',
    difficulty: 'medium',
    expected_concepts: ['big o', 'merge sort', 'quick sort', 'heap sort', 'time complexity', 'space complexity', 'best average worst case'],
    source_type: 'ai_generated',
    source_note: 'AI-generated practice question — not an official Google question.'
  },
  {
    id: 'tq-dsa-2',
    company_id: 'amazon',
    question: 'Compare BFS and DFS. When would you use each? What are their time complexities?',
    topic: 'DSA',
    difficulty: 'medium',
    expected_concepts: ['bfs', 'dfs', 'queue', 'stack', 'shortest path', 'connected components', 'o(v+e)'],
    source_type: 'ai_generated',
    source_note: 'AI-generated practice question — not an official Amazon question.'
  },
  {
    id: 'tq-dsa-3',
    company_id: 'flipkart',
    question: 'Explain dynamic programming. What is the difference between memoization and tabulation?',
    topic: 'DSA',
    difficulty: 'hard',
    expected_concepts: ['overlapping subproblems', 'optimal substructure', 'memoization', 'tabulation', 'top-down', 'bottom-up'],
    source_type: 'ai_generated',
    source_note: 'AI-generated practice question — not an official Flipkart question.'
  },

  // ───── System Design ─────
  {
    id: 'tq-sd-1',
    company_id: 'google',
    question: 'How would you design a URL shortening service like bit.ly? Discuss the system components.',
    topic: 'System Design',
    difficulty: 'hard',
    expected_concepts: ['hash function', 'database', 'cache', 'scalability', 'load balancer', 'redirect', 'analytics'],
    source_type: 'ai_generated',
    source_note: 'AI-generated practice question — not an official Google question.'
  },
  {
    id: 'tq-sd-2',
    company_id: 'amazon',
    question: 'Design a notification system that can send millions of messages per day via email, SMS, and push.',
    topic: 'System Design',
    difficulty: 'hard',
    expected_concepts: ['message queue', 'kafka', 'rate limiting', 'retry logic', 'fanout', 'delivery guarantees'],
    source_type: 'ai_generated',
    source_note: 'AI-generated practice question — not an official Amazon question.'
  },

  // ───── Python ─────
  {
    id: 'tq-python-1',
    company_id: 'cognizant',
    question: 'What is a Python decorator? Write a decorator that logs function call time.',
    topic: 'Python',
    difficulty: 'medium',
    expected_concepts: ['decorator', 'closure', 'functools.wraps', 'higher-order function', 'wrapper', 'example code'],
    source_type: 'ai_generated',
    source_note: 'AI-generated practice question — not an official Cognizant question.'
  },
  {
    id: 'tq-python-2',
    company_id: 'hcl',
    question: 'Explain Python\'s GIL (Global Interpreter Lock). How does it affect multithreading?',
    topic: 'Python',
    difficulty: 'hard',
    expected_concepts: ['gil', 'cpython', 'thread safety', 'multiprocessing', 'io-bound', 'cpu-bound', 'limitation'],
    source_type: 'ai_generated',
    source_note: 'AI-generated practice question — not an official HCL question.'
  },

  // ───── SQL ─────
  {
    id: 'tq-sql-1',
    company_id: 'accenture',
    question: 'What are the different types of JOINs in SQL? Provide examples for each.',
    topic: 'SQL',
    difficulty: 'easy',
    expected_concepts: ['inner join', 'left join', 'right join', 'full outer join', 'cross join', 'self join', 'example'],
    source_type: 'ai_generated',
    source_note: 'AI-generated practice question — not an official Accenture question.'
  },
  {
    id: 'tq-sql-2',
    company_id: 'wipro',
    question: 'What are window functions in SQL? Explain RANK, DENSE_RANK, and ROW_NUMBER.',
    topic: 'SQL',
    difficulty: 'hard',
    expected_concepts: ['window function', 'partition by', 'order by', 'rank', 'dense_rank', 'row_number', 'over clause'],
    source_type: 'ai_generated',
    source_note: 'AI-generated practice question — not an official Wipro question.'
  },
  {
    id: 'tq-sql-3',
    company_id: 'tcs',
    question: 'What is the difference between TRUNCATE, DELETE, and DROP?',
    topic: 'SQL',
    difficulty: 'easy',
    expected_concepts: ['truncate', 'delete', 'drop', 'rollback', 'ddl vs dml', 'where clause', 'recovery'],
    source_type: 'ai_generated',
    source_note: 'AI-generated practice question — not an official TCS question.'
  }
];

// ═══════════════════════════════════════════════
// APTITUDE QUESTIONS
// ═══════════════════════════════════════════════
export const APTITUDE_QUESTIONS: AptitudeQuestion[] = [
  {
    id: 'aq-quant-1',
    company_id: 'tcs',
    question: 'A train travels at 60 km/h. How many seconds does it take to cross a 300m bridge if the train is 200m long?',
    options: [
      { id: 'a', text: '25 seconds' },
      { id: 'b', text: '30 seconds' },
      { id: 'c', text: '35 seconds' },
      { id: 'd', text: '40 seconds' }
    ],
    correct_option_id: 'b',
    explanation: 'Total distance = 300 + 200 = 500m. Speed = 60 km/h = 16.67 m/s. Time = 500/16.67 ≈ 30 seconds.',
    category: 'quantitative',
    difficulty: 'medium',
    source_type: 'ai_generated',
    source_note: 'AI-generated practice question.'
  },
  {
    id: 'aq-quant-2',
    company_id: 'infosys',
    question: 'If 8 workers can complete a task in 12 days, how many days will 16 workers take to complete the same task?',
    options: [
      { id: 'a', text: '4 days' },
      { id: 'b', text: '6 days' },
      { id: 'c', text: '8 days' },
      { id: 'd', text: '10 days' }
    ],
    correct_option_id: 'b',
    explanation: 'Total work = 8 × 12 = 96 worker-days. With 16 workers: 96 / 16 = 6 days.',
    category: 'quantitative',
    difficulty: 'easy',
    source_type: 'ai_generated',
    source_note: 'AI-generated practice question.'
  },
  {
    id: 'aq-quant-3',
    company_id: 'wipro',
    question: 'A sum of money doubles itself in 10 years at simple interest. What is the annual interest rate?',
    options: [
      { id: 'a', text: '5%' },
      { id: 'b', text: '8%' },
      { id: 'c', text: '10%' },
      { id: 'd', text: '12%' }
    ],
    correct_option_id: 'c',
    explanation: 'SI formula: P×R×T/100 = P → R×10/100 = 1 → R = 10%',
    category: 'quantitative',
    difficulty: 'easy',
    source_type: 'ai_generated',
    source_note: 'AI-generated practice question.'
  },
  {
    id: 'aq-quant-4',
    company_id: 'accenture',
    question: 'The ratio of ages of A and B is 3:5. After 10 years, the ratio will be 5:7. What is A\'s current age?',
    options: [
      { id: 'a', text: '10 years' },
      { id: 'b', text: '15 years' },
      { id: 'c', text: '20 years' },
      { id: 'd', text: '25 years' }
    ],
    correct_option_id: 'b',
    explanation: 'Let A = 3x, B = 5x. (3x+10)/(5x+10) = 5/7 → 21x+70 = 25x+50 → 4x = 20 → x = 5. A = 15.',
    category: 'quantitative',
    difficulty: 'medium',
    source_type: 'ai_generated',
    source_note: 'AI-generated practice question.'
  },
  {
    id: 'aq-logic-1',
    company_id: 'tcs',
    question: 'All cats are mammals. All mammals are animals. Which conclusion MUST be true?',
    options: [
      { id: 'a', text: 'All animals are cats' },
      { id: 'b', text: 'All cats are animals' },
      { id: 'c', text: 'All animals are mammals' },
      { id: 'd', text: 'Some animals are not cats' }
    ],
    correct_option_id: 'b',
    explanation: 'By transitive logic: All cats are mammals AND all mammals are animals → All cats are animals.',
    category: 'logical',
    difficulty: 'easy',
    source_type: 'ai_generated',
    source_note: 'AI-generated practice question.'
  },
  {
    id: 'aq-logic-2',
    company_id: 'cognizant',
    question: 'In a series: 2, 6, 12, 20, 30, ___ . What is the next number?',
    options: [
      { id: 'a', text: '40' },
      { id: 'b', text: '42' },
      { id: 'c', text: '44' },
      { id: 'd', text: '46' }
    ],
    correct_option_id: 'b',
    explanation: 'Pattern: n(n+1). 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, 6×7=42.',
    category: 'logical',
    difficulty: 'medium',
    source_type: 'ai_generated',
    source_note: 'AI-generated practice question.'
  },
  {
    id: 'aq-logic-3',
    company_id: 'infosys',
    question: 'Five people A, B, C, D, E are seated in a row. A is not at any end. B is to the right of C. D is at the right end. E is to the left of A. Who is at the left end?',
    options: [
      { id: 'a', text: 'B' },
      { id: 'b', text: 'C' },
      { id: 'c', text: 'E' },
      { id: 'd', text: 'Cannot be determined' }
    ],
    correct_option_id: 'b',
    explanation: 'D is at right end. A not at ends. E is left of A. B is right of C. Arrangement: C, E, A, B, D → C is at left end.',
    category: 'logical',
    difficulty: 'hard',
    source_type: 'ai_generated',
    source_note: 'AI-generated practice question.'
  },
  {
    id: 'aq-verbal-1',
    company_id: 'hcl',
    question: 'Choose the word most similar in meaning to AMELIORATE:',
    options: [
      { id: 'a', text: 'Deteriorate' },
      { id: 'b', text: 'Improve' },
      { id: 'c', text: 'Ignore' },
      { id: 'd', text: 'Complicate' }
    ],
    correct_option_id: 'b',
    explanation: 'Ameliorate means to make something bad or unsatisfactory better. Synonym: Improve.',
    category: 'verbal',
    difficulty: 'medium',
    source_type: 'ai_generated',
    source_note: 'AI-generated practice question.'
  },
  {
    id: 'aq-verbal-2',
    company_id: 'wipro',
    question: 'Choose the correct sentence:',
    options: [
      { id: 'a', text: 'Neither the manager nor the employees was present.' },
      { id: 'b', text: 'Neither the manager nor the employees were present.' },
      { id: 'c', text: 'Neither the manager nor the employees is present.' },
      { id: 'd', text: 'Neither the manager nor the employees are present.' }
    ],
    correct_option_id: 'b',
    explanation: 'With "neither...nor", the verb agrees with the subject closest to it. "employees" is plural → "were".',
    category: 'verbal',
    difficulty: 'medium',
    source_type: 'ai_generated',
    source_note: 'AI-generated practice question.'
  },
  {
    id: 'aq-di-1',
    company_id: 'accenture',
    question: 'If Company A had revenue of ₹500Cr in 2020 and ₹650Cr in 2022, what is the % increase?',
    options: [
      { id: 'a', text: '20%' },
      { id: 'b', text: '25%' },
      { id: 'c', text: '30%' },
      { id: 'd', text: '35%' }
    ],
    correct_option_id: 'c',
    explanation: '% increase = (650-500)/500 × 100 = 150/500 × 100 = 30%.',
    category: 'data_interpretation',
    difficulty: 'easy',
    source_type: 'ai_generated',
    source_note: 'AI-generated practice question.'
  }
];

// ═══════════════════════════════════════════════
// HR QUESTIONS
// ═══════════════════════════════════════════════
export const HR_QUESTIONS: HRQuestion[] = [
  {
    id: 'hr-1',
    company_id: 'tcs',
    question: 'Tell me about yourself.',
    category: 'general',
    tips: [
      'Start with your current status (final year / recent graduate)',
      'Mention your degree, branch, and college',
      'Highlight 1-2 key technical skills or projects',
      'Connect to why you are interested in this role/company',
      'Keep it under 2 minutes'
    ],
    source_type: 'ai_generated',
    source_note: 'Common HR question — AI-generated tips for structuring your response.'
  },
  {
    id: 'hr-2',
    company_id: 'infosys',
    question: 'Why do you want to join Infosys?',
    category: 'company_specific',
    tips: [
      'Research Infosys\'s recent projects, technology pillars, or CSR initiatives',
      'Mention specific programs (e.g., InfyTQ, digital accelerator)',
      'Connect your skills to their technology stack',
      'Avoid generic answers like "It\'s a big company"',
      'Show genuine interest and preparation'
    ],
    source_type: 'ai_generated',
    source_note: 'AI-generated practice question — not an official Infosys question.'
  },
  {
    id: 'hr-3',
    company_id: 'amazon',
    question: 'Tell me about a time you failed and what you learned from it.',
    category: 'behavioral',
    tips: [
      'Use the STAR method: Situation, Task, Action, Result',
      'Choose a real failure — not something trivial',
      'Focus more on learning and recovery than the failure',
      'Show ownership and accountability',
      'Explain how you applied the lesson in future work'
    ],
    source_type: 'ai_generated',
    source_note: 'Reflects Amazon\'s Leadership Principle "Learn and Be Curious" — AI-generated practice.'
  },
  {
    id: 'hr-4',
    company_id: 'google',
    question: 'Describe a challenging project you worked on. How did you handle it?',
    category: 'behavioral',
    tips: [
      'Select a project with real technical or collaborative challenges',
      'Explain the complexity, your role, and your approach',
      'Quantify the outcome where possible',
      'Highlight problem-solving and collaboration skills',
      'Be specific and honest about your individual contribution'
    ],
    source_type: 'ai_generated',
    source_note: 'AI-generated practice question — not an official Google question.'
  },
  {
    id: 'hr-5',
    company_id: 'microsoft',
    question: 'What are your strengths and weaknesses?',
    category: 'general',
    tips: [
      'For strengths: choose ones relevant to the role and back them with examples',
      'For weaknesses: choose a real one that you are actively improving',
      'Avoid saying "I am a perfectionist" as a weakness',
      'Show self-awareness and a growth mindset',
      'Keep it professional and concise'
    ],
    source_type: 'ai_generated',
    source_note: 'AI-generated practice question — not an official Microsoft question.'
  },
  {
    id: 'hr-6',
    company_id: 'accenture',
    question: 'Where do you see yourself in 5 years?',
    category: 'situational',
    tips: [
      'Align your goals with the company\'s growth path',
      'Show ambition but be realistic',
      'Mention technical skills you want to develop',
      'If targeting a leadership role, mention it',
      'Show commitment to the organization'
    ],
    source_type: 'ai_generated',
    source_note: 'AI-generated practice question — not an official Accenture question.'
  },
  {
    id: 'hr-7',
    company_id: 'wipro',
    question: 'How do you handle working under pressure or tight deadlines?',
    category: 'behavioral',
    tips: [
      'Give a concrete example from a project or hackathon',
      'Explain your prioritization method',
      'Mention communication with teammates under pressure',
      'Describe the outcome and what you delivered',
      'Stay positive and solution-focused'
    ],
    source_type: 'ai_generated',
    source_note: 'AI-generated practice question — not an official Wipro question.'
  },
  {
    id: 'hr-8',
    company_id: 'cognizant',
    question: 'Are you comfortable working in shifts or relocating to other cities?',
    category: 'company_specific',
    tips: [
      'Be honest about your flexibility',
      'If open to relocation, express enthusiasm',
      'If there are constraints, mention them professionally',
      'Ask about the specific project location if unsure',
      'Show adaptability as a positive trait'
    ],
    source_type: 'ai_generated',
    source_note: 'AI-generated practice question — not an official Cognizant question.'
  },
  {
    id: 'hr-9',
    company_id: 'flipkart',
    question: 'Why should we hire you?',
    category: 'general',
    tips: [
      'Summarize your strongest technical skills relevant to the role',
      'Highlight what makes you different (projects, problem-solving)',
      'Connect your background to the company\'s tech stack or domain',
      'Show enthusiasm and readiness to contribute',
      'Be confident, not arrogant'
    ],
    source_type: 'ai_generated',
    source_note: 'AI-generated practice question — not an official Flipkart question.'
  },
  {
    id: 'hr-10',
    company_id: 'hcl',
    question: 'Do you have any questions for us?',
    category: 'general',
    tips: [
      'Always have 2-3 questions ready — shows interest',
      'Ask about team structure, tech stack, or growth opportunities',
      'Avoid asking about salary at early stages',
      'Ask about onboarding or training programs',
      'Example: "What does the typical first project look like for a fresh hire?"'
    ],
    source_type: 'ai_generated',
    source_note: 'Common interview close — AI-generated tips for responding effectively.'
  }
];

// Helper lookup functions
export function getCompanyById(id: string): Company | undefined {
  return COMPANIES.find(c => c.id === id);
}

export function getCompanyBySlug(slug: string): Company | undefined {
  return COMPANIES.find(c => c.slug === slug);
}

export function getTheoryQuestionsByCompany(companyId: string, topic?: string): TheoryQuestion[] {
  return THEORY_QUESTIONS.filter(q =>
    q.company_id === companyId && (!topic || q.topic === topic)
  );
}

export function getAptitudeByCompany(companyId: string, category?: string): AptitudeQuestion[] {
  return APTITUDE_QUESTIONS.filter(q =>
    q.company_id === companyId && (!category || q.category === category)
  );
}

export function getHRByCompany(companyId: string): HRQuestion[] {
  return HR_QUESTIONS.filter(q => q.company_id === companyId);
}

export function getAllTopics(): string[] {
  return [...new Set(THEORY_QUESTIONS.map(q => q.topic))];
}
