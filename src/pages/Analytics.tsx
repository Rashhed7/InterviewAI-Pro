import { useState, useEffect } from "react";
import { BarChart3, CheckCircle2, TrendingUp, Sparkles } from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { interviewService, type InterviewSessionData } from "../services/interviewService";

function Analytics() {
  const [history, setHistory] = useState<InterviewSessionData[]>([]);

  useEffect(() => {
    interviewService.getHistory().then((res) => {
      if (res.history) {
        setHistory(res.history);
      }
    });
  }, []);

  const totalSessions = history.length;
  const avgScore = totalSessions > 0
    ? Math.round(history.reduce((acc, curr) => acc + curr.score, 0) / totalSessions)
    : 78;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0b0f19] dark:text-slate-100 warm:bg-[#f5f0e6] warm:text-[#2c251e] flex font-sans transition-colors duration-300 eye-comfort-glow">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

      <main className="max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex-1 my-2 space-y-6">
        <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-amber-500/10 blur-3xl dark:bg-indigo-500/10 warm:bg-amber-600/15" />
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:bg-indigo-500/20 dark:border-indigo-500/30 dark:text-indigo-400 warm:bg-amber-600/20 warm:border-amber-600/30 warm:text-amber-800 text-xs font-bold mb-2">
            <BarChart3 className="w-3.5 h-3.5" /> Performance & Mastery Intelligence
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 warm:text-[#2c251e] tracking-tight">Performance Analytics & Insights</h1>
          <p className="text-slate-600 dark:text-slate-300 warm:text-[#736758] text-xs mt-1 leading-6">
            Track your preparation progress, technical score trends, and skill masteries over time.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card rounded-2xl p-5 space-y-1">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 warm:text-[#736758] font-bold uppercase tracking-wider">Total Sessions</span>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 warm:text-[#2c251e] font-mono mt-1">{totalSessions}</div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 warm:text-emerald-800 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Active Candidate
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 space-y-1">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 warm:text-[#736758] font-bold uppercase tracking-wider">Average Score</span>
            <div className="text-3xl font-bold text-amber-600 dark:text-indigo-400 warm:text-amber-700 font-mono mt-1">{avgScore}%</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 warm:text-[#736758]">Target benchmark: 80%+</p>
          </div>

          <div className="glass-card rounded-2xl p-5 space-y-1">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 warm:text-[#736758] font-bold uppercase tracking-wider">Readiness Level</span>
            <div className="text-2xl font-bold text-amber-600 dark:text-indigo-400 warm:text-amber-700 mt-1 flex items-center gap-1.5">
              <TrendingUp className="w-5 h-5" />
              {avgScore >= 80 ? "Interview Ready" : "Intermediate Tier"}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 warm:text-[#736758]">Based on recent sessions</p>
          </div>
        </div>

        <div className="bg-[#111113] border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" /> Technical Skill Breakdown
          </h3>
          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between text-zinc-300 font-medium mb-1.5">
                <span>React & Frontend Engineering</span>
                <span className="font-mono">88%</span>
              </div>
              <div className="w-full bg-zinc-900 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full w-[88%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-zinc-300 font-medium mb-1.5">
                <span>Node.js & Backend Architecture</span>
                <span className="font-mono">82%</span>
              </div>
              <div className="w-full bg-zinc-900 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full w-[82%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-zinc-300 font-medium mb-1.5">
                <span>Data Structures & Algorithms</span>
                <span className="font-mono">74%</span>
              </div>
              <div className="w-full bg-zinc-900 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full w-[74%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-zinc-300 font-medium mb-1.5">
                <span>System Design & Cloud Scaling</span>
                <span className="font-mono">68%</span>
              </div>
              <div className="w-full bg-zinc-900 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full w-[68%]" />
              </div>
            </div>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}

export default Analytics;
