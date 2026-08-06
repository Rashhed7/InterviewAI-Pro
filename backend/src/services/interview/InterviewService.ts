import prisma from "../../config/prisma";
import { ConversationMemory } from "./ConversationMemory";
import { GeminiInterviewEngine } from "./GeminiInterviewEngine";
import { InterviewReportGenerator } from "./InterviewReportGenerator";
import { UserMemoryService } from "./UserMemoryService";
import {
  AntiCheatWarning,
  CandidateMetrics,
  CodingAnalysisResponse,
  FinalReportResponse,
  FullResumeAnalysisResponse,
  InterviewMode,
  InterviewState,
  NextQuestionResponse,
} from "./types";
const activeSessions: Map<string, { memory: ConversationMemory; createdAt: number }> = new Map();

// Session cleanup every 4 hours
setInterval(() => {
  const now = Date.now();
  for (const [id, session] of activeSessions.entries()) {
    if (now - session.createdAt > 4 * 60 * 60 * 1000) {
      activeSessions.delete(id);
    }
  }
}, 60 * 60 * 1000);

export class InterviewService {
  private engine: GeminiInterviewEngine;
  private reportGenerator: InterviewReportGenerator;

  constructor() {
    this.engine = new GeminiInterviewEngine();
    this.reportGenerator = new InterviewReportGenerator();
  }

  public async startSession(
    role: string,
    mode: InterviewMode,
    customRoleTitle?: string,
    resumeText?: string,
    targetCompany?: string,
    yearsExperience?: number
  ): Promise<{ sessionId: string; firstTurn: NextQuestionResponse; state: InterviewState }> {
    const effectiveRole = mode === "Custom Role" ? (customRoleTitle || role || "Software Engineer") : role;
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const memory = new ConversationMemory(effectiveRole, mode, resumeText);
    const state = memory.getState();
    state.targetCompany = targetCompany;
    state.yearsExperience = yearsExperience;

    const firstTurn = await this.engine.generateNextQuestion(state);

    memory.recordTurn(
      firstTurn.question,
      "",
      firstTurn.turnAnalysis,
      undefined,
      firstTurn.topic,
      firstTurn.difficulty,
      firstTurn.progress
    );

    activeSessions.set(sessionId, { memory, createdAt: Date.now() });

    return {
      sessionId,
      firstTurn,
      state: memory.getState(),
    };
  }

  public async processNextTurn(
    sessionId: string,
    answer: string,
    codeSnippet?: string,
    metrics?: CandidateMetrics,
    antiCheatWarnings?: AntiCheatWarning[],
    existingState?: InterviewState
  ): Promise<{ nextTurn: NextQuestionResponse; state: InterviewState }> {
    let memory: ConversationMemory;

    if (sessionId && activeSessions.has(sessionId)) {
      memory = activeSessions.get(sessionId)!.memory;
    } else if (existingState) {
      memory = ConversationMemory.fromState(existingState);
    } else {
      memory = new ConversationMemory("Software Engineer", "Technical Interview");
    }

    const state = memory.getState();
    const lastTurnIndex = state.history.length - 1;

    if (lastTurnIndex >= 0 && !state.history[lastTurnIndex].answer) {
      state.history[lastTurnIndex].answer = answer;
      if (codeSnippet) state.history[lastTurnIndex].codeSnippet = codeSnippet;
      if (metrics) state.history[lastTurnIndex].metrics = metrics;
    }

    if (antiCheatWarnings && antiCheatWarnings.length > 0) {
      state.antiCheatWarnings = state.antiCheatWarnings || [];
      state.antiCheatWarnings.push(...antiCheatWarnings);
    }

    const nextTurn = await this.engine.generateNextQuestion(state, answer, codeSnippet, metrics);

    if (!nextTurn.isInterviewComplete) {
      memory.recordTurn(
        nextTurn.question,
        "",
        nextTurn.turnAnalysis,
        undefined,
        nextTurn.topic,
        nextTurn.difficulty,
        nextTurn.progress
      );
    }

    if (sessionId) {
      activeSessions.set(sessionId, { memory, createdAt: Date.now() });
    }

    return {
      nextTurn,
      state: memory.getState(),
    };
  }

  public async analyzeResumeFull(resumeText: string, targetRole?: string): Promise<FullResumeAnalysisResponse> {
    return await this.engine.analyzeResumeFull(resumeText, targetRole);
  }

  public async submitCodingSolution(
    sessionId: string,
    problemTitle: string,
    problemDescription: string,
    code: string,
    language: string
  ): Promise<CodingAnalysisResponse> {
    return await this.engine.analyzeCodingSubmission(
      problemTitle || "Coding Challenge",
      problemDescription || "Solve problem",
      code,
      language
    );
  }

  public async generateFinalReport(
    sessionId?: string,
    existingState?: InterviewState
  ): Promise<{ report: FinalReportResponse; state: InterviewState }> {
    let memory: ConversationMemory;

    if (sessionId && activeSessions.has(sessionId)) {
      memory = activeSessions.get(sessionId)!.memory;
    } else if (existingState) {
      memory = ConversationMemory.fromState(existingState);
    } else {
      memory = new ConversationMemory("Software Engineer", "Technical Interview");
    }

    const state = memory.getState();
    const report = await this.reportGenerator.generateReport(state);

    return { report, state };
  }

  public async saveSessionToDatabase(
    userId: string,
    sessionId: string,
    report: FinalReportResponse,
    state: InterviewState
  ) {
    const title = `${state.role} AI Interview (${state.mode})`;
    const difficulty = state.difficulty || "Medium";
    const score = report.overallScore;
    const feedback = report.interviewSummary;

    const payloadToSave = {
      sessionId,
      history: state.history,
      report,
      topicsCovered: state.topicsCovered,
      strengths: report.strengths,
      weaknesses: report.weaknesses,
      hiringRecommendation: report.hiringRecommendation,
      antiCheatSummary: report.antiCheatSummary,
    };

    return await prisma.interviewSession.create({
      data: {
        userId,
        title,
        role: state.role,
        difficulty,
        score,
        feedback,
        answersJson: JSON.stringify(payloadToSave),
      },
    });
  }

  public async getUserAIMemory(userId: string) {
    return await UserMemoryService.getUserMemory(userId);
  }

  public async getHistory(userId: string) {
    return await prisma.interviewSession.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }
}
