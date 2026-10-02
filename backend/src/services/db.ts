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
  config.supabaseAnonKey &&
  config.supabaseAnonKey !== 'mock-anon-key'
);

export const supabase = isLiveSupabase
  ? createClient(config.supabaseUrl, config.supabaseServiceKey || config.supabaseAnonKey)
  : null;

// Strongly-typed in-memory DB Store
export const memoryStore: {
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
} = {
  profiles: [
    {
      id: 'demo-student-id',
      email: 'student@nexprep.io',
      full_name: 'Alex Johnson',
      role: 'student',
      college: 'National Institute of Technology',
      degree: 'B.Tech',
      branch: 'Computer Science & Engineering',
      graduation_year: 2026,
      cgpa: 8.75,
      phone: '+91 98765 43210',
      github_url: 'https://github.com/alexjohnson',
      linkedin_url: 'https://linkedin.com/in/alexjohnson',
      skills: ['Java', 'Python', 'React', 'Node.js', 'PostgreSQL', 'Data Structures', 'REST APIs'],
      target_role: 'Full Stack Engineer',
      bio: 'Enthusiastic CS undergraduate passionate about scalable systems, distributed cloud computing, and AI-assisted workflows.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'demo-admin-id',
      email: 'admin@nexprep.io',
      full_name: 'Dr. Sarah Mitchell',
      role: 'admin',
      college: 'NexPrep Placement Cell',
      degree: 'PhD CS',
      branch: 'Administration',
      graduation_year: 2012,
      cgpa: 9.8,
      phone: '+91 91234 56789',
      skills: ['Curriculum Planning', 'System Design', 'Evaluation'],
      target_role: 'Placement Director',
      bio: 'Placement & Career Development Cell Director, leading corporate relations and talent readiness.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  assessments: [
    {
      id: 'assessment-core-cs',
      title: 'Full Stack & Core CS Screening Assessment',
      description: 'Comprehensive screening covering Data Structures, SQL, OOP concepts, and algorithmic reasoning.',
      type: 'mixed',
      duration_minutes: 45,
      total_marks: 40,
      pass_percentage: 60.0,
      is_active: true,
      scheduled_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
      created_by: 'demo-admin-id',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
    },
    {
      id: 'assessment-java-oop',
      title: 'Java & Object-Oriented Principles Evaluation',
      description: 'Deep dive into polymorphism, inheritance, memory management, garbage collection, and collections framework.',
      type: 'mcq',
      duration_minutes: 30,
      total_marks: 30,
      pass_percentage: 70.0,
      is_active: true,
      scheduled_at: new Date().toISOString(),
      created_by: 'demo-admin-id',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString()
    }
  ],
  questions: [
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
      explanation: 'Durability guarantees that once a transaction has been committed, it will remain committed even in the case of a power outage or crash (usually via write-ahead logging).',
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
  ],
  assessment_submissions: [],
  coding_problems: [
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
      acceptance_rate: 88.5,
      total_submissions: 142,
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
      acceptance_rate: 76.2,
      total_submissions: 98,
      created_at: new Date().toISOString()
    }
  ],
  code_submissions: [],
  resumes: [],
  ats_analyses: [],
  roadmaps: [],
  interview_sessions: [],
  placement_drives: [
    {
      id: 'drive-atlassian',
      company_name: 'Atlassian',
      company_logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
      role_title: 'Associate Software Engineer',
      location: 'Bengaluru, India (Hybrid)',
      ctc_range: '26 - 32 LPA',
      eligibility: {
        min_cgpa: 7.5,
        allowed_branches: ['CSE', 'IT', 'ECE'],
        allowed_batches: [2025, 2026],
        backlogs_allowed: false
      },
      job_description: 'Build enterprise-grade developer productivity platforms. Deep focus on distributed systems, React, Java/Kotlin, and cloud microservices.',
      rounds: ['Online Assessment', 'Technical DSA Interview', 'System Design & OOP', 'Values & Leadership'],
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12).toISOString(),
      apply_url: 'https://www.atlassian.com/company/careers',
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'drive-razorpay',
      company_name: 'Razorpay',
      company_logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&q=80',
      role_title: 'Software Development Engineer 1',
      location: 'Bengaluru, India',
      ctc_range: '18 - 24 LPA',
      eligibility: {
        min_cgpa: 7.0,
        allowed_branches: ['All Engineering Branches'],
        allowed_batches: [2025, 2026],
        backlogs_allowed: false
      },
      job_description: 'Engineer high-throughput transactional payment rails with 99.999% reliability. Languages: Go, Python, Node.js, PHP, Kafka, MySQL.',
      rounds: ['Coding Assessment', 'DSA & Problem Solving', 'Machine Coding', 'Culture & Managerial'],
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 18).toISOString(),
      apply_url: 'https://razorpay.com/jobs',
      is_active: true,
      created_at: new Date().toISOString()
    }
  ],
  placement_applications: [],
  bulk_email_logs: []
};
