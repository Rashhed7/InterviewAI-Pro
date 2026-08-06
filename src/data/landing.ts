export interface HeroFeature {
  id: "interview" | "resume" | "coding";
  title: string;
  badge: string;
  headline: string;
  description: string;
  folderPath: string;
  themeColor: string;
  metrics: { label: string; value: string }[];
  ctaText: string;
  ctaLink: string;
}

export const heroFeatures: HeroFeature[] = [
  {
    id: "interview",
    title: "AI Interviewer",
    badge: "Real-Time Voice AI",
    headline: "Master Technical & Behavioral Interviews",
    description: "Practice dynamic, role-specific questions with instant feedback on clarity, technical depth, and tone.",
    folderPath: "/images/sequence",
    themeColor: "#06B6D4",
    metrics: [
      { label: "Response Latency", value: "<200ms" },
      { label: "Score Accuracy", value: "98%" }
    ],
    ctaText: "Get Started",
    ctaLink: "/register"
  },
  {
    id: "resume",
    title: "Resume Analyzer",
    badge: "ATS Optimization",
    headline: "Turn Resumes into Interview Calls",
    description: "Scan your resume against live job descriptions to fix skill gaps and boost ATS match scores instantly.",
    folderPath: "/images/sequence",
    themeColor: "#10B981",
    metrics: [
      { label: "Match Speed", value: "Instant" },
      { label: "ATS Pass Rate", value: "99.4%" }
    ],
    ctaText: "Get Started",
    ctaLink: "/register"
  },
  {
    id: "coding",
    title: "Coding Challenges",
    badge: "Interactive IDE",
    headline: "Crush Algorithmic Coding Rounds",
    description: "Solve DSA problems in a built-in code editor with 24/7 AI-guided hints and complexity breakdown.",
    folderPath: "/images/sequence",
    themeColor: "#6366F1",
    metrics: [
      { label: "Languages", value: "15+" },
      { label: "Practice Problems", value: "500+" }
    ],
    ctaText: "Get Started",
    ctaLink: "/register"
  }
];

export const TOTAL_FRAMES = 240;

export function getFrameUrl(frameIndex: number, folderPath: string = "/images/sequence"): string {
  const index = Math.min(Math.max(frameIndex, 1), TOTAL_FRAMES);
  const paddedIndex = String(index).padStart(3, "0");
  return `${folderPath}/ezgif-frame-${paddedIndex}.jpg`;
}

export const whatYouGetCards = [
  {
    id: "adaptive-interviews",
    title: "Adaptive interviews",
    description: "Role-based question flow with natural follow-ups and focused evaluations.",
    icon: "Brain"
  },
  {
    id: "voice-practice",
    title: "Voice practice",
    description: "Speak answers out loud, track pacing, and build remote interview confidence.",
    icon: "Mic"
  },
  {
    id: "coding-workspace",
    title: "Coding workspace",
    description: "Practice algorithms with complexity notes and real-time edge-case reviews.",
    icon: "Code"
  },
  {
    id: "resume-review",
    title: "Resume review",
    description: "Improve role alignment, keyword coverage, and bullet impact before applying.",
    icon: "FileText"
  },
  {
    id: "session-integrity",
    title: "Session integrity",
    description: "Keep practice realistic with focus checks and structured post-session notes.",
    icon: "ShieldCheck"
  },
  {
    id: "progress-analytics",
    title: "Progress analytics",
    description: "Track trends across clarity, structure, and technical depth.",
    icon: "BarChart3"
  }
];

export const workflowSteps = [
  {
    stepNumber: "01",
    title: "Set the target",
    description: "Choose a role, seniority level, and topic to set expectations."
  },
  {
    stepNumber: "02",
    title: "Practice like it's live",
    description: "Answer via voice or text and handle real-time follow-ups."
  },
  {
    stepNumber: "03",
    title: "Review the next move",
    description: "Use detailed reports to rewrite answers and target weak spots."
  }
];

export const repeatPracticePoints = [
  {
    title: "Short sessions fit real schedules",
    description: "Run quick rounds and return without losing history."
  },
  {
    title: "Feedback becomes measurable",
    description: "Spot patterns in structure and technical confidence."
  },
  {
    title: "Practice data stays purposeful",
    description: "Pure signal without visual clutter."
  }
];

export const faqItems = [
  {
    question: "Can I use it for different roles?",
    answer: "Yes. Prepare for technical, HR, behavioral, system design, and coding rounds."
  },
  {
    question: "Does the feedback include answer rewrites?",
    answer: "Yes. Get actionable rewrites using the STAR method after each round."
  },
  {
    question: "Can I review my resume before interviews?",
    answer: "Yes. Upload your resume PDF to match skills against targeted job descriptions."
  },
  {
    question: "Is dark mode fully supported?",
    answer: "Yes. Native dark-first interface design."
  }
];
