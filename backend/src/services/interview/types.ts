export type InterviewMode =
  | "Technical Interview"
  | "HR Interview"
  | "Behavioral Interview"
  | "Coding Interview"
  | "System Design Interview"
  | "Machine Learning Interview"
  | "Data Science Interview"
  | "Frontend"
  | "Backend"
  | "Full Stack"
  | "DevOps"
  | "Cloud"
  | "Cyber Security"
  | "Custom Role";

export type DifficultyLevel = "Easy" | "Medium" | "Hard" | "Expert Level";

export interface AntiCheatWarning {
  type: "tab_switch" | "window_blur" | "copy_paste" | "looking_away" | "camera_off" | "mic_muted" | "long_silence";
  timestamp: number;
  message: string;
}

export interface CandidateMetrics {
  confidenceScore: number; // 0-100
  communicationScore: number; // 0-100
  speakingSpeedWPM: number;
  fillerWordCount: number;
  hesitationCount: number;
  eyeContactScore: number; // 0-100
  facialExpression: "Confident" | "Nervous" | "Focused" | "Stressed" | "Neutral";
  attentionScore: number; // 0-100
  professionalismScore: number; // 0-100
}

export interface QuestionSTARAnalysis {
  questionNumber: number;
  questionText: string;
  candidateAnswer: string;
  idealSTARAnswer: {
    starMethod: {
      situation?: string;
      task?: string;
      action?: string;
      result?: string;
    };
    fullAnswerText: string;
    keyConcepts: string[];
    technicalDepth: string;
    businessImpact: string;
  };
  gapAnalysis: {
    missedKeywords: string[];
    missedConcepts: string[];
    weakExplanations: string[];
    whatWasGood: string[];
    expectedExtraPoints: string[];
  };
  rewrittenWinningAnswer: string;
}

// Backward compatibility alias
export type QuestionFAANGAnalysis = QuestionSTARAnalysis;

export interface TurnAnalysis {
  technicalAccuracy: number; // 0 - 100
  communication: number; // 0 - 100
  confidence: number; // 0 - 100
  problemSolving: number; // 0 - 100
  depth: number; // 0 - 100
  keyTakeaway: string;
  detectedMistakes: string[];
  detectedStrengths: string[];
  detectedWeaknesses: string[];
  questionAnalysis?: QuestionSTARAnalysis;
}

export interface ConversationTurn {
  question: string;
  answer: string;
  timestamp?: number;
  codeSnippet?: string;
  analysis?: TurnAnalysis;
  metrics?: CandidateMetrics;
}

export interface InterviewState {
  role: string;
  mode: InterviewMode;
  customRoleTitle?: string;
  resumeText?: string;
  difficulty: DifficultyLevel;
  history: ConversationTurn[];
  topicsCovered: string[];
  detectedMistakes: string[];
  detectedStrengths: string[];
  detectedWeaknesses: string[];
  candidateConfidence: "Low" | "Moderate" | "High";
  progress: number; // 0 - 100
  antiCheatWarnings: AntiCheatWarning[];
  targetCompany?: string;
  yearsExperience?: number;
}

export interface NextQuestionResponse {
  question: string;
  followUpReason: string;
  difficulty: DifficultyLevel;
  topic: string;
  progress: number;
  isInterviewComplete: boolean;
  codingProblem?: {
    title: string;
    description: string;
    starterCode: Record<string, string>;
    constraints: string[];
    sampleInputOutput: Array<{ input: string; output: string; explanation?: string }>;
  };
  turnAnalysis?: TurnAnalysis;
}

export interface CodingAnalysisResponse {
  isCorrect: boolean;
  timeComplexity: string;
  spaceComplexity: string;
  bugs: string[];
  improvements: string[];
  hiddenTestCases: Array<{ input: string; expectedOutput: string; actualBehavior: string; passed: boolean }>;
  optimalSolution: string;
  codeExplanation: string;
}

export interface LearningRoadmapItem {
  topic: string;
  priority: "High" | "Medium" | "Low";
  recommendedDocs: string[];
  youtubeSearchQuery: string;
  leetCodeProblem?: string;
  projectIdea: string;
  dailyPracticeTask: string;
}

export interface FinalReportResponse {
  overallScore: number;
  technicalKnowledge: number;
  communication: number;
  confidenceScore: number;
  problemSolving: number;
  leadership: number;
  bodyLanguageScore: number;
  eyeContactScore: number;
  grammarScore: number;
  fluencyScore: number;
  vocabularyScore: number;
  voiceClarityScore: number;
  responseQualityScore: number;
  timeManagementScore: number;
  professionalismScore: number;

  strengths: string[];
  weaknesses: string[];
  missedConcepts: string[];
  topicsCovered: string[];
  interviewSummary: string;
  hiringRecommendation: "Hire" | "Strong Hire" | "Maybe" | "No Hire";
  
  perQuestionAnalysis: QuestionSTARAnalysis[];
  recommendations: string[];
  learningRoadmap: LearningRoadmapItem[];
  antiCheatSummary: {
    totalWarnings: number;
    integrityScore: number;
    details: AntiCheatWarning[];
  };
}

export interface ResumeBulletRewrite {
  originalBullet: string;
  improvedBullet: string;
  explanation: string;
  addedMetrics: string;
}

export interface FullResumeAnalysisResponse {
  atsScore: number; // 0-100
  structureScore: number;
  keywordScore: number;
  formattingScore: number;
  actionVerbScore: number;
  summary: string;
  careerLevel: string;
  expectedSalaryRange: string;
  overallHiringProbability: number;
  missingSkills: string[];
  matchedSkills: string[];
  missingSections: string[];
  weakBulletRewrites: ResumeBulletRewrite[];
  recommendations: string[];
}

export interface UserAIMemory {
  userId: string;
  targetRole: string;
  targetCompany: string;
  totalInterviewsCompleted: number;
  averageOverallScore: number;
  interviewStreak: number;
  strongTopics: string[];
  weakTopics: string[];
  historicalScores: Array<{ date: string; score: number; role: string }>;
  recentResumeAnalysis?: FullResumeAnalysisResponse;
}
