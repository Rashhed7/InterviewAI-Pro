import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Cpu,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Receipt,
} from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { adminService, type AdminDashboardMetrics, type ActivityLogItem, type AdminPayment } from "../../services/adminService";

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminDashboardMetrics | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>([]);
  const [recentPayments, setRecentPayments] = useState<AdminPayment[]>([]);

  useEffect(() => {
    adminService.getDashboardStats().then((res) => {
      if (res.success) {
        setStats(res.stats);
        setActivityLogs(res.latestActivity || []);
        setRecentPayments(res.recentPayments || []);
      }
    });
  }, []);

  return (
    <AdminLayout title="System Overview & Analytics">
      <div className="space-y-6">
        {/* Top Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-slate-900 text-white dark:bg-slate-900 border border-slate-800 shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" /> Enterprise SaaS Control Plane
            </div>
            <h2 className="text-2xl font-black tracking-tight">System Status: {stats?.systemHealth || "OPTIMAL"}</h2>
            <p className="text-xs text-slate-400 mt-1">
              Real-time telemetry across authentication, subscription tiers, AI compute pipelines, and revenue streams.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/admin/users"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition"
            >
              Manage Users
            </Link>
            <Link
              to="/admin/analytics"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition"
            >
              Full Telemetry
            </Link>
          </div>
        </div>

        {/* Primary Metric Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Revenue */}
          <div className="glass-card p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Monthly Revenue
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <Receipt className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              ₹{stats ? stats.monthlyRevenue.toLocaleString() : "0"}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> +18.4%
              </span>
              <span>vs last month</span>
            </div>
          </div>

          {/* Card 2: Total Users */}
          <div className="glass-card p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Total Registered Users
              </span>
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              {stats ? stats.totalUsers.toLocaleString() : "0"}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                +{stats?.newUsersToday || 0} today
              </span>
              <span>• {stats?.activeUsers || 0} active</span>
            </div>
          </div>

          {/* Card 3: AI Computes Today */}
          <div className="glass-card p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                AI Sessions Today
              </span>
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                <Cpu className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              {stats ? (stats.todaysInterviews + stats.todaysResumeAnalyses + stats.todaysCodingChallenges).toLocaleString() : "0"}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
              <span>{stats?.todaysInterviews || 0} Interviews • {stats?.todaysResumeAnalyses || 0} Resumes</span>
            </div>
          </div>

          {/* Card 4: API Costs */}
          <div className="glass-card p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                API Tokens / Cost
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              ${stats ? stats.apiCostToday.toFixed(2) : "0.00"}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
              <span>{stats ? (stats.totalAiTokensUsed / 1000000).toFixed(2) : "0"}M Tokens used today</span>
            </div>
          </div>
        </div>

        {/* Plan Breakdown & Performance Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Subscription Tiers Distribution */}
          <div className="glass-card p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              User Tiers Breakdown
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700 dark:text-slate-300">Free Tier Users</span>
                  <span className="text-slate-900 dark:text-slate-100">{stats?.freeUsers || 0}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-slate-500 rounded-full" style={{ width: `${(stats?.freeUsers || 1) / (stats?.totalUsers || 1) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700 dark:text-slate-300">Pro Tier Users</span>
                  <span className="text-indigo-600 dark:text-indigo-400">{stats?.proUsers || 0}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${(stats?.proUsers || 1) / (stats?.totalUsers || 1) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700 dark:text-slate-300">Premium Tier Users</span>
                  <span className="text-amber-600 dark:text-amber-400">{stats?.premiumUsers || 0}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(stats?.premiumUsers || 1) / (stats?.totalUsers || 1) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Average Evaluation Scores */}
          <div className="glass-card p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Platform Benchmark Scores
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Interview</span>
                <span className="text-xl font-black text-slate-900 dark:text-slate-100">{stats?.averageInterviewScore || 0}%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Resume</span>
                <span className="text-xl font-black text-slate-900 dark:text-slate-100">{stats?.averageResumeScore || 0}%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Coding</span>
                <span className="text-xl font-black text-slate-900 dark:text-slate-100">{stats?.averageCodingScore || 0}%</span>
              </div>
            </div>
          </div>

          {/* System Storage & Health */}
          <div className="glass-card p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Infrastructure Telemetry
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 font-medium">Database Node</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">ONLINE</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 font-medium">Gemini AI Endpoint</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">142ms Latency</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 font-medium">Storage Allocation</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{stats?.storageUsedMb || 0} MB / 10 GB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tables & Audit Log Feeds */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Payments Table */}
          <div className="glass-card p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Recent Transactions
              </h3>
              <Link to="/admin/payments" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                View All →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-extrabold">
                    <th className="py-2">User</th>
                    <th className="py-2">Plan</th>
                    <th className="py-2">Amount</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {recentPayments.map((pay) => (
                    <tr key={pay.id}>
                      <td className="py-2.5 font-bold text-slate-900 dark:text-slate-100">{pay.userName}</td>
                      <td className="py-2.5">{pay.plan}</td>
                      <td className="py-2.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">₹{pay.amount}</td>
                      <td className="py-2.5">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          {pay.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Admin Audit Trail */}
          <div className="glass-card p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Audit Trail & Activity Log
              </h3>
              <Link to="/admin/logs" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                View All →
              </Link>
            </div>

            <div className="space-y-3 text-xs">
              {activityLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-indigo-600 dark:text-indigo-400">{log.action}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-[11px]">{log.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
