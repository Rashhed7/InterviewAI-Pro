import { Router } from "express";
import {
  startInterview,
  nextQuestion,
  analyzeCoding,
  generateReport,
  saveInterview,
  fetchHistory,
  submitCodingSolution,
  fetchLeaderboard,
  handleAnalyzeResume,
  handleAnalyzeResumeFull,
  fetchUserMemory,
  handleGenerateQuestion,
} from "../controllers/interview.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// AI Interview System Core Endpoints
router.post("/start", authenticate, startInterview);
router.post("/next-question", authenticate, nextQuestion);
router.post("/analyze-coding", authenticate, analyzeCoding);
router.post("/generate-report", authenticate, generateReport);

// Full Resume ATS Analysis & FAANG Rewriter
router.post("/analyze-resume-full", authenticate, handleAnalyzeResumeFull);

// AI User Memory Profile
router.get("/user-memory", authenticate, fetchUserMemory);

// Session & History
router.post("/session", authenticate, saveInterview);
router.get("/history", authenticate, fetchHistory);
router.post("/coding-submit", authenticate, submitCodingSolution);
router.get("/leaderboard", authenticate, fetchLeaderboard);
router.post("/analyze-resume", authenticate, handleAnalyzeResume);

// Backward compatibility question endpoint
router.post("/generate-question", authenticate, handleGenerateQuestion);

export default router;
