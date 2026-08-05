import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = (process.env.GEMINI_API_KEY || "").trim().replace(/^["']|["']$/g, "");
const isValidFormat = apiKey.startsWith("AIza");
const genAI = apiKey && isValidFormat ? new GoogleGenerativeAI(apiKey) : null;

if (!isValidFormat && apiKey) {
  console.log(`[Gemini API Notice]: Current GEMINI_API_KEY '${apiKey.substring(0, 8)}...' does not start with 'AIza'. Standard Google AI Studio keys start with 'AIzaSy...'. Obtain a free valid key at https://aistudio.google.com/app/apikey`);
}

/**
 * Generate technical interview evaluation using Google Gemini API
 */
export const evaluateInterviewWithGemini = async (
  roleTitle: string,
  questions: string[],
  answers: string[]
): Promise<{
  score: number;
  keywordMatchRate: number;
  feedback: string;
  grammarFeedback: string;
  idealAnswers: { question: string; idealAnswer: string }[];
}> => {
  if (!genAI) {
    console.log("Gemini API key missing. Using fallback rule-based evaluation.");
    const totalWords = answers.join(" ").split(/\s+/).filter(Boolean).length;
    const score = Math.min(95, Math.max(30, 40 + Math.min(30, totalWords * 0.5)));
    return {
      score: Math.round(score),
      keywordMatchRate: Math.round(score * 0.9),
      feedback: `Evaluated performance for ${roleTitle}.`,
      grammarFeedback: "Focus on speaking complete technical sentences with clear subject-verb agreement.",
      idealAnswers: questions.map((q) => ({
        question: q,
        idealAnswer: `For ${roleTitle}, explain the core concept, practical trade-offs, and a real-world example cleanly using technical terms.`
      }))
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const transcriptText = questions.map((q, i) => `[Question ${i + 1}]: ${q}\n[Candidate Spoken Answer ${i + 1}]: "${answers[i] || "No answer provided"}"`).join("\n\n");

    const prompt = `You are a Strict Senior Technical Recruiter and Communication Coach evaluating an actual candidate interview for the position of "${roleTitle}".

ACTUAL CANDIDATE INTERVIEW TRANSCRIPT:
${transcriptText}

STRICT EVALUATION INSTRUCTIONS:
1. "score": Assign a realistic technical score from 0 to 100:
   - If candidate's answers are WRONG, OFF-TOPIC, GIBBERISH, or SHORT (e.g., 'dffs', 'sdf'): Assign 0 to 35.
   - If candidate's answers are PARTIALLY CORRECT or WEAK: Assign 40 to 65.
   - If candidate's answers are ACCURATE and THOROUGH: Assign 75 to 98.
2. "keywordMatchRate": Percentage (0-100%) of expected technical domain terms present in candidate's spoken text.
3. "feedback": Provide a 2-3 sentence honest technical evaluation explaining why the score was awarded and what concepts were correct/incorrect.
4. "grammarFeedback": 2-3 sentences analyzing the candidate's spoken grammar, sentence structure, filler words, or note if non-words/gibberish were detected.
5. "idealAnswers": An array of objects for each question in the transcript containing:
   - "question": string
   - "idealAnswer": A concise (2-3 sentence) high-scoring model answer that a student SHOULD give for this type of question.

Return a JSON object strictly in this format without markdown code blocks:
{
  "score": <number between 0 and 100>,
  "keywordMatchRate": <number between 0 and 100>,
  "feedback": "<detailed technical feedback>",
  "grammarFeedback": "<grammar and sentence structure feedback>",
  "idealAnswers": [
    {
      "question": "<question text>",
      "idealAnswer": "<concise high-scoring student model answer>"
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim().replace(/```json|```/g, "");
    const parsed = JSON.parse(responseText);

    const calculatedScore = typeof parsed.score === "number" ? Math.min(100, Math.max(0, parsed.score)) : 30;
    const calculatedKeywords = typeof parsed.keywordMatchRate === "number" ? Math.min(100, Math.max(0, parsed.keywordMatchRate)) : 25;

    return {
      score: calculatedScore,
      keywordMatchRate: calculatedKeywords,
      feedback: parsed.feedback || `Interview evaluation complete for ${roleTitle}.`,
      grammarFeedback: parsed.grammarFeedback || "Ensure you speak in complete sentences with clear pronunciation and technical vocabulary.",
      idealAnswers: Array.isArray(parsed.idealAnswers) && parsed.idealAnswers.length > 0
        ? parsed.idealAnswers
        : questions.map((q) => ({
            question: q,
            idealAnswer: `For ${roleTitle}, explain the core concept, practical trade-offs, and a real-world example cleanly.`
          }))
    };
  } catch (error) {
    console.error("Gemini API evaluation failed:", error);
    const allText = answers.join(" ").toLowerCase();
    const words = allText.split(/\s+/).filter(Boolean);
    const hasTechWords = /\b(react|node|api|sql|dom|state|function|database|hook|index|class|object|var|const|let)\b/i.test(allText);
    
    let rawScore = 25;
    if (words.length > 15 && hasTechWords) rawScore = 65;
    if (words.length > 40 && hasTechWords) rawScore = 82;

    return {
      score: rawScore,
      keywordMatchRate: hasTechWords ? 60 : 20,
      feedback: hasTechWords 
        ? `Evaluated response for ${roleTitle}. Technical terms detected in transcript.`
        : `Evaluated response for ${roleTitle}. Answers lacked required technical depth or accuracy.`,
      grammarFeedback: words.length < 5 ? "Spoken audio contained extremely short or non-standard characters ('dffs', 'sdf'). Practice speaking in complete technical sentences." : "Maintain clear subject-verb structure and avoid pause words.",
      idealAnswers: questions.map((q) => ({
        question: q,
        idealAnswer: `For ${roleTitle}, state the definition clearly, mention key tools/APIs involved, and explain how you implement it in projects.`
      }))
    };
  }
};

/**
 * Generate resume ATS Analysis using Google Gemini API
 */
export const analyzeResumeWithGemini = async (
  resumeText: string
): Promise<{ score: number; summary: string; missingSkills: string[] }> => {
  if (!genAI) {
    return {
      score: 85,
      summary: "Resume contains strong technical skills and project metrics.",
      missingSkills: ["System Design", "Docker", "CI/CD"],
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Analyze this candidate resume for ATS compatibility and technical strength:

${resumeText.substring(0, 3000)}

Return a JSON object strictly in this format without markdown code blocks:
{
  "score": <number between 60 and 98>,
  "summary": "<2-sentence executive summary>",
  "missingSkills": ["<skill1>", "<skill2>", "<skill3>"]
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim().replace(/```json|```/g, "");
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Gemini ATS Analysis error:", error);
    return {
      score: 84,
      summary: "Resume structure is clear with good technical depth.",
      missingSkills: ["Kubernetes", "GraphQL"],
    };
  }
};

const buildResumeFallbackQuestion = (resumeText: string, questionIndex: number): string => {
  const clean = resumeText.toLowerCase();
  
  const techMap: Record<string, string> = {
    react: "React",
    node: "Node.js",
    express: "Express.js",
    python: "Python",
    java: "Java",
    sql: "SQL Database",
    postgres: "PostgreSQL",
    mongo: "MongoDB",
    docker: "Docker",
    aws: "AWS Cloud",
    typescript: "TypeScript",
    tailwind: "Tailwind CSS",
    redux: "Redux",
    pytorch: "PyTorch",
    pandas: "Pandas",
    graphql: "GraphQL",
    rest: "REST API",
  };

  const foundTools: string[] = [];
  for (const [key, label] of Object.entries(techMap)) {
    if (clean.includes(key)) {
      foundTools.push(label);
    }
  }

  const projectMatches = resumeText.match(/\b([A-Z][a-zA-Z0-9_-]{3,})\b/g) || [];
  const candidateProjects = Array.from(new Set(projectMatches)).filter(
    p => !["Resume", "Education", "Experience", "Skills", "Projects", "University", "College", "Degree", "Contact", "Phone", "Email", "Engineer", "Developer"].includes(p)
  );

  const sampleProject = candidateProjects[questionIndex % Math.max(1, candidateProjects.length)] || "your main resume project";
  const sampleTech = foundTools[questionIndex % Math.max(1, foundTools.length)] || "your core technical stack";

  const resumeFallbackPool = [
    `I reviewed your resume and noticed your project "${sampleProject}". Could you explain the technical architecture and how you implemented ${sampleTech}?`,
    `On your resume, you listed experience with ${sampleTech}. What was the most challenging bug or performance bottleneck you solved when using ${sampleTech}?`,
    `Can you walk me through how you designed data structures, state management, or API endpoints for "${sampleProject}" listed on your resume?`,
    `In your resume project "${sampleProject}", how did you handle automated testing, error handling, and deployment for ${sampleTech}?`
  ];

  return resumeFallbackPool[questionIndex % resumeFallbackPool.length];
};

/**
 * Live Google Gemini AI Interactive Question Generator (Domain-Specific & Student-Tailored)
 */
export const generateGeminiNextQuestion = async (
  roleTitle: string,
  questionIndex: number,
  previousQuestions: string[],
  previousAnswers: string[],
  resumeText?: string
): Promise<string> => {
  const roleLower = roleTitle.toLowerCase();
  
  const frontendTopics = ["React hooks vs Lifecycle", "CSS Grid & Flexbox layout challenges", "Component state vs props", "Async API fetching with try/catch", "Virtual DOM and rendering optimization", "Handling form validation in React", "Browser DOM event delegation"];
  const backendTopics = ["Node.js Event Loop & non-blocking I/O", "SQL database joins & indexing", "Designing clean REST API endpoints", "Handling async errors & middleware", "JWT vs Cookie authentication", "Caching strategies with Redis", "Database transaction locks"];
  const aiTopics = ["LLM prompting vs fine-tuning", "Retrieval-Augmented Generation (RAG)", "Vector databases and embeddings", "PyTorch tensor operations", "Preventing LLM hallucinations", "Tokenization and context windows"];
  const dataTopics = ["Pandas data cleaning & missing values", "Overfitting vs Underfitting", "Random Forest vs Decision Trees", "Precision, Recall, and F1 Score", "SQL GROUP BY and aggregate functions"];
  const hrTopics = ["STAR method project challenge", "Handling tight project deadlines", "Receiving critical code review feedback", "Resolving team priority conflicts"];

  let topics = frontendTopics;
  if (roleLower.includes("backend")) topics = backendTopics;
  else if (roleLower.includes("ai") || roleLower.includes("machine")) topics = aiTopics;
  else if (roleLower.includes("data")) topics = dataTopics;
  else if (roleLower.includes("hr") || roleLower.includes("behavioral")) topics = hrTopics;

  const randomTopic = topics[Math.floor(Math.random() * topics.length)];
  const randomSeed = Math.floor(Math.random() * 9000) + 1000;

  const defaultFallback = resumeText && resumeText.trim().length > 10
    ? buildResumeFallbackQuestion(resumeText, questionIndex)
    : `Welcome! Could you explain your understanding of ${randomTopic} and how you would use it in a ${roleTitle} project?`;

  if (!genAI) {
    return defaultFallback;
  }

  try {
    const candidateModels = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
    let result = null;

    const prevQList = previousQuestions.filter(Boolean).join(" | ");
    let prompt = "";

    if (resumeText && resumeText.trim().length > 10) {
      prompt = `You are a Senior Technical Recruiter conducting a 1-on-1 resume-based technical interview. [Session ID: ${randomSeed}]

CANDIDATE RESUME CONTENT:
"""
${resumeText.substring(0, 3000)}
"""

STRICT RESUME QUESTION RULES:
1. Read the candidate's resume above carefully.
2. Question #${questionIndex + 1} MUST directly quote or reference a SPECIFIC project, skill, tool, framework, or experience explicitly listed in the resume above.
3. Example format: "On your resume, you listed [Project Name / Technology]. Could you explain how you designed [Feature] or solved [Technical Challenge] in that project?"
4. DO NOT REPEAT any of these previously asked questions: [ ${prevQList} ].
5. Keep the question to 1-2 sharp, clear sentences so it sounds natural when spoken out loud.`;
    } else if (previousAnswers.length > 0 && previousAnswers[previousAnswers.length - 1].trim().length > 0) {
      const lastQ = previousQuestions[previousQuestions.length - 1] || "";
      const lastA = previousAnswers[previousAnswers.length - 1];
      prompt = `You are a supportive, realistic Technical Recruiter interviewing a student/beginner for a junior "${roleTitle}" role. [Session ID: ${randomSeed}]

Candidate's Answer to Previous Question:
Q: "${lastQ}"
A: "${lastA}"

CRITICAL DIVERSITY INSTRUCTIONS:
1. Briefly acknowledge what the candidate said in 1 encouraging sentence.
2. Ask a BRAND NEW, sharp, practical entry-level Question #${questionIndex + 1} for ${roleTitle} focusing on topic: "${randomTopic}".
3. DO NOT REPEAT OR REPHRASE any of these previously asked questions: [ ${prevQList} ].
4. Keep the response under 3 sentences so it is easy to understand when spoken out loud.`;
    } else {
      prompt = `You are a supportive, realistic Technical Recruiter interviewing a student/beginner for a junior "${roleTitle}" role. [Session ID: ${randomSeed}]

Generate a BRAND NEW, unique entry-level Question #${questionIndex + 1} for ${roleTitle} focusing on topic: "${randomTopic}".
DO NOT REPEAT any of these previously asked questions: [ ${prevQList} ].
Ask 1-2 clear, realistic scenario sentences without intro or outro fluff.`;
    }

    for (const mName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({ model: mName });
        result = await model.generateContent(prompt);
        if (result) break;
      } catch (mErr) {
        continue;
      }
    }

    if (result) {
      const text = result.response.text().trim().replace(/^["']|["']$/g, "");
      return text || defaultFallback;
    }
    return defaultFallback;
  } catch (error) {
    console.error("Gemini Question Generator error:", error);
    return defaultFallback;
  }
};
