import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Moon, Sun, Laptop, Bell, Globe, Shield, Trash2, Check, Target, Briefcase, Building2, Award, FileText, Save } from "lucide-react";
import { authService, type UserProfile } from "../services/authService";
import { interviewService } from "../services/interviewService";
import { useTheme } from "../context/ThemeContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const QUICK_ROLES = [
  "Full Stack Engineer",
  "Frontend React Developer",
  "Backend Node.js Engineer",
  "AI & Machine Learning Engineer",
  "Cloud & DevOps Architect",
  "System Design Specialist",
];

const QUICK_COMPANIES = ["Stripe", "Google", "Meta", "Amazon", "Microsoft", "Fast-growing Startup"];

function Settings() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const { theme, setTheme: handleThemeChange } = useTheme();

  // Candidate Interview Preferences State
  const [targetRole, setTargetRole] = useState("Full Stack Engineer");
  const [targetCompany, setTargetCompany] = useState("Stripe");
  const [experienceLevel, setExperienceLevel] = useState("Mid-level (2-5 yrs)");
  const [resumeText, setResumeText] = useState("");
  const [prefSavedMsg, setPrefSavedMsg] = useState<string | null>(null);
  const [prefLoading, setPrefLoading] = useState(false);

  // Notification Settings State
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [practiceReminders, setPracticeReminders] = useState(true);
  const [productUpdates, setProductUpdates] = useState(false);
  const [notifSavedMsg, setNotifSavedMsg] = useState<string | null>(null);

  // Language State
  const [language, setLanguage] = useState("en-US");
  const [langSavedMsg, setLangSavedMsg] = useState<string | null>(null);

  // Delete Account Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setUser(currentUser);

    // Load candidate interview preferences
    const savedPrefs = localStorage.getItem("onboardingPreferences");
    if (savedPrefs) {
      try {
        const parsed = JSON.parse(savedPrefs);
        if (parsed.targetRole) setTargetRole(parsed.targetRole);
        if (parsed.targetCompany) setTargetCompany(parsed.targetCompany);
        if (parsed.experienceLevel) setExperienceLevel(parsed.experienceLevel);
        if (parsed.resumeText) setResumeText(parsed.resumeText);
      } catch (e) {}
    } else {
      interviewService.getUserMemory().then((res) => {
        if (res?.memory) {
          if (res.memory.targetRole) setTargetRole(res.memory.targetRole);
          if (res.memory.targetCompany) setTargetCompany(res.memory.targetCompany);
        }
      }).catch(() => {});
    }

    const savedNotifs = localStorage.getItem("appNotifications");
    if (savedNotifs) {
      try {
        const parsed = JSON.parse(savedNotifs);
        setEmailNotifs(parsed.emailNotifs ?? true);
        setPracticeReminders(parsed.practiceReminders ?? true);
        setProductUpdates(parsed.productUpdates ?? false);
      } catch (e) {}
    }

    const savedLang = localStorage.getItem("appLanguage") || "en-US";
    setLanguage(savedLang);
  }, [navigate]);

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setPrefLoading(true);
    const prefs = { targetRole, targetCompany, experienceLevel, resumeText };
    localStorage.setItem("onboardingPreferences", JSON.stringify(prefs));
    localStorage.setItem("hasCompletedOnboarding", "true");

    try {
      await interviewService.updateUserMemory({
        targetRole,
        targetCompany,
        resumeText,
      });
    } catch (err) {}

    setPrefLoading(false);
    setPrefSavedMsg("Interview & role preferences saved successfully!");
    setTimeout(() => setPrefSavedMsg(null), 3000);
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    const settings = { emailNotifs, practiceReminders, productUpdates };
    localStorage.setItem("appNotifications", JSON.stringify(settings));
    setNotifSavedMsg("Notification preferences saved!");
    setTimeout(() => setNotifSavedMsg(null), 3000);
  };

  const handleSaveLanguage = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("appLanguage", language);
    setLangSavedMsg("Language preference saved!");
    setTimeout(() => setLangSavedMsg(null), 3000);
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (deleteConfirmText.toUpperCase() !== "DELETE") {
      setDeleteError("Please type DELETE to confirm account deletion.");
      return;
    }

    setDeleteLoading(true);
    setDeleteError(null);

    try {
      await authService.deleteAccount();
      navigate("/register");
    } catch (err: any) {
      setDeleteError(err.message || "Failed to delete account. Please try again.");
      setDeleteLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0b0f19] dark:text-slate-100 warm:bg-[#f5f0e6] warm:text-[#2c251e] flex font-sans transition-colors duration-300 eye-comfort-glow">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

      <main className="max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex-1 my-2 space-y-8">
        <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-amber-500/10 blur-3xl dark:bg-indigo-500/10 warm:bg-amber-600/15" />
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 warm:text-[#2c251e] tracking-tight">Account & Studio Settings</h1>
          <p className="text-slate-600 dark:text-slate-300 warm:text-[#736758] text-xs leading-6 mt-1">
            Customize target role preferences, visual theme, notification alerts, language, and security.
          </p>
        </div>

        {/* SECTION 1: INTERVIEW & ROLE PREFERENCES */}
        <section className="glass-card rounded-3xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 warm:border-[#e2d9c8] pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 warm:text-[#2c251e] flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-600 dark:text-indigo-400 warm:text-amber-700" /> Target Role & Interview Preferences
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 warm:text-[#736758] mt-0.5">
                Update the target job title, target company, and experience level used to tailor your mock interviews and Dashboard.
              </p>
            </div>
            {prefSavedMsg && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 warm:text-emerald-800 text-xs font-semibold rounded-xl animate-in fade-in">
                <Check className="w-3.5 h-3.5" /> {prefSavedMsg}
              </div>
            )}
          </div>

          <form onSubmit={handleSavePreferences} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Target Role */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 warm:text-[#2c251e] flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-amber-600 dark:text-indigo-400" /> Target Job Title / Role
                </label>
                <input
                  type="text"
                  required
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Full Stack Engineer"
                  className="w-full p-3 rounded-xl border border-slate-200/80 bg-white text-slate-900 text-xs font-medium outline-none focus:border-amber-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 warm:border-[#e2d9c8] warm:bg-[#fffdf9] warm:text-[#2c251e]"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {QUICK_ROLES.slice(0, 4).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setTargetRole(role)}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg border transition ${
                        targetRole === role
                          ? "bg-amber-500/20 border-amber-500/40 text-amber-700 dark:bg-indigo-500/20 dark:border-indigo-500/40 dark:text-indigo-300 warm:bg-amber-600/20 warm:border-amber-600/40 warm:text-amber-900 font-bold"
                          : "border-slate-200 bg-slate-100/50 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 warm:border-[#e2d9c8] warm:bg-[#eae3d2]/60 warm:text-[#736758]"
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Company */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 warm:text-[#2c251e] flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-amber-600 dark:text-indigo-400" /> Target Company
                </label>
                <input
                  type="text"
                  required
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  placeholder="e.g. Stripe, Google, Meta"
                  className="w-full p-3 rounded-xl border border-slate-200/80 bg-white text-slate-900 text-xs font-medium outline-none focus:border-amber-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 warm:border-[#e2d9c8] warm:bg-[#fffdf9] warm:text-[#2c251e]"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {QUICK_COMPANIES.slice(0, 4).map((company) => (
                    <button
                      key={company}
                      type="button"
                      onClick={() => setTargetCompany(company)}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg border transition ${
                        targetCompany === company
                          ? "bg-amber-500/20 border-amber-500/40 text-amber-700 dark:bg-indigo-500/20 dark:border-indigo-500/40 dark:text-indigo-300 warm:bg-amber-600/20 warm:border-amber-600/40 warm:text-amber-900 font-bold"
                          : "border-slate-200 bg-slate-100/50 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 warm:border-[#e2d9c8] warm:bg-[#eae3d2]/60 warm:text-[#736758]"
                      }`}
                    >
                      {company}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Experience Level & Bio Text */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 warm:text-[#2c251e] flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-600 dark:text-indigo-400" /> Experience Tier
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200/80 bg-white text-slate-900 text-xs font-medium outline-none focus:border-amber-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 warm:border-[#e2d9c8] warm:bg-[#fffdf9] warm:text-[#2c251e]"
                >
                  <option value="Entry-level (0-2 yrs)">Entry-level (0-2 yrs)</option>
                  <option value="Mid-level (2-5 yrs)">Mid-level (2-5 yrs)</option>
                  <option value="Senior (5-8 yrs)">Senior (5-8 yrs)</option>
                  <option value="Staff / Principal (8+ yrs)">Staff / Lead (8+ yrs)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 warm:text-[#2c251e] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-600 dark:text-indigo-400" /> Resume / Background Bio
                </label>
                <textarea
                  rows={2}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume highlights or tech stack summary..."
                  className="w-full p-3 rounded-xl border border-slate-200/80 bg-white text-slate-900 text-xs font-medium outline-none focus:border-amber-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 warm:border-[#e2d9c8] warm:bg-[#fffdf9] warm:text-[#2c251e] custom-scrollbar"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={prefLoading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-md shadow-slate-900/10 transition hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 warm:bg-[#d97706] warm:hover:bg-[#b45309]"
              >
                <Save className="w-3.5 h-3.5" />
                {prefLoading ? "Saving Preferences..." : "Save Candidate Preferences"}
              </button>
            </div>
          </form>
        </section>

        {/* SECTION 2: THEME CUSTOMIZATION */}
        <section className="glass-card rounded-3xl p-6 space-y-4">
          <div className="space-y-1 border-b border-slate-200/80 dark:border-slate-800 warm:border-[#e2d9c8] pb-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 warm:text-[#2c251e] flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-600 dark:text-indigo-400 warm:text-amber-700" /> Visual Theme Mode
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 warm:text-[#736758]">Choose visual theme preference for InterviewAI Pro.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <button
              type="button"
              onClick={() => handleThemeChange("dark")}
              className={`p-4 rounded-xl border flex items-center justify-between gap-3 transition ${
                theme === "dark"
                  ? "bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10"
                  : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-blue-400" />
                <div className="text-left">
                  <div className="font-semibold text-xs">Dark Mode</div>
                  <div className="text-[10px] text-zinc-400">Default dark aesthetic</div>
                </div>
              </div>
              {theme === "dark" && <Check className="w-4 h-4 text-blue-400" />}
            </button>

            <button
              type="button"
              onClick={() => handleThemeChange("light")}
              className={`p-4 rounded-xl border flex items-center justify-between gap-3 transition ${
                theme === "light"
                  ? "bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10"
                  : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <Sun className="w-5 h-5 text-amber-400" />
                <div className="text-left">
                  <div className="font-semibold text-xs">Light Mode</div>
                  <div className="text-[10px] text-zinc-400">High contrast bright theme</div>
                </div>
              </div>
              {theme === "light" && <Check className="w-4 h-4 text-blue-400" />}
            </button>

            <button
              type="button"
              onClick={() => handleThemeChange("system")}
              className={`p-4 rounded-xl border flex items-center justify-between gap-3 transition ${
                theme === "system"
                  ? "bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10"
                  : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <Laptop className="w-5 h-5 text-purple-400" />
                <div className="text-left">
                  <div className="font-semibold text-xs">System Theme</div>
                  <div className="text-[10px] text-zinc-400">Match device settings</div>
                </div>
              </div>
              {theme === "system" && <Check className="w-4 h-4 text-blue-400" />}
            </button>
          </div>
        </section>

        {/* SECTION 2: NOTIFICATIONS */}
        <section className="p-6 rounded-3xl border border-zinc-800 bg-[#111113] space-y-4 shadow-xl">
          <div className="space-y-1 border-b border-zinc-800 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-purple-400" /> Notification Preferences
            </h2>
            <p className="text-xs text-zinc-400">Manage email alerts and interview streak reminders.</p>
          </div>

          <form onSubmit={handleSaveNotifications} className="space-y-4 pt-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
              <div>
                <div className="font-semibold text-white">Email Interview Summaries</div>
                <div className="text-[11px] text-zinc-400">Receive copy of report after session completion.</div>
              </div>
              <input
                type="checkbox"
                checked={emailNotifs}
                onChange={(e) => setEmailNotifs(e.target.checked)}
                className="w-4 h-4 rounded bg-zinc-950 border-zinc-800 text-blue-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
              <div>
                <div className="font-semibold text-white">Daily Streak Reminders</div>
                <div className="text-[11px] text-zinc-400">Reminders to maintain daily interview practice streak.</div>
              </div>
              <input
                type="checkbox"
                checked={practiceReminders}
                onChange={(e) => setPracticeReminders(e.target.checked)}
                className="w-4 h-4 rounded bg-zinc-950 border-zinc-800 text-blue-600 cursor-pointer"
              />
            </div>

            {notifSavedMsg && (
              <div className="text-xs text-emerald-400 font-semibold">{notifSavedMsg}</div>
            )}

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md shadow-blue-600/20 transition"
            >
              Save Notification Preferences
            </button>
          </form>
        </section>

        {/* SECTION 3: LANGUAGE & LOCALE */}
        <section className="p-6 rounded-3xl border border-zinc-800 bg-[#111113] space-y-4 shadow-xl">
          <div className="space-y-1 border-b border-zinc-800 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" /> Language & Regional Settings
            </h2>
            <p className="text-xs text-zinc-400">Select language persona for AI interviewer voice synthesis.</p>
          </div>

          <form onSubmit={handleSaveLanguage} className="space-y-4 pt-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-medium outline-none focus:border-blue-500"
            >
              <option value="en-US">English (United States)</option>
              <option value="en-GB">English (United Kingdom)</option>
              <option value="en-IN">English (India)</option>
            </select>

            {langSavedMsg && <div className="text-xs text-emerald-400 font-semibold">{langSavedMsg}</div>}

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md shadow-blue-600/20 transition"
            >
              Save Language Settings
            </button>
          </form>
        </section>

        {/* SECTION 4: SECURITY & ACCOUNT DELETION */}
        <section className="p-6 rounded-3xl border border-red-500/30 bg-[#111113] space-y-4 shadow-xl">
          <div className="space-y-1 border-b border-zinc-800 pb-3">
            <h2 className="text-sm font-bold text-red-400 flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-400" /> Danger Zone: Account Deletion
            </h2>
            <p className="text-xs text-zinc-400">Permanently erase profile, interview history, and report logs.</p>
          </div>

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-400 font-bold px-5 py-2.5 rounded-xl text-xs transition flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> Permanently Delete Account
          </button>
        </section>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111113] border border-zinc-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-red-400 flex items-center gap-2">
              <Trash2 className="w-4 h-4" /> Confirm Account Deletion
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              This action is irreversible. All your interview transcripts, reports, and AI memory will be permanently removed.
            </p>

            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-300">
                  Type <span className="text-red-400 font-mono">DELETE</span> to confirm:
                </label>
                <input
                  type="text"
                  required
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs font-mono outline-none focus:border-red-500"
                />
              </div>

              {deleteError && <div className="text-xs text-red-400 font-medium">{deleteError}</div>}

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={deleteLoading}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/30"
                >
                  {deleteLoading ? "Deleting..." : "Delete Permanently"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </main>
      </div>
    </div>
  );
}

export default Settings;
