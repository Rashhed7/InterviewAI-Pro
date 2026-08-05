import { useState, useEffect } from "react";
import { BarChart3, CheckCircle2, TrendingUp, Sparkles } from "lucide-react";
import Navbar from "../components/Navbar";
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
    <div className="min-h-screen bg-[#09090B] text-zinc-100 flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <main className="max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex-1 my-2 space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5" /> Performance & Mastery Intelligence
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Performance Analytics & Insights</h1>
          <p className="text-zinc-400 text-xs mt-1">
            Track your preparation progress, technical score trends, and skill masteries over time.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#111113] border border-zinc-800 rounded-2xl p-5 shadow-xl space-y-1">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Total Sessions</span>
            <div className="text-3xl font-extrabold text-white font-mono mt-1">{totalSessions}</div>
            <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Active Candidate
            </p>
          </div>

          <div className="bg-[#111113] border border-zinc-800 rounded-2xl p-5 shadow-xl space-y-1">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Average Score</span>
            <div className="text-3xl font-extrabold text-blue-400 font-mono mt-1">{avgScore}%</div>
            <p className="text-[11px] text-zinc-500">Target benchmark: 80%+</p>
          </div>

          <div className="bg-[#111113] border border-zinc-800 rounded-2xl p-5 shadow-xl space-y-1">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Readiness Level</span>
            <div className="text-2xl font-extrabold text-indigo-400 mt-1 flex items-center gap-1.5">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              {avgScore >= 80 ? "Interview Ready" : "Intermediate Tier"}
            </div>
            <p className="text-[11px] text-zinc-500">Based on recent sessions</p>
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
  );
}

export default Analytics;
