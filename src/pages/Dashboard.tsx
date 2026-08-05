import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Code2,
  FileText,
  History,
  Video,
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
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0b0f19] dark:text-slate-100 warm:bg-[#f5f0e6] warm:text-[#2c251e] flex font-sans transition-colors duration-300 eye-comfort-glow">
      <OnboardingModal isOpen={showOnboarding} onComplete={handleOnboardingComplete} />
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

          <main className="mx-auto w-full max-w-7xl flex-1 space-y-8 p-4 sm:p-6 lg:p-8">
            {/* Header & Preferences */}
            <section className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-indigo-400 warm:text-amber-700">
                  Welcome back, {firstName}
                </p>
                <h1 className="mt-1.5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100 warm:text-[#2c251e]">
                  Prepare for your next interview
                </h1>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full border border-slate-200/80 bg-white/80 px-3 py-1 text-slate-700 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 warm:border-[#e2d9c8] warm:bg-[#fffdf9] warm:text-[#2c251e]">
                    Role: <span className="font-semibold text-amber-600 dark:text-indigo-400 warm:text-amber-700">{targetRole}</span>
                  </span>
                  <span className="rounded-full border border-slate-200/80 bg-white/80 px-3 py-1 text-slate-700 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 warm:border-[#e2d9c8] warm:bg-[#fffdf9] warm:text-[#2c251e]">
                    Target Company: <span className="font-semibold text-slate-900 dark:text-slate-100 warm:text-[#2c251e]">{targetCompany}</span>
                  </span>
                </div>
              </div>

              <Link
                to="/settings"
                className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white px-4 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 warm:border-[#e2d9c8] warm:bg-[#fffdf9] warm:text-[#2c251e] warm:hover:bg-[#eae3d2]"
              >
                Update preferences
              </Link>
            </section>

            {/* TOP ACTIONS SUITE */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 warm:text-[#736758]">
                  Quick Actions Workspace
                </h2>
                <span className="text-[11px] font-semibold text-amber-600 dark:text-indigo-400 warm:text-amber-700">
                  Ready to practice
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="glass-card group relative overflow-hidden rounded-2xl p-5 transition-all hover:-translate-y-1">
                  <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-amber-500/10 blur-2xl dark:bg-indigo-500/10 warm:bg-amber-600/15" />
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-indigo-500/20 dark:text-indigo-400 warm:bg-amber-600/20 warm:text-amber-800">
                    <Video className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 warm:text-[#2c251e]">
                    AI Mock Interview
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 warm:text-[#736758]">
                    Real-time audio & role-specific adaptive questions.
                  </p>
                  <Link
                    to="/ai-interview"
                    className="mt-4 inline-flex w-full items-center justify-between rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs font-semibold text-white transition group-hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 warm:bg-[#d97706] warm:hover:bg-[#b45309]"
                  >
                    <span>Start Session</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <div className="glass-card group relative overflow-hidden rounded-2xl p-5 transition-all hover:-translate-y-1">
                  <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-emerald-500/10 blur-2xl warm:bg-emerald-600/15" />
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 warm:bg-emerald-600/20 warm:text-emerald-800">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 warm:text-[#2c251e]">
                    ATS Resume Review
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 warm:text-[#736758]">
                    Scan resume keywords and get role fit score.
                  </p>
                  <Link
                    to="/resume-analyzer"
                    className="mt-4 inline-flex w-full items-center justify-between rounded-xl border border-slate-200/80 bg-white/90 px-3.5 py-2.5 text-xs font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 warm:border-[#e2d9c8] warm:bg-[#fffdf9] warm:text-[#2c251e] warm:hover:bg-[#eae3d2]"
                  >
                    <span>Analyze Resume</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <div className="glass-card group relative overflow-hidden rounded-2xl p-5 transition-all hover:-translate-y-1">
                  <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl warm:bg-amber-500/10" />
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 warm:bg-amber-600/20 warm:text-amber-800">
                    <Code2 className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 warm:text-[#2c251e]">
                    Coding Challenge
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 warm:text-[#736758]">
                    Solve algorithms with complexity feedback.
                  </p>
                  <Link
                    to="/coding-challenge"
                    className="mt-4 inline-flex w-full items-center justify-between rounded-xl border border-slate-200/80 bg-white/90 px-3.5 py-2.5 text-xs font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 warm:border-[#e2d9c8] warm:bg-[#fffdf9] warm:text-[#2c251e] warm:hover:bg-[#eae3d2]"
                  >
                    <span>Open Studio</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <div className="glass-card group relative overflow-hidden rounded-2xl p-5 transition-all hover:-translate-y-1">
                  <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-violet-500/10 blur-2xl warm:bg-teal-500/10" />
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400 warm:bg-teal-600/20 warm:text-teal-800">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 warm:text-[#2c251e]">
                    History & Analytics
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 warm:text-[#736758]">
                    View past reports & progress breakdown.
                  </p>
                  <Link
                    to="/interview-history"
                    className="mt-4 inline-flex w-full items-center justify-between rounded-xl border border-slate-200/80 bg-white/90 px-3.5 py-2.5 text-xs font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 warm:border-[#e2d9c8] warm:bg-[#fffdf9] warm:text-[#2c251e] warm:hover:bg-[#eae3d2]"
                  >
                    <span>View Reports</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </section>

            {/* STATS SUMMARY */}
            <section className="grid gap-4 sm:grid-cols-3">
              <StatCard label="Completed sessions" value={stats.completed.toString()} />
              <StatCard label="Average score" value={stats.averageScore !== null ? `${stats.averageScore}%` : "None"} />
              <StatCard
                label="Last practice"
                value={stats.latest ? new Date(stats.latest.createdAt).toLocaleDateString() : "Not started"}
              />
            </section>

            {/* RECENT SESSIONS & FOCUS TOPICS */}
            <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
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
                        className="grid w-full gap-3 px-5 py-4 text-left transition hover:bg-slate-50/70 dark:hover:bg-slate-800/40 warm:hover:bg-[#eae3d2]/50 sm:grid-cols-[1fr_auto] sm:items-center"
                        aria-label={`Open report for ${session.role}, score ${session.score} percent`}
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-900 dark:text-slate-100 warm:text-[#2c251e]">{session.role}</p>
                          <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400 warm:text-[#736758]">
                            {session.difficulty} &bull; {new Date(session.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-sm font-bold text-amber-600 dark:text-indigo-400 warm:text-amber-700">{session.score}%</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="glass-card rounded-2xl p-5 sm:p-6">
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 warm:text-[#2c251e]">Focus topics</h2>
                {userMemory?.weakTopics?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {userMemory.weakTopics.slice(0, 5).map((topic) => (
                      <span
                        key={topic}
                        className="rounded-full border border-slate-200/80 bg-slate-100/70 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 warm:border-[#e2d9c8] warm:bg-[#eae3d2] warm:text-[#2c251e]"
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
            </section>
          </main>
        </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-zinc-950 dark:text-white">{value}</p>
    </div>
  );
}

export default Dashboard;
