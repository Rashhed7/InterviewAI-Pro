import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import {
  getLeaderboard,
  saveCodingSubmission,
  analyzeResumeText,
} from "../services/interview.service";
import { analyzeResumeWithGemini } from "../services/gemini.service";
import { InterviewService } from "../services/interview/InterviewService";
import { InterviewMode } from "../services/interview/types";

const interviewServiceInstance = new InterviewService();

/**
 * Start a new AI Interview Session
 */
export const startInterview = async (req: AuthRequest, res: Response) => {
  try {
    const { role, mode, customRoleTitle, resumeText, targetCompany, yearsExperience } = req.body;
    const result = await interviewServiceInstance.startSession(
      role || "Full Stack",
      (mode as InterviewMode) || "Technical Interview",
      customRoleTitle,
      resumeText,
      targetCompany,
      yearsExperience
    );

    return res.status(200).json({
      success: true,
      sessionId: result.sessionId,
      nextTurn: result.firstTurn,
      state: result.state,
    });
  } catch (error: any) {
    console.error("[startInterview Controller Error]:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Process Candidate Answer & Fetch Next Question Turn
 */
export const nextQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId, answer, codeSnippet, metrics, antiCheatWarnings, existingState } = req.body;
    const result = await interviewServiceInstance.processNextTurn(
      sessionId,
      answer || "",
      codeSnippet,
      metrics,
      antiCheatWarnings,
      existingState
    );

    return res.status(200).json({
      success: true,
      nextTurn: result.nextTurn,
      state: result.state,
    });
  } catch (error: any) {
    console.error("[nextQuestion Controller Error]:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Analyze Code Submission in Coding Interview Mode
 */
export const analyzeCoding = async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId, problemTitle, problemDescription, code, language } = req.body;
    const analysis = await interviewServiceInstance.submitCodingSolution(
      sessionId,
      problemTitle,
      problemDescription,
      code,
      language || "javascript"
    );

    return res.status(200).json({
      success: true,
      analysis,
    });
  } catch (error: any) {
    console.error("[analyzeCoding Controller Error]:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Generate Final AI JSON Report with per-question FAANG analysis & roadmap
 */
export const generateReport = async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId, state } = req.body;
    const result = await interviewServiceInstance.generateFinalReport(sessionId, state);

    return res.status(200).json({
      success: true,
      report: result.report,
      state: result.state,
    });
  } catch (error: any) {
    console.error("[generateReport Controller Error]:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Save Completed Interview Session
 */
export const saveInterview = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { sessionId, report, state } = req.body;

    if (report && state) {
      const dbSession = await interviewServiceInstance.saveSessionToDatabase(userId, sessionId, report, state);
      return res.status(200).json({
        success: true,
        session: dbSession,
        report,
      });
    }

    return res.status(400).json({ success: false, message: "Invalid session or report payload" });
  } catch (error: any) {
    console.error("[saveInterview Controller Error]:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Comprehensive Resume ATS Analysis & FAANG Bullet Rewriter
 */
export const handleAnalyzeResumeFull = async (req: AuthRequest, res: Response) => {
  try {
    const { resumeText, targetRole } = req.body;
    if (!resumeText) {
      return res.status(400).json({ success: false, message: "Resume text is required" });
    }

    const fullAnalysis = await interviewServiceInstance.analyzeResumeFull(resumeText, targetRole);

    return res.status(200).json({
      success: true,
      analysis: fullAnalysis,
    });
  } catch (error: any) {
    console.error("[handleAnalyzeResumeFull Controller Error]:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Fetch Aggregated User AI Memory Profile
 */
export const fetchUserMemory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const memory = await interviewServiceInstance.getUserAIMemory(userId);
    return res.status(200).json({ success: true, memory });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Fetch User's Interview History
 */
export const fetchHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const history = await interviewServiceInstance.getHistory(userId);
    return res.status(200).json({ success: true, history });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Save Coding Submission
 */
export const submitCodingSolution = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { problemId, title, language, code, status } = req.body;
    const submission = await saveCodingSubmission(
      userId,
      problemId || "two-sum",
      title || "Two Sum",
      language || "javascript",
      code || "",
      status || "Passed"
    );

    return res.status(200).json({ success: true, submission });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Fetch Leaderboard
 */
export const fetchLeaderboard = async (req: AuthRequest, res: Response) => {
  try {
    const leaderboard = await getLeaderboard();
    return res.status(200).json({ success: true, leaderboard });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Legacy Resume Analysis Endpoint
 */
export const handleAnalyzeResume = async (req: AuthRequest, res: Response) => {
  try {
    const { resumeText } = req.body;
    if (!resumeText) return res.status(400).json({ success: false, message: "Resume text required" });
    const geminiAnalysis = await analyzeResumeWithGemini(resumeText);
    const localAnalysis = analyzeResumeText(resumeText);

    return res.status(200).json({
      success: true,
      analysis: {
        ...localAnalysis,
        atsScore: geminiAnalysis.score || localAnalysis.atsScore,
        summary: geminiAnalysis.summary || "Technical resume.",
        missingSkills: geminiAnalysis.missingSkills || ["System Design"],
      },
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Legacy Generate Question Endpoint
 */
export const handleGenerateQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const { roleTitle, previousAnswers } = req.body;
    const state = {
      role: roleTitle || "Software Engineer",
      mode: "Technical Interview" as InterviewMode,
      difficulty: "Medium" as const,
      history: [],
      topicsCovered: [],
      detectedMistakes: [],
      detectedStrengths: [],
      detectedWeaknesses: [],
      candidateConfidence: "Moderate" as const,
      progress: 20,
      antiCheatWarnings: [],
    };

    const nextTurnResult = await interviewServiceInstance.processNextTurn("", previousAnswers ? previousAnswers[previousAnswers.length - 1] : "", undefined, undefined, undefined, state);
    return res.status(200).json({ success: true, question: nextTurnResult.nextTurn.question, nextTurn: nextTurnResult.nextTurn });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
