import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sparkles,
  Code2,
  Terminal,
  Server,
  Layout,
  Cpu,
  Layers,
  Cloud,
  Brain,
  BarChart3,
  ShieldCheck,
  Users,
  Award,
  Mic,
  MicOff,
  Volume2,
  FileText,
  Upload,
  Clock,
  Bot,
  Search,
  Building2,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { CameraStudio } from "../components/interview/CameraStudio";
import { AudioVisualizer } from "../components/interview/AudioVisualizer";
import { AntiCheatingMonitor } from "../components/interview/AntiCheatingMonitor";
import { InterviewReportView } from "../components/interview/InterviewReportView";
import { voiceManager } from "../utils/voiceSynthesis";
import { COMPANY_CATEGORIES } from "../utils/companyCategories";
import { subscriptionService } from "../services/subscriptionService";
import { UpgradeModal } from "../components/subscription/UpgradeModal";
import {
  interviewService,
  type InterviewMode,
  type NextQuestionResponse,
  type CodingAnalysisResponse,
  type FinalReportResponse,
  type InterviewState,
  type AntiCheatWarning,
  type CandidateMetrics,
} from "../services/interviewService";

const INTERVIEW_MODES: Array<{ id: InterviewMode; name: string; icon: any; description: string }> = [
  { id: "Technical Interview", name: "Technical Interview", icon: Code2, description: "Comprehensive technical fundamentals, trade-offs, and practical engineering concepts." },
  { id: "Coding Interview", name: "Coding Interview", icon: Terminal, description: "Algorithm challenges, real-time code analysis, complexity evaluation, and edge cases." },
  { id: "System Design Interview", name: "System Design", icon: Server, description: "High-scale architecture, distributed systems, caching, partitioning, and fault tolerance." },
  { id: "Frontend", name: "Frontend Engineer", icon: Layout, description: "React, DOM manipulation, state management, Web Vitals, CSS, and rendering performance." },
  { id: "Backend", name: "Backend Engineer", icon: Cpu, description: "Node.js event loop, REST/GraphQL APIs, SQL indexing, concurrency, and DB design." },
  { id: "Full Stack", name: "Full Stack Engineer", icon: Layers, description: "End-to-end web architecture, frontend UI, server APIs, and database design." },
  { id: "Cloud", name: "Cloud Architect", icon: Cloud, description: "AWS/GCP/Azure architecture, serverless, security, and cloud infrastructure scale." },
  { id: "Machine Learning Interview", name: "Machine Learning", icon: Brain, description: "Model architectures, training, fine-tuning, loss functions, PyTorch, and optimization." },
  { id: "Data Science Interview", name: "Data Science", icon: BarChart3, description: "Statistical modeling, Pandas, data cleaning, feature engineering, and hypothesis testing." },
  { id: "Cyber Security", name: "Cyber Security", icon: ShieldCheck, description: "Penetration testing, network security, authentication protocols, and threat mitigation." },
  { id: "HR Interview", name: "HR Interview", icon: Users, description: "Culture fit, communication skills, career aspirations, and salary expectations." },
  { id: "Behavioral Interview", name: "Behavioral Interview", icon: Award, description: "STAR method scenarios, leadership, conflict resolution, and teamwork." },
  { id: "Custom Role", name: "Custom Role / Title", icon: Sparkles, description: "Define your own target job title or industry domain for a fully custom AI interview." },
];

function AIInterview() {
  const navigate = useNavigate();
  const location = useLocation();

  // Configuration States
  const [selectedMode, setSelectedMode] = useState<InterviewMode>("Technical Interview");
  const [targetRole, setTargetRole] = useState("Full Stack Engineer");
  const [customRoleInput, setCustomRoleInput] = useState("");
  const [targetCompany, setTargetCompany] = useState("Stripe");
  const [yearsExperience, setYearsExperience] = useState<number>(3);
  const [resumeText, setResumeText] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [voiceGender, setVoiceGender] = useState<"female" | "male">("female");

  // Active Session States
  const [step, setStep] = useState<"select" | "interview" | "result">("select");
  const [sessionId, setSessionId] = useState("");
  const [interviewState, setInterviewState] = useState<InterviewState | null>(null);
  const [currentTurn, setCurrentTurn] = useState<NextQuestionResponse | null>(null);

  // Status & Streaming Text
  const [aiStatus, setAiStatus] = useState<"" | "Thinking..." | "Analyzing..." | "Preparing next question...">("");
  const [loading, setLoading] = useState(false);

  // Input & Coding States
  const [candidateAnswer, setCandidateAnswer] = useState("");
  const [candidateCode, setCandidateCode] = useState("");
  const [codeLanguage, setCodeLanguage] = useState("javascript");
  const [codingAnalysis, setCodingAnalysis] = useState<CodingAnalysisResponse | null>(null);
  const [analyzingCode, setAnalyzingCode] = useState(false);

  // Proctoring & Sound States
  const [antiCheatWarnings, setAntiCheatWarnings] = useState<AntiCheatWarning[]>([]);
  const [micEnabled, setMicEnabled] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [candidateMetrics, setCandidateMetrics] = useState<CandidateMetrics | null>(null);
  const [aiSpeechState, setAiSpeechState] = useState<"idle" | "speaking" | "listening">("idle");
  const [sessionTimer, setSessionTimer] = useState(0);

  // Final Report
  const [finalReport, setFinalReport] = useState<FinalReportResponse | null>(null);
  const [savingReport, setSavingReport] = useState(false);

  const recognitionRef = useRef<any>(null);
  const isRecordingRef = useRef(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [interviewState?.history, currentTurn]);

  useEffect(() => {
    let interval: any = null;
    if (step === "interview") {
      interval = setInterval(() => setSessionTimer((prev) => prev + 1), 1000);
    } else {
      setSessionTimer(0);
    }
    return () => clearInterval(interval);
  }, [step]);

  useEffect(() => {
    if (location.state?.customRoleTitle) setTargetRole(location.state.customRoleTitle);
  }, [location.state]);

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (text) {
        setResumeText(text.replace(/[^\x20-\x7E\n\r]/g, " ").replace(/\s+/g, " "));
      }
    };
    reader.readAsText(file);
  };

  const speakQuestion = (text: string) => {
    voiceManager.setGender(voiceGender);
    voiceManager.speak(
      text,
      () => setAiSpeechState("speaking"),
      () => {
        setAiSpeechState("idle");
        if (micEnabled) startSpeechRecognition();
      }
    );
  };

  const startSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    try {
      if (recognitionRef.current) recognitionRef.current.abort();
    } catch {}

    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = "en-US";

      rec.onresult = (event: any) => {
        let finalStr = "";
        let interimStr = "";
        for (let i = 0; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) finalStr += transcript + " ";
          else interimStr += transcript;
        }
        const combined = (finalStr + interimStr).trim();
        if (combined) setCandidateAnswer(combined);
      };

      rec.onend = () => {
        if (isRecordingRef.current) {
          try { rec.start(); } catch {}
        } else {
          setIsRecording(false);
          setAiSpeechState("idle");
        }
      };

      try {
        rec.start();
        recognitionRef.current = rec;
      } catch {}
    }
    isRecordingRef.current = true;
    setIsRecording(true);
    setAiSpeechState("listening");
  };

  const stopSpeechRecognition = () => {
    isRecordingRef.current = false;
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    setIsRecording(false);
    setAiSpeechState("idle");
  };

  const toggleMic = () => {
    const nextState = !micEnabled;
    setMicEnabled(nextState);
    if (!nextState) stopSpeechRecognition();
    else startSpeechRecognition();
  };

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleStartInterview = async () => {
    // Check Subscription Limit
    const check = subscriptionService.checkUsageLimit("interviews");
    if (!check.allowed) {
      setShowUpgradeModal(true);
      return;
    }

    const effectiveRole = selectedMode === "Custom Role" ? customRoleInput || "Software Engineer" : targetRole;
    setLoading(true);
    setAiStatus("Thinking...");

    try {
      subscriptionService.incrementUsage("interviews");
      const res = await interviewService.startInterview({
        role: effectiveRole,
        mode: selectedMode,
        customRoleTitle: selectedMode === "Custom Role" ? customRoleInput : undefined,
        resumeText: resumeText.trim() ? resumeText : undefined,
        targetCompany,
        yearsExperience,
      });

      if (res?.success) {
        setSessionId(res.sessionId);
        setCurrentTurn(res.nextTurn);
        setInterviewState(res.state);
        setStep("interview");

        if (res.nextTurn.codingProblem?.starterCode) {
          const starter = res.nextTurn.codingProblem.starterCode[codeLanguage] || res.nextTurn.codingProblem.starterCode["javascript"] || "";
          setCandidateCode(starter);
        }

        speakQuestion(res.nextTurn.question);
      }
    } catch (err: any) {
      alert("Failed to start AI interview: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
      setAiStatus("");
    }
  };

  const handleNextTurn = async () => {
    if (!sessionId && !interviewState) return;
    if (loading) return;

    setLoading(true);
    setAiStatus("Analyzing...");
    setTimeout(() => setAiStatus("Preparing next question..."), 1200);

    const textAnswer = candidateAnswer.trim();
    setCandidateAnswer("");

    try {
      const res = await interviewService.nextQuestion({
        sessionId,
        answer: textAnswer || "Candidate provided answer.",
        codeSnippet: candidateCode.trim() ? candidateCode : undefined,
        metrics: candidateMetrics || undefined,
        antiCheatWarnings: antiCheatWarnings.length > 0 ? antiCheatWarnings : undefined,
        existingState: interviewState || undefined,
      });

      if (res?.success) {
        setCurrentTurn(res.nextTurn);
        setInterviewState(res.state);

        if (res.nextTurn.isInterviewComplete) {
          handleFinishInterview(res.state);
        } else {
          speakQuestion(res.nextTurn.question);
        }
      }
    } catch (err: any) {
      console.error("Error advancing interview turn:", err);
    } finally {
      setLoading(false);
      setAiStatus("");
    }
  };

  const handleAnalyzeCode = async () => {
    if (!candidateCode.trim()) {
      alert("Please write your solution in the code editor before submitting for AI analysis.");
      return;
    }

    setAnalyzingCode(true);
    try {
      const problemTitle = currentTurn?.codingProblem?.title || `${selectedMode} Challenge`;
      const problemDesc = currentTurn?.codingProblem?.description || currentTurn?.question || "";

      const res = await interviewService.analyzeCoding({
        sessionId,
        problemTitle,
        problemDescription: problemDesc,
        code: candidateCode,
        language: codeLanguage,
      });

      if (res?.success) setCodingAnalysis(res.analysis);
    } catch (err: any) {
      alert("Code analysis error: " + err.message);
    } finally {
      setAnalyzingCode(false);
    }
  };

  const handleFinishInterview = async (latestState?: InterviewState) => {
    stopSpeechRecognition();
    voiceManager.stop();

    setSavingReport(true);
    setAiStatus("Analyzing...");

    const targetState = latestState || interviewState;

    try {
      const reportRes = await interviewService.generateReport({
        sessionId,
        state: targetState!,
      });

      if (reportRes?.success) {
        setFinalReport(reportRes.report);
        await interviewService.saveSession({
          sessionId,
          report: reportRes.report,
          state: reportRes.state || targetState!,
        });
      }
    } catch (err) {
      console.error("Report generation error:", err);
    } finally {
      setSavingReport(false);
      setAiStatus("");
      setStep("result");
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0b0f19] dark:text-slate-100 warm:bg-[#f5f0e6] warm:text-[#2c251e] flex font-sans transition-colors duration-300 eye-comfort-glow">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

      <main className="max-w-6xl w-full mx-auto p-4 lg:p-6 flex-1 my-2 space-y-6">
        {step === "select" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:bg-indigo-500/20 dark:border-indigo-500/30 dark:text-indigo-400 warm:bg-amber-600/20 warm:border-amber-600/30 warm:text-amber-800 rounded-full text-xs font-bold mb-3">
                <Sparkles className="w-3.5 h-3.5" /> Production-Grade AI Recruiter
              </div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 warm:text-[#2c251e] tracking-tight">
                AI Interview Studio Pro
              </h1>
              <p className="text-slate-600 dark:text-slate-300 warm:text-[#736758] text-xs leading-relaxed mt-1">
                Natural recruiter dialogue, dynamic follow-ups, adaptive difficulty escalation, live proctoring anti-cheating, code complexity analysis, and per-question STAR answer rewrites.
              </p>
            </div>

            {/* INTERVIEW MODES GRID */}
            <div className="space-y-3">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400 warm:text-[#736758]">
                1. Select Interview Type / Mode:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {INTERVIEW_MODES.map((mode) => {
                  const Icon = mode.icon;
                  const isSel = selectedMode === mode.id;
                  return (
                    <div
                      key={mode.id}
                      onClick={() => {
                        setSelectedMode(mode.id);
                        if (mode.id !== "Custom Role") setTargetRole(mode.name);
                      }}
                      className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                        isSel
                          ? "bg-amber-500/20 border-amber-500 shadow-xl dark:bg-indigo-600/20 dark:border-indigo-500 warm:bg-amber-600/20 warm:border-amber-600"
                          : "glass-card hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Icon className="w-5 h-5 text-amber-600 dark:text-indigo-400 warm:text-amber-700" />
                          {isSel && <span className="w-2.5 h-2.5 rounded-full bg-amber-600 dark:bg-indigo-400 warm:bg-amber-700" />}
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 warm:text-[#2c251e] mb-1">{mode.name}</h3>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 warm:text-[#736758] leading-relaxed">{mode.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* DYNAMIC COMPANY CATEGORY SELECTION */}
            <div className="glass-card p-6 rounded-3xl space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-100 warm:text-[#2c251e] flex items-center gap-2 mb-1">
                  <Building2 className="w-4 h-4 text-amber-600 dark:text-indigo-400 warm:text-amber-700" /> 2. Select Target Company & Industry Sector:
                </label>
                <p className="text-xs text-slate-600 dark:text-slate-300 warm:text-[#736758]">
                  Select your target enterprise or enter a custom startup to adapt question styles, system design depth, and evaluation rubrics.
                </p>
              </div>

              <div className="space-y-3">
                <select
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200/80 bg-white text-slate-900 text-xs font-bold outline-none focus:border-amber-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 warm:border-[#e2d9c8] warm:bg-[#fffdf9] warm:text-[#2c251e]"
                >
                  {COMPANY_CATEGORIES.map((cat, idx) => (
                    <optgroup key={idx} label={`-- ${cat.category} --`}>
                      {cat.companies.map((c, i) => (
                        <option key={i} value={c}>
                          {c}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>

                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 warm:text-[#736758]">
                  <span>Or enter custom target company:</span>
                  <input
                    type="text"
                    placeholder="e.g. Acme Corp, OpenAI, Anthropic..."
                    value={targetCompany}
                    onChange={(e) => setTargetCompany(e.target.value)}
                    className="flex-1 p-2.5 border border-slate-200/80 bg-white text-slate-900 rounded-xl text-xs font-medium outline-none focus:border-amber-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 warm:border-[#e2d9c8] warm:bg-[#fffdf9] warm:text-[#2c251e]"
                  />
                </div>
              </div>
            </div>

            {/* YEARS EXPERIENCE & VOICE SELECTION */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="glass-card p-4 rounded-2xl space-y-2">
                <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 warm:text-[#2c251e]">Years of Experience Level:</label>
                <select
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200/80 bg-white text-slate-900 text-xs font-medium outline-none focus:border-amber-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 warm:border-[#e2d9c8] warm:bg-[#fffdf9] warm:text-[#2c251e]"
                >
                  <option value={1}>0 - 2 Years (Entry / Junior)</option>
                  <option value={3}>3 - 5 Years (Mid-Level)</option>
                  <option value={6}>6 - 8 Years (Senior Lead)</option>
                  <option value={10}>10+ Years (Staff / Principal Lead)</option>
                </select>
              </div>

              <div className="glass-card p-4 rounded-2xl space-y-2">
                <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 warm:text-[#2c251e]">Recruiter AI Voice Persona:</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setVoiceGender("female")}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition border ${
                      voiceGender === "female"
                        ? "bg-amber-500/20 border-amber-500 text-amber-700 dark:bg-indigo-600/30 dark:text-indigo-300 dark:border-indigo-500 warm:bg-amber-600/20 warm:text-amber-900"
                        : "glass-card text-slate-600 dark:text-slate-400 warm:text-[#736758]"
                    }`}
                  >
                    Studio Female
                  </button>
                  <button
                    type="button"
                    onClick={() => setVoiceGender("male")}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition border ${
                      voiceGender === "male"
                        ? "bg-purple-600/20 border-purple-500 text-purple-700 dark:text-purple-300 warm:bg-purple-600/20 warm:text-purple-900"
                        : "glass-card text-slate-600 dark:text-slate-400 warm:text-[#736758]"
                    }`}
                  >
                    Studio Male
                  </button>
                </div>
              </div>
            </div>

            {selectedMode === "Custom Role" && (
              <div className="glass-card p-5 rounded-2xl space-y-2">
                <label className="block text-xs font-bold text-amber-600 dark:text-indigo-400 warm:text-amber-700 uppercase tracking-wider">
                  Define Custom Target Role:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Principal Cloud Security Engineer, Senior iOS Developer..."
                  value={customRoleInput}
                  onChange={(e) => setCustomRoleInput(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-slate-200/80 bg-white text-slate-900 outline-none focus:border-amber-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 warm:border-[#e2d9c8] warm:bg-[#fffdf9] warm:text-[#2c251e] text-xs font-medium"
                />
              </div>
            )}

            {/* RESUME UPLOAD SECTION */}
            <div className="glass-card p-6 rounded-3xl space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 warm:text-[#2c251e] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" /> Candidate Resume Context (Optional)
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 warm:text-[#736758] mt-1">
                  Upload your resume or paste resume text to instruct the AI Recruiter to ask targeted questions about your actual projects & experience.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleResumeUpload} id="resume-input" className="hidden" />
                <label htmlFor="resume-input" className="cursor-pointer bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-lg shadow-purple-600/30 shrink-0 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" /> Upload Resume (.txt, .pdf, .docx)
                </label>
                {uploadedFileName && <span className="text-xs text-emerald-400 font-semibold font-mono">Loaded: {uploadedFileName}</span>}
              </div>

              <textarea
                rows={3}
                placeholder="Or paste your resume text here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="w-full p-3 rounded-xl bg-zinc-950 text-purple-200 outline-none border border-zinc-800 focus:border-purple-500 text-xs font-mono"
              />
            </div>

            {/* LAUNCH BUTTON */}
            <button
              onClick={handleStartInterview}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition py-4 rounded-2xl text-white font-bold shadow-xl shadow-blue-600/30 text-base flex items-center justify-center gap-3"
            >
              {loading ? (
                <span className="animate-pulse flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  {aiStatus || "Thinking..."}
                </span>
              ) : (
                <span>Launch AI Interview for {targetCompany} ({selectedMode === "Custom Role" ? customRoleInput || "Custom Role" : targetRole})</span>
              )}
            </button>
          </div>
        )}

        {step === "interview" && (
          <div className="bg-[#111113] border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-5 animate-in fade-in duration-200">
            <AntiCheatingMonitor
              active={step === "interview"}
              onWarning={(warn) => setAntiCheatWarnings((prev) => [...prev, warn])}
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                      {interviewState?.role || targetRole} @ {interviewState?.targetCompany || targetCompany}
                    </span>
                    <span className="text-[10px] bg-zinc-800 text-zinc-300 border border-zinc-700 px-2 py-0.5 rounded font-semibold">
                      {selectedMode}
                    </span>
                  </div>
                  <h2 className="text-sm font-bold text-white mt-0.5">
                    Live Question Turn #{Math.max(1, (interviewState?.history.length || 0) + 1)}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <span className={`px-3 py-1 rounded-xl text-xs font-bold border ${
                  interviewState?.difficulty === "Expert Level"
                    ? "bg-purple-500/20 text-purple-300 border-purple-500/40 animate-pulse"
                    : interviewState?.difficulty === "Hard"
                    ? "bg-red-500/20 text-red-300 border-red-500/40"
                    : interviewState?.difficulty === "Medium"
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                }`}>
                  Tier: {interviewState?.difficulty || "Medium"}
                </span>

                {currentTurn?.topic && (
                  <span className="bg-zinc-950 border border-zinc-800 text-zinc-300 px-3 py-1 rounded-xl text-xs font-medium">
                    Topic: {currentTurn.topic}
                  </span>
                )}

                <span className="bg-zinc-950 border border-zinc-800 text-zinc-300 px-3 py-1 rounded-xl text-xs font-mono font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-400" /> {formatTimer(sessionTimer)}
                </span>

                {isRecording && (
                  <span className="bg-red-500/20 text-red-400 border border-red-500/40 px-3 py-1 rounded-xl text-xs font-bold animate-pulse flex items-center gap-1">
                    <Mic className="w-3.5 h-3.5 text-red-400" /> Mic Listening
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-semibold text-zinc-400">
                <span>AI Interview Signal Progress</span>
                <span>{currentTurn?.progress || interviewState?.progress || 0}%</span>
              </div>
              <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-800">
                <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${currentTurn?.progress || interviewState?.progress || 0}%` }} />
              </div>
            </div>

            {aiStatus && (
              <div className="bg-blue-950/60 border border-blue-500/40 text-blue-300 p-3 rounded-xl text-xs font-bold flex items-center justify-between animate-pulse">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping" />
                  AI Recruiter Engine Status: {aiStatus}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-blue-400 font-mono">Processing Engine</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              {/* LEFT: RECRUITER AVATAR */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-2xl flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                      <Bot className="w-4 h-4 text-blue-400" /> Technical Hiring Lead ({targetCompany})
                    </span>
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded font-semibold">
                      Voice: Studio {voiceGender}
                    </span>
                  </div>

                  <div className="rounded-2xl bg-gradient-to-tr from-zinc-900 via-zinc-900 to-indigo-950 border border-zinc-800 p-6 text-center space-y-3 shadow-inner">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto shadow-lg ring-4 ring-blue-500/30">
                      AI
                    </div>
                    <div className="flex items-center justify-center gap-1.5 h-4">
                      {aiSpeechState === "speaking" ? (
                        <>
                          <div className="w-1.5 h-5 bg-blue-400 animate-bounce" />
                          <div className="w-1.5 h-7 bg-blue-500 animate-bounce delay-100" />
                          <div className="w-1.5 h-3 bg-blue-400 animate-bounce delay-150" />
                          <div className="w-1.5 h-6 bg-indigo-400 animate-bounce delay-200" />
                        </>
                      ) : (
                        <span className="text-[11px] text-zinc-400 font-medium">Recruiter Listening...</span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-zinc-900/90 rounded-2xl border border-zinc-800 space-y-3 h-64 overflow-y-auto custom-scrollbar">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block border-b border-zinc-800 pb-1">
                      Interactive Recruiter Dialogue Stream
                    </span>

                    {interviewState?.history.map((item, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex gap-2 text-xs justify-start">
                          <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                            AI
                          </div>
                          <div className="p-3 bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-2xl rounded-tl-none max-w-[85%] leading-relaxed">
                            {item.question}
                          </div>
                        </div>

                        {item.answer && (
                          <div className="flex gap-2 text-xs justify-end">
                            <div className="p-3 bg-emerald-600/20 text-emerald-200 border border-emerald-500/30 rounded-2xl rounded-tr-none max-w-[85%] leading-relaxed">
                              {item.answer}
                            </div>
                            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                              YOU
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {currentTurn?.question && (
                      <div className="flex gap-2 text-xs justify-start">
                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                          AI
                        </div>
                        <div className="p-3 bg-zinc-800 text-white border border-blue-500/40 rounded-2xl rounded-tl-none max-w-[85%] leading-relaxed shadow-md">
                          {currentTurn.question}
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                </div>

                <button
                  onClick={() => speakQuestion(currentTurn?.question || "Please explain your technical background.")}
                  className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2"
                >
                  <Volume2 className="w-4 h-4 text-blue-400" /> Repeat Question Out Loud
                </button>
              </div>

              {/* RIGHT: CAMERA & MIC */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-2xl flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  <CameraStudio
                    onMetricsUpdate={(m) => setCandidateMetrics(m)}
                  />

                  <AudioVisualizer micEnabled={micEnabled} />

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs font-semibold text-zinc-300 flex items-center gap-2">
                        Your Answer:
                        <button
                          type="button"
                          onClick={toggleMic}
                          className={`text-[10px] px-2 py-0.5 rounded font-bold border flex items-center gap-1 ${
                            micEnabled ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"
                          }`}
                        >
                          {micEnabled ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
                          {micEnabled ? "Mic On" : "Mic Muted"}
                        </button>
                      </label>
                      <button
                        type="button"
                        onClick={() => setCandidateAnswer("")}
                        className="text-[10px] px-2 py-0.5 bg-zinc-800 text-zinc-400 hover:text-white rounded border border-zinc-700"
                      >
                        Clear
                      </button>
                    </div>
                    <textarea
                      rows={3}
                      placeholder="Type or speak your answer clearly..."
                      value={candidateAnswer}
                      onChange={(e) => setCandidateAnswer(e.target.value)}
                      className="w-full p-3 rounded-xl bg-zinc-900 text-emerald-300 outline-none border border-zinc-800 focus:border-blue-500 text-xs font-mono leading-relaxed"
                    />
                  </div>

                  {(selectedMode === "Coding Interview" || currentTurn?.codingProblem) && (
                    <div className="space-y-3 border-t border-zinc-800 pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Code2 className="w-4 h-4 text-purple-400" /> Code Solution Editor
                        </span>
                        <select
                          value={codeLanguage}
                          onChange={(e) => setCodeLanguage(e.target.value)}
                          className="bg-zinc-900 border border-zinc-800 text-purple-300 px-2.5 py-1 rounded-lg text-xs font-mono"
                        >
                          <option value="javascript">JavaScript</option>
                          <option value="python">Python</option>
                          <option value="typescript">TypeScript</option>
                          <option value="cpp">C++</option>
                          <option value="java">Java</option>
                        </select>
                      </div>

                      {currentTurn?.codingProblem && (
                        <div className="p-3 bg-zinc-900/90 border border-zinc-800 rounded-xl space-y-1 text-xs">
                          <span className="font-bold text-white block">{currentTurn.codingProblem.title}</span>
                          <p className="text-zinc-300 leading-relaxed text-[11px]">{currentTurn.codingProblem.description}</p>
                        </div>
                      )}

                      <textarea
                        rows={6}
                        placeholder="// Write your code solution here..."
                        value={candidateCode}
                        onChange={(e) => setCandidateCode(e.target.value)}
                        className="w-full p-3 rounded-xl bg-zinc-950 text-indigo-200 outline-none border border-zinc-800 focus:border-purple-500 font-mono text-xs shadow-inner"
                      />

                      <button
                        onClick={handleAnalyzeCode}
                        disabled={analyzingCode || !candidateCode.trim()}
                        className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white py-2 rounded-xl text-xs font-bold transition shadow-lg shadow-purple-600/30 flex items-center justify-center gap-1.5"
                      >
                        <Search className="w-3.5 h-3.5" />
                        {analyzingCode ? "Analyzing Code Complexity..." : "Analyze Code Solution"}
                      </button>

                      {codingAnalysis && (
                        <div className="p-4 bg-zinc-900 border border-purple-500/30 rounded-xl space-y-2 text-xs">
                          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                            <span className="font-bold text-emerald-400">{codingAnalysis.isCorrect ? "Solution Correct" : "Needs Optimization"}</span>
                            <div className="flex gap-2 font-mono text-[10px]">
                              <span>Time: {codingAnalysis.timeComplexity}</span>
                              <span>Space: {codingAnalysis.spaceComplexity}</span>
                            </div>
                          </div>
                          {codingAnalysis.bugs.length > 0 && <p className="text-red-300 text-[11px]">Bugs: {codingAnalysis.bugs.join(", ")}</p>}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-3 border-t border-zinc-800">
                  <button
                    onClick={() => handleFinishInterview()}
                    disabled={savingReport || loading}
                    className="w-full sm:w-auto bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2.5 rounded-xl text-xs font-semibold transition border border-zinc-700"
                  >
                    Finish Session & Generate Report
                  </button>

                  <button
                    onClick={handleNextTurn}
                    disabled={loading || savingReport}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2"
                  >
                    {loading ? <span>Preparing next question...</span> : <span>Submit Answer & Next →</span>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === "result" && finalReport && (
          <InterviewReportView
            report={finalReport}
            roleTitle={interviewState?.role || targetRole}
            onRestart={() => {
              setStep("select");
              setFinalReport(null);
              setInterviewState(null);
              setCurrentTurn(null);
              setAntiCheatWarnings([]);
            }}
            onViewHistory={() => navigate("/interview-history")}
          />
        )}
      </main>
      </div>

      {/* Upgrade Modal for Limit Enforcement */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        featureType="interviews"
      />
    </div>
  );
}

export default AIInterview;
