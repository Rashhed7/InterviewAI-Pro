import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Moon, Sun, Laptop, Bell, Globe, Shield, Trash2, Check } from "lucide-react";
import { authService, type UserProfile } from "../services/authService";
import { useTheme } from "../context/ThemeContext";
import Navbar from "../components/Navbar";

function Settings() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const { theme, setTheme: handleThemeChange } = useTheme();

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
    <div className="min-h-screen bg-[#09090B] text-zinc-100 flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <main className="max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex-1 my-2 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Account & Studio Settings</h1>
          <p className="text-zinc-400 text-xs mt-1">
            Customize visual theme, notification alerts, language preferences, and security settings.
          </p>
        </div>

        {/* SECTION 1: THEME CUSTOMIZATION */}
        <section className="p-6 rounded-3xl border border-zinc-800 bg-[#111113] space-y-4 shadow-xl">
          <div className="space-y-1 border-b border-zinc-800 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sun className="w-4 h-4 text-blue-400" /> Visual Theme Mode
            </h2>
            <p className="text-xs text-zinc-400">Choose visual theme preference for InterviewAI Pro.</p>
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
      </main>

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
    </div>
  );
}

export default Settings;
