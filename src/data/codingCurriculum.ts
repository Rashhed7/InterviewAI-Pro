export interface VisualStep {
  stepIndex: number;
  label: string;
  explanation: string;
  variableState: Record<string, string | number | boolean | null>;
  highlightLine?: number;
}

export interface CurriculumLesson {
  id: string;
  topicTitle: string;
  category: "Basics" | "Data Structures" | "Algorithms" | "Advanced" | "System Design";
  order: number;
  unlocked: boolean;
  difficulty: "Beginner" | "Easy" | "Medium" | "Hard" | "Expert";
  overview: string;
  realWorldUseCase: string;
  keyConcepts: string[];
  dryRunSteps: VisualStep[];
  codeTemplate: Record<string, string>;
  practiceQuestion: {
    id: string;
    title: string;
    description: string;
    sampleInput: string;
    sampleOutput: string;
    timeComplexity: string;
    spaceComplexity: string;
    solutionCode: string;
  };
}

export const CODING_ROADMAP: CurriculumLesson[] = [
  {
    id: "basics-variables",
    topicTitle: "Programming Basics & Variables",
    category: "Basics",
    order: 1,
    unlocked: true,
    difficulty: "Beginner",
    overview: "Variables store data values in memory. Understanding types (numbers, strings, booleans) and scope is the foundation of programming.",
    realWorldUseCase: "Storing user login sessions, cart prices, and API request flags in memory.",
    keyConcepts: ["Variable Declaration (let, const, var)", "Primitive Types vs Reference Types", "Scope & Mutability"],
    dryRunSteps: [
      { stepIndex: 1, label: "Declare 'x'", explanation: "Allocating memory for x and assigning value 10.", variableState: { x: 10 }, highlightLine: 1 },
      { stepIndex: 2, label: "Declare 'y'", explanation: "Allocating memory for y and assigning value 20.", variableState: { x: 10, y: 20 }, highlightLine: 2 },
      { stepIndex: 3, label: "Compute Sum", explanation: "Computing x + y = 30 and storing in sum variable.", variableState: { x: 10, y: 20, sum: 30 }, highlightLine: 3 },
    ],
    codeTemplate: {
      javascript: `function calculateTotal(price, taxRate) {\n  // Write code to return price + (price * taxRate)\n  const taxAmount = price * taxRate;\n  return price + taxAmount;\n}`,
      python: `def calculate_total(price: float, tax_rate: float) -> float:\n    # Write code to return price + (price * tax_rate)\n    tax_amount = price * tax_rate\n    return price + tax_amount`,
    },
    practiceQuestion: {
      id: "q-var-1",
      title: "Calculate Total Price with Tax",
      description: "Write a function that accepts `price` and `taxRate` and returns the final total.",
      sampleInput: "price = 100, taxRate = 0.1",
      sampleOutput: "110",
      timeComplexity: "O(1)",
      spaceComplexity: "O(1)",
      solutionCode: "function calculateTotal(price, taxRate) { return price + (price * taxRate); }",
    },
  },
  {
    id: "loops-iteration",
    topicTitle: "Loops & Iteration",
    category: "Basics",
    order: 2,
    unlocked: true,
    difficulty: "Beginner",
    overview: "Loops allow executing a block of code repeatedly while a specified condition evaluates to true.",
    realWorldUseCase: "Iterating through user records in a database result set or rendering items in a UI list.",
    keyConcepts: ["for loops", "while loops", "break & continue", "Loop invariant & termination conditions"],
    dryRunSteps: [
      { stepIndex: 1, label: "Initialize loop i=0", explanation: "Loop counter i set to 0. Condition i < 3 is true.", variableState: { i: 0, sum: 0 }, highlightLine: 1 },
      { stepIndex: 2, label: "Iteration 1 (i=0)", explanation: "Add 1 to sum. sum becomes 1.", variableState: { i: 0, sum: 1 }, highlightLine: 2 },
      { stepIndex: 3, label: "Iteration 2 (i=1)", explanation: "Increment i to 1. Add 2 to sum. sum becomes 3.", variableState: { i: 1, sum: 3 }, highlightLine: 2 },
      { stepIndex: 4, label: "Iteration 3 (i=2)", explanation: "Increment i to 2. Add 3 to sum. sum becomes 6.", variableState: { i: 2, sum: 6 }, highlightLine: 2 },
      { stepIndex: 5, label: "Loop Termination", explanation: "Increment i to 3. Condition i < 3 is false. Exit loop.", variableState: { i: 3, sum: 6 }, highlightLine: 3 },
    ],
    codeTemplate: {
      javascript: `function sumRange(n) {\n  let sum = 0;\n  for (let i = 1; i <= n; i++) {\n    sum += i;\n  }\n  return sum;\n}`,
      python: `def sum_range(n: int) -> int:\n    sum_val = 0\n    for i in range(1, n + 1):\n        sum_val += i\n    return sum_val`,
    },
    practiceQuestion: {
      id: "q-loop-1",
      title: "Sum of First N Integers",
      description: "Write a function that calculates the sum of all integers from 1 to N using a loop.",
      sampleInput: "n = 5",
      sampleOutput: "15",
      timeComplexity: "O(N)",
      spaceComplexity: "O(1)",
      solutionCode: "function sumRange(n) { let s = 0; for(let i=1;i<=n;i++) s += i; return s; }",
    },
  },
  {
    id: "arrays-vectors",
    topicTitle: "Arrays & Contiguous Memory",
    category: "Data Structures",
    order: 3,
    unlocked: true,
    difficulty: "Easy",
    overview: "Arrays store elements in contiguous memory locations, allowing instant O(1) index access but O(N) insertion/deletion.",
    realWorldUseCase: "Buffer streams, time-series metrics, database indexing, and batch operation queues.",
    keyConcepts: ["0-based Indexing", "Contiguous Memory Layout", "Two-Pointer Technique", "Sliding Window"],
    dryRunSteps: [
      { stepIndex: 1, label: "Initialize Array", explanation: "Array [10, 20, 30, 40] stored at memory address 0x100.", variableState: { arr: "[10, 20, 30, 40]", ptr: 0 }, highlightLine: 1 },
      { stepIndex: 2, label: "Access arr[2]", explanation: "Offset calculation 0x100 + 2 * sizeof(int) = element 30.", variableState: { arr: "[10, 20, 30, 40]", value: 30 }, highlightLine: 2 },
    ],
    codeTemplate: {
      javascript: `function findMaxElement(nums) {\n  let maxVal = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    if (nums[i] > maxVal) maxVal = nums[i];\n  }\n  return maxVal;\n}`,
      python: `def find_max_element(nums: list[int]) -> int:\n    max_val = nums[0]\n    for num in nums[1:]:\n        if num > max_val:\n            max_val = num\n    return max_val`,
    },
    practiceQuestion: {
      id: "q-arr-1",
      title: "Find Maximum Element in Array",
      description: "Given an array of integers, return the maximum element.",
      sampleInput: "nums = [3, 7, 2, 9, 4]",
      sampleOutput: "9",
      timeComplexity: "O(N)",
      spaceComplexity: "O(1)",
      solutionCode: "function findMaxElement(nums) { return Math.max(...nums); }",
    },
  },
  {
    id: "hash-maps",
    topicTitle: "Hash Maps & Hash Tables",
    category: "Data Structures",
    order: 4,
    unlocked: true,
    difficulty: "Easy",
    overview: "Hash Maps map keys to values using a hashing function for O(1) average lookup, insertion, and deletion.",
    realWorldUseCase: "Caching (Redis), database indexes, counting frequencies, and constant-time duplicate detection.",
    keyConcepts: ["Hash Function", "Collision Handling (Chaining / Open Addressing)", "O(1) Average Lookup"],
    dryRunSteps: [
      { stepIndex: 1, label: "Insert Key 'user_1'", explanation: "hash('user_1') % tableSize = Bucket 3. Storing payload.", variableState: { map: "{ user_1: 'Alex' }" }, highlightLine: 1 },
    ],
    codeTemplate: {
      javascript: `function hasDuplicate(nums) {\n  const seen = new Set();\n  for (const num of nums) {\n    if (seen.has(num)) return true;\n    seen.add(num);\n  }\n  return false;\n}`,
      python: `def has_duplicate(nums: list[int]) -> bool:\n    seen = set()\n    for num in nums:\n        if num in seen:\n            return True\n        seen.add(num)\n    return False`,
    },
    practiceQuestion: {
      id: "q-hash-1",
      title: "Contains Duplicate Check",
      description: "Return true if any value appears at least twice in the array, and false if every element is distinct.",
      sampleInput: "nums = [1, 2, 3, 1]",
      sampleOutput: "true",
      timeComplexity: "O(N)",
      spaceComplexity: "O(N)",
      solutionCode: "function hasDuplicate(nums) { return new Set(nums).size !== nums.length; }",
    },
  },
];
