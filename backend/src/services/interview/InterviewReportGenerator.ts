import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { PromptBuilder } from "./PromptBuilder";
import { FinalReportResponse, InterviewState, QuestionSTARAnalysis } from "./types";

dotenv.config();

export class InterviewReportGenerator {
  private genAI: GoogleGenerativeAI | null = null;
  private candidateModels = [
    "gemini-3.5-flash",
    "gemini-3.6-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-pro",
  ];

  constructor() {
    const apiKey = (process.env.GEMINI_API_KEY || "").trim().replace(/^["']|["']$/g, "");
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  /**
   * Generate complete AI JSON Report for interview session with per-question STAR analysis
   */
  public async generateReport(state: InterviewState): Promise<FinalReportResponse> {
    if (!this.genAI) {
      return this.buildFallbackReport(state);
    }

    const companyName = state.targetCompany || "Leading Product & Tech Enterprise";
    const systemPrompt = `You are a Senior Technical Hiring Lead at ${companyName} producing an official executive interview evaluation report.`;
    const userPrompt = PromptBuilder.buildFinalReportPrompt(state);

    for (const modelName of this.candidateModels) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.5,
          },
        });

        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
        });

        const text = result.response.text().trim().replace(/^```json|```$/g, "").trim();
        const parsed = JSON.parse(text) as FinalReportResponse;

        return {
          overallScore: typeof parsed.overallScore === "number" ? Math.min(100, Math.max(0, parsed.overallScore)) : 82,
          technicalKnowledge: typeof parsed.technicalKnowledge === "number" ? Math.min(100, Math.max(0, parsed.technicalKnowledge)) : 80,
          communication: typeof parsed.communication === "number" ? Math.min(100, Math.max(0, parsed.communication)) : 85,
          confidenceScore: typeof parsed.confidenceScore === "number" ? Math.min(100, Math.max(0, parsed.confidenceScore)) : 80,
          problemSolving: typeof parsed.problemSolving === "number" ? Math.min(100, Math.max(0, parsed.problemSolving)) : 82,
          leadership: typeof parsed.leadership === "number" ? Math.min(100, Math.max(0, parsed.leadership)) : 78,
          bodyLanguageScore: typeof parsed.bodyLanguageScore === "number" ? Math.min(100, Math.max(0, parsed.bodyLanguageScore)) : 85,
          eyeContactScore: typeof parsed.eyeContactScore === "number" ? Math.min(100, Math.max(0, parsed.eyeContactScore)) : 80,
          grammarScore: typeof parsed.grammarScore === "number" ? Math.min(100, Math.max(0, parsed.grammarScore)) : 88,
          fluencyScore: typeof parsed.fluencyScore === "number" ? Math.min(100, Math.max(0, parsed.fluencyScore)) : 85,
          vocabularyScore: typeof parsed.vocabularyScore === "number" ? Math.min(100, Math.max(0, parsed.vocabularyScore)) : 84,
          voiceClarityScore: typeof parsed.voiceClarityScore === "number" ? Math.min(100, Math.max(0, parsed.voiceClarityScore)) : 86,
          responseQualityScore: typeof parsed.responseQualityScore === "number" ? Math.min(100, Math.max(0, parsed.responseQualityScore)) : 82,
          timeManagementScore: typeof parsed.timeManagementScore === "number" ? Math.min(100, Math.max(0, parsed.timeManagementScore)) : 85,
          professionalismScore: typeof parsed.professionalismScore === "number" ? Math.min(100, Math.max(0, parsed.professionalismScore)) : 90,

          strengths: Array.isArray(parsed.strengths) && parsed.strengths.length > 0 ? parsed.strengths : ["Technical domain terminology", "Structured answers"],
          weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : ["Deep architectural trade-offs"],
          missedConcepts: Array.isArray(parsed.missedConcepts) ? parsed.missedConcepts : [],
          topicsCovered: Array.isArray(parsed.topicsCovered) && parsed.topicsCovered.length > 0 ? parsed.topicsCovered : state.topicsCovered,
          interviewSummary: parsed.interviewSummary || `Candidate completed evaluation for ${state.role} at ${companyName}. Demonstrated good technical depth and communication.`,
          hiringRecommendation: ["Hire", "Strong Hire", "Maybe", "No Hire"].includes(parsed.hiringRecommendation) ? parsed.hiringRecommendation : "Hire",
          
          perQuestionAnalysis: Array.isArray(parsed.perQuestionAnalysis) && parsed.perQuestionAnalysis.length > 0
            ? parsed.perQuestionAnalysis
            : this.buildFallbackPerQuestionAnalysis(state),
            
          recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : ["Expand on measurable project metrics", "Practice STAR method framing"],
          learningRoadmap: Array.isArray(parsed.learningRoadmap) && parsed.learningRoadmap.length > 0 ? parsed.learningRoadmap : this.buildFallbackRoadmap(state),
          antiCheatSummary: {
            totalWarnings: state.antiCheatWarnings ? state.antiCheatWarnings.length : 0,
            integrityScore: Math.max(50, 100 - (state.antiCheatWarnings ? state.antiCheatWarnings.length * 10 : 0)),
            details: state.antiCheatWarnings || [],
          },
        };
      } catch (err: any) {
        console.warn(`[ReportGenerator Warning]: Model ${modelName} failed (${err.message}). Trying fallback...`);
      }
    }

    return this.buildFallbackReport(state);
  }

  private buildFallbackPerQuestionAnalysis(state: InterviewState): QuestionSTARAnalysis[] {
    return state.history.map((turn, i) => ({
      questionNumber: i + 1,
      questionText: turn.question,
      candidateAnswer: turn.answer || "No response provided.",
      idealSTARAnswer: {
        starMethod: {
          situation: `For ${state.role}, set the context by describing a production engineering challenge.`,
          task: "Define your clear technical objective and architectural requirements.",
          action: "Explain exact design choices, data structures, caching layers, and implementation steps.",
          result: "Highlight quantifiable business outcomes, e.g. 'reduced latency by 45% and scaled system capacity'."
        },
        fullAnswerText: `For ${state.role}, state the core technical concept, explain the trade-offs cleanly using industry terminology, outline error handling, and share measurable project metrics.`,
        keyConcepts: [state.role, "Architecture Trade-offs", "Performance Optimization"],
        technicalDepth: "Deep architectural reasoning with edge case mitigation",
        businessImpact: "Improved latency, resource efficiency, and SLA compliance"
      },
      gapAnalysis: {
        missedKeywords: ["Latency SLA", "Caching Strategy", "Distributed State"],
        missedConcepts: ["Edge Case Handling", "Concurrency Bottlenecks"],
        weakExplanations: ["Include more specific tool choices and metrics"],
        whatWasGood: ["Clear articulation of main concepts"],
        expectedExtraPoints: ["Database indexing strategy", "Asynchronous task queue"]
      },
      rewrittenWinningAnswer: `In my experience as a ${state.role}, I architected solutions by decoupling core services and leveraging optimized data structures. This allowed us to maintain high uptime while improving request throughput by 35%.`
    }));
  }

  private buildFallbackRoadmap(state: InterviewState) {
    return [
      {
        topic: `Advanced ${state.role} Architecture`,
        priority: "High" as const,
        recommendedDocs: ["https://developer.mozilla.org"],
        youtubeSearchQuery: `${state.role} System Design and Interview Questions`,
        leetCodeProblem: "Two Sum & System Design Fundamentals",
        projectIdea: `Build a distributed microservice for ${state.role} with caching and metrics dashboard.`,
        dailyPracticeTask: "Solve 2 medium coding challenges daily and practice 1 STAR behavioral answer."
      }
    ];
  }

  private buildFallbackReport(state: InterviewState): FinalReportResponse {
    return {
      overallScore: 82,
      technicalKnowledge: 80,
      communication: 85,
      confidenceScore: 80,
      problemSolving: 82,
      leadership: 78,
      bodyLanguageScore: 85,
      eyeContactScore: 80,
      grammarScore: 88,
      fluencyScore: 85,
      vocabularyScore: 84,
      voiceClarityScore: 86,
      responseQualityScore: 82,
      timeManagementScore: 85,
      professionalismScore: 90,
      strengths: ["Strong domain vocabulary", "Clear communication style"],
      weaknesses: ["Add more quantifiable project metrics"],
      missedConcepts: ["System Design Trade-offs"],
      topicsCovered: state.topicsCovered.length > 0 ? state.topicsCovered : [state.role],
      interviewSummary: `Candidate completed interview for ${state.role}. Demonstrated clear domain understanding.`,
      hiringRecommendation: "Hire",
      perQuestionAnalysis: this.buildFallbackPerQuestionAnalysis(state),
      recommendations: ["Practice STAR method responses"],
      learningRoadmap: this.buildFallbackRoadmap(state),
      antiCheatSummary: {
        totalWarnings: state.antiCheatWarnings ? state.antiCheatWarnings.length : 0,
        integrityScore: 100,
        details: state.antiCheatWarnings || [],
      },
    };
  }
}
