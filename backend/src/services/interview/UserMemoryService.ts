import prisma from "../../config/prisma";
import { UserAIMemory } from "./types";

export class UserMemoryService {
  /**
   * Fetch aggregated AI Memory profile for a user
   */
  static async getUserMemory(userId: string): Promise<UserAIMemory> {
    const sessions = await prisma.interviewSession.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    const totalInterviews = sessions.length;
    let avgScore = 80;
    const historicalScores: Array<{ date: string; score: number; role: string }> = [];
    const strongTopicsSet = new Set<string>();
    const weakTopicsSet = new Set<string>();

    if (totalInterviews > 0) {
      const sum = sessions.reduce((acc, s) => acc + s.score, 0);
      avgScore = Math.round(sum / totalInterviews);

      for (const s of sessions) {
        historicalScores.push({
          date: s.createdAt.toISOString().split("T")[0],
          score: s.score,
          role: s.role,
        });

        try {
          const parsed = JSON.parse(s.answersJson);
          if (parsed?.topicsCovered && Array.isArray(parsed.topicsCovered)) {
            parsed.topicsCovered.forEach((t: string) => strongTopicsSet.add(t));
          }
          if (parsed?.report?.weaknesses && Array.isArray(parsed.report.weaknesses)) {
            parsed.report.weaknesses.forEach((w: string) => weakTopicsSet.add(w));
          }
        } catch {
          strongTopicsSet.add(s.role);
        }
      }
    }

    return {
      userId,
      targetRole: sessions[0]?.role || "Full Stack Engineer",
      targetCompany: "Leading Product & Tech Companies",
      totalInterviewsCompleted: totalInterviews,
      averageOverallScore: avgScore,
      interviewStreak: Math.min(totalInterviews, 5),
      strongTopics: Array.from(strongTopicsSet).slice(0, 10),
      weakTopics: Array.from(weakTopicsSet).slice(0, 10),
      historicalScores,
    };
  }
}
