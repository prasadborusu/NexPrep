import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { config } from '../config';
import {
  UserProfile,
  Assessment,
  Question,
  AssessmentSubmission,
  CodingProblem,
  CodeSubmission,
  ResumeData,
  ATSAnalysisResult,
  StudentRoadmap,
  InterviewSession,
  PlacementDrive,
  PlacementApplication,
  BulkEmailLog
} from '../types';

const isLiveSupabase = Boolean(
  config.supabaseUrl &&
  !config.supabaseUrl.includes('mock-supabase') &&
  !config.supabaseUrl.includes('your-project-id') &&
  config.supabaseAnonKey &&
  config.supabaseAnonKey !== 'mock-anon-key' &&
  config.supabaseAnonKey !== 'your-supabase-anon-key'
);

export const supabase = isLiveSupabase
  ? createClient(config.supabaseUrl, config.supabaseServiceKey || config.supabaseAnonKey)
  : null;

if (isLiveSupabase) {
  console.log(`⚡ Connected to Live Supabase: ${config.supabaseUrl}`);
} else {
  console.log('ℹ️ Running on local persistent file store (store.json). Set SUPABASE_URL & SUPABASE_ANON_KEY in backend/.env to switch to live Supabase.');
}

// Local JSON Storage Path for Production Persistence
const DATA_DIR = path.resolve(__dirname, '../../data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

// Real initial curriculum & assessment bank (Standardized placement screening modules)
const INITIAL_ASSESSMENTS: Assessment[] = [
  {
    id: 'assessment-core-cs',
    title: 'Core Computer Science & Technical Screening',
    description: 'Standardized evaluation covering Data Structures, SQL Transactions, Object-Oriented Principles, and Algorithmic Analysis.',
    type: 'mixed',
    duration_minutes: 45,
    total_marks: 40,
    pass_percentage: 60.0,
    is_active: true,
    scheduled_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60).toISOString(),
    created_by: 'system',
    created_at: new Date().toISOString()
  },
  {
    id: 'assessment-java-oop',
    title: 'Java & Object-Oriented System Architecture',
    description: 'Technical evaluation on Polymorphism, Inheritance, Garbage Collection, and Collections Framework.',
    type: 'mcq',
    duration_minutes: 30,
    total_marks: 30,
    pass_percentage: 70.0,
    is_active: true,
    scheduled_at: new Date().toISOString(),
    created_by: 'system',
    created_at: new Date().toISOString()
  }
];

const INITIAL_QUESTIONS: Question[] = [
  {
    id: 'q1',
    assessment_id: 'assessment-core-cs',
    title: 'Time Complexity of HashMap Lookup',
    description: 'What is the average time complexity of retrieving a value from a well-distributed hash map?',
    type: 'mcq',
    marks: 5,
    options: [
      { id: 'opt1', text: 'O(1)' },
      { id: 'opt2', text: 'O(log n)' },
      { id: 'opt3', text: 'O(n)' },
      { id: 'opt4', text: 'O(n log n)' }
    ],
    correct_option_id: 'opt1',
    explanation: 'Under uniform hashing, bucket collisions are minimal, yielding an expected O(1) average lookup time.',
    created_at: new Date().toISOString()
  },
  {
    id: 'q2',
    assessment_id: 'assessment-core-cs',
    title: 'SQL ACID Properties',
    description: 'Which property of ACID ensures that transactions are committed permanently even in the event of a system crash?',
    type: 'mcq',
    marks: 5,
    options: [
      { id: 'opt1', text: 'Atomicity' },
      { id: 'opt2', text: 'Consistency' },
      { id: 'opt3', text: 'Isolation' },
      { id: 'opt4', text: 'Durability' }
    ],
    correct_option_id: 'opt4',
    explanation: 'Durability guarantees that once a transaction has been committed, it will remain committed even in the case of a power outage or crash via write-ahead logging.',
    created_at: new Date().toISOString()
  },
  {
    id: 'q3',
    assessment_id: 'assessment-core-cs',
    title: 'REST Idempotence',
    description: 'Which of the following HTTP methods is NOT inherently idempotent according to RFC 7231?',
    type: 'mcq',
    marks: 5,
    options: [
      { id: 'opt1', text: 'GET' },
      { id: 'opt2', text: 'PUT' },
      { id: 'opt3', text: 'POST' },
      { id: 'opt4', text: 'DELETE' }
    ],
    correct_option_id: 'opt3',
    explanation: 'POST requests generally produce side effects on each invocation (e.g. creating multiple resources) and are thus non-idempotent.',
    created_at: new Date().toISOString()
  },
  {
    id: 'q4',
    assessment_id: 'assessment-core-cs',
    title: 'Two Sum Problem',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    type: 'coding',
    marks: 25,
    allowed_languages: ['python', 'javascript', 'java', 'cpp'],
    starter_code: {
      python: 'def twoSum(nums, target):\n    # Return [index1, index2]\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []\n\nimport sys, json\ninput_data = sys.stdin.read().strip()\nif input_data:\n    d = json.loads(input_data)\n    print(json.dumps(twoSum(d["nums"], d["target"])))\n',
      javascript: 'function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}\n\nconst fs = require("fs");\nconst input = fs.readFileSync(0, "utf-8").trim();\nif (input) {\n    const d = JSON.parse(input);\n    console.log(JSON.stringify(twoSum(d.nums, d.target)));\n}\n'
    },
    test_cases: [
      { id: 'tc1', input: '{"nums": [2, 7, 11, 15], "target": 9}', expected_output: '[0, 1]', is_hidden: false },
      { id: 'tc2', input: '{"nums": [3, 2, 4], "target": 6}', expected_output: '[1, 2]', is_hidden: false },
      { id: 'tc3', input: '{"nums": [3, 3], "target": 6}', expected_output: '[0, 1]', is_hidden: true }
    ],
    constraints: '2 <= nums.length <= 10^4, exactly one solution',
    difficulty: 'easy',
    category: 'Algorithms',
    created_at: new Date().toISOString()
  }
];

const INITIAL_CODING_PROBLEMS: CodingProblem[] = [
  {
    id: 'prob-two-sum',
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'easy',
    category: 'Arrays & Hashing',
    tags: ['Array', 'Hash Table'],
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    examples: [
      { input: 'nums = [2, 7, 11, 15], target = 9', output: '[0, 1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3, 2, 4], target = 6', output: '[1, 2]' }
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9', 'Only one valid answer exists.'],
    starter_code: {
      python: 'def twoSum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in seen:\n            return [seen[diff], i]\n        seen[num] = i\n    return []\n\nimport sys, json\ninput_data = sys.stdin.read().strip()\nif input_data:\n    d = json.loads(input_data)\n    print(json.dumps(twoSum(d["nums"], d["target"])))\n',
      javascript: 'function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const comp = target - nums[i];\n        if (map.has(comp)) return [map.get(comp), i];\n        map.set(nums[i], i);\n    }\n    return [];\n}\n\nconst fs = require("fs");\nconst input = fs.readFileSync(0, "utf-8").trim();\nif (input) {\n    const d = JSON.parse(input);\n    console.log(JSON.stringify(twoSum(d.nums, d.target)));\n}\n',
      java: 'import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        System.out.println("[0, 1]");\n    }\n}\n',
      cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "[0, 1]" << endl;\n    return 0;\n}\n'
    },
    test_cases: [
      { id: 'tc1', input: '{"nums": [2, 7, 11, 15], "target": 9}', expected_output: '[0, 1]', is_hidden: false },
      { id: 'tc2', input: '{"nums": [3, 2, 4], "target": 6}', expected_output: '[1, 2]', is_hidden: false },
      { id: 'tc3', input: '{"nums": [3, 3], "target": 6}', expected_output: '[0, 1]', is_hidden: true }
    ],
    acceptance_rate: 0,
    total_submissions: 0,
    created_at: new Date().toISOString()
  },
  {
    id: 'prob-valid-parentheses',
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    difficulty: 'easy',
    category: 'Stack',
    tags: ['Stack', 'String'],
    description: 'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid.',
    examples: [
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' }
    ],
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only "()[]{}"'],
    starter_code: {
      python: 'def isValid(s: str) -> bool:\n    stack = []\n    mapping = {")": "(", "}": "{", "]": "["}\n    for char in s:\n        if char in mapping:\n            top = stack.pop() if stack else "#"\n            if mapping[char] != top: return False\n        else:\n            stack.append(char)\n    return not stack\n\nimport sys\ns = sys.stdin.read().strip().replace(\'"\', "")\nprint("true" if isValid(s) else "false")\n',
      javascript: 'function isValid(s) {\n    const stack = [];\n    const map = { ")": "(", "}": "{", "]": "[" };\n    for (let c of s) {\n        if (map[c]) {\n            if (stack.pop() !== map[c]) return false;\n        } else {\n            stack.push(c);\n        }\n    }\n    return stack.length === 0;\n}\nconst fs = require("fs");\nconst s = fs.readFileSync(0, "utf-8").trim().replace(/"/g, "");\nconsole.log(isValid(s) ? "true" : "false");\n'
    },
    test_cases: [
      { id: 'tc1', input: '"()[]{}"', expected_output: 'true', is_hidden: false },
      { id: 'tc2', input: '"(]"', expected_output: 'false', is_hidden: false },
      { id: 'tc3', input: '"([{}])"', expected_output: 'true', is_hidden: true }
    ],
    acceptance_rate: 0,
    total_submissions: 0,
    created_at: new Date().toISOString()
  }
];

export interface DataStore {
  profiles: UserProfile[];
  assessments: Assessment[];
  questions: Question[];
  assessment_submissions: AssessmentSubmission[];
  coding_problems: CodingProblem[];
  code_submissions: CodeSubmission[];
  resumes: ResumeData[];
  ats_analyses: ATSAnalysisResult[];
  roadmaps: StudentRoadmap[];
  interview_sessions: InterviewSession[];
  placement_drives: PlacementDrive[];
  placement_applications: PlacementApplication[];
  bulk_email_logs: BulkEmailLog[];
}

function loadInitialStore(): DataStore {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(STORE_FILE)) {
      const content = fs.readFileSync(STORE_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      return {
        profiles: parsed.profiles || [],
        assessments: parsed.assessments || INITIAL_ASSESSMENTS,
        questions: parsed.questions || INITIAL_QUESTIONS,
        assessment_submissions: parsed.assessment_submissions || [],
        coding_problems: parsed.coding_problems || INITIAL_CODING_PROBLEMS,
        code_submissions: parsed.code_submissions || [],
        resumes: parsed.resumes || [],
        ats_analyses: parsed.ats_analyses || [],
        roadmaps: parsed.roadmaps || [],
        interview_sessions: parsed.interview_sessions || [],
        placement_drives: parsed.placement_drives || [],
        placement_applications: parsed.placement_applications || [],
        bulk_email_logs: parsed.bulk_email_logs || []
      };
    }
  } catch (err) {
    console.error('Failed to load store from disk:', err);
  }

  // Initial clean store with ZERO demo profiles, ZERO fake placement drives, ZERO fake submissions
  return {
    profiles: [],
    assessments: INITIAL_ASSESSMENTS,
    questions: INITIAL_QUESTIONS,
    assessment_submissions: [],
    coding_problems: INITIAL_CODING_PROBLEMS,
    code_submissions: [],
    resumes: [],
    ats_analyses: [],
    roadmaps: [],
    interview_sessions: [],
    placement_drives: [],
    placement_applications: [],
    bulk_email_logs: []
  };
}

export const memoryStore: DataStore = loadInitialStore();

export function persistStore(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(memoryStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist store to disk:', err);
  }
}

// Initial write to ensure store.json exists
persistStore();

