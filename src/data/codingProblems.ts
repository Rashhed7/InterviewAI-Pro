export interface TestCase {
  id: number;
  input: string;
  expectedOutput: string;
  explanation?: string;
  isHidden?: boolean;
}

export interface CodingProblem {
  id: string;
  title: string;
  category: "DSA" | "Frontend" | "Backend" | "System Design" | "AI & ML" | "DevOps" | "Security";
  difficulty: "Easy" | "Medium" | "Hard" | "Expert";
  companyTags: string[];
  statement: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string[];
  sampleCases: TestCase[];
  hiddenCases: TestCase[];
  starterCode: Record<string, string>;
  timeComplexityOptimal: string;
  spaceComplexityOptimal: string;
  hints: string[];
  optimalSolutionText: string;
}

export const CODING_PROBLEMS_COLLECTION: CodingProblem[] = [
  {
    id: "two-sum-enterprise",
    title: "Two Sum Target Indices",
    category: "DSA",
    difficulty: "Easy",
    companyTags: ["Google", "Stripe", "Uber", "Amazon"],
    statement:
      "Given an array of integers `nums` and an integer `target`, return the 0-based indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
    inputFormat: "nums: Array<number>, target: number",
    outputFormat: "Array<number> containing indices [index1, index2]",
    constraints: [
      "2 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Exactly one valid answer exists.",
    ],
    sampleCases: [
      {
        id: 1,
        input: "nums = [2, 7, 11, 15], target = 9",
        expectedOutput: "[0, 1]",
        explanation: "Because nums[0] + nums[1] == 2 + 7 == 9, we return [0, 1].",
      },
      {
        id: 2,
        input: "nums = [3, 2, 4], target = 6",
        expectedOutput: "[1, 2]",
        explanation: "nums[1] + nums[2] == 2 + 4 == 6, return [1, 2].",
      },
    ],
    hiddenCases: [
      { id: 3, input: "nums = [3, 3], target = 6", expectedOutput: "[0, 1]", isHidden: true },
      { id: 4, input: "nums = [-1, -8, 10, 5], target = 2", expectedOutput: "[1, 2]", isHidden: true },
      { id: 5, input: "nums = [1000000, 500000, 500000], target = 1000000", expectedOutput: "[1, 2]", isHidden: true },
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // Write your solution here
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      python: `def two_sum(nums: list[int], target: int) -> list[int]:
    # Write your solution here
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []`,
      typescript: `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      cpp: `#include <vector>
#include <unordered_map>

std::vector<int> twoSum(std::vector<int>& nums, int target) {
    std::unordered_map<int, int> map;
    for (int i = 0; i < nums.size(); i++) {
        int diff = target - nums[i];
        if (map.find(diff) != map.end()) {
            return {map[diff], i};
        }
        map[nums[i]] = i;
    }
    return {};
}`,
      java: `import java.util.HashMap;

public class Solution {
    public int[] twoSum(int[] nums, int target) {
        HashMap<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int diff = target - nums[i];
            if (map.containsKey(diff)) {
                return new int[] { map.get(diff), i };
            }
            map.put(nums[i], i);
        }
        return new int[0];
    }
}`,
      go: `package main

func twoSum(nums []int, target int) []int {
    seen := make(map[int]int)
    for i, num := range nums {
        diff := target - num
        if idx, ok := seen[diff]; ok {
            return []int{idx, i}
        }
        seen[num] = i
    }
    return nil
}`,
    },
    timeComplexityOptimal: "O(N) - Single pass Hash Map lookup",
    spaceComplexityOptimal: "O(N) - Storage for Hash Map elements",
    hints: [
      "Can you avoid brute-force O(N^2) nested loops by using auxiliary space?",
      "Consider using a Hash Map (or Hash Table) to store element values and their corresponding array indices.",
      "As you iterate through `nums`, check if `target - current_element` already exists in your map.",
    ],
    optimalSolutionText:
      "Use a Hash Map to store numbers and their indices in O(N) time and O(N) space. For each element, lookup target - element in O(1) time.",
  },
  {
    id: "lru-cache-system",
    title: "Design LRU Cache",
    category: "System Design",
    difficulty: "Medium",
    companyTags: ["Atlassian", "Microsoft", "Uber", "Razorpay"],
    statement:
      "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.\n\nImplement the `LRUCache` class:\n- `LRUCache(capacity)` Initialize the LRU cache with positive size capacity.\n- `get(key)` Return the value of key if key exists, otherwise return -1.\n- `put(key, value)` Update key if key exists. Otherwise, add key-value pair to cache. If keys exceed capacity, evict the least recently used key.",
    inputFormat: "LRUCache(capacity), get(key), put(key, value)",
    outputFormat: "Integer value or -1",
    constraints: ["1 <= capacity <= 3000", "0 <= key <= 10^4", "0 <= value <= 10^5", "get and put must run in O(1) average time."],
    sampleCases: [
      {
        id: 1,
        input: 'put(1, 1), put(2, 2), get(1), put(3, 3), get(2)',
        expectedOutput: 'get(1) -> 1, get(2) -> -1',
        explanation: 'Key 2 was evicted when key 3 was inserted because key 2 was least recently used.',
      },
    ],
    hiddenCases: [
      { id: 2, input: 'capacity = 1, put(2, 1), get(2), put(3, 2), get(2)', expectedOutput: 'get(2) -> -1', isHidden: true },
    ],
    starterCode: {
      javascript: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    const val = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, value);
  }
}`,
      python: `class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = {}

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        val = self.cache.pop(key)
        self.cache[key] = val
        return val

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.cache.pop(key)
        elif len(self.cache) >= self.capacity:
            oldest = next(iter(self.cache))
            del self.cache[oldest]
        self.cache[key] = value`,
    },
    timeComplexityOptimal: "O(1) average for both get and put operations",
    spaceComplexityOptimal: "O(Capacity) for storing entries",
    hints: [
      "How can you achieve O(1) lookup and O(1) removal/insertion at the head/tail?",
      "Combine a Hash Map with a Doubly Linked List, or leverage JS Map / Python OrderDict ordering semantics.",
    ],
    optimalSolutionText: "Combine Hash Map for O(1) key lookup with Doubly Linked List for O(1) node relocation and eviction.",
  },
  {
    id: "max-subarray-kadane",
    title: "Maximum Subarray (Kadane's Algorithm)",
    category: "DSA",
    difficulty: "Medium",
    companyTags: ["Google", "Meta", "Amazon", "Freshworks"],
    statement:
      "Given an integer array `nums`, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
    inputFormat: "nums: Array<number>",
    outputFormat: "number (largest sum)",
    constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    sampleCases: [
      {
        id: 1,
        input: "nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]",
        expectedOutput: "6",
        explanation: "Subarray [4, -1, 2, 1] has the largest sum = 6.",
      },
    ],
    hiddenCases: [
      { id: 2, input: "nums = [-1]", expectedOutput: "-1", isHidden: true },
      { id: 3, input: "nums = [5, 4, -1, 7, 8]", expectedOutput: "23", isHidden: true },
    ],
    starterCode: {
      javascript: `function maxSubArray(nums) {
  let maxSoFar = nums[0];
  let currMax = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currMax = Math.max(nums[i], currMax + nums[i]);
    maxSoFar = Math.max(maxSoFar, currMax);
  }
  return maxSoFar;
}`,
      python: `def max_sub_array(nums: list[int]) -> int:
    max_so_far = nums[0]
    curr_max = nums[0]
    for i in range(1, len(nums)):
        curr_max = max(nums[i], curr_max + nums[i])
        max_so_far = max(max_so_far, curr_max)
    return max_so_far`,
    },
    timeComplexityOptimal: "O(N) single pass",
    spaceComplexityOptimal: "O(1) constant auxiliary space",
    hints: [
      "Think about dynamic programming: at each index, do you extend the previous subarray or start a new subarray at current element?",
      "If running current sum drops below current element, reset starting subarray.",
    ],
    optimalSolutionText: "Kadane's Algorithm maintains running maximum subarray ending at current index in linear time O(N).",
  },
];
