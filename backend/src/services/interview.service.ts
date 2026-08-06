import prisma from "../config/prisma";

// Save completed AI Mock Interview Session
export const saveInterviewSession = async (
  userId: string,
  title: string,
  role: string,
  difficulty: string,
  score: number,
  feedback: string,
  answersJson: string
) => {
  return await prisma.interviewSession.create({
    data: {
      userId,
      title,
      role,
      difficulty,
      score,
      feedback,
      answersJson,
    },
  });
};

// Fetch User's Interview History
export const getInterviewHistory = async (userId: string) => {
  return await prisma.interviewSession.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

// Save Coding Submission
export const saveCodingSubmission = async (
  userId: string,
  problemId: string,
  title: string,
  language: string,
  code: string,
  status: string
) => {
  return await prisma.codingSubmission.create({
    data: {
      userId,
      problemId,
      title,
      language,
      code,
      status,
    },
  });
};

// Fetch Coding Submissions
export const getCodingSubmissions = async (userId: string) => {
  return await prisma.codingSubmission.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

// Global Leaderboard
export const getLeaderboard = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      avatar: true,
      interviews: {
        select: {
          score: true,
        },
      },
      submissions: {
        select: {
          id: true,
        },
      },
    },
  });

  const leaderboard = users.map((u) => {
    const totalInterviews = u.interviews.length;
    const avgScore = totalInterviews > 0
      ? Math.round(u.interviews.reduce((acc, curr) => acc + curr.score, 0) / totalInterviews)
      : 75;
    const problemsSolved = u.submissions.length;

    return {
      id: u.id,
      name: u.name,
      avatar: u.avatar,
      totalInterviews,
      avgScore,
      problemsSolved,
      xp: (totalInterviews * 150) + (problemsSolved * 100) + (avgScore * 10),
    };
  });

  return leaderboard.sort((a, b) => b.xp - a.xp);
};

// Resume ATS Analysis Engine
export const analyzeResumeText = (resumeText: string) => {
  const text = resumeText.toLowerCase();
  const keywords = ["javascript", "typescript", "react", "node.js", "express", "postgresql", "prisma", "api", "git", "docker", "agile", "testing", "cloud", "aws"];

  let matchedKeywords = keywords.filter((kw) => text.includes(kw));
  let missingKeywords = keywords.filter((kw) => !text.includes(kw));

  const wordCount = resumeText.trim().split(/\s+/).length;
  const keywordScore = Math.min(100, Math.round((matchedKeywords.length / keywords.length) * 100));
  const lengthScore = wordCount >= 200 ? 95 : Math.round((wordCount / 200) * 100);
  const overallAtsScore = Math.round((keywordScore * 0.6) + (lengthScore * 0.4));

  return {
    atsScore: overallAtsScore,
    wordCount,
    matchedKeywords,
    missingKeywords,
    summary: overallAtsScore >= 80
      ? "Excellent Resume! Highly optimized for ATS scanners with strong technical skill keywords."
      : overallAtsScore >= 60
      ? "Good Candidate Resume. Adding missing core skills will boost your ATS match rate significantly."
      : "Resume Needs Optimization. Include key industry skill terms and expand project details.",
    recommendations: [
      "Add quantifiable metric achievements (e.g. 'Increased speed by 35%').",
      "Include key missing skills: " + (missingKeywords.slice(0, 4).join(", ") || "None"),
      "Ensure standard section titles (Experience, Skills, Education, Projects).",
    ],
  };
};
