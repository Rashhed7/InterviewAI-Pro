import { useState } from "react";
import { Download, FileText } from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";

export default function AdminReports() {
  const [reportType, setReportType] = useState("REVENUE");
  const [timeframe, setTimeframe] = useState("MONTHLY");

  const handleExport = (format: "CSV" | "PDF") => {
    alert(`Exporting ${reportType} report (${timeframe}) as ${format}...`);
  };

  return (
    <AdminLayout title="Reports & Data Export Studio">
      <div className="space-y-6">
        <div className="glass-card p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Generate Custom Report</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-extrabold text-slate-500 uppercase tracking-wider block mb-1.5">Select Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-bold"
              >
                <option value="REVENUE">Revenue & Financial Transactions</option>
                <option value="USERS">User Registrations & Growth</option>
                <option value="AI_USAGE">AI Compute & Token Expenses</option>
                <option value="SUBSCRIPTIONS">Subscription Upgrades & Churn</option>
                <option value="INTERVIEWS">AI Mock Interview Telemetry</option>
              </select>
            </div>

            <div>
              <label className="font-extrabold text-slate-500 uppercase tracking-wider block mb-1.5">Timeframe Interval</label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-bold"
              >
                <option value="DAILY">Daily (Last 24 Hours)</option>
                <option value="WEEKLY">Weekly (Last 7 Days)</option>
                <option value="MONTHLY">Monthly (Current Month)</option>
                <option value="YEARLY">Yearly (YTD 2026)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleExport("CSV")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg transition"
            >
              <Download className="w-4 h-4" /> Download CSV Spreadsheet
            </button>
            <button
              type="button"
              onClick={() => handleExport("PDF")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg transition"
            >
              <FileText className="w-4 h-4" /> Download Formatted PDF Report
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
