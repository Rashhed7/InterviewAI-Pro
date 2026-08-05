import { useState, useEffect } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { adminService } from "../../services/adminService";

export default function AdminAIUsage() {
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    adminService.getAIUsageStats().then((res) => {
      if (res.success) setMetrics(res.aiMetrics);
    });
  }, []);

  return (
    <AdminLayout title="AI Compute & Token Cost Telemetry">
      <div className="space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">Total AI Tokens</span>
            <p className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {metrics ? (metrics.totalTokens / 1000000).toFixed(2) : "0"}M
            </p>
            <span className="text-[11px] text-slate-500">Gemini 1.5 Flash Token Pipeline</span>
          </div>

          <div className="glass-card p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">API Cost Today</span>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              ${metrics?.estimatedCostUsd || "0.00"}
            </p>
            <span className="text-[11px] text-slate-500">Estimated LLM Infrastructure Expense</span>
          </div>

          <div className="glass-card p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">Average Latency</span>
            <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
              {metrics?.averageResponseTimeMs || 0} ms
            </p>
            <span className="text-[11px] text-slate-500">End-to-End LLM Generation Speed</span>
          </div>

          <div className="glass-card p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">Average Score</span>
            <p className="text-2xl font-black text-amber-500">
              {metrics?.averageSessionScore || 0}%
            </p>
            <span className="text-[11px] text-slate-500">Global Candidate Pass Score</span>
          </div>
        </div>

        {/* Breakdown by Feature */}
        <div className="glass-card p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Usage Breakdown by Feature Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="font-bold text-slate-700 dark:text-slate-300 block">AI Interviews</span>
              <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">{metrics?.interviewsCount || 0} Sessions</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="font-bold text-slate-700 dark:text-slate-300 block">Resume Analyses</span>
              <p className="text-xl font-black text-purple-600 dark:text-purple-400">{metrics?.resumeScansCount || 0} Scans</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="font-bold text-slate-700 dark:text-slate-300 block">Coding Challenges</span>
              <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">{metrics?.codingSubmissionsCount || 0} Evaluated</p>
            </div>
          </div>
        </div>

        {/* Top AI Power Users Table */}
        <div className="glass-card p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Top AI Consumers (Highest Token Consumption)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-extrabold">
                  <th className="py-2">User</th>
                  <th className="py-2">Sessions</th>
                  <th className="py-2">Tokens Used</th>
                  <th className="py-2">Est. Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {metrics?.topAiUsers?.map((u: any) => (
                  <tr key={u.id}>
                    <td className="py-2.5 font-bold text-slate-900 dark:text-slate-100">{u.name} ({u.email})</td>
                    <td className="py-2.5">{u.interviews}</td>
                    <td className="py-2.5 font-mono font-bold text-purple-600 dark:text-purple-400">{(u.tokensUsed / 1000).toFixed(0)}k</td>
                    <td className="py-2.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">${u.estimatedCost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
