import { useState } from "react";
import {
  BarChart3,
  Star,
  Map,
  ShieldCheck,
  CheckCircle2,
  Target,
  Trophy,
  RotateCcw,
  History,
} from "lucide-react";
import type { FinalReportResponse } from "../../services/interviewService";

interface InterviewReportViewProps {
  report: FinalReportResponse;
  roleTitle: string;
  onRestart: () => void;
  onViewHistory: () => void;
}

export function InterviewReportView({ report, roleTitle, onRestart, onViewHistory }: InterviewReportViewProps) {
  const [activeTab, setActiveTab] = useState<"summary" | "star" | "roadmap" | "proctoring">("summary");
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);

  const getHiringBadgeClass = (rec: string) => {
    switch (rec) {
      case "Strong Hire":
      case "Hire":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-emerald-500/10";
      case "Maybe":
        return "bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-amber-500/10";
      default:
        return "bg-red-500/20 text-red-400 border-red-500/40 shadow-red-500/10";
    }
  };

  const selectedQuestion = report.perQuestionAnalysis && report.perQuestionAnalysis[selectedQuestionIndex];

  return (
    <div className="bg-[#111113] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Top Header & Hiring Recommendation */}
      <div className="text-center space-y-3 border-b border-zinc-800 pb-6">
        <div className="inline-flex items-center gap-2">
          <span className={`px-5 py-1.5 rounded-full text-xs font-extrabold border uppercase tracking-wider shadow-lg ${getHiringBadgeClass(report.hiringRecommendation)}`}>
            Hiring Recommendation: {report.hiringRecommendation}
          </span>
        </div>

        <div className="flex justify-center items-center gap-6 pt-2">
          <div className={`w-28 h-28 border-4 rounded-full flex flex-col items-center justify-center text-3xl font-black shadow-inner ${
            report.overallScore >= 80
              ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
              : report.overallScore >= 60
              ? "bg-amber-500/10 border-amber-500 text-amber-400"
              : "bg-red-500/10 border-red-500 text-red-400"
          }`}>
            <span>{report.overallScore}%</span>
            <span className="text-[10px] text-zinc-400 font-sans font-bold uppercase tracking-wider">Overall Score</span>
          </div>
        </div>

        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          Executive AI Evaluation Report
        </h2>
        <p className="text-zinc-400 text-xs max-w-md mx-auto">
          Comprehensive candidate evaluation for <span className="text-blue-400 font-semibold">{roleTitle}</span>.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 bg-zinc-950 p-1.5 rounded-2xl border border-zinc-800 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("summary")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTab === "summary" ? "bg-blue-600 text-white shadow-md shadow-blue-600/30" : "text-zinc-400 hover:text-white"
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" /> Score Metrics & Summary
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("star")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTab === "star" ? "bg-purple-600 text-white shadow-md shadow-purple-600/30" : "text-zinc-400 hover:text-white"
          }`}
        >
          <Star className="w-3.5 h-3.5" /> Per-Question STAR Breakdown ({report.perQuestionAnalysis ? report.perQuestionAnalysis.length : 0})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("roadmap")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTab === "roadmap" ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30" : "text-zinc-400 hover:text-white"
          }`}
        >
          <Map className="w-3.5 h-3.5" /> Learning Roadmap ({report.learningRoadmap ? report.learningRoadmap.length : 0})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("proctoring")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTab === "proctoring" ? "bg-amber-600 text-white shadow-md shadow-amber-600/30" : "text-zinc-400 hover:text-white"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" /> Integrity Audit ({report.antiCheatSummary?.totalWarnings || 0})
        </button>
      </div>

      {/* TAB 1: SUMMARY */}
      {activeTab === "summary" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-center space-y-1">
              <span className="text-[10px] text-zinc-400 font-bold uppercase">Technical Depth</span>
              <div className="text-2xl font-extrabold text-blue-400 font-mono">{report.technicalKnowledge}%</div>
            </div>

            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-center space-y-1">
              <span className="text-[10px] text-zinc-400 font-bold uppercase">Communication</span>
              <div className="text-2xl font-extrabold text-emerald-400 font-mono">{report.communication}%</div>
            </div>

            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-center space-y-1">
              <span className="text-[10px] text-zinc-400 font-bold uppercase">Problem Solving</span>
              <div className="text-2xl font-extrabold text-purple-400 font-mono">{report.problemSolving}%</div>
            </div>

            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-center space-y-1">
              <span className="text-[10px] text-zinc-400 font-bold uppercase">Confidence</span>
              <div className="text-2xl font-extrabold text-indigo-400 font-mono">{report.confidenceScore}%</div>
            </div>
          </div>

          <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider">Executive Interview Summary</h3>
            <p className="text-xs text-zinc-300 leading-relaxed">{report.interviewSummary}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-zinc-950 border border-emerald-500/30 rounded-2xl space-y-2">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Key Strengths
              </h4>
              <ul className="space-y-1 text-xs text-zinc-300">
                {report.strengths.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span> {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-zinc-950 border border-amber-500/30 rounded-2xl space-y-2">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" /> Areas for Growth
              </h4>
              <ul className="space-y-1 text-xs text-zinc-300">
                {report.weaknesses.map((w, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">!</span> {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PER-QUESTION STAR BREAKDOWN */}
      {activeTab === "star" && report.perQuestionAnalysis && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex gap-2 overflow-x-auto pb-2 border-b border-zinc-800">
            {report.perQuestionAnalysis.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedQuestionIndex(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                  selectedQuestionIndex === idx
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                    : "bg-zinc-950 text-zinc-400 border border-zinc-800 hover:border-zinc-700"
                }`}
              >
                Question #{idx + 1}
              </button>
            ))}
          </div>

          {selectedQuestion && (
            <div className="space-y-5">
              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Interviewer Question #{selectedQuestion.questionNumber}</span>
                <p className="text-sm font-bold text-white leading-relaxed">{selectedQuestion.questionText}</p>
              </div>

              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Candidate Spoken Answer</span>
                <p className="text-xs text-zinc-300 leading-relaxed font-mono">"{selectedQuestion.candidateAnswer}"</p>
              </div>

              {/* Ideal STAR Answer */}
              {(selectedQuestion.idealSTARAnswer || (selectedQuestion as any).idealFAANGAnswer) && (
                <div className="p-5 bg-zinc-950 border border-purple-500/30 rounded-2xl space-y-3">
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-purple-400" /> Ideal Gold-Standard STAR Method Response
                  </span>

                  {(() => {
                    const starObj = selectedQuestion.idealSTARAnswer || (selectedQuestion as any).idealFAANGAnswer;
                    return (
                      <>
                        {starObj.starMethod && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {starObj.starMethod.situation && (
                              <div className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800">
                                <span className="font-bold text-blue-400 block text-[10px]">S - Situation:</span>
                                <span className="text-zinc-300 text-[11px]">{starObj.starMethod.situation}</span>
                              </div>
                            )}
                            {starObj.starMethod.task && (
                              <div className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800">
                                <span className="font-bold text-purple-400 block text-[10px]">T - Task:</span>
                                <span className="text-zinc-300 text-[11px]">{starObj.starMethod.task}</span>
                              </div>
                            )}
                            {starObj.starMethod.action && (
                              <div className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800">
                                <span className="font-bold text-amber-400 block text-[10px]">A - Action:</span>
                                <span className="text-zinc-300 text-[11px]">{starObj.starMethod.action}</span>
                              </div>
                            )}
                            {starObj.starMethod.result && (
                              <div className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800">
                                <span className="font-bold text-emerald-400 block text-[10px]">R - Result:</span>
                                <span className="text-zinc-300 text-[11px]">{starObj.starMethod.result}</span>
                              </div>
                            )}
                          </div>
                        )}

                        <p className="text-xs text-purple-100 leading-relaxed font-sans">{starObj.fullAnswerText}</p>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* Rewritten Winning Answer */}
              {selectedQuestion.rewrittenWinningAnswer && (
                <div className="p-5 bg-emerald-950/30 border border-emerald-500/40 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-emerald-400" /> Winning Answer Rewrite (High-Impact Version)
                  </span>
                  <p className="text-xs text-emerald-100 font-semibold leading-relaxed">
                    "{selectedQuestion.rewrittenWinningAnswer}"
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: LEARNING ROADMAP */}
      {activeTab === "roadmap" && report.learningRoadmap && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Map className="w-4 h-4 text-emerald-400" /> Targeted Skill Improvement Plan
            </h3>
            <p className="text-xs text-zinc-400">Step-by-step roadmap based on topics missed in your session.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {report.learningRoadmap.map((item, idx) => (
              <div key={idx} className="p-5 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{item.topic}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                    item.priority === "High" ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  }`}>
                    {item.priority} Priority
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-zinc-300">
                  <div>
                    <span className="text-[10px] text-zinc-500 block font-bold uppercase">Daily Practice Task:</span>
                    <p className="text-xs text-zinc-200">{item.dailyPracticeTask}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block font-bold uppercase">Project Idea:</span>
                    <p className="text-xs text-indigo-300">{item.projectIdea}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: INTEGRITY AUDIT */}
      {activeTab === "proctoring" && report.antiCheatSummary && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Integrity Score</span>
              <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">
                {report.antiCheatSummary.integrityScore}%
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Total Warnings Recorded</span>
              <div className="text-2xl font-extrabold text-amber-400 font-mono mt-1">
                {report.antiCheatSummary.totalWarnings}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 border-t border-zinc-800 pt-6">
        <button
          onClick={onViewHistory}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-semibold transition flex items-center justify-center gap-2"
        >
          <History className="w-4 h-4 text-zinc-400" /> View Session History
        </button>

        <button
          onClick={onRestart}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" /> Start New AI Interview Session
        </button>
      </div>
    </div>
  );
}
