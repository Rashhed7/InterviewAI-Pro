import { useState } from "react";
import { Save, CheckCircle2 } from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";

export default function AdminFeatureLimits() {
  const [limits, setLimits] = useState<any>({
    FREE: { interviewLimit: 3, resumeLimit: 3, codingLimit: 5, voiceEnabled: false, cameraEnabled: false, pdfExportEnabled: false },
    PRO: { interviewLimit: -1, resumeLimit: -1, codingLimit: -1, voiceEnabled: true, cameraEnabled: true, pdfExportEnabled: true },
    PREMIUM: { interviewLimit: -1, resumeLimit: -1, codingLimit: -1, voiceEnabled: true, cameraEnabled: true, pdfExportEnabled: true },
  });
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <AdminLayout title="Dynamic Plan Limits & Feature Toggles">
      <div className="space-y-6">
        {savedToast && (
          <div className="p-4 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xl animate-in fade-in flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Feature limits and access flags updated live platform-wide.
          </div>
        )}

        <p className="text-xs text-slate-500">
          Configure daily usage quotas and feature access gates for each subscription tier without redeploying code. (-1 denotes Unlimited).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(["FREE", "PRO", "PREMIUM"] as const).map((plan) => (
            <div key={plan} className="glass-card p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-black tracking-tight uppercase text-slate-900 dark:text-slate-100">{plan} Tier</h3>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase">Configured</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Daily Interview Limit</label>
                  <input
                    type="number"
                    value={limits[plan].interviewLimit}
                    onChange={(e) =>
                      setLimits((prev: any) => ({
                        ...prev,
                        [plan]: { ...prev[plan], interviewLimit: Number(e.target.value) },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-slate-100 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-500 block mb-1">Daily Resume Analysis Limit</label>
                  <input
                    type="number"
                    value={limits[plan].resumeLimit}
                    onChange={(e) =>
                      setLimits((prev: any) => ({
                        ...prev,
                        [plan]: { ...prev[plan], resumeLimit: Number(e.target.value) },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-slate-100 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-500 block mb-1">Daily Coding Practice Limit</label>
                  <input
                    type="number"
                    value={limits[plan].codingLimit}
                    onChange={(e) =>
                      setLimits((prev: any) => ({
                        ...prev,
                        [plan]: { ...prev[plan], codingLimit: Number(e.target.value) },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-slate-100 font-mono font-bold"
                  />
                </div>

                <div className="pt-2 space-y-2 border-t border-slate-100 dark:border-slate-800">
                  <label className="flex items-center justify-between cursor-pointer font-bold text-slate-700 dark:text-slate-300">
                    <span>Voice Interview Mode</span>
                    <input
                      type="checkbox"
                      checked={limits[plan].voiceEnabled}
                      onChange={(e) =>
                        setLimits((prev: any) => ({
                          ...prev,
                          [plan]: { ...prev[plan], voiceEnabled: e.target.checked },
                        }))
                      }
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer font-bold text-slate-700 dark:text-slate-300">
                    <span>Camera Studio Mode</span>
                    <input
                      type="checkbox"
                      checked={limits[plan].cameraEnabled}
                      onChange={(e) =>
                        setLimits((prev: any) => ({
                          ...prev,
                          [plan]: { ...prev[plan], cameraEnabled: e.target.checked },
                        }))
                      }
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer font-bold text-slate-700 dark:text-slate-300">
                    <span>Export PDF Reports</span>
                    <input
                      type="checkbox"
                      checked={limits[plan].pdfExportEnabled}
                      onChange={(e) =>
                        setLimits((prev: any) => ({
                          ...prev,
                          [plan]: { ...prev[plan], pdfExportEnabled: e.target.checked },
                        }))
                      }
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xl transition"
          >
            <Save className="w-4 h-4" /> Save Feature Limits
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
