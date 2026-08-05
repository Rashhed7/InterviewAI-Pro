export interface QuestionTestCase {
  id: number;
  input: string;
  expectedOutput: string;
  isCustom?: boolean;
  isHidden?: boolean;
  explanation?: string;
}

export interface ExpandedCodingProblem {
  id: string;
  title: string;
  slug: string;
  category:
    | "Arrays & Hashing"
    | "Two Pointers"
    | "Sliding Window"
    | "Stack & Queue"
    | "Trees & Graphs"
    | "Dynamic Programming"
    | "SQL & System Design";
  difficulty: "Easy" | "Medium" | "Hard" | "Expert";
  companyCategory: "Top Product Companies" | "High-Growth Startups" | "FinTech" | "Enterprise & Cloud" | "Global Services";
  companyTags: string[];
  statement: string;
  constraints: string[];
  sampleCases: QuestionTestCase[];
  hiddenCases: QuestionTestCase[];
  starterCode: Record<string, string>;
  hints: [string, string, string]; // 3 progressive hint levels
  timeComplexityOptimal: string;
  spaceComplexityOptimal: string;
  solutionExplanation: {
    approach: string;
    dryRun: string;
    optimalCode: Record<string, string>;
    commonMistakes: string[];
    followUpQuestions: string[];
  };
}

export const EXPANDED_PROBLEM_BANK: ExpandedCodingProblem[] = [
  {
    id: "two-sum-pro",
    title: "Two Sum Target Pair",
    slug: "two-sum-target-pair",
    category: "Arrays & Hashing",
    difficulty: "Easy",
    companyCategory: "Top Product Companies",
    companyTags: ["Stripe", "Uber", "Google", "Atlassian"],
    statement:
      "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
    constraints: [
      "2 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Exactly one valid solution exists.",
    ],
    sampleCases: [
      { id: 1, input: "nums = [2, 7, 11, 15], target = 9", expectedOutput: "[0, 1]", explanation: "nums[0] + nums[1] = 2 + 7 = 9" },
      { id: 2, input: "nums = [3, 2, 4], target = 6", expectedOutput: "[1, 2]", explanation: "nums[1] + nums[2] = 2 + 4 = 6" },
    ],
    hiddenCases: [
      { id: 3, input: "nums = [3, 3], target = 6", expectedOutput: "[0, 1]", isHidden: true },
      { id: 4, input: "nums = [-1, -8, 10, 5], target = 2", expectedOutput: "[1, 2]", isHidden: true },
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {\n  // Write your O(N) solution here\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
      python: `def two_sum(nums: list[int], target: int) -> list[int]:\n    # Write your O(N) solution here\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []`,
      typescript: `function twoSum(nums: number[], target: number): number[] {\n  const map = new Map<number, number>();\n  for (let i = 0; i < nums.length; i++) {\n    const comp = target - nums[i];\n    if (map.has(comp)) return [map.get(comp)!, i];\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
      cpp: `#include <vector>\n#include <unordered_map>\n\nstd::vector<int> twoSum(std::vector<int>& nums, int target) {\n    std::unordered_map<int, int> map;\n    for (int i = 0; i < nums.size(); i++) {\n        int comp = target - nums[i];\n        if (map.count(comp)) return {map[comp], i};\n        map[nums[i]] = i;\n    }\n    return {};\n}`,
    },
    hints: [
      "Level 1 Intuition: Avoid a nested O(N^2) loop by checking if target - current_value has been seen before.",
      "Level 2 Strategy: Store previously visited numbers and their array indices in a Hash Map for O(1) average lookup.",
      "Level 3 Pseudo-Code:\nfor i in 0..N:\n  diff = target - nums[i]\n  if map.contains(diff): return [map[diff], i]\n  map[nums[i]] = i",
    ],
    timeComplexityOptimal: "O(N) - Single pass Hash Map traversal",
    spaceComplexityOptimal: "O(N) - Auxiliary Hash Map space",
    solutionExplanation: {
      approach: "We use a Hash Map to store numbers we have seen so far mapped to their array indices. For each element `nums[i]`, we compute its required complement `target - nums[i]`. If the complement exists in the map, we immediately return `[map.get(complement), i]`. Otherwise, we record `nums[i]` in the map and continue.",
      dryRun: "Input: nums = [2, 7, 11, 15], target = 9\n- i=0, num=2: comp = 9 - 2 = 7. Not in map. Map = {2: 0}\n- i=1, num=7: comp = 9 - 7 = 2. Found in map at index 0! Return [0, 1].",
      optimalCode: {
        javascript: `function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
      },
      commonMistakes: [
        "Using the same element twice (e.g. nums[0] + nums[0] = target).",
        "Brute force nested O(N^2) loops causing TLE on 10^5 elements.",
      ],
      followUpQuestions: [
        "What if the input array is already sorted? (Ans: Two Pointer approach in O(1) space).",
        "What if duplicate pairs exist and we need to return all unique index pairs?",
      ],
    },
  },
  {
    id: "lru-cache-enterprise",
    title: "Design LRU Cache System",
    slug: "design-lru-cache-system",
    category: "SQL & System Design",
    difficulty: "Medium",
    companyCategory: "High-Growth Startups",
    companyTags: ["Razorpay", "Uber", "Spotify", "Dropbox"],
    statement:
      "Design a Least Recently Used (LRU) cache system that supports `get(key)` and `put(key, value)` operations in constant O(1) average time.\n\nEvict the least recently accessed key when capacity limit is reached.",
    constraints: ["1 <= capacity <= 3000", "0 <= key <= 10^4", "Both get and put operations must run in O(1) average time."],
    sampleCases: [
      { id: 1, input: "put(1,1), put(2,2), get(1), put(3,3), get(2)", expectedOutput: "get(2) -> -1 (Evicted)" },
    ],
    hiddenCases: [
      { id: 2, input: "capacity=1, put(2,1), get(2), put(3,2), get(2)", expectedOutput: "-1", isHidden: true },
    ],
    starterCode: {
      javascript: `class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.cache = new Map();\n  }\n  get(key) {\n    if (!this.cache.has(key)) return -1;\n    const val = this.cache.get(key);\n    this.cache.delete(key);\n    this.cache.set(key, val);\n    return val;\n  }\n  put(key, value) {\n    if (this.cache.has(key)) {\n      this.cache.delete(key);\n    } else if (this.cache.size >= this.capacity) {\n      const oldestKey = this.cache.keys().next().value;\n      this.cache.delete(oldestKey);\n    }\n    this.cache.set(key, value);\n  }\n}`,
    },
    hints: [
      "Level 1 Intuition: A Hash Map gives O(1) lookup, but how do we maintain access order in O(1)?",
      "Level 2 Strategy: Combine a Hash Map with a Doubly Linked List (DLL) for O(1) insertion, deletion, and relocation.",
      "Level 3 Pseudo-Code:\nclass Node: { key, val, prev, next }\nget(key): node = map[key]; moveToHead(node); return node.val\nput(key, val): if key in map -> update node & moveToHead; else if full -> removeTail & removeMapEntry; insertHead",
    ],
    timeComplexityOptimal: "O(1) average for both get and put operations",
    spaceComplexityOptimal: "O(Capacity) auxiliary space",
    solutionExplanation: {
      approach: "A Doubly Linked List maintains access history with O(1) node detachment and head placement. A Hash Map maps keys directly to DLL node pointers for O(1) retrieval.",
      dryRun: "Insert 1, 2. Get 1 moves key 1 to head. Put 3 evicts key 2 because key 2 is at the tail.",
      optimalCode: {
        javascript: `class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.cache = new Map();\n  }\n  get(key) {\n    if (!this.cache.has(key)) return -1;\n    const val = this.cache.get(key);\n    this.cache.delete(key);\n    this.cache.set(key, val);\n    return val;\n  }\n  put(key, value) {\n    if (this.cache.has(key)) {\n      this.cache.delete(key);\n    } else if (this.cache.size >= this.capacity) {\n      const oldestKey = this.cache.keys().next().value;\n      this.cache.delete(oldestKey);\n    }\n    this.cache.set(key, value);\n  }\n}`,
      },
      commonMistakes: ["Failing to update LRU node order on get() operations.", "Memory leaks when evicting nodes without unlinking pointers."],
      followUpQuestions: ["How would you make this LRU Cache thread-safe for multi-threaded access?", "How would you handle TTL expiration per key?"],
    },
  },
];
