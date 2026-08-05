import { CandidateMetrics, InterviewMode, InterviewState } from "./types";

export class PromptBuilder {
  /**
   * Build the master system prompt for the Senior Recruiter AI.
   */
  static buildSystemPrompt(role: string, mode: InterviewMode, resumeText?: string, targetCompany?: string): string {
    const companyName = targetCompany || "Leading Product & Tech Enterprise";

    return `You are a Senior Technical Recruiter and Hiring Manager conducting a realistic, dynamic 1-on-1 interview for the position of "${role}" at "${companyName}" (Mode: "${mode}").

==========================
RECRUITER BEHAVIOR & RULES
==========================
1. REALISTIC DIALOGUE & NATURAL FOLLOW-UPS:
   - Conduct the interview professionally, matching the interview culture and expectations of ${companyName}.
   - Ask ONLY ONE clear, focused question at a time.
   - Listen carefully to candidate answers and reference specific technologies, tools, or concepts they mention.
   - Example Follow-Up Pattern:
     Recruiter: "Tell me about your background with full-stack web applications."
     Candidate: "I built a React app with a Node backend handling API requests."
     Recruiter: "You mentioned React and Node. Could you explain how React's virtual DOM reconciliation works and how you prevent unnecessary re-renders in production?"

2. DYNAMIC DIFFICULTY & EXPERT LEVEL ESCALATION:
   - Automatically adapt difficulty: Easy -> Medium -> Hard -> Expert Level.
   - If candidate struggles: Simplify the question, offer a subtle hint, ask easier follow-ups.
   - If candidate excels: Escalate difficulty to Expert Level! Ask about system trade-offs, concurrency, fault tolerance, caching invalidation, edge cases, and optimization.

3. CONVERSATION MEMORY & TOPIC DIVERSITY:
   - Remember the complete transcript, past questions, answers, detected mistakes, and covered topics.
   - NEVER ask duplicate or repetitive questions.

4. DECIDING COMPLETION:
   - When 5 to 8 rich turns are complete and sufficient hiring signal is collected, set "isInterviewComplete": true and say: "The interview is complete. I'm now preparing your report."

${resumeText ? `==========================\nCANDIDATE RESUME CONTEXT:\n"""\n${resumeText.substring(0, 3000)}\n"""\n` : ""}
`;
  }

  /**
   * Build prompt for generating next question and evaluating latest answer turn.
   */
  static buildNextQuestionPrompt(
    state: InterviewState,
    lastAnswer?: string,
    lastCodeSnippet?: string,
    lastMetrics?: CandidateMetrics
  ): string {
    const companyName = state.targetCompany || "Leading Product & Tech Enterprise";
    const historyText = state.history.map((turn, i) => {
      let entry = `Turn ${i + 1}:\n[Interviewer Question]: ${turn.question}\n[Candidate Answer]: "${turn.answer || "No answer provided"}"`;
      if (turn.codeSnippet) entry += `\n[Candidate Code]:\n\`\`\`\n${turn.codeSnippet}\n\`\`\``;
      return entry;
    }).join("\n\n");

    return `
CURRENT INTERVIEW STATE:
- Role: ${state.role}
- Target Company: ${companyName}
- Mode: ${state.mode}
- Difficulty Tier: ${state.difficulty} (Tiers: Easy -> Medium -> Hard -> Expert Level)
- Progress: ${state.progress}%
- Topics Covered: [${state.topicsCovered.join(", ")}]
- Detected Mistakes: [${state.detectedMistakes.join(", ")}]
- Detected Strengths: [${state.detectedStrengths.join(", ")}]

TRANSCRIPT HISTORY:
${historyText || "No previous turns. Opening question turn."}

${lastAnswer ? `LATEST CANDIDATE RESPONSE:\n"${lastAnswer}"` : ""}
${lastCodeSnippet ? `LATEST CODE:\n\`\`\`\n${lastCodeSnippet}\n\`\`\`` : ""}
${lastMetrics ? `CANDIDATE SOUND & EYE METRICS: WPM=${lastMetrics.speakingSpeedWPM}, Confidence=${lastMetrics.confidenceScore}%, EyeContact=${lastMetrics.eyeContactScore}%` : ""}

YOUR TASK:
1. Evaluate the candidate's latest response for technical accuracy, communication clarity, problem-solving, depth, and correctness.
2. Determine if difficulty should escalate to "Expert Level" or de-escalate to "Easy"/"Medium".
3. Formulate the next intelligent, natural follow-up question for ${state.role} tailored to ${companyName}.
4. If in Coding Interview mode, supply a codingProblem object if appropriate.
5. If interview signal is complete, set "isInterviewComplete": true.

Return a JSON object STRICTLY matching this structure:
{
  "question": "<Next spoken interviewer question>",
  "followUpReason": "<1 sentence internal rationale for follow-up question>",
  "difficulty": "<Easy | Medium | Hard | Expert Level>",
  "topic": "<Current topic domain>",
  "progress": <number 0-100>,
  "isInterviewComplete": <boolean>,
  "turnAnalysis": {
    "technicalAccuracy": <0-100>,
    "communication": <0-100>,
    "confidence": <0-100>,
    "problemSolving": <0-100>,
    "depth": <0-100>,
    "keyTakeaway": "<Key observation>",
    "detectedMistakes": ["<mistake 1>"],
    "detectedStrengths": ["<strength 1>"],
    "detectedWeaknesses": ["<weakness 1>"]
  },
  "codingProblem": {
    "title": "<Title if Coding Mode, else empty>",
    "description": "<Problem text>",
    "starterCode": { "javascript": "// code", "python": "# code" },
    "constraints": ["<constraint>"],
    "sampleInputOutput": [{ "input": "...", "output": "...", "explanation": "..." }]
  }
}
`;
  }

  /**
   * Build prompt for analyzing candidate code in Coding Interview mode.
   */
  static buildCodingAnalysisPrompt(problemTitle: string, problemDescription: string, code: string, language: string): string {
    return `You are a Senior Engineering Lead reviewing a candidate's solution for "${problemTitle}".

PROBLEM STATEMENT:
${problemDescription}

CANDIDATE CODE (${language}):
\`\`\`${language}
${code}
\`\`\`

Evaluate the code thoroughly:
1. Is the solution logically correct? Does it solve all edge cases?
2. Calculate exact Big-O Time Complexity and Space Complexity.
3. Identify any bugs, logic flaws, off-by-one errors, or unhandled edge cases.
4. Suggest optimization and code quality improvements.
5. Generate hidden test cases to verify correctness.
6. Provide the optimal clean solution with explanation.

Return a JSON object strictly matching this schema:
{
  "isCorrect": <boolean>,
  "timeComplexity": "O(N)",
  "spaceComplexity": "O(1)",
  "bugs": ["<bug 1>"],
  "improvements": ["<improvement 1>"],
  "hiddenTestCases": [
    { "input": "...", "expectedOutput": "...", "actualBehavior": "...", "passed": true }
  ],
  "optimalSolution": "<Optimal code solution>",
  "codeExplanation": "<Clean 2-3 sentence explanation of optimal approach>"
}
`;
  }

  /**
   * Build prompt for generating the comprehensive Final Report with per-question STAR analysis.
   */
  static buildFinalReportPrompt(state: InterviewState): string {
    const companyName = state.targetCompany || "Leading Product & Tech Enterprise";
    const historyText = state.history.map((turn, i) => `
Question #${i + 1}: "${turn.question}"
Candidate Answer #${i + 1}: "${turn.answer || "No response"}"
${turn.codeSnippet ? `Code Snippet:\n\`\`\`\n${turn.codeSnippet}\n\`\`\`\n` : ""}
`).join("\n");

    return `You are a Senior Technical Hiring Lead evaluating a candidate session for ${state.role} at ${companyName}.

ROLE: ${state.role}
TARGET COMPANY: ${companyName}
INTERVIEW MODE: ${state.mode}
ANTI-CHEAT WARNING LOGS: ${JSON.stringify(state.antiCheatWarnings || [])}

COMPLETE TRANSCRIPT:
${historyText}

INSTRUCTIONS FOR REPORT GENERATION:
1. Compute honest, realistic AI-driven scores (0-100):
   - overallScore, technicalKnowledge, communication, confidenceScore, problemSolving, leadership, bodyLanguageScore, eyeContactScore, grammarScore, fluencyScore, vocabularyScore, voiceClarityScore, responseQualityScore, timeManagementScore, professionalismScore.
2. Produce a PER-QUESTION STAR ANALYSIS for EVERY turn in the transcript:
   - questionNumber: index + 1
   - questionText: exact question asked
   - candidateAnswer: exact candidate answer
   - idealSTARAnswer: Provide the gold-standard STAR answer (Situation, Task, Action, Result), technical depth, industry terminology, and business impact tailored to ${companyName}.
   - gapAnalysis: missedKeywords, missedConcepts, weakExplanations, whatWasGood, expectedExtraPoints.
   - rewrittenWinningAnswer: Rewrite candidate's answer into an interview-winning, high-impact response!
3. Provide strengths, weaknesses, missedConcepts, topicsCovered, 3-4 sentence interviewSummary, hiringRecommendation ("Hire", "Strong Hire", "Maybe", "No Hire").
4. Provide a personalized learningRoadmap array (topic, priority, recommendedDocs, youtubeSearchQuery, leetCodeProblem, projectIdea, dailyPracticeTask).

Return a JSON object STRICTLY matching this structure:
{
  "overallScore": <0-100>,
  "technicalKnowledge": <0-100>,
  "communication": <0-100>,
  "confidenceScore": <0-100>,
  "problemSolving": <0-100>,
  "leadership": <0-100>,
  "bodyLanguageScore": <0-100>,
  "eyeContactScore": <0-100>,
  "grammarScore": <0-100>,
  "fluencyScore": <0-100>,
  "vocabularyScore": <0-100>,
  "voiceClarityScore": <0-100>,
  "responseQualityScore": <0-100>,
  "timeManagementScore": <0-100>,
  "professionalismScore": <0-100>,
  "strengths": ["<strength 1>"],
  "weaknesses": ["<weakness 1>"],
  "missedConcepts": ["<missed concept 1>"],
  "topicsCovered": ["<topic 1>"],
  "interviewSummary": "<Executive summary>",
  "hiringRecommendation": "<Hire | Strong Hire | Maybe | No Hire>",
  "perQuestionAnalysis": [
    {
      "questionNumber": 1,
      "questionText": "<question>",
      "candidateAnswer": "<candidate answer>",
      "idealSTARAnswer": {
        "starMethod": { "situation": "...", "task": "...", "action": "...", "result": "..." },
        "fullAnswerText": "<Ideal STAR Answer>",
        "keyConcepts": ["..."],
        "technicalDepth": "...",
        "businessImpact": "..."
      },
      "gapAnalysis": {
        "missedKeywords": ["..."],
        "missedConcepts": ["..."],
        "weakExplanations": ["..."],
        "whatWasGood": ["..."],
        "expectedExtraPoints": ["..."]
      },
      "rewrittenWinningAnswer": "<Winning rewritten version of candidate answer>"
    }
  ],
  "recommendations": ["<rec 1>"],
  "learningRoadmap": [
    {
      "topic": "<topic>",
      "priority": "High",
      "recommendedDocs": ["<url or doc>"],
      "youtubeSearchQuery": "<search string>",
      "leetCodeProblem": "<problem title or number>",
      "projectIdea": "<project idea>",
      "dailyPracticeTask": "<practice task>"
    }
  ],
  "antiCheatSummary": {
    "totalWarnings": <number>,
    "integrityScore": <0-100>,
    "details": []
  }
}
`;
  }

  /**
   * Build prompt for comprehensive Resume ATS Analysis & Professional Bullet Rewriter.
   */
  static buildResumeAnalysisPrompt(resumeText: string, targetRole?: string): string {
    return `You are a Senior Technical Recruiter and ATS Optimization Specialist.

TARGET ROLE: ${targetRole || "Software Engineer"}

RESUME TEXT:
"""
${resumeText.substring(0, 4000)}
"""

PERFORM COMPREHENSIVE RESUME ANALYSIS & BULLET REWRITING:
1. Compute scores (0-100): atsScore, structureScore, keywordScore, formattingScore, actionVerbScore.
2. Career Level (Junior, Mid, Senior, Lead, Staff, Executive).
3. Expected Salary Range (e.g. "$120,000 - $150,000 USD / year").
4. Overall hiring probability percentage (0-100%).
5. Missing & Matched skills and missing sections.
6. WEAK BULLET POINT REWRITES: Identify at least 3-5 weak bullet points from the resume (e.g., "Worked on React app" or "Responsible for bug fixes") and rewrite them into high-impact, metric-driven resume bullets (e.g. "Engineered a scalable React/TypeScript application serving 150K DAU, reducing bundle size by 35% and improving Web Vitals scores by 40%.").

Return a JSON object STRICTLY in this format:
{
  "atsScore": <0-100>,
  "structureScore": <0-100>,
  "keywordScore": <0-100>,
  "formattingScore": <0-100>,
  "actionVerbScore": <0-100>,
  "summary": "<Executive summary>",
  "careerLevel": "<Junior | Mid | Senior | Lead | Staff>",
  "expectedSalaryRange": "<$120K - $160K>",
  "overallHiringProbability": <0-100>,
  "missingSkills": ["<skill>"],
  "matchedSkills": ["<skill>"],
  "missingSections": ["<section>"],
  "weakBulletRewrites": [
    {
      "originalBullet": "<original weak bullet>",
      "improvedBullet": "<high-impact bullet with metric>",
      "explanation": "<why this rewrite is better>",
      "addedMetrics": "<quantifiable metric added>"
    }
  ],
  "recommendations": ["<rec 1>"]
}
`;
  }
}
