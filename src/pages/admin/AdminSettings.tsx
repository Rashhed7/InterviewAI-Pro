import { useState } from "react";
import { Save, CheckCircle2 } from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";

export default function AdminSettings() {
  const [appName, setAppName] = useState("InterviewAI Pro");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState("AIzaSy*********************");
  const [razorpayKeyId, setRazorpayKeyId] = useState("rzp_live_****************");
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <AdminLayout title="System Configurations & Integration Keys">
      <div className="space-y-6 max-w-4xl">
        {savedToast && (
          <div className="p-4 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xl animate-in fade-in flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> System settings and API keys updated successfully.
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: General Platform Settings */}
          <div className="glass-card p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">General Application Settings</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-500 block mb-1">Platform Application Name</label>
                <input
                  type="text"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-slate-100 font-bold"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-slate-100 block">Maintenance Mode</span>
                    <span className="text-[11px] text-slate-500">Temporarily restrict platform access for system upgrades.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={maintenanceMode}
                    onChange={(e) => setMaintenanceMode(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Section 2: AI & LLM Key Config */}
          <div className="glass-card p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Google Gemini AI Engine Credentials</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-500 block mb-1">Gemini API Key</label>
                <input
                  type="password"
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-slate-100 font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Payment Gateway Config */}
          <div className="glass-card p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Razorpay Payment Gateway Credentials</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-500 block mb-1">Razorpay Key ID</label>
                <input
                  type="text"
                  value={razorpayKeyId}
                  onChange={(e) => setRazorpayKeyId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-slate-100 font-mono font-bold"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xl transition"
            >
              <Save className="w-4 h-4" /> Save System Settings
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
