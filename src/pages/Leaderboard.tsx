import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { interviewService, type LeaderboardUser } from "../services/interviewService";

function Leaderboard() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    interviewService.getLeaderboard().then((res) => {
      if (res.leaderboard) {
        setUsers(res.leaderboard);
      }
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="max-w-5xl w-full mx-auto p-6 flex-1 my-4 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Global Candidate Leaderboard 🏆</h1>
          <p className="text-gray-400 text-sm mt-1">
            Top candidates ranked by mock interview performance scores, practice sessions, and coding challenges.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
          {loading ? (
            <div className="p-8 text-center text-gray-400 text-xs">Loading candidate standings...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead>
                  <tr className="border-b border-slate-800 text-gray-400 uppercase font-semibold">
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4">Candidate</th>
                    <th className="py-3 px-4">Avg Score</th>
                    <th className="py-3 px-4">Interviews</th>
                    <th className="py-3 px-4">Problems</th>
                    <th className="py-3 px-4 text-right">Total XP</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, idx) => (
                    <tr key={u.id} className="border-b border-slate-800/60 hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 font-bold text-white">
                        {idx === 0 ? "🥇 #1" : idx === 1 ? "🥈 #2" : idx === 2 ? "🥉 #3" : `#${idx + 1}`}
                      </td>
                      <td className="py-3 px-4 font-medium text-white flex items-center gap-2">
                        {u.avatar ? (
                          <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center uppercase">
                            {u.name.charAt(0)}
                          </div>
                        )}
                        <span>{u.name}</span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-emerald-400">{u.avgScore}%</td>
                      <td className="py-3 px-4">{u.totalInterviews}</td>
                      <td className="py-3 px-4">{u.problemsSolved}</td>
                      <td className="py-3 px-4 font-bold text-blue-400 text-right">{u.xp} XP</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Leaderboard;
