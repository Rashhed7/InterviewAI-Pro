import { AdminLayout } from "../../components/admin/AdminLayout";

export default function AdminAnalytics() {
  return (
    <AdminLayout title="Enterprise Telemetry & Conversion Analytics">
      <div className="space-y-6">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">DAU / MAU Ratio</span>
            <p className="text-2xl font-black text-slate-900 dark:text-slate-100">77.1%</p>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">+4.2% engagement growth</span>
          </div>

          <div className="glass-card p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">Paid Conversion Rate</span>
            <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">18.4%</p>
            <span className="text-[11px] text-slate-500">Free to Pro / Premium Upgrades</span>
          </div>

          <div className="glass-card p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">Gross Margin</span>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">92.4%</p>
            <span className="text-[11px] text-slate-500">Revenue after API compute costs</span>
          </div>

          <div className="glass-card p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">Monthly Churn Rate</span>
            <p className="text-2xl font-black text-amber-500">1.2%</p>
            <span className="text-[11px] text-slate-500">Industry leading retention</span>
          </div>
        </div>

        {/* Telemetry Charts Mock Visualizers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">User Growth & Retention Trend</h3>
            <div className="h-48 flex items-end justify-between gap-2 pt-8 px-2 border-b border-slate-200 dark:border-slate-800">
              {[45, 62, 78, 90, 110, 145, 180, 220, 260, 310, 380, 450].map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-indigo-600 rounded-t-lg transition-all" style={{ height: `${val / 4.5}%` }} />
                  <span className="text-[9px] font-mono text-slate-400">{idx + 1}M</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Monthly Recurring Revenue (MRR)</h3>
            <div className="h-48 flex items-end justify-between gap-2 pt-8 px-2 border-b border-slate-200 dark:border-slate-800">
              {[12, 18, 25, 34, 48, 65, 82, 110, 140, 190, 240, 310].map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-emerald-500 rounded-t-lg transition-all" style={{ height: `${val / 3.1}%` }} />
                  <span className="text-[9px] font-mono text-slate-400">{idx + 1}M</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
