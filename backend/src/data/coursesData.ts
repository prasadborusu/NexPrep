import { Course } from '../types';

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-python-backend',
    title: 'Mastering Python for Backend & Placement Interviews',
    slug: 'python-backend-mastery',
    category: 'python',
    level: 'intermediate',
    duration_hours: 14,
    instructor_name: 'NexPrep Engineering Team',
    instructor_title: 'Infrastructure & Backend Faculty',
    instructor_avatar: '🐍',
    thumbnail_url: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=80',
    short_description: 'Production Python 3, asynchronous FastAPI, PostgreSQL indexing, and backend system architecture screened by top tech firms.',
    description: 'A deep-dive technical engineering track designed for candidates targeting Python Developer and Backend Engineering roles. Covers language internals, OOP design patterns, high-concurrency async APIs, and database transactions.',
    tags: ['Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker', 'AsyncIO', 'OOP'],
    prerequisites: ['Basic programming syntax', 'Fundamental understanding of web requests'],
    learning_outcomes: [
      'Master Python memory model, dunder methods, generators and decorators',
      'Architect async microservices using FastAPI, Pydantic, and SQLAlchemy',
      'Optimize database queries with indexing, transactions, and Redis caching',
      'Pass technical coding and architecture rounds at top product companies'
    ],
    is_published: true,
    enrolled_count: 342,
    rating: 4.9,
    created_at: new Date('2026-01-10').toISOString(),
    updated_at: new Date('2026-03-15').toISOString(),
    modules: [
      {
        id: 'mod-py-1',
        title: 'Module 1: Python Core & OOP Architecture',
        description: 'Deep dive into Python internals, memory allocation, and object-oriented design.',
        order: 1,
        lessons: [
          {
            id: 'les-py-1',
            title: 'Python Memory Model, Mutability & References',
            slug: 'python-memory-model',
            type: 'article',
            duration_minutes: 25,
            order: 1,
            content: `### Python Memory Model & Object References

In Python, everything is an object. Understanding how variables bind to memory is essential for technical interviews.

#### 1. Identity vs Equality
- \`==\` checks for **value equality** (calls \`__eq__\`).
- \`is\` checks for **object identity** (verifies memory address via \`id()\`).

\`\`\`python
a = [1, 2, 3]
b = [1, 2, 3]
print(a == b)  # True (equal values)
print(a is b)  # False (distinct memory locations)
\`\`\`

#### 2. Mutability Gotcha in Default Arguments
Never use mutable objects (like lists or dictionaries) as default parameter values:

\`\`\`python
# ANTI-PATTERN:
def append_to(element, target=[]):
    target.append(element)
    return target

# CORRECT PATTERN:
def append_to(element, target=None):
    if target is None:
        target = []
    target.append(element)
    return target
\`\`\`

#### 3. Garbage Collection & Reference Counting
Python uses **reference counting** as its primary GC mechanism, supplemented by a **generational cyclic GC** to detect circular references.`
          },
          {
            id: 'les-py-2',
            title: 'Dunder Methods, Metaclasses & Custom Iterators',
            slug: 'dunder-methods-iterators',
            type: 'code',
            duration_minutes: 35,
            order: 2,
            content: `### Magic (Dunder) Methods & Iterator Protocol

Building idiomatic Python code relies on protocol implementation rather than concrete inheritance.

#### The Iterator Protocol
Any class implementing \`__iter__()\` and \`__next__()\` can be iterated over in a \`for\` loop:

\`\`\`python
class Fibonacci:
    def __init__(self, limit: int):
        self.limit = limit
        self.count = 0
        self.a, self.b = 0, 1

    def __iter__(self):
        return self

    def __next__(self):
        if self.count >= self.limit:
            raise StopIteration
        val = self.a
        self.a, self.b = self.b, self.a + self.b
        self.count += 1
        return val

# Execution
for num in Fibonacci(8):
    print(num, end=" ")
# Output: 0 1 1 2 3 5 8 13
\`\`\`

#### Context Managers (\`__enter__\` and \`__exit__\`)
Use context managers to safely handle resource allocation (files, locks, database connections):

\`\`\`python
class DatabaseTransaction:
    def __enter__(self):
        print("BEGIN TRANSACTION")
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type is not None:
            print("ROLLBACK TRANSACTION due to exception")
            return False  # re-raise exception
        print("COMMIT TRANSACTION")
        return True
\`\`\``
          }
        ]
      },
      {
        id: 'mod-py-2',
        title: 'Module 2: High-Concurrency APIs with FastAPI & PostgreSQL',
        description: 'Building production-grade async REST microservices with caching and database pools.',
        order: 2,
        lessons: [
          {
            id: 'les-py-3',
            title: 'Asynchronous Programming: Event Loops & Async/Await',
            slug: 'async-event-loops',
            type: 'video',
            duration_minutes: 30,
            video_url: 'https://www.youtube.com/embed/tSLdcBnfl6A',
            order: 1,
            content: `### Concurrency in Python: Threading vs Multiprocessing vs AsyncIO

Interviewers frequently evaluate your knowledge of Python's **GIL (Global Interpreter Lock)**:

| Paradigm | Mechanism | Best Used For |
|---|---|---|
| **AsyncIO** | Single-threaded cooperative multitasking | I/O-bound (APIs, network calls, DB queries) |
| **Multiprocessing** | Separate OS processes (bypasses GIL) | CPU-bound (Data crunching, image processing) |
| **Threading** | OS threads (subject to GIL) | Legacy I/O, background daemon tasks |

#### FastAPI Async Route Architecture
\`\`\`python
from fastapi import FastAPI, Depends, HTTPException
import asyncio

app = FastAPI()

@app.get("/items/{item_id}")
async def fetch_item(item_id: str):
    # Non-blocking async database fetch
    data = await db_query_async(item_id)
    if not data:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"status": "success", "item": data}
\`\`\``
          },
          {
            id: 'les-py-4',
            title: 'PostgreSQL Indexing, Transactions & Connection Pooling',
            slug: 'postgres-indexing-pooling',
            type: 'article',
            duration_minutes: 40,
            order: 2,
            content: `### Database Performance Optimization

Top tech company interviews place strong emphasis on database performance under high read/write loads.

#### 1. B-Tree vs Hash Indexing
- **B-Tree**: The default index. Ideal for range queries (\`<, >, BETWEEN\`), equality (\`=\`), and sorting (\`ORDER BY\`).
- **Composite Indexes**: Always order columns from highest cardinality to lowest cardinality (Leftmost Prefix Rule).

#### 2. Connection Pooling (PgBouncer / asyncpg)
Opening a PostgreSQL connection involves process forking and authentication overhead (~30-50ms). Use connection pooling:
- Pool min size: 10
- Pool max size: 50
- Recycle connections after 30 minutes.`
          }
        ]
      }
    ]
  },
  {
    id: 'course-dsa-masterclass',
    title: 'Data Structures & Algorithms: Placement Masterclass',
    slug: 'dsa-placement-masterclass',
    category: 'dsa',
    level: 'intermediate',
    duration_hours: 22,
    instructor_name: 'NexPrep Algorithm Council',
    instructor_title: 'Competitive Programming & DSA Division',
    instructor_avatar: '⚡',
    thumbnail_url: 'https://images.unsplash.com/photo-1516116211227-bbc141e48e89?w=800&auto=format&fit=crop&q=80',
    short_description: 'Pattern-based problem solving: Two Pointers, Sliding Window, Graph Algorithms, and Dynamic Programming for technical screening rounds.',
    description: 'Engineered specifically for campus placement and off-campus tech screening. Rather than memorizing 500 individual problems, you learn 14 canonical patterns that solve 90% of coding interview challenges.',
    tags: ['DSA', 'Algorithms', 'LeetCode', 'Graphs', 'Dynamic Programming', 'Coding Interview'],
    prerequisites: ['Familiarity with any language: Python, C++, Java, or JavaScript'],
    learning_outcomes: [
      'Recognize algorithmic patterns in under 2 minutes of reading problem statements',
      'Implement optimal solutions with tight Time and Space complexity bounds',
      'Master Two Pointers, Sliding Window, Monotonic Stacks, and BFS/DFS',
      'Crack Medium & Hard coding challenges on LeetCode and HackerRank'
    ],
    is_published: true,
    enrolled_count: 512,
    rating: 4.95,
    created_at: new Date('2026-01-15').toISOString(),
    updated_at: new Date('2026-03-20').toISOString(),
    modules: [
      {
        id: 'mod-dsa-1',
        title: 'Module 1: Array Patterns & Sliding Window',
        description: 'Master linear time complexity patterns for sequential data.',
        order: 1,
        lessons: [
          {
            id: 'les-dsa-1',
            title: 'Two Pointers Pattern (Opposite Direction & Fast-Slow)',
            slug: 'two-pointers-pattern',
            type: 'code',
            duration_minutes: 30,
            order: 1,
            content: `### Two Pointers: Canonical Framework

The Two Pointers pattern reduces $O(N^2)$ brute-force solutions to $O(N)$ linear time by exploiting sorted arrays or cycle detection.

#### Framework 1: Opposite Direction (e.g., Two Sum II)
\`\`\`python
def twoSumSorted(numbers: list[int], target: int) -> list[int]:
    left, right = 0, len(numbers) - 1
    while left < right:
        curr_sum = numbers[left] + numbers[right]
        if curr_sum == target:
            return [left + 1, right + 1]
        elif curr_sum < target:
            left += 1   # Need larger sum
        else:
            right -= 1  # Need smaller sum
    return []
\`\`\`

#### Framework 2: Fast & Slow Pointer (Floyd's Cycle Finding)
Used in linked lists to detect cycles in $O(N)$ time and $O(1)$ space.`
          },
          {
            id: 'les-dsa-2',
            title: 'Sliding Window: Fixed Size vs Dynamic Size',
            slug: 'sliding-window-mastery',
            type: 'code',
            duration_minutes: 35,
            order: 2,
            content: `### Sliding Window Master Template

Used for sub-array or substring problems where elements must be contiguous.

\`\`\`python
def lengthOfLongestSubstringKDistinct(s: str, k: int) -> int:
    char_counts = {}
    left = 0
    max_len = 0
    
    for right in range(len(s)):
        # 1. Expand window
        char_counts[s[right]] = char_counts.get(s[right], 0) + 1
        
        # 2. Shrink window while invalid
        while len(char_counts) > k:
            char_counts[s[left]] -= 1
            if char_counts[s[left]] == 0:
                del char_counts[s[left]]
            left += 1
            
        # 3. Update result
        max_len = max(max_len, right - left + 1)
        
    return max_len
\`\`\``
          }
        ]
      }
    ]
  },
  {
    id: 'course-system-design',
    title: 'System Design & High-Scale Architecture',
    slug: 'system-design-architecture',
    category: 'system_design',
    level: 'advanced',
    duration_hours: 18,
    instructor_name: 'NexPrep Cloud Architecture Group',
    instructor_title: 'Distributed Systems & Cloud Faculty',
    instructor_avatar: '🏗️',
    thumbnail_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    short_description: 'Architecting distributed systems: Load Balancers, CAP Theorem, Database Sharding, Caching strategies, and Microservices.',
    description: 'Comprehensive system design course covering both high-level and low-level architectural patterns required for Tier-1 and Tier-2 software engineering interviews.',
    tags: ['System Design', 'Scalability', 'Microservices', 'Distributed Systems', 'Redis', 'Kafka'],
    prerequisites: ['Basic understanding of client-server architecture and databases'],
    learning_outcomes: [
      'Design scalable distributed architectures capable of handling millions of QPS',
      'Apply CAP theorem, PACELC, and consistent hashing to real system designs',
      'Implement multi-layer caching with Redis and Memcached',
      'Confidently answer system design questions (Design URL Shortener, Twitter, Uber)'
    ],
    is_published: true,
    enrolled_count: 289,
    rating: 4.88,
    created_at: new Date('2026-02-01').toISOString(),
    updated_at: new Date('2026-03-10').toISOString(),
    modules: [
      {
        id: 'mod-sd-1',
        title: 'Module 1: Scalability Fundamentals',
        description: 'Core building blocks of reliable distributed services.',
        order: 1,
        lessons: [
          {
            id: 'les-sd-1',
            title: 'Vertical vs Horizontal Scaling & Load Balancing',
            slug: 'scaling-and-load-balancing',
            type: 'article',
            duration_minutes: 30,
            order: 1,
            content: `### Horizontal Scaling & Load Balancing Algorithms

When designing systems to scale from 1,000 to 10,000,000 users, understanding load distribution is paramount.

#### Load Balancer Distribution Strategies
1. **Round Robin & Weighted Round Robin**: Cycles through servers sequentially, optionally weighting servers by CPU/RAM capacity.
2. **Least Connections**: Dispatches traffic to the instance currently serving the fewest active requests.
3. **Consistent Hashing**: Minimizes key re-distribution when servers are added or removed (crucial for distributed caching).`
          }
        ]
      }
    ]
  },
  {
    id: 'course-core-cs',
    title: 'Operating Systems, DBMS & Computer Networks: Core CS Screening',
    slug: 'core-cs-fundamentals',
    category: 'core_cs',
    level: 'beginner',
    duration_hours: 16,
    instructor_name: 'NexPrep Core CS Faculty',
    instructor_title: 'Systems, Networking & Database Group',
    instructor_avatar: '💻',
    thumbnail_url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80',
    short_description: 'The foundation for technical screening: Process scheduling, Virtual Memory, ACID transactions, Normalization, and TCP/IP stack.',
    description: 'All placement screening rounds and technical interviews assess core CS fundamentals. This course provides rigorous, conceptual clarity with interview-focused diagrams and questions.',
    tags: ['Operating Systems', 'DBMS', 'Computer Networks', 'SQL', 'Concurrency'],
    prerequisites: ['None (Foundational curriculum)'],
    learning_outcomes: [
      'Explain OS processes, threads, virtual memory, and deadlock conditions',
      'Master DBMS transaction isolation levels, indexing, and normalization forms',
      'Understand TCP 3-way handshake, DNS resolution, and HTTP/HTTPS protocols',
      'Excel in online assessment technical MCQs for TCS, Infosys, Wipro, and Amazon'
    ],
    is_published: true,
    enrolled_count: 670,
    rating: 4.92,
    created_at: new Date('2026-01-05').toISOString(),
    updated_at: new Date('2026-03-12').toISOString(),
    modules: [
      {
        id: 'mod-cs-1',
        title: 'Module 1: Operating Systems & Process Concurrency',
        description: 'Process management, synchronization primitives, and virtual memory.',
        order: 1,
        lessons: [
          {
            id: 'les-cs-1',
            title: 'Processes vs Threads & Deadlock Prevention (Coffman Conditions)',
            slug: 'processes-threads-deadlocks',
            type: 'article',
            duration_minutes: 30,
            order: 1,
            content: `### Operating Systems: Processes, Threads & Deadlocks

#### 1. Process vs Thread
- **Process**: An executing program with its own address space, text, data, open file descriptors, and heap.
- **Thread**: A lightweight unit of execution within a process. Threads share the process's heap and global variables, but have their own registers and stack.

#### 2. The 4 Coffman Conditions for Deadlock
A deadlock occurs if and only if all four conditions hold simultaneously:
1. **Mutual Exclusion**: At least one resource is held in non-shareable mode.
2. **Hold and Wait**: A process holds at least one resource and is waiting for others.
3. **No Preemption**: Resources cannot be preempted; only released voluntarily.
4. **Circular Wait**: A closed loop of processes where each waits for a resource held by the next.`
          }
        ]
      }
    ]
  }
];
