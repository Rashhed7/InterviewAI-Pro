import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Code2,
  FileText,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Settings as SettingsIcon,
  Sparkles,
  Sun,
  Target,
  Video,
  X,
} from "lucide-react";
import { OnboardingModal } from "../components/onboarding/OnboardingModal";
import { useTheme } from "../context/ThemeContext";
import { authService, type UserProfile } from "../services/authService";
import { interviewService, type InterviewSessionData, type UserAIMemory } from "../services/interviewService";

const navigationItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Interview", path: "/ai-interview", icon: Video },
  { name: "Resume", path: "/resume-analyzer", icon: FileText },
  { name: "Coding", path: "/coding-challenge", icon: Code2 },
  { name: "Reports", path: "/interview-history", icon: History },
  { name: "Analytics", path: "/analytics", icon: BarChart3 },
  { name: "Settings", path: "/settings", icon: SettingsIcon },
];

const quickActions = [
  {
    title: "Start interview",
    description: "Practice a focused mock interview.",
    path: "/ai-interview",
    icon: Video,
  },
  {
    title: "Review resume",
    description: "Improve wording and role fit.",
    path: "/resume-analyzer",
    icon: FileText,
  },
  {
    title: "Solve coding",
    description: "Work through a coding challenge.",
    path: "/coding-challenge",
    icon: Code2,
  },
];

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { effectiveTheme, setTheme } = useTheme();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [userMemory, setUserMemory] = useState<UserAIMemory | null>(null);
  const [recentSessions, setRecentSessions] = useState<InterviewSessionData[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

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

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  if (!user) return null;

  const firstName = user.name?.split(" ")[0] || "there";
  const targetRole = userMemory?.targetRole || "Not set";
  const targetCompany = userMemory?.targetCompany || "Not set";

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-[#09090B] dark:text-zinc-100">
      <OnboardingModal isOpen={showOnboarding} onComplete={handleOnboardingComplete} />

      <div className="flex min-h-screen">
        <aside
          className={`hidden shrink-0 flex-col border-r border-zinc-200 bg-white transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-950 lg:flex ${
            sidebarCollapsed ? "w-20" : "w-64"
          }`}
        >
          <div className="flex h-16 items-center justify-between border-b border-zinc-200 px-4 dark:border-zinc-800">
            <Link to="/dashboard" className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                <Sparkles className="h-5 w-5" />
              </div>
              {!sidebarCollapsed && (
                <span className="truncate text-sm font-semibold">
                  InterviewAI <span className="font-mono text-xs text-blue-600 dark:text-blue-400">PRO</span>
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setSidebarCollapsed((value) => !value)}
              className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </button>
          </div>

          <nav className="flex-1 space-y-1 p-3" aria-label="Dashboard navigation">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
                  }`}
                  title={sidebarCollapsed ? item.name : undefined}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!sidebarCollapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-sm font-semibold text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
                {user.name ? user.name[0].toUpperCase() : "U"}
              </div>
              {!sidebarCollapsed && (
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{user.name}</p>
                  <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{user.email}</p>
                </div>
              )}
            </div>

            {sidebarCollapsed ? (
              <button
                type="button"
                onClick={handleLogout}
                className="mt-3 flex h-10 w-full items-center justify-center rounded-lg text-zinc-500 transition hover:bg-red-50 hover:text-red-600 dark:text-zinc-400 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                className="mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-500 transition hover:bg-red-50 hover:text-red-600 dark:text-zinc-400 dark:hover:bg-red-950/30 dark:hover:text-red-400"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            )}
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/85 px-4 backdrop-blur-xl dark:border-zinc-800 dark:bg-[#09090B]/85 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen((value) => !value)}
                className="rounded-lg border border-zinc-200 bg-zinc-50 p-2 text-zinc-600 transition hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-white lg:hidden"
                aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileMenuOpen}
                aria-controls="dashboard-mobile-menu"
              >
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">Dashboard</p>
                <p className="hidden truncate text-xs text-zinc-500 dark:text-zinc-400 sm:block">Your interview preparation workspace</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTheme(effectiveTheme === "dark" ? "light" : "dark")}
                className="rounded-lg border border-zinc-200 bg-zinc-50 p-2 text-zinc-600 transition hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                aria-label={effectiveTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                title={effectiveTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {effectiveTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={() => navigate("/ai-interview")}
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-zinc-950 px-3 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                aria-label="Start a new interview session"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New session</span>
              </button>
            </div>
          </header>

          {mobileMenuOpen && (
            <div
              id="dashboard-mobile-menu"
              className="sticky top-16 z-10 border-b border-zinc-200 bg-white px-4 py-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 lg:hidden"
            >
              <nav className="grid grid-cols-2 gap-2" aria-label="Mobile dashboard navigation">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                        isActive
                          ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 px-3 py-2.5 text-sm font-semibold text-zinc-600 transition hover:bg-red-50 hover:text-red-600 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-red-950/30 dark:hover:text-red-400"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}

          <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
            <section className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Welcome back, {firstName}</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">
                  Prepare for your next interview.
                </h1>
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                    Role: <span className="font-semibold text-zinc-950 dark:text-white">{targetRole}</span>
                  </span>
                  <span className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                    Company: <span className="font-semibold text-zinc-950 dark:text-white">{targetCompany}</span>
                  </span>
                </div>
              </div>

              <Link
                to="/settings"
                className="inline-flex h-10 items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900"
              >
                Update preferences
              </Link>
            </section>

            <section className="grid gap-4 sm:grid-cols-3">
              <StatCard label="Completed sessions" value={stats.completed.toString()} />
              <StatCard label="Average score" value={stats.averageScore !== null ? `${stats.averageScore}%` : "None"} />
              <StatCard
                label="Last practice"
                value={stats.latest ? new Date(stats.latest.createdAt).toLocaleDateString() : "Not started"}
              />
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                      <Target className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-semibold text-zinc-950 dark:text-white">
                      {stats.latest ? `Continue with ${stats.latest.role}` : "Start your first session"}
                    </h2>
                    <p className="mt-2 max-w-xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                      {stats.latest
                        ? `Your last score was ${stats.latest.score}%. Start a fresh round or review the report before practicing again.`
                        : "Run a mock interview to generate your first report and understand what to improve next."}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate("/ai-interview")}
                    className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                  >
                    Start interview
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
                <h2 className="text-sm font-semibold text-zinc-950 dark:text-white">Focus topics</h2>
                {userMemory?.weakTopics?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {userMemory.weakTopics.slice(0, 5).map((topic) => (
                      <span
                        key={topic}
                        className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                    Focus topics will appear after you complete an interview.
                  </p>
                )}
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[1fr_0.75fr]">
              <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
                  <h2 className="text-sm font-semibold text-zinc-950 dark:text-white">Recent sessions</h2>
                  <Link to="/interview-history" className="text-sm font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400">
                    View all
                  </Link>
                </div>

                {recentSessions.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                      <History className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-sm font-semibold text-zinc-950 dark:text-white">No sessions yet</h3>
                    <p className="mx-auto mt-2 max-w-sm text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                      Complete an interview and your reports will show here.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {recentSessions.slice(0, 4).map((session) => (
                      <button
                        key={session.id}
                        type="button"
                        onClick={() => navigate("/interview-history")}
                        className="grid w-full gap-3 px-5 py-4 text-left transition hover:bg-zinc-50 dark:hover:bg-zinc-900 sm:grid-cols-[1fr_auto] sm:items-center"
                        aria-label={`Open report for ${session.role}, score ${session.score} percent`}
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-zinc-950 dark:text-white">{session.role}</p>
                          <p className="mt-1 truncate text-xs text-zinc-500 dark:text-zinc-400">
                            {session.difficulty} · {new Date(session.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-sm font-semibold text-zinc-950 dark:text-white">{session.score}%</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
                <h2 className="text-sm font-semibold text-zinc-950 dark:text-white">Quick actions</h2>
                <div className="mt-4 space-y-3">
                  {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <Link
                        key={action.path}
                        to={action.path}
                        className="flex items-center gap-3 rounded-xl border border-zinc-200 p-3 transition hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-zinc-950 dark:text-white">{action.title}</p>
                          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{action.description}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </section>
          </main>
        </div>
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
