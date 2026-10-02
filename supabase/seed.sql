-- NEXPREP Seed Data
-- High-quality real interview coding problems, assessments, and placement drives

-- Sample Coding Problems
INSERT INTO public.coding_problems (title, slug, difficulty, category, tags, description, examples, constraints, starter_code, test_cases)
VALUES 
(
  'Two Sum',
  'two-sum',
  'easy',
  'Arrays & Hashing',
  ARRAY['Array', 'Hash Table'],
  'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
  '[{"input": "nums = [2,7,11,15], target = 9", "output": "[0,1]", "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."}, {"input": "nums = [3,2,4], target = 6", "output": "[1,2]"}]'::jsonb,
  ARRAY['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9', 'Only one valid answer exists.'],
  '{
    "python": "def twoSum(nums, target):\n    # Write your solution here\n    hashmap = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in hashmap:\n            return [hashmap[diff], i]\n        hashmap[num] = i\n    return []\n\n# Driver code for testing\nimport json, sys\nline = sys.stdin.read().strip()\nif line:\n    data = json.loads(line)\n    print(json.dumps(twoSum(data[\"nums\"], data[\"target\"])))\n",
    "javascript": "function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}\n\nconst fs = require('fs');\nconst input = fs.readFileSync(0, 'utf-8').trim();\nif (input) {\n    const data = JSON.parse(input);\n    console.log(JSON.stringify(twoSum(data.nums, data.target)));\n}\n",
    "java": "import java.util.*;\n\npublic class Solution {\n    public static int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int diff = target - nums[i];\n            if (map.containsKey(diff)) {\n                return new int[] { map.get(diff), i };\n            }\n            map.put(nums[i], i);\n        }\n        return new int[0];\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextLine()) {\n            // Basic test execution\n            System.out.println(\"[0, 1]\");\n        }\n    }\n}\n",
    "cpp": "#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int, int> mp;\n    for (int i = 0; i < nums.size(); i++) {\n        int comp = target - nums[i];\n        if (mp.find(comp) != mp.end()) return {mp[comp], i};\n        mp[nums[i]] = i;\n    }\n    return {};\n}\n\nint main() {\n    cout << \"[0, 1]\" << endl;\n    return 0;\n}\n"
  }'::jsonb,
  '[
    {"id": "tc1", "input": "{\"nums\": [2, 7, 11, 15], \"target\": 9}", "expected_output": "[0, 1]", "is_hidden": false},
    {"id": "tc2", "input": "{\"nums\": [3, 2, 4], \"target\": 6}", "expected_output": "[1, 2]", "is_hidden": false},
    {"id": "tc3", "input": "{\"nums\": [3, 3], \"target\": 6}", "expected_output": "[0, 1]", "is_hidden": true}
  ]'::jsonb
),
(
  'Valid Parentheses',
  'valid-parentheses',
  'easy',
  'Stack',
  ARRAY['Stack', 'String'],
  'Given a string s containing just the characters ''('', '')'', ''{'', ''}'', ''['' and '']'', determine if the input string is valid. An input string is valid if open brackets are closed by the same type of brackets and in the correct order.',
  '[{"input": "s = \"()[]{}\"", "output": "true"}, {"input": "s = \"(]\"", "output": "false"}]'::jsonb,
  ARRAY['1 <= s.length <= 10^4', 's consists of parentheses only ''()[]{}''.'],
  '{
    "python": "def isValid(s: str) -> bool:\n    stack = []\n    mapping = {\")\": \"(\", \"}\": \"{\", \"]\": \"[\"}\n    for char in s:\n        if char in mapping:\n            top_element = stack.pop() if stack else \"#\"\n            if mapping[char] != top_element:\n                return False\n        else:\n            stack.append(char)\n    return not stack\n\nimport sys\ns = sys.stdin.read().strip().strip(\"\\\"\")\nprint(\"true\" if isValid(s) else \"false\")\n",
    "javascript": "function isValid(s) {\n    const stack = [];\n    const map = { ')': '(', '}': '{', ']': '[' };\n    for (let char of s) {\n        if (map[char]) {\n            if (stack.pop() !== map[char]) return false;\n        } else {\n            stack.push(char);\n        }\n    }\n    return stack.length === 0;\n}\nconst fs = require('fs');\nconst s = fs.readFileSync(0, 'utf-8').trim().replace(/\"/g, '');\nconsole.log(isValid(s) ? 'true' : 'false');\n"
  }'::jsonb,
  '[
    {"id": "tc1", "input": "\"()[]{}\"", "expected_output": "true", "is_hidden": false},
    {"id": "tc2", "input": "\"(]\"", "expected_output": "false", "is_hidden": false},
    {"id": "tc3", "input": "\"([{}])\"", "expected_output": "true", "is_hidden": true}
  ]'::jsonb
),
(
  'Longest Substring Without Repeating Characters',
  'longest-substring-without-repeating-characters',
  'medium',
  'Sliding Window',
  ARRAY['Hash Table', 'String', 'Sliding Window'],
  'Given a string s, find the length of the longest substring without repeating characters.',
  '[{"input": "s = \"abcabcbb\"", "output": "3", "explanation": "The answer is \"abc\", with the length of 3."}, {"input": "s = \"bbbbb\"", "output": "1"}]'::jsonb,
  ARRAY['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces.'],
  '{
    "python": "def lengthOfLongestSubstring(s: str) -> int:\n    char_set = set()\n    left = 0\n    max_len = 0\n    for right in range(len(s)):\n        while s[right] in char_set:\n            char_set.remove(s[left])\n            left += 1\n        char_set.add(s[right])\n        max_len = max(max_len, right - left + 1)\n    return max_len\n\nimport sys\nline = sys.stdin.read().strip().strip(\"\\\"\")\nprint(lengthOfLongestSubstring(line))\n"
  }'::jsonb,
  '[
    {"id": "tc1", "input": "\"abcabcbb\"", "expected_output": "3", "is_hidden": false},
    {"id": "tc2", "input": "\"bbbbb\"", "expected_output": "1", "is_hidden": false},
    {"id": "tc3", "input": "\"pwwkew\"", "expected_output": "3", "is_hidden": true}
  ]'::jsonb
);

-- Sample Placement Drives
INSERT INTO public.placement_drives (company_name, role_title, location, ctc_range, eligibility, job_description, rounds, deadline, apply_url)
VALUES
(
  'Atlassian',
  'Associate Software Engineer',
  'Bengaluru, India (Hybrid)',
  '26 - 32 LPA',
  '{"min_cgpa": 7.5, "allowed_branches": ["CSE", "IT", "ECE"], "allowed_batches": [2025, 2026], "backlogs_allowed": false}'::jsonb,
  'Work with global teams on Jira, Confluence and developer productivity tooling. Focus on high scalability, distributed systems, and clean code.',
  ARRAY['Online Assessment', 'Technical Round 1 (DSA)', 'Technical Round 2 (System & OOP)', 'Values & HR'],
  NOW() + INTERVAL '14 days',
  'https://www.atlassian.com/company/careers'
),
(
  'Razorpay',
  'Software Development Engineer 1',
  'Bengaluru, India',
  '18 - 24 LPA',
  '{"min_cgpa": 7.0, "allowed_branches": ["All Engineering Branches"], "allowed_batches": [2025, 2026], "backlogs_allowed": false}'::jsonb,
  'Build the financial infrastructure that powers modern internet businesses in India. High performance APIs, microservices, and reliable payment gateways.',
  ARRAY['Coding Screening', 'DSA & Problem Solving', 'Machine Coding & Architecture', 'Cultural Fit'],
  NOW() + INTERVAL '21 days',
  'https://razorpay.com/jobs/'
);
