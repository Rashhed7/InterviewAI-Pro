import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { interviewService, type InterviewSessionData } from "../services/interviewService";

function InterviewHistory() {
  const [history, setHistory] = useState<InterviewSessionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    interviewService.getHistory().then((res) => {
      if (res.history) {
        setHistory(res.history);
      }
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0b0f19] dark:text-slate-100 warm:bg-[#f5f0e6] warm:text-[#2c251e] flex font-sans transition-colors duration-300 eye-comfort-glow">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

      <main className="max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex-1 my-2 space-y-6">
        <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-amber-500/10 blur-3xl dark:bg-indigo-500/10 warm:bg-amber-600/15" />
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 warm:text-[#2c251e]">Interview Practice History 📚</h1>
          <p className="text-slate-600 dark:text-slate-300 warm:text-[#736758] text-xs leading-6 mt-1">
            Review all completed AI mock interview sessions, scores, and feedback logs.
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400 warm:text-[#736758]">Loading interview records...</div>
        ) : history.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center space-y-4">
            <div className="text-4xl">🎙️</div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 warm:text-[#2c251e]">No Mock Interviews Completed Yet</h2>
            <p className="text-slate-600 dark:text-slate-300 warm:text-[#736758] text-xs max-w-sm mx-auto">
              Launch an AI Mock Interview session to test your knowledge and record your scores.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((session) => (
              <div
                key={session.id}
                className="glass-card rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:-translate-y-0.5"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 warm:text-[#2c251e] text-base">{session.title}</h3>
                    <span className="text-[10px] bg-amber-500/10 text-amber-600 border border-amber-500/30 dark:bg-indigo-500/20 dark:text-indigo-400 warm:bg-amber-600/20 warm:text-amber-800 px-2.5 py-0.5 rounded font-bold">
                      {session.difficulty}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 warm:text-[#736758] leading-relaxed">{session.feedback}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 warm:text-[#736758] pt-1">
                    Completed on {new Date(session.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-center px-4 py-2 bg-slate-100 dark:bg-slate-900 warm:bg-[#eae3d2] rounded-xl border border-slate-200/80 dark:border-slate-800 warm:border-[#e2d9c8]">
                    <span className="block text-[10px] text-slate-500 dark:text-slate-400 warm:text-[#736758] uppercase font-bold">Score</span>
                    <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 warm:text-emerald-700">{session.score}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      </div>
    </div>
  );
}

export default InterviewHistory;
