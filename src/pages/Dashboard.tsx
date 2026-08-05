import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Code2,
  FileText,
  History,
  Video,
  Sparkles,
  Zap,
  TrendingUp,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { OnboardingModal } from "../components/onboarding/OnboardingModal";
import { authService, type UserProfile } from "../services/authService";
import { interviewService, type InterviewSessionData, type UserAIMemory } from "../services/interviewService";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [userMemory, setUserMemory] = useState<UserAIMemory | null>(null);
  const [recentSessions, setRecentSessions] = useState<InterviewSessionData[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setUser(currentUser);
    setShowOnboarding(!localStorage.getItem("hasCompletedOnboarding"));

    Promise.all([
      interviewService.getUserMemory().then((res) => {
        if (res?.memory) setUserMemory(res.memory);
      }),
      interviewService.getHistory().then((res) => {
        if (res?.history) setRecentSessions(res.history);
      }),
    ]).catch(() => {
      setRecentSessions([]);
    });
  }, [navigate]);

  const handleOnboardingComplete = (data: {
    targetRole: string;
    experienceLevel: string;
    targetCompany: string;
    resumeText: string;
  }) => {
    localStorage.setItem("hasCompletedOnboarding", "true");
    localStorage.setItem("onboardingPreferences", JSON.stringify(data));
    setShowOnboarding(false);
    setUserMemory((memory) =>
      memory
        ? {
            ...memory,
            targetRole: data.targetRole,
            targetCompany: data.targetCompany,
          }
        : memory
    );
  };

  const stats = useMemo(() => {
    const completed = recentSessions.length;
    const averageScore =
      completed > 0
        ? Math.round(recentSessions.reduce((total, session) => total + session.score, 0) / completed)
        : null;
    const latest = completed > 0 ? recentSessions[0] : null;

    return { averageScore, completed, latest };
  }, [recentSessions]);

  if (!user) return null;

  const firstName = user.name?.split(" ")[0] || "there";
  const targetRole = userMemory?.targetRole || "Not set";
  const targetCompany = userMemory?.targetCompany || "Not set";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0b0f19] dark:text-slate-100 warm:bg-[#f5f0e6] warm:text-[#2c251e] flex font-sans transition-colors duration-300 eye-comfort-glow relative overflow-hidden">
      {/* Floating Animated Ambient Background Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.35, 0.6, 0.35],
          x: [0, 20, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -top-20 -left-20 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl dark:bg-indigo-500/15 warm:bg-amber-600/20"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
          y: [0, -30, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="pointer-events-none absolute top-1/3 -right-20 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl dark:bg-purple-500/15 warm:bg-emerald-600/15"
      />

      <OnboardingModal isOpen={showOnboarding} onComplete={handleOnboardingComplete} />
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 z-10">
        <Navbar />

        <main className="mx-auto w-full max-w-7xl flex-1 space-y-8 p-4 sm:p-6 lg:p-8">
          {/* Header & Preferences */}
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end"
          >
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:bg-indigo-500/20 dark:border-indigo-500/30 dark:text-indigo-400 warm:bg-amber-600/20 warm:border-amber-600/30 warm:text-amber-800 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" /> Welcome back, {firstName}
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100 warm:text-[#2c251e]">
                Prepare for your next interview
              </h1>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full border border-slate-200/80 bg-white/80 px-3 py-1 text-slate-700 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 warm:border-[#e2d9c8] warm:bg-[#fffdf9] warm:text-[#2c251e] shadow-sm">
                  Role: <span className="font-bold text-amber-600 dark:text-indigo-400 warm:text-amber-700">{targetRole}</span>
                </span>
                <span className="rounded-full border border-slate-200/80 bg-white/80 px-3 py-1 text-slate-700 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 warm:border-[#e2d9c8] warm:bg-[#fffdf9] warm:text-[#2c251e] shadow-sm">
                  Target Company: <span className="font-bold text-slate-900 dark:text-slate-100 warm:text-[#2c251e]">{targetCompany}</span>
                </span>
              </div>
            </div>

            <Link
              to="/settings"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white px-4 text-xs font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 warm:border-[#e2d9c8] warm:bg-[#fffdf9] warm:text-[#2c251e] warm:hover:bg-[#eae3d2] shadow-sm"
            >
              Update preferences
            </Link>
          </motion.section>

          {/* TOP ACTIONS SUITE WITH STAGGERED MOTION */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 warm:text-[#736758] flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" /> Quick Actions Workspace
              </h2>
              <span className="text-[11px] font-bold text-amber-600 dark:text-indigo-400 warm:text-amber-700 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Ready to practice
              </span>
            </div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.08 },
                },
              }}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              {/* CARD 1: AI MOCK INTERVIEW */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ y: -6, scale: 1.015 }}
                transition={{ duration: 0.25 }}
                className="glass-card group relative overflow-hidden rounded-2xl p-5"
              >
                <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-amber-500/10 blur-2xl dark:bg-indigo-500/10 warm:bg-amber-600/15" />
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-indigo-500/20 dark:text-indigo-400 warm:bg-amber-600/20 warm:text-amber-800 shadow-sm transition-transform group-hover:scale-110">
                  <Video className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 warm:text-[#2c251e]">
                  AI Mock Interview
                </h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 warm:text-[#736758] leading-relaxed">
                  Real-time audio & role-specific adaptive questions.
                </p>
                <Link
                  to="/ai-interview"
                  className="mt-4 inline-flex w-full items-center justify-between rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs font-bold text-white transition group-hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 warm:bg-[#d97706] warm:hover:bg-[#b45309] shadow-md"
                >
                  <span>Start Session</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>

              {/* CARD 2: ATS RESUME REVIEW */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ y: -6, scale: 1.015 }}
                transition={{ duration: 0.25 }}
                className="glass-card group relative overflow-hidden rounded-2xl p-5"
              >
                <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-emerald-500/10 blur-2xl warm:bg-emerald-600/15" />
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 warm:bg-emerald-600/20 warm:text-emerald-800 shadow-sm transition-transform group-hover:scale-110">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 warm:text-[#2c251e]">
                  ATS Resume Review
                </h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 warm:text-[#736758] leading-relaxed">
                  Scan resume keywords and get role fit score.
                </p>
                <Link
                  to="/resume-analyzer"
                  className="mt-4 inline-flex w-full items-center justify-between rounded-xl border border-slate-200/80 bg-white/90 px-3.5 py-2.5 text-xs font-bold text-slate-900 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 warm:border-[#e2d9c8] warm:bg-[#fffdf9] warm:text-[#2c251e] warm:hover:bg-[#eae3d2] shadow-sm"
                >
                  <span>Analyze Resume</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>

              {/* CARD 3: CODING CHALLENGE */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ y: -6, scale: 1.015 }}
                transition={{ duration: 0.25 }}
                className="glass-card group relative overflow-hidden rounded-2xl p-5"
              >
                <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl warm:bg-amber-500/10" />
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 warm:bg-amber-600/20 warm:text-amber-800 shadow-sm transition-transform group-hover:scale-110">
                  <Code2 className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 warm:text-[#2c251e]">
                  Coding Challenge
                </h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 warm:text-[#736758] leading-relaxed">
                  Solve algorithms with complexity feedback.
                </p>
                <Link
                  to="/coding-challenge"
                  className="mt-4 inline-flex w-full items-center justify-between rounded-xl border border-slate-200/80 bg-white/90 px-3.5 py-2.5 text-xs font-bold text-slate-900 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 warm:border-[#e2d9c8] warm:bg-[#fffdf9] warm:text-[#2c251e] warm:hover:bg-[#eae3d2] shadow-sm"
                >
                  <span>Open Studio</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>

              {/* CARD 4: HISTORY & ANALYTICS */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ y: -6, scale: 1.015 }}
                transition={{ duration: 0.25 }}
                className="glass-card group relative overflow-hidden rounded-2xl p-5"
              >
                <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-violet-500/10 blur-2xl warm:bg-teal-500/10" />
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400 warm:bg-teal-600/20 warm:text-teal-800 shadow-sm transition-transform group-hover:scale-110">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 warm:text-[#2c251e]">
                  History & Analytics
                </h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 warm:text-[#736758] leading-relaxed">
                  View past reports & progress breakdown.
                </p>
                <Link
                  to="/interview-history"
                  className="mt-4 inline-flex w-full items-center justify-between rounded-xl border border-slate-200/80 bg-white/90 px-3.5 py-2.5 text-xs font-bold text-slate-900 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 warm:border-[#e2d9c8] warm:bg-[#fffdf9] warm:text-[#2c251e] warm:hover:bg-[#eae3d2] shadow-sm"
                >
                  <span>View Reports</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </motion.div>
          </section>

          {/* STATS SUMMARY */}
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="grid gap-4 sm:grid-cols-3"
          >
            <StatCard label="Completed sessions" value={stats.completed.toString()} />
            <StatCard label="Average score" value={stats.averageScore !== null ? `${stats.averageScore}%` : "None"} />
            <StatCard
              label="Last practice"
              value={stats.latest ? new Date(stats.latest.createdAt).toLocaleDateString() : "Not started"}
            />
          </motion.section>

          {/* RECENT SESSIONS & FOCUS TOPICS */}
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]"
          >
            <div className="glass-card rounded-2xl">
              <div className="flex items-center justify-between border-b border-slate-200/80 px-5 py-4 dark:border-slate-800 warm:border-[#e2d9c8]">
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 warm:text-[#2c251e]">Recent sessions</h2>
                <Link to="/interview-history" className="text-xs font-bold text-amber-600 hover:text-amber-500 dark:text-indigo-400 warm:text-amber-700">
                  View all
                </Link>
              </div>

              {recentSessions.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 warm:bg-[#eae3d2] warm:text-[#736758]">
                    <History className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-slate-100 warm:text-[#2c251e]">No sessions yet</h3>
                  <p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-slate-600 dark:text-slate-300 warm:text-[#736758]">
                    Complete an interview and your reports will show here.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-200/80 dark:divide-slate-800 warm:divide-[#e2d9c8]">
                  {recentSessions.slice(0, 4).map((session) => (
                    <button
                      key={session.id}
                      type="button"
                      onClick={() => navigate("/interview-history")}
                      className="grid w-full gap-3 px-5 py-4 text-left transition hover:bg-slate-50/70 dark:hover:bg-slate-800/40 warm:hover:bg-[#eae3d2]/50 sm:grid-cols-[1fr_auto] sm:items-center group"
                      aria-label={`Open report for ${session.role}, score ${session.score} percent`}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-900 dark:text-slate-100 warm:text-[#2c251e] group-hover:text-amber-600 dark:group-hover:text-indigo-400 transition-colors">{session.role}</p>
                        <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400 warm:text-[#736758]">
                          {session.difficulty} &bull; {new Date(session.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-sm font-extrabold text-amber-600 dark:text-indigo-400 warm:text-amber-700 font-mono">{session.score}%</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="glass-card rounded-2xl p-5 sm:p-6">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 warm:text-[#2c251e] flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-amber-600 dark:text-indigo-400" /> Focus topics
              </h2>
              {userMemory?.weakTopics?.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {userMemory.weakTopics.slice(0, 5).map((topic) => (
                    <span
                      key={topic}
                      className="rounded-full border border-slate-200/80 bg-slate-100/70 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 warm:border-[#e2d9c8] warm:bg-[#eae3d2] warm:text-[#2c251e] transition-transform hover:scale-105"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-xs leading-6 text-slate-600 dark:text-slate-300 warm:text-[#736758]">
                  Focus topics will appear after you complete an interview session.
                </p>
              )}
            </div>
          </motion.section>
        </main>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      className="glass-card rounded-2xl p-5 transition-all shadow-sm"
    >
      <p className="text-xs text-slate-500 dark:text-slate-400 warm:text-[#736758] font-bold uppercase tracking-wider">{label}</p>
      <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white warm:text-[#2c251e] font-mono">{value}</p>
    </motion.div>
  );
}

export default Dashboard;
