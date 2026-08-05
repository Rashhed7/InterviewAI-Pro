import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Video,
  FileText,
  Code2,
  BarChart3,
  History,
  Settings as SettingsIcon,
  Search,
  Bell,
  Sun,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  ArrowRight,
  Plus,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Bot,
  Target,
} from "lucide-react";
import { authService, type UserProfile } from "../services/authService";
import { interviewService, type UserAIMemory, type InterviewSessionData } from "../services/interviewService";
import { useTheme } from "../context/ThemeContext";
import { OnboardingModal } from "../components/onboarding/OnboardingModal";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { effectiveTheme, setTheme } = useTheme();

  // User & Data States
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userMemory, setUserMemory] = useState<UserAIMemory | null>(null);
  const [recentSessions, setRecentSessions] = useState<InterviewSessionData[]>([]);

  // Onboarding & Guided UX States
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Layout States
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setUser(currentUser);

    // Check if user has completed onboarding
    const completedOnboarding = localStorage.getItem("hasCompletedOnboarding");
    if (!completedOnboarding) {
      setShowOnboarding(true);
    }

    Promise.all([
      interviewService.getUserMemory().then((res) => {
        if (res?.memory) setUserMemory(res.memory);
      }),
      interviewService.getHistory().then((res) => {
        if (res?.history) setRecentSessions(res.history);
      }),
    ]);
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

    if (userMemory) {
      setUserMemory({
        ...userMemory,
        targetRole: data.targetRole,
        targetCompany: data.targetCompany,
      });
    }
  };

  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  if (!user) return null;

  // Real Metric Calculations
  const hasSessions = recentSessions.length > 0;
  const totalCompleted = recentSessions.length;
  const averageScore = hasSessions
    ? Math.round(recentSessions.reduce((acc, s) => acc + s.score, 0) / totalCompleted)
    : null;
  const lastSession = hasSessions ? recentSessions[0] : null;

  // Filtered Sessions for Search
  const filteredSessions = recentSessions.filter(
    (s) =>
      s.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.difficulty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navigationItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "AI Interview", path: "/ai-interview", icon: Video },
    { name: "Resume Analyzer", path: "/resume-analyzer", icon: FileText },
    { name: "Reports", path: "/interview-history", icon: History },
    { name: "Practice", path: "/coding-challenge", icon: Code2 },
    { name: "Analytics", path: "/analytics", icon: BarChart3 },
    { name: "Settings", path: "/settings", icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 flex font-sans antialiased selection:bg-blue-500 selection:text-white">
      {/* ONBOARDING MODAL */}
      <OnboardingModal
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
      />

      {/* LEFT SIDEBAR */}
      <aside
        className={`bg-[#0D0D0E] border-r border-zinc-800/80 flex flex-col justify-between transition-all duration-300 z-30 shrink-0 ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="p-4 space-y-6">
          {/* Brand Header */}
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0 shadow-lg shadow-blue-600/20">
                <Sparkles className="w-5 h-5" />
              </div>
              {!sidebarCollapsed && (
                <span className="font-extrabold text-sm text-white tracking-tight whitespace-nowrap">
                  InterviewAI <span className="text-blue-500 font-mono text-[10px]">PRO</span>
                </span>
              )}
            </Link>

            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition"
              title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="w-4 h-4" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition group relative ${
                    isActive
                      ? "bg-zinc-800/80 text-white border border-zinc-700/60"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-blue-400" : "text-zinc-400 group-hover:text-zinc-200"}`} />
                  {!sidebarCollapsed && <span>{item.name}</span>}
                  {isActive && !sidebarCollapsed && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-zinc-800/80 space-y-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-200 font-bold flex items-center justify-center text-xs shrink-0 border border-zinc-700">
              {user.name ? user.name[0].toUpperCase() : "U"}
            </div>
            {!sidebarCollapsed && (
              <div className="truncate">
                <div className="text-xs font-semibold text-white truncate">{user.name}</div>
                <div className="text-[10px] text-zinc-400 truncate">{user.email}</div>
              </div>
            )}
          </div>

          {!sidebarCollapsed && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          )}
        </div>
      </aside>

      {/* MAIN WORKSPACE WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto custom-scrollbar">
        {/* TOP WORKSPACE BAR */}
        <header className="h-16 border-b border-zinc-800/80 bg-[#09090B]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search sessions, topics, or roles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs text-white placeholder-zinc-500 outline-none focus:border-zinc-700 transition"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(effectiveTheme === "dark" ? "light" : "dark")}
              className="p-2 rounded-xl border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white transition"
              title="Toggle Theme"
            >
              {effectiveTheme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white transition relative"
              >
                <Bell className="w-4 h-4" />
                {hasSessions && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500" />}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-11 w-72 bg-[#111113] border border-zinc-800 rounded-2xl p-4 shadow-2xl space-y-3 z-50 text-xs">
                  <div className="font-bold text-white border-b border-zinc-800 pb-2">Notifications</div>
                  {hasSessions ? (
                    <div className="text-zinc-300">
                      Your latest interview report for <span className="font-semibold text-white">{lastSession?.role}</span> is ready for review.
                    </div>
                  ) : (
                    <div className="text-zinc-400">No unread alerts. Start a session to generate insights.</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* MAIN BODY CONTENT */}
        <main className="p-6 lg:p-8 space-y-8 max-w-7xl w-full mx-auto">
          {/* GREETING & AI MENTOR COACH GUIDANCE CARD */}
          <div className="space-y-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {getTimeOfDayGreeting()}, {user.name.split(" ")[0]}
              </h1>
              <p className="text-xs text-zinc-400">
                Targeting <span className="text-blue-400 font-semibold">{userMemory?.targetRole || "Full Stack Engineer"}</span> at <span className="text-purple-400 font-semibold">{userMemory?.targetCompany || "Stripe"}</span>.
              </p>
            </div>

            {/* AI COACH MENTOR WIDGET ("TODAY'S PLAN") */}
            <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-zinc-900 to-indigo-950/40 p-6 shadow-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                  <Bot className="w-4 h-4 text-blue-400" /> Personal AI Interview Coach Guidance
                </span>
                <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-0.5 rounded font-semibold">
                  Today's Practice Plan
                </span>
              </div>

              <div className="space-y-2 text-xs text-zinc-200 leading-relaxed">
                <p className="font-medium">
                  {hasSessions
                    ? `Great progress! Based on your recent ${lastSession?.role} interview, here are your recommended steps for today:`
                    : "Welcome to InterviewAI Pro! Follow these 3 simple steps to prepare for your interviews:"}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3 bg-zinc-900/90 rounded-xl border border-zinc-800 space-y-1">
                    <span className="text-[10px] font-bold text-blue-400 uppercase block">Step 1: Spoken Room</span>
                    <p className="text-[11px] text-zinc-300">Complete 1 live AI voice interview session.</p>
                  </div>
                  <div className="p-3 bg-zinc-900/90 rounded-xl border border-zinc-800 space-y-1">
                    <span className="text-[10px] font-bold text-purple-400 uppercase block">Step 2: Resume Audit</span>
                    <p className="text-[11px] text-zinc-300">Upload resume for metric bullet rewriting.</p>
                  </div>
                  <div className="p-3 bg-zinc-900/90 rounded-xl border border-zinc-800 space-y-1">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase block">Step 3: Algorithm Challenge</span>
                    <p className="text-[11px] text-zinc-300">Solve 1 DSA coding algorithm in Monaco sandbox.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN TWO-COLUMN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* LEFT 2 COLUMNS: PRIMARY ACTION & CONTENT */}
            <div className="lg:col-span-2 space-y-6">
              {/* PRIMARY ACTION CARD ("WHAT TO DO NEXT") */}
              <div className="rounded-3xl border border-zinc-800 bg-[#111113] p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" /> Core Action
                  </span>
                  {hasSessions && (
                    <span className="text-[11px] text-zinc-400 font-mono">
                      Last Session: {new Date(lastSession!.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {hasSessions ? `Continue Practice: ${lastSession?.role}` : "Start Your First AI Interview"}
                  </h2>
                  <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
                    {hasSessions
                      ? `You completed a session for ${lastSession?.role} with a score of ${lastSession?.score}%. Launch a new turn to practice follow-up topics.`
                      : "Configure your target role and enterprise company to experience a realistic, voice-conducted 1-on-1 interview with dynamic AI feedback."}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => navigate("/ai-interview")}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-2xl text-xs shadow-xl shadow-blue-600/20 transition flex items-center justify-center gap-2"
                  >
                    <span>{hasSessions ? "Start New AI Interview" : "Launch AI Interview Room"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => navigate("/resume-analyzer")}
                    className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 font-semibold px-5 py-3 rounded-2xl text-xs transition flex items-center justify-center gap-2"
                  >
                    <FileText className="w-4 h-4 text-purple-400" />
                    <span>Upload Resume for ATS Score</span>
                  </button>
                </div>
              </div>

              {/* RECENT REPORTS SECTION */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <History className="w-4 h-4 text-blue-400" /> Recent Interview Sessions
                  </h3>
                  {hasSessions && (
                    <Link to="/interview-history" className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1">
                      View All Reports <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>

                {!hasSessions ? (
                  /* ELEGANT EMPTY STATE FOR 0 INTERVIEWS */
                  <div className="rounded-3xl border border-zinc-800/80 bg-[#111113] p-8 text-center space-y-4 shadow-xl">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center justify-center mx-auto">
                      <History className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white">No interviews completed yet</h4>
                      <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                        Complete your first AI interview to unlock detailed performance metrics, STAR method breakdowns, and skill insights.
                      </p>
                    </div>
                    <button
                      onClick={() => navigate("/ai-interview")}
                      className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs border border-zinc-700 transition inline-flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4 text-blue-400" /> Start First Interview
                    </button>
                  </div>
                ) : (
                  /* REAL SESSION CARDS LIST */
                  <div className="space-y-3">
                    {filteredSessions.slice(0, 3).map((session) => (
                      <div
                        key={session.id}
                        onClick={() => navigate("/interview-history")}
                        className="p-5 rounded-2xl border border-zinc-800 bg-[#111113] hover:border-zinc-700 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{session.role}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono">
                              {session.difficulty}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400 line-clamp-1">{session.feedback}</p>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                          <div className="text-right">
                            <div className="text-lg font-bold font-mono text-emerald-400">{session.score}%</div>
                            <div className="text-[10px] text-zinc-500 font-mono">
                              {new Date(session.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-zinc-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* PRACTICE MODULES GRID */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-emerald-400" /> Preparation Modules
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link
                    to="/coding-challenge"
                    className="p-5 rounded-2xl border border-zinc-800 bg-[#111113] hover:border-emerald-500/40 transition group space-y-2 shadow-md"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Code2 className="w-5 h-5" />
                    </div>
                    <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition flex items-center justify-between">
                      Algorithm Sandbox <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400" />
                    </h4>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Practice DSA challenges with instant Big-O evaluation and edge case checks.
                    </p>
                  </Link>

                  <Link
                    to="/resume-analyzer"
                    className="p-5 rounded-2xl border border-zinc-800 bg-[#111113] hover:border-purple-500/40 transition group space-y-2 shadow-md"
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <h4 className="text-xs font-bold text-white group-hover:text-purple-400 transition flex items-center justify-between">
                      ATS Bullet Rewriter <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-purple-400" />
                    </h4>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Transform generic project descriptions into high-impact metric-driven bullets.
                    </p>
                  </Link>
                </div>
              </div>
            </div>

            {/* RIGHT PANEL: REAL METRICS & SKILL BREAKDOWN */}
            <div className="space-y-6">
              {/* REAL METRIC SUMMARY */}
              <div className="p-6 rounded-3xl border border-zinc-800 bg-[#111113] space-y-4 shadow-xl">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-800 pb-2">
                  Session Overview
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400 font-medium">Interviews Completed</span>
                    <span className="font-mono font-bold text-white">{totalCompleted}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400 font-medium">Average Evaluation Score</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {averageScore !== null ? `${averageScore}%` : "None"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400 font-medium">Target Track</span>
                    <span className="font-mono font-semibold text-blue-400">
                      {userMemory?.targetRole || "Full Stack Engineer"}
                    </span>
                  </div>
                </div>
              </div>

              {/* WEAK SKILLS & TOPIC FOCUS */}
              <div className="p-6 rounded-3xl border border-zinc-800 bg-[#111113] space-y-4 shadow-xl">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-800 pb-2">
                  Focus Topics
                </h3>

                {!userMemory?.weakTopics || userMemory.weakTopics.length === 0 ? (
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Topics will automatically populate here after your first AI interview evaluation.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {userMemory.weakTopics.slice(0, 5).map((topic, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 flex items-center justify-between">
                        <span>{topic}</span>
                        <span className="text-[10px] text-amber-400 font-bold">Needs Review</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ONBOARDING CHECKLIST */}
              <div className="p-6 rounded-3xl border border-zinc-800 bg-[#111113] space-y-4 shadow-xl">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-800 pb-2">
                  Recommended Workflow
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${hasSessions ? "text-emerald-400" : "text-zinc-600"}`} />
                    <div>
                      <span className={hasSessions ? "line-through text-zinc-500" : "font-semibold text-white"}>
                        Complete first AI interview
                      </span>
                      <p className="text-[11px] text-zinc-400">Receive STAR analysis & AI score</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white">Upload resume for ATS audit</span>
                      <p className="text-[11px] text-zinc-400">Extract missing skills & metrics</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white">Solve 1 DSA coding problem</span>
                      <p className="text-[11px] text-zinc-400">Verify complexity in sandbox</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;