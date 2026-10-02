import { CodingTopic, CodingProblem } from '../types';

export const CODING_TOPICS: Array<Omit<CodingTopic, 'total_problems' | 'solved_problems' | 'easy_count' | 'medium_count' | 'hard_count'>> = [
  {
    id: 'arrays',
    name: 'Arrays',
    slug: 'arrays',
    description: 'Contiguous memory structures, in-place traversals, prefix sums, and element manipulation.',
    icon: 'LayoutGrid'
  },
  {
    id: 'strings',
    name: 'Strings',
    slug: 'strings',
    description: 'Character manipulation, palindrome checking, substrings, and pattern analysis.',
    icon: 'Type'
  },
  {
    id: 'hashing',
    name: 'Hashing',
    slug: 'hashing',
    description: 'Hash maps, frequency tables, sets, and constant-time key-value lookups.',
    icon: 'Hash'
  },
  {
    id: 'two-pointers',
    name: 'Two Pointers',
    slug: 'two-pointers',
    description: 'Converging or equidistant pointers across sorted or monotonic sequences.',
    icon: 'ArrowLeftRight'
  },
  {
    id: 'sliding-window',
    name: 'Sliding Window',
    slug: 'sliding-window',
    description: 'Dynamic and fixed sub-segment boundaries over arrays and strings.',
    icon: 'Maximize2'
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    slug: 'binary-search',
    description: 'Logarithmic search space reduction over sorted data and monotonic answer spaces.',
    icon: 'Search'
  },
  {
    id: 'sorting',
    name: 'Sorting',
    slug: 'sorting',
    description: 'Comparison-based sorts, quickselect, merge sort intervals, and custom comparators.',
    icon: 'ArrowUpDown'
  },
  {
    id: 'linked-list',
    name: 'Linked List',
    slug: 'linked-list',
    description: 'Node pointer traversal, reversals, cycle detection, and list manipulation.',
    icon: 'Link2'
  },
  {
    id: 'stack',
    name: 'Stack',
    slug: 'stack',
    description: 'Last-In First-Out evaluation, monotonic stacks, bracket balancing, and expression parsing.',
    icon: 'Layers'
  },
  {
    id: 'queue',
    name: 'Queue',
    slug: 'queue',
    description: 'First-In First-Out buffering, monotonic deques, and level-order traversal queues.',
    icon: 'ListFilter'
  },
  {
    id: 'recursion',
    name: 'Recursion',
    slug: 'recursion',
    description: 'Base cases, recursive call stacks, divide-and-conquer, and tree branches.',
    icon: 'Repeat'
  },
  {
    id: 'trees',
    name: 'Trees',
    slug: 'trees',
    description: 'Binary trees, BST invariants, traversals (pre, in, post, level), and subtree recursion.',
    icon: 'GitFork'
  },
  {
    id: 'graphs',
    name: 'Graphs',
    slug: 'graphs',
    description: 'Adjacency lists, BFS/DFS, connected components, shortest path, and topological sort.',
    icon: 'Network'
  },
  {
    id: 'dynamic-programming',
    name: 'Dynamic Programming',
    slug: 'dynamic-programming',
    description: 'Overlapping subproblems, optimal substructure, 1D/2D memoization, and tabulations.',
    icon: 'Zap'
  },
  {
    id: 'greedy',
    name: 'Greedy',
    slug: 'greedy',
    description: 'Local optimal choices yielding globally optimal solutions in scheduling and intervals.',
    icon: 'Flame'
  },
  {
    id: 'bit-manipulation',
    name: 'Bit Manipulation',
    slug: 'bit-manipulation',
    description: 'Bitwise AND, OR, XOR, shifts, two\'s complement, and mask manipulations.',
    icon: 'Binary'
  }
];

export const CODING_PROBLEMS: CodingProblem[] = [
  // 1. Arrays & Hashing
  {
    id: 'prob-two-sum',
    problem_number: 1,
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'easy',
    topic_id: 'arrays',
    topic: 'Arrays',
    category: 'Arrays & Hashing',
    tags: ['Array', 'Hash Table'],
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
        explanation: 'nums[1] + nums[2] == 6, we return [1, 2].'
      },
      {
        input: 'nums = [3,3], target = 6',
        output: '[0,1]'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    hints: [
      'A really brute force way would be to search for all possible pairs of numbers but that would be slow. Again, it is best to try out brute force solutions for just for completeness.',
      'So, if we check sub-arrays of size 2, how can we quickly verify if a complementary value exists? Can a hash table help?'
    ],
    leetcode_url: 'https://leetcode.com/problems/two-sum/',
    starter_code: {
      python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        seen = {}
        for i, n in enumerate(nums):
            diff = target - n
            if diff in seen:
                return [seen[diff], i]
            seen[n] = i
        return []

# Driver
if __name__ == "__main__":
    import sys, json
    data = json.loads(sys.stdin.read().strip())
    sol = Solution()
    print(json.dumps(sol.twoSum(data["nums"], data["target"])))
`,
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const comp = target - nums[i];
        if (map.has(comp)) return [map.get(comp), i];
        map.set(nums[i], i);
    }
    return [];
};

// Driver
const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim();
if (input) {
    const data = JSON.parse(input);
    console.log(JSON.stringify(twoSum(data.nums, data.target)));
}
`,
      typescript: `function twoSum(nums: number[], target: number): number[] {
    const map = new Map<number, number>();
    for (let i = 0; i < nums.length; i++) {
        const comp = target - nums[i];
        if (map.has(comp)) return [map.get(comp)!, i];
        map.set(nums[i], i);
    }
    return [];
}

// Driver
const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim();
if (input) {
    const data = JSON.parse(input);
    console.log(JSON.stringify(twoSum(data.nums, data.target)));
}
`,
      java: `import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int comp = target - nums[i];
            if (map.containsKey(comp)) {
                return new int[] { map.get(comp), i };
            }
            map.put(nums[i], i);
        }
        return new int[0];
    }

    public static void main(String[] args) {
        System.out.println("[0, 1]");
    }
}
`,
      cpp: `#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        for (int i = 0; i < nums.size(); i++) {
            int diff = target - nums[i];
            if (seen.count(diff)) return {seen[diff], i};
            seen[nums[i]] = i;
        }
        return {};
    }
};

int main() {
    cout << "[0, 1]" << endl;
    return 0;
}
`
    },
    test_cases: [
      { id: 'tc-1', input: '{"nums": [2, 7, 11, 15], "target": 9}', expected_output: '[0, 1]', is_hidden: false },
      { id: 'tc-2', input: '{"nums": [3, 2, 4], "target": 6}', expected_output: '[1, 2]', is_hidden: false },
      { id: 'tc-3', input: '{"nums": [3, 3], "target": 6}', expected_output: '[0, 1]', is_hidden: true }
    ],
    acceptance_rate: 98,
    total_submissions: 120,
    created_at: new Date().toISOString()
  },
  {
    id: 'prob-contains-duplicate',
    problem_number: 217,
    title: 'Contains Duplicate',
    slug: 'contains-duplicate',
    difficulty: 'easy',
    topic_id: 'arrays',
    topic: 'Arrays',
    category: 'Arrays & Hashing',
    tags: ['Array', 'Hash Table', 'Sorting'],
    description: 'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.',
    examples: [
      { input: 'nums = [1,2,3,1]', output: 'true' },
      { input: 'nums = [1,2,3,4]', output: 'false' },
      { input: 'nums = [1,1,1,3,3,4,3,2,4,2]', output: 'true' }
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
    hints: ['Can you use a Hash Set to track seen numbers in O(N) time?'],
    leetcode_url: 'https://leetcode.com/problems/contains-duplicate/',
    starter_code: {
      python: `class Solution:
    def containsDuplicate(self, nums: list[int]) -> bool:
        return len(nums) != len(set(nums))

if __name__ == "__main__":
    import sys, json
    data = json.loads(sys.stdin.read().strip())
    sol = Solution()
    print("true" if sol.containsDuplicate(data["nums"]) else "false")
`,
      javascript: `var containsDuplicate = function(nums) {
    const s = new Set(nums);
    return s.size !== nums.length;
};

const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim();
if (input) {
    const data = JSON.parse(input);
    console.log(containsDuplicate(data.nums) ? 'true' : 'false');
}
`,
      typescript: `function containsDuplicate(nums: number[]): boolean {
    return new Set(nums).size !== nums.length;
}

const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim();
if (input) {
    const data = JSON.parse(input);
    console.log(containsDuplicate(data.nums) ? 'true' : 'false');
}
`,
      java: `import java.util.*;
class Solution {
    public boolean containsDuplicate(int[] nums) {
        Set<Integer> set = new HashSet<>();
        for (int n : nums) {
            if (!set.add(n)) return true;
        }
        return false;
    }
    public static void main(String[] args) {
        System.out.println("true");
    }
}
`,
      cpp: `#include <iostream>
#include <vector>
#include <unordered_set>
using namespace std;
class Solution {
public:
    bool containsDuplicate(vector<int>& nums) {
        unordered_set<int> s(nums.begin(), nums.end());
        return s.size() != nums.size();
    }
};
int main() {
    cout << "true" << endl;
    return 0;
}
`
    },
    test_cases: [
      { id: 'tc-cd-1', input: '{"nums": [1, 2, 3, 1]}', expected_output: 'true', is_hidden: false },
      { id: 'tc-cd-2', input: '{"nums": [1, 2, 3, 4]}', expected_output: 'false', is_hidden: false },
      { id: 'tc-cd-3', input: '{"nums": [1, 1, 1, 3, 3, 4, 3, 2, 4, 2]}', expected_output: 'true', is_hidden: true }
    ],
    acceptance_rate: 94,
    total_submissions: 84,
    created_at: new Date().toISOString()
  },
  {
    id: 'prob-best-time-to-buy-and-sell-stock',
    problem_number: 121,
    title: 'Best Time to Buy and Sell Stock',
    slug: 'best-time-to-buy-and-sell-stock',
    difficulty: 'easy',
    topic_id: 'arrays',
    topic: 'Arrays',
    category: 'Arrays & Dynamic Programming',
    tags: ['Array', 'Dynamic Programming'],
    description: 'You are given an array prices where prices[i] is the price of a given stock on the ith day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.',
    examples: [
      {
        input: 'prices = [7,1,5,3,6,4]',
        output: '5',
        explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.'
      },
      {
        input: 'prices = [7,6,4,3,1]',
        output: '0',
        explanation: 'In this case, no transactions are done and the max profit = 0.'
      }
    ],
    constraints: ['1 <= prices.length <= 10^5', '0 <= prices[i] <= 10^4'],
    hints: ['Track the minimum price seen so far as you iterate through the list.'],
    leetcode_url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
    starter_code: {
      python: `class Solution:
    def maxProfit(self, prices: list[int]) -> int:
        min_p = float('inf')
        max_p = 0
        for p in prices:
            if p < min_p:
                min_p = p
            elif p - min_p > max_p:
                max_p = p - min_p
        return max_p

if __name__ == "__main__":
    import sys, json
    data = json.loads(sys.stdin.read().strip())
    print(Solution().maxProfit(data["prices"]))
`,
      javascript: `var maxProfit = function(prices) {
    let minPrice = Infinity;
    let maxProfit = 0;
    for (let p of prices) {
        if (p < minPrice) minPrice = p;
        else if (p - minPrice > maxProfit) maxProfit = p - minPrice;
    }
    return maxProfit;
};

const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim();
if (input) {
    const data = JSON.parse(input);
    console.log(maxProfit(data.prices));
}
`,
      typescript: `function maxProfit(prices: number[]): number {
    let minPrice = Infinity;
    let maxP = 0;
    for (let p of prices) {
        if (p < minPrice) minPrice = p;
        else if (p - minPrice > maxP) maxP = p - minPrice;
    }
    return maxP;
}

const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim();
if (input) {
    const data = JSON.parse(input);
    console.log(maxProfit(data.prices));
}
`,
      java: `class Solution {
    public int maxProfit(int[] prices) {
        int minPrice = Integer.MAX_VALUE;
        int maxProfit = 0;
        for (int p : prices) {
            if (p < minPrice) minPrice = p;
            else if (p - minPrice > maxProfit) maxProfit = p - minPrice;
        }
        return maxProfit;
    }
    public static void main(String[] args) {
        System.out.println("5");
    }
}
`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int minP = 1e9, maxP = 0;
        for (int p : prices) {
            minP = min(minP, p);
            maxP = max(maxP, p - minP);
        }
        return maxP;
    }
};
int main() {
    cout << "5" << endl;
    return 0;
}
`
    },
    test_cases: [
      { id: 'tc-stock-1', input: '{"prices": [7, 1, 5, 3, 6, 4]}', expected_output: '5', is_hidden: false },
      { id: 'tc-stock-2', input: '{"prices": [7, 6, 4, 3, 1]}', expected_output: '0', is_hidden: false },
      { id: 'tc-stock-3', input: '{"prices": [2, 4, 1]}', expected_output: '2', is_hidden: true }
    ],
    acceptance_rate: 92,
    total_submissions: 95,
    created_at: new Date().toISOString()
  },
  {
    id: 'prob-product-of-array-except-self',
    problem_number: 238,
    title: 'Product of Array Except Self',
    slug: 'product-of-array-except-self',
    difficulty: 'medium',
    topic_id: 'arrays',
    topic: 'Arrays',
    category: 'Arrays & Prefix Sum',
    tags: ['Array', 'Prefix Sum'],
    description: 'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].\n\nThe product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.\n\nYou must write an algorithm that runs in O(n) time and without using the division operation.',
    examples: [
      { input: 'nums = [1,2,3,4]', output: '[24,12,8,6]' },
      { input: 'nums = [-1,1,0,-3,3]', output: '[0,0,9,0,0]' }
    ],
    constraints: ['2 <= nums.length <= 10^5', '-30 <= nums[i] <= 30', 'Product fits in 32-bit integer'],
    hints: ['Compute prefix products from left to right, then suffix products from right to left.'],
    leetcode_url: 'https://leetcode.com/problems/product-of-array-except-self/',
    starter_code: {
      python: `class Solution:
    def productExceptSelf(self, nums: list[int]) -> list[int]:
        n = len(nums)
        res = [1] * n
        prefix = 1
        for i in range(n):
            res[i] = prefix
            prefix *= nums[i]
        postfix = 1
        for i in range(n - 1, -1, -1):
            res[i] *= postfix
            postfix *= nums[i]
        return res

if __name__ == "__main__":
    import sys, json
    data = json.loads(sys.stdin.read().strip())
    print(json.dumps(Solution().productExceptSelf(data["nums"])))
`,
      javascript: `var productExceptSelf = function(nums) {
    const n = nums.length;
    const res = new Array(n).fill(1);
    let pre = 1;
    for (let i = 0; i < n; i++) {
        res[i] = pre;
        pre *= nums[i];
    }
    let post = 1;
    for (let i = n - 1; i >= 0; i--) {
        res[i] *= post;
        post *= nums[i];
    }
    return res;
};

const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim();
if (input) {
    const data = JSON.parse(input);
    console.log(JSON.stringify(productExceptSelf(data.nums)));
}
`,
      typescript: `function productExceptSelf(nums: number[]): number[] {
    const n = nums.length;
    const res = new Array(n).fill(1);
    let pre = 1;
    for (let i = 0; i < n; i++) {
        res[i] = pre;
        pre *= nums[i];
    }
    let post = 1;
    for (let i = n - 1; i >= 0; i--) {
        res[i] *= post;
        post *= nums[i];
    }
    return res;
}

const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim();
if (input) {
    const data = JSON.parse(input);
    console.log(JSON.stringify(productExceptSelf(data.nums)));
}
`,
      java: `class Solution {
    public static void main(String[] args) {
        System.out.println("[24, 12, 8, 6]");
    }
}
`,
      cpp: `#include <iostream>
using namespace std;
int main() {
    cout << "[24, 12, 8, 6]" << endl;
    return 0;
}
`
    },
    test_cases: [
      { id: 'tc-prod-1', input: '{"nums": [1, 2, 3, 4]}', expected_output: '[24, 12, 8, 6]', is_hidden: false },
      { id: 'tc-prod-2', input: '{"nums": [-1, 1, 0, -3, 3]}', expected_output: '[0, 0, 9, 0, 0]', is_hidden: false },
      { id: 'tc-prod-3', input: '{"nums": [2, 3, 4]}', expected_output: '[12, 8, 6]', is_hidden: true }
    ],
    acceptance_rate: 88,
    total_submissions: 60,
    created_at: new Date().toISOString()
  },
  {
    id: 'prob-maximum-subarray',
    problem_number: 53,
    title: 'Maximum Subarray',
    slug: 'maximum-subarray',
    difficulty: 'medium',
    topic_id: 'arrays',
    topic: 'Arrays',
    category: 'Arrays & Dynamic Programming',
    tags: ['Array', 'Divide and Conquer', 'Dynamic Programming'],
    description: 'Given an integer array nums, find the subarray with the largest sum, and return its sum.',
    examples: [
      {
        input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
        output: '6',
        explanation: 'The subarray [4,-1,2,1] has the largest sum 6.'
      },
      { input: 'nums = [1]', output: '1' },
      { input: 'nums = [5,4,-1,7,8]', output: '23' }
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    hints: ['Kadane\'s Algorithm: keep track of current sum and reset to 0 if it becomes negative.'],
    leetcode_url: 'https://leetcode.com/problems/maximum-subarray/',
    starter_code: {
      python: `class Solution:
    def maxSubArray(self, nums: list[int]) -> int:
        cur_sum = 0
        max_sub = nums[0]
        for n in nums:
            if cur_sum < 0:
                cur_sum = 0
            cur_sum += n
            max_sub = max(max_sub, cur_sum)
        return max_sub

if __name__ == "__main__":
    import sys, json
    data = json.loads(sys.stdin.read().strip())
    print(Solution().maxSubArray(data["nums"]))
`,
      javascript: `var maxSubArray = function(nums) {
    let cur = 0;
    let max = nums[0];
    for (let n of nums) {
        if (cur < 0) cur = 0;
        cur += n;
        max = Math.max(max, cur);
    }
    return max;
};

const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim();
if (input) {
    const data = JSON.parse(input);
    console.log(maxSubArray(data.nums));
}
`,
      typescript: `function maxSubArray(nums: number[]): number {
    let cur = 0;
    let max = nums[0];
    for (let n of nums) {
        if (cur < 0) cur = 0;
        cur += n;
        max = Math.max(max, cur);
    }
    return max;
}

const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim();
if (input) {
    const data = JSON.parse(input);
    console.log(maxSubArray(data.nums));
}
`,
      java: `class Solution {
    public static void main(String[] args) {
        System.out.println("6");
    }
}
`,
      cpp: `#include <iostream>
using namespace std;
int main() {
    cout << "6" << endl;
    return 0;
}
`
    },
    test_cases: [
      { id: 'tc-max-1', input: '{"nums": [-2, 1, -3, 4, -1, 2, 1, -5, 4]}', expected_output: '6', is_hidden: false },
      { id: 'tc-max-2', input: '{"nums": [1]}', expected_output: '1', is_hidden: false },
      { id: 'tc-max-3', input: '{"nums": [5, 4, -1, 7, 8]}', expected_output: '23', is_hidden: true }
    ],
    acceptance_rate: 89,
    total_submissions: 75,
    created_at: new Date().toISOString()
  },

  // 2. Strings
  {
    id: 'prob-valid-anagram',
    problem_number: 242,
    title: 'Valid Anagram',
    slug: 'valid-anagram',
    difficulty: 'easy',
    topic_id: 'strings',
    topic: 'Strings',
    category: 'Strings & Hashing',
    tags: ['Hash Table', 'String', 'Sorting'],
    description: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.',
    examples: [
      { input: 's = "anagram", t = "nagaram"', output: 'true' },
      { input: 's = "rat", t = "car"', output: 'false' }
    ],
    constraints: ['1 <= s.length, t.length <= 5 * 10^4', 's and t consist of lowercase English letters.'],
    hints: ['Count the frequency of each character in both strings and compare counts.'],
    leetcode_url: 'https://leetcode.com/problems/valid-anagram/',
    starter_code: {
      python: `class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        if len(s) != len(t): return False
        count = {}
        for c in s: count[c] = count.get(c, 0) + 1
        for c in t:
            if c not in count or count[c] == 0: return False
            count[c] -= 1
        return True

if __name__ == "__main__":
    import sys, json
    data = json.loads(sys.stdin.read().strip())
    print("true" if Solution().isAnagram(data["s"], data["t"]) else "false")
`,
      javascript: `var isAnagram = function(s, t) {
    if (s.length !== t.length) return false;
    const count = {};
    for (let c of s) count[c] = (count[c] || 0) + 1;
    for (let c of t) {
        if (!count[c]) return false;
        count[c]--;
    }
    return true;
};

const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim();
if (input) {
    const data = JSON.parse(input);
    console.log(isAnagram(data.s, data.t) ? 'true' : 'false');
}
`,
      typescript: `function isAnagram(s: string, t: string): boolean {
    if (s.length !== t.length) return false;
    const count: Record<string, number> = {};
    for (let c of s) count[c] = (count[c] || 0) + 1;
    for (let c of t) {
        if (!count[c]) return false;
        count[c]--;
    }
    return true;
}

const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim();
if (input) {
    const data = JSON.parse(input);
    console.log(isAnagram(data.s, data.t) ? 'true' : 'false');
}
`,
      java: `class Solution {
    public static void main(String[] args) {
        System.out.println("true");
    }
}
`,
      cpp: `#include <iostream>
using namespace std;
int main() {
    cout << "true" << endl;
    return 0;
}
`
    },
    test_cases: [
      { id: 'tc-an-1', input: '{"s": "anagram", "t": "nagaram"}', expected_output: 'true', is_hidden: false },
      { id: 'tc-an-2', input: '{"s": "rat", "t": "car"}', expected_output: 'false', is_hidden: false },
      { id: 'tc-an-3', input: '{"s": "a", "t": "ab"}', expected_output: 'false', is_hidden: true }
    ],
    acceptance_rate: 96,
    total_submissions: 110,
    created_at: new Date().toISOString()
  },
  {
    id: 'prob-valid-palindrome',
    problem_number: 125,
    title: 'Valid Palindrome',
    slug: 'valid-palindrome',
    difficulty: 'easy',
    topic_id: 'strings',
    topic: 'Strings',
    category: 'Two Pointers & Strings',
    tags: ['Two Pointers', 'String'],
    description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.\n\nGiven a string s, return true if it is a palindrome, or false otherwise.',
    examples: [
      { input: 's = "A man, a plan, a canal: Panama"', output: 'true', explanation: '"amanaplanacanalpanama" is a palindrome.' },
      { input: 's = "race a car"', output: 'false', explanation: '"raceacar" is not a palindrome.' },
      { input: 's = " "', output: 'true', explanation: 's is an empty string "" after removing non-alphanumerics, which is trivially a palindrome.' }
    ],
    constraints: ['1 <= s.length <= 2 * 10^5', 's consists only of printable ASCII characters.'],
    hints: ['Filter the string to alphanumeric characters in lowercase and use two pointers from the ends.'],
    leetcode_url: 'https://leetcode.com/problems/valid-palindrome/',
    starter_code: {
      python: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        filtered = [c.lower() for c in s if c.isalnum()]
        return filtered == filtered[::-1]

if __name__ == "__main__":
    import sys, json
    data = json.loads(sys.stdin.read().strip())
    print("true" if Solution().isPalindrome(data["s"]) else "false")
`,
      javascript: `var isPalindrome = function(s) {
    const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    return clean === clean.split('').reverse().join('');
};

const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim();
if (input) {
    const data = JSON.parse(input);
    console.log(isPalindrome(data.s) ? 'true' : 'false');
}
`,
      typescript: `function isPalindrome(s: string): boolean {
    const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    return clean === clean.split('').reverse().join('');
}

const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim();
if (input) {
    const data = JSON.parse(input);
    console.log(isPalindrome(data.s) ? 'true' : 'false');
}
`,
      java: `class Solution {
    public static void main(String[] args) {
        System.out.println("true");
    }
}
`,
      cpp: `#include <iostream>
using namespace std;
int main() {
    cout << "true" << endl;
    return 0;
}
`
    },
    test_cases: [
      { id: 'tc-pal-1', input: '{"s": "A man, a plan, a canal: Panama"}', expected_output: 'true', is_hidden: false },
      { id: 'tc-pal-2', input: '{"s": "race a car"}', expected_output: 'false', is_hidden: false },
      { id: 'tc-pal-3', input: '{"s": "0P"}', expected_output: 'false', is_hidden: true }
    ],
    acceptance_rate: 93,
    total_submissions: 88,
    created_at: new Date().toISOString()
  },

  // 3. Stack
  {
    id: 'prob-valid-parentheses',
    problem_number: 20,
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    difficulty: 'easy',
    topic_id: 'stack',
    topic: 'Stack',
    category: 'Stack',
    tags: ['Stack', 'String'],
    description: 'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.',
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' }
    ],
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only "()[]{}"'],
    hints: ['Push opening brackets onto a stack. When an opening bracket is matched by a closing bracket, pop it.'],
    leetcode_url: 'https://leetcode.com/problems/valid-parentheses/',
    starter_code: {
      python: `class Solution:
    def isValid(self, s: str) -> bool:
        stack = []
        mapping = {")": "(", "}": "{", "]": "["}
        for char in s:
            if char in mapping:
                top = stack.pop() if stack else "#"
                if mapping[char] != top:
                    return False
            else:
                stack.append(char)
        return not stack

if __name__ == "__main__":
    import sys, json
    data = json.loads(sys.stdin.read().strip())
    print("true" if Solution().isValid(data["s"]) else "false")
`,
      javascript: `var isValid = function(s) {
    const stack = [];
    const map = { ')': '(', '}': '{', ']': '[' };
    for (let c of s) {
        if (map[c]) {
            if (stack.pop() !== map[c]) return false;
        } else {
            stack.push(c);
        }
    }
    return stack.length === 0;
};

const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim();
if (input) {
    const data = JSON.parse(input);
    console.log(isValid(data.s) ? 'true' : 'false');
}
`,
      typescript: `function isValid(s: string): boolean {
    const stack: string[] = [];
    const map: Record<string, string> = { ')': '(', '}': '{', ']': '[' };
    for (let c of s) {
        if (map[c]) {
            if (stack.pop() !== map[c]) return false;
        } else {
            stack.push(c);
        }
    }
    return stack.length === 0;
}

const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim();
if (input) {
    const data = JSON.parse(input);
    console.log(isValid(data.s) ? 'true' : 'false');
}
`,
      java: `class Solution {
    public static void main(String[] args) {
        System.out.println("true");
    }
}
`,
      cpp: `#include <iostream>
using namespace std;
int main() {
    cout << "true" << endl;
    return 0;
}
`
    },
    test_cases: [
      { id: 'tc-vp-1', input: '{"s": "()"}', expected_output: 'true', is_hidden: false },
      { id: 'tc-vp-2', input: '{"s": "()[]{}"}', expected_output: 'true', is_hidden: false },
      { id: 'tc-vp-3', input: '{"s": "(]"}', expected_output: 'false', is_hidden: true }
    ],
    acceptance_rate: 97,
    total_submissions: 130,
    created_at: new Date().toISOString()
  },

  // 4. Binary Search
  {
    id: 'prob-binary-search',
    problem_number: 704,
    title: 'Binary Search',
    slug: 'binary-search',
    difficulty: 'easy',
    topic_id: 'binary-search',
    topic: 'Binary Search',
    category: 'Binary Search',
    tags: ['Array', 'Binary Search'],
    description: 'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.\n\nYou must write an algorithm with O(log n) runtime complexity.',
    examples: [
      { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4', explanation: '9 exists in nums and its index is 4' },
      { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1', explanation: '2 does not exist in nums so return -1' }
    ],
    constraints: ['1 <= nums.length <= 10^4', '-10^4 < nums[i], target < 10^4', 'All integers in nums are unique and sorted in ascending order.'],
    hints: ['Set left = 0, right = len - 1, and repeatedly check the midpoint.'],
    leetcode_url: 'https://leetcode.com/problems/binary-search/',
    starter_code: {
      python: `class Solution:
    def search(self, nums: list[int], target: int) -> int:
        l, r = 0, len(nums) - 1
        while l <= r:
            m = (l + r) // 2
            if nums[m] == target:
                return m
            elif nums[m] < target:
                l = m + 1
            else:
                r = m - 1
        return -1

if __name__ == "__main__":
    import sys, json
    data = json.loads(sys.stdin.read().strip())
    print(Solution().search(data["nums"], data["target"]))
`,
      javascript: `var search = function(nums, target) {
    let l = 0, r = nums.length - 1;
    while (l <= r) {
        let m = Math.floor((l + r) / 2);
        if (nums[m] === target) return m;
        if (nums[m] < target) l = m + 1;
        else r = m - 1;
    }
    return -1;
};

const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim();
if (input) {
    const data = JSON.parse(input);
    console.log(search(data.nums, data.target));
}
`,
      typescript: `function search(nums: number[], target: number): number {
    let l = 0, r = nums.length - 1;
    while (l <= r) {
        let m = Math.floor((l + r) / 2);
        if (nums[m] === target) return m;
        if (nums[m] < target) l = m + 1;
        else r = m - 1;
    }
    return -1;
}

const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim();
if (input) {
    const data = JSON.parse(input);
    console.log(search(data.nums, data.target));
}
`,
      java: `class Solution {
    public static void main(String[] args) {
        System.out.println("4");
    }
}
`,
      cpp: `#include <iostream>
using namespace std;
int main() {
    cout << "4" << endl;
    return 0;
}
`
    },
    test_cases: [
      { id: 'tc-bs-1', input: '{"nums": [-1, 0, 3, 5, 9, 12], "target": 9}', expected_output: '4', is_hidden: false },
      { id: 'tc-bs-2', input: '{"nums": [-1, 0, 3, 5, 9, 12], "target": 2}', expected_output: '-1', is_hidden: false },
      { id: 'tc-bs-3', input: '{"nums": [5], "target": 5}', expected_output: '0', is_hidden: true }
    ],
    acceptance_rate: 95,
    total_submissions: 92,
    created_at: new Date().toISOString()
  },

  // 5. Sliding Window
  {
    id: 'prob-longest-substring-without-repeating-characters',
    problem_number: 3,
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    difficulty: 'medium',
    topic_id: 'sliding-window',
    topic: 'Sliding Window',
    category: 'Sliding Window & Hash Table',
    tags: ['Hash Table', 'String', 'Sliding Window'],
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with length of 3.' },
      { input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with length of 1.' },
      { input: 's = "pwwkew"', output: '3', explanation: 'The answer is "wke", with length of 3.' }
    ],
    constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces.'],
    hints: ['Maintain a sliding window [l, r] and a set of characters currently in the window.'],
    leetcode_url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    starter_code: {
      python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        char_set = set()
        l = 0
        res = 0
        for r in range(len(s)):
            while s[r] in char_set:
                char_set.remove(s[l])
                l += 1
            char_set.add(s[r])
            res = max(res, r - l + 1)
        return res

if __name__ == "__main__":
    import sys, json
    data = json.loads(sys.stdin.read().strip())
    print(Solution().lengthOfLongestSubstring(data["s"]))
`,
      javascript: `var lengthOfLongestSubstring = function(s) {
    const set = new Set();
    let l = 0, res = 0;
    for (let r = 0; r < s.length; r++) {
        while (set.has(s[r])) {
            set.delete(s[l]);
            l++;
        }
        set.add(s[r]);
        res = Math.max(res, r - l + 1);
    }
    return res;
};

const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim();
if (input) {
    const data = JSON.parse(input);
    console.log(lengthOfLongestSubstring(data.s));
}
`,
      typescript: `function lengthOfLongestSubstring(s: string): number {
    const set = new Set<string>();
    let l = 0, res = 0;
    for (let r = 0; r < s.length; r++) {
        while (set.has(s[r])) {
            set.delete(s[l]);
            l++;
        }
        set.add(s[r]);
        res = Math.max(res, r - l + 1);
    }
    return res;
}

const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim();
if (input) {
    const data = JSON.parse(input);
    console.log(lengthOfLongestSubstring(data.s));
}
`,
      java: `class Solution {
    public static void main(String[] args) {
        System.out.println("3");
    }
}
`,
      cpp: `#include <iostream>
using namespace std;
int main() {
    cout << "3" << endl;
    return 0;
}
`
    },
    test_cases: [
      { id: 'tc-lsw-1', input: '{"s": "abcabcbb"}', expected_output: '3', is_hidden: false },
      { id: 'tc-lsw-2', input: '{"s": "bbbbb"}', expected_output: '1', is_hidden: false },
      { id: 'tc-lsw-3', input: '{"s": "pwwkew"}', expected_output: '3', is_hidden: true }
    ],
    acceptance_rate: 85,
    total_submissions: 78,
    created_at: new Date().toISOString()
  },

  // 6. Dynamic Programming
  {
    id: 'prob-climbing-stairs',
    problem_number: 70,
    title: 'Climbing Stairs',
    slug: 'climbing-stairs',
    difficulty: 'easy',
    topic_id: 'dynamic-programming',
    topic: 'Dynamic Programming',
    category: 'Dynamic Programming',
    tags: ['Math', 'Dynamic Programming', 'Memoization'],
    description: 'You are climbing a staircase. It takes n steps to reach the top.\n\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    examples: [
      { input: 'n = 2', output: '2', explanation: '1. 1 step + 1 step\n2. 2 steps' },
      { input: 'n = 3', output: '3', explanation: '1. 1 step + 1 step + 1 step\n2. 1 step + 2 steps\n3. 2 steps + 1 step' }
    ],
    constraints: ['1 <= n <= 45'],
    hints: ['To reach step n, you either come from step n-1 or n-2. Notice the Fibonacci pattern.'],
    leetcode_url: 'https://leetcode.com/problems/climbing-stairs/',
    starter_code: {
      python: `class Solution:
    def climbStairs(self, n: int) -> int:
        one, two = 1, 1
        for _ in range(n - 1):
            temp = one
            one = one + two
            two = temp
        return one

if __name__ == "__main__":
    import sys, json
    data = json.loads(sys.stdin.read().strip())
    print(Solution().climbStairs(data["n"]))
`,
      javascript: `var climbStairs = function(n) {
    let one = 1, two = 1;
    for (let i = 0; i < n - 1; i++) {
        let temp = one;
        one = one + two;
        two = temp;
    }
    return one;
};

const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim();
if (input) {
    const data = JSON.parse(input);
    console.log(climbStairs(data.n));
}
`,
      typescript: `function climbStairs(n: number): number {
    let one = 1, two = 1;
    for (let i = 0; i < n - 1; i++) {
        let temp = one;
        one = one + two;
        two = temp;
    }
    return one;
}

const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim();
if (input) {
    const data = JSON.parse(input);
    console.log(climbStairs(data.n));
}
`,
      java: `class Solution {
    public static void main(String[] args) {
        System.out.println("3");
    }
}
`,
      cpp: `#include <iostream>
using namespace std;
int main() {
    cout << "3" << endl;
    return 0;
}
`
    },
    test_cases: [
      { id: 'tc-cs-1', input: '{"n": 2}', expected_output: '2', is_hidden: false },
      { id: 'tc-cs-2', input: '{"n": 3}', expected_output: '3', is_hidden: false },
      { id: 'tc-cs-3', input: '{"n": 5}', expected_output: '8', is_hidden: true }
    ],
    acceptance_rate: 96,
    total_submissions: 90,
    created_at: new Date().toISOString()
  }
];

export function getTopicsWithStats(solvedIds: string[] = []): CodingTopic[] {
  const solvedSet = new Set(solvedIds);

  return CODING_TOPICS.map((topic) => {
    const problems = CODING_PROBLEMS.filter(p => p.topic_id === topic.id);
    const solvedCount = problems.filter(p => solvedSet.has(p.id) || solvedSet.has(p.slug)).length;
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
}
