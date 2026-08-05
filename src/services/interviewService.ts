import { apiRequest } from "./api";

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
  confidenceScore: number;
  communicationScore: number;
  speakingSpeedWPM: number;
  fillerWordCount: number;
  hesitationCount: number;
  eyeContactScore: number;
  facialExpression: "Confident" | "Nervous" | "Focused" | "Stressed" | "Neutral";
  attentionScore: number;
  professionalismScore: number;
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

export type QuestionFAANGAnalysis = QuestionSTARAnalysis;

export interface TurnAnalysis {
  technicalAccuracy: number;
  communication: number;
  confidence: number;
  problemSolving: number;
  depth: number;
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
  progress: number;
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
  atsScore: number;
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
}

export interface InterviewSessionData {
  id: string;
  title: string;
  role: string;
  difficulty: string;
  score: number;
  feedback: string;
  answersJson: string;
  createdAt: string;
}

export interface CodingSubmissionData {
  id: string;
  problemId: string;
  title: string;
  language: string;
  code: string;
  status: string;
  createdAt: string;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  avatar?: string;
  totalInterviews: number;
  avgScore: number;
  problemsSolved: number;
  xp: number;
}

export interface ResumeAnalysisResult {
  atsScore: number;
  wordCount: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  summary: string;
  recommendations: string[];
}

export const interviewService = {
  async startInterview(data: {
    role: string;
    mode: InterviewMode;
    customRoleTitle?: string;
    resumeText?: string;
    targetCompany?: string;
    yearsExperience?: number;
  }): Promise<{ success: boolean; sessionId: string; nextTurn: NextQuestionResponse; state: InterviewState }> {
    return await apiRequest<{ success: boolean; sessionId: string; nextTurn: NextQuestionResponse; state: InterviewState }>("/interviews/start", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async nextQuestion(data: {
    sessionId: string;
    answer: string;
    codeSnippet?: string;
    metrics?: CandidateMetrics;
    antiCheatWarnings?: AntiCheatWarning[];
    existingState?: InterviewState;
  }): Promise<{ success: boolean; nextTurn: NextQuestionResponse; state: InterviewState }> {
    return await apiRequest<{ success: boolean; nextTurn: NextQuestionResponse; state: InterviewState }>("/interviews/next-question", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async analyzeCoding(data: {
    sessionId: string;
    problemTitle: string;
    problemDescription: string;
    code: string;
    language: string;
  }): Promise<{ success: boolean; analysis: CodingAnalysisResponse }> {
    return await apiRequest<{ success: boolean; analysis: CodingAnalysisResponse }>("/interviews/analyze-coding", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async generateReport(data: {
    sessionId: string;
    state: InterviewState;
  }): Promise<{ success: boolean; report: FinalReportResponse; state: InterviewState }> {
    return await apiRequest<{ success: boolean; report: FinalReportResponse; state: InterviewState }>("/interviews/generate-report", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async analyzeResumeFull(resumeText: string, targetRole?: string): Promise<{ success: boolean; analysis: FullResumeAnalysisResponse }> {
    return await apiRequest<{ success: boolean; analysis: FullResumeAnalysisResponse }>("/interviews/analyze-resume-full", {
      method: "POST",
      body: JSON.stringify({ resumeText, targetRole }),
    });
  },

  async getUserMemory(): Promise<{ success: boolean; memory: UserAIMemory }> {
    return await apiRequest<{ success: boolean; memory: UserAIMemory }>("/interviews/user-memory", {
      method: "GET",
    });
  },

  async updateUserMemory(data: {
    targetRole?: string;
    targetCompany?: string;
    resumeText?: string;
  }): Promise<{ success: boolean; memory?: UserAIMemory }> {
    return await apiRequest<{ success: boolean; memory?: UserAIMemory }>("/interviews/user-memory", {
      method: "POST",
      body: JSON.stringify(data),
    }).catch(() => ({ success: false }));
  },

  async saveSession(data: {
    sessionId: string;
    report: FinalReportResponse;
    state: InterviewState;
  }): Promise<{ success: boolean; session: InterviewSessionData }> {
    return await apiRequest<{ success: boolean; session: InterviewSessionData }>("/interviews/session", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async submitCodingSolution(data: {
    problemId: string;
    title: string;
    language: string;
    code: string;
    status: string;
  }): Promise<{ success: boolean; submission: CodingSubmissionData }> {
    return await apiRequest<{ success: boolean; submission: CodingSubmissionData }>("/interviews/coding-submit", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getHistory(): Promise<{ success: boolean; history: InterviewSessionData[] }> {
    return await apiRequest<{ success: boolean; history: InterviewSessionData[] }>("/interviews/history", {
      method: "GET",
    });
  },

  async getLeaderboard(): Promise<{ success: boolean; leaderboard: LeaderboardUser[] }> {
    return await apiRequest<{ success: boolean; leaderboard: LeaderboardUser[] }>("/interviews/leaderboard", {
      method: "GET",
    });
  },

  async analyzeResume(resumeText: string): Promise<{ success: boolean; analysis: ResumeAnalysisResult }> {
    return await apiRequest<{ success: boolean; analysis: ResumeAnalysisResult }>("/interviews/analyze-resume", {
      method: "POST",
      body: JSON.stringify({ resumeText }),
    });
  },
};
