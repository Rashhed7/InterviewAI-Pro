import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Upload, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import { interviewService, type FullResumeAnalysisResponse } from "../services/interviewService";

const TARGET_ROLES = [
  "Full Stack Engineer",
  "Frontend React Developer",
  "Backend Node.js Engineer",
  "AI & Machine Learning Engineer",
  "Cloud & DevOps Architect",
  "Data Scientist & Analytics Lead",
  "Cyber Security Specialist",
  "Mobile App Engineer",
  "System Design Specialist",
  "Technical Product Manager",
];

function ResumeAnalyzer() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(TARGET_ROLES[0]);
  const [resumeText, setResumeText] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<FullResumeAnalysisResponse | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (text) {
        setResumeText(text.replace(/[^\x20-\x7E\n\r]/g, " ").replace(/\s+/g, " "));
      }
    };
    reader.readAsText(file);
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      alert("Please upload a resume file or paste your resume text.");
      return;
    }

    setLoading(true);
    try {
      const res = await interviewService.analyzeResumeFull(resumeText, selectedRole);
      if (res?.success) {
        setAnalysisResult(res.analysis);
      }
    } catch (err: any) {
      alert("Resume analysis failed: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 flex flex-col font-sans">
      <Navbar />

      <main className="max-w-6xl w-full mx-auto p-4 lg:p-6 flex-1 my-2 space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-400 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Powered by Smart AI Resume Engine
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            ATS Resume Analyzer & Bullet Rewriter
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Get instant ATS score breakdowns, keyword optimization, salary range estimations, and automated high-impact metric-driven bullet point rewrites.
          </p>
        </div>

        {/* INPUT FORM SECTION */}
        <div className="bg-[#111113] border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">
                1. Select Target Role Domain:
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs font-medium outline-none focus:border-purple-500"
              >
                {TARGET_ROLES.map((r, idx) => (
                  <option key={idx} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">
                2. Upload Resume File (.pdf, .docx, .txt):
              </label>
              <div className="flex items-center gap-3">
                <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFileUpload} id="resume-file" className="hidden" />
                <label htmlFor="resume-file" className="cursor-pointer bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-lg shadow-purple-600/30 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" /> Choose File
                </label>
                {uploadedFileName && <span className="text-xs text-emerald-400 font-mono font-semibold">{uploadedFileName}</span>}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Or Paste Resume Text Below:
            </label>
            <textarea
              rows={6}
              placeholder="Paste your complete resume text here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="w-full p-4 rounded-xl bg-zinc-950 text-purple-200 outline-none border border-zinc-800 focus:border-purple-500 text-xs font-mono leading-relaxed"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading || !resumeText.trim()}
            className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 transition py-4 rounded-2xl text-white font-bold shadow-xl shadow-purple-600/30 text-base flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="animate-pulse flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Smart AI Assistant Analyzing Resume...
              </span>
            ) : (
              <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Analyze Resume & Rewrite Weak Bullets</span>
            )}
          </button>
        </div>

        {/* RESULT SECTION */}
        {analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#111113] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 text-center space-y-1">
                <span className="text-[10px] text-zinc-400 font-bold uppercase">ATS Compatibility</span>
                <div className="text-3xl font-extrabold text-emerald-400 font-mono">{analysisResult.atsScore}%</div>
              </div>
              <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 text-center space-y-1">
                <span className="text-[10px] text-zinc-400 font-bold uppercase">Keyword Match</span>
                <div className="text-3xl font-extrabold text-blue-400 font-mono">{analysisResult.keywordScore}%</div>
              </div>
              <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 text-center space-y-1">
                <span className="text-[10px] text-zinc-400 font-bold uppercase">Action Verbs</span>
                <div className="text-3xl font-extrabold text-purple-400 font-mono">{analysisResult.actionVerbScore}%</div>
              </div>
              <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 text-center space-y-1">
                <span className="text-[10px] text-zinc-400 font-bold uppercase">Hiring Probability</span>
                <div className="text-3xl font-extrabold text-amber-400 font-mono">{analysisResult.overallHiringProbability}%</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 text-left space-y-1">
                <span className="text-[10px] text-zinc-400 font-bold uppercase">Assessed Career Level</span>
                <div className="text-lg font-bold text-white">{analysisResult.careerLevel}</div>
              </div>
              <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 text-left space-y-1">
                <span className="text-[10px] text-zinc-400 font-bold uppercase">Estimated Market Salary</span>
                <div className="text-lg font-bold text-emerald-400 font-mono">{analysisResult.expectedSalaryRange}</div>
              </div>
            </div>

            <div className="p-5 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-2">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block">
                Executive ATS Assessment Summary
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed">{analysisResult.summary}</p>
            </div>

            {analysisResult.weakBulletRewrites && analysisResult.weakBulletRewrites.length > 0 && (
              <div className="p-6 bg-zinc-950 border border-purple-500/30 rounded-2xl space-y-4">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" /> High-Impact Metric Bullet Point Rewrites
                </span>

                <div className="space-y-4">
                  {analysisResult.weakBulletRewrites.map((item, idx) => (
                    <div key={idx} className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-3">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block">
                          Original Weak Bullet:
                        </span>
                        <p className="text-xs text-red-300 font-mono">"{item.originalBullet}"</p>
                      </div>

                      <div className="space-y-1 p-3 bg-emerald-950/30 border border-emerald-500/40 rounded-lg">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                          Metric-Driven Rewritten Bullet:
                        </span>
                        <p className="text-xs text-emerald-100 font-semibold leading-relaxed">
                          "{item.improvedBullet}"
                        </p>
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-zinc-400 font-mono border-t border-zinc-800 pt-2">
                        <span>Why Better: {item.explanation}</span>
                        <span className="text-amber-400 font-bold">Added Metric: {item.addedMetrics}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => navigate("/ai-interview", { state: { customRoleTitle: selectedRole } })}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-2xl text-xs shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2"
            >
              Launch AI Interview Session for {selectedRole} <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default ResumeAnalyzer;
