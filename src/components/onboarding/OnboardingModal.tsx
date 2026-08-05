import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Upload, ArrowRight, ArrowLeft, Bot } from "lucide-react";
import { COMPANY_CATEGORIES } from "../../utils/companyCategories";

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (data: {
    targetRole: string;
    experienceLevel: string;
    targetCompany: string;
    resumeText: string;
  }) => void;
}

export function OnboardingModal({ isOpen, onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [targetRole, setTargetRole] = useState("Full Stack Engineer");
  const [experienceLevel, setExperienceLevel] = useState("Student / Fresh Graduate");
  const [targetCompany, setTargetCompany] = useState("Stripe");
  const [resumeText, setResumeText] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

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

  const handleFinalSubmit = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      onComplete({
        targetRole,
        experienceLevel,
        targetCompany,
        resumeText,
      });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#111113] border border-zinc-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden text-zinc-100"
      >
        {/* Step Progress Indicator */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-blue-600/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-white">AI Coach Setup</span>
              <p className="text-[10px] text-zinc-400">Guided Onboarding (Step {step} of 5)</p>
            </div>
          </div>

          <span className="text-xs font-mono text-blue-400 font-bold">{step * 20}%</span>
        </div>

        <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-800">
          <div
            className="bg-blue-600 h-full transition-all duration-300"
            style={{ width: `${step * 20}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: CAREER GOAL */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">What is your primary career goal?</h3>
                <p className="text-xs text-zinc-400">Select the target role you want your AI interviewer to focus on.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {[
                  "Full Stack Engineer",
                  "Frontend Developer",
                  "Backend Developer",
                  "AI / ML Engineer",
                  "Cloud & DevOps Engineer",
                  "Cybersecurity Specialist",
                ].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setTargetRole(role)}
                    className={`p-3.5 rounded-xl border text-left text-xs font-semibold transition ${
                      targetRole === role
                        ? "bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/10"
                        : "bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl text-xs shadow-lg shadow-blue-600/20 transition flex items-center justify-center gap-2 mt-4"
              >
                <span>Continue to Experience Level</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* STEP 2: EXPERIENCE LEVEL */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">What is your current experience level?</h3>
                <p className="text-xs text-zinc-400">The AI Recruiter will tailor interview question depth accordingly.</p>
              </div>

              <div className="space-y-2.5 pt-2">
                {[
                  { title: "Student / Fresh Graduate", desc: "0-1 years. Focus on computer science fundamentals and STAR method." },
                  { title: "Junior Engineer", desc: "1-3 years. Practical coding, REST APIs, and basic system architecture." },
                  { title: "Mid-to-Senior Lead", desc: "3+ years. High concurrency, distributed trade-offs, and system design." },
                ].map((item) => (
                  <div
                    key={item.title}
                    onClick={() => setExperienceLevel(item.title)}
                    className={`p-4 rounded-xl border cursor-pointer transition ${
                      experienceLevel === item.title
                        ? "bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/10"
                        : "bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                    }`}
                  >
                    <div className="font-bold text-xs text-white mb-0.5">{item.title}</div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-semibold"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-xs shadow-lg shadow-blue-600/20 transition flex items-center justify-center gap-2"
                >
                  <span>Select Target Enterprise</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: TARGET ENTERPRISE */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Choose your target enterprise:</h3>
                <p className="text-xs text-zinc-400">Question style and company culture will adapt automatically.</p>
              </div>

              <select
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs font-semibold outline-none focus:border-blue-500"
              >
                {COMPANY_CATEGORIES.map((cat, idx) => (
                  <optgroup key={idx} label={`-- ${cat.category} --`}>
                    {cat.companies.map((c, i) => (
                      <option key={i} value={c}>{c}</option>
                    ))}
                  </optgroup>
                ))}
              </select>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-semibold"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-xs shadow-lg shadow-blue-600/20 transition flex items-center justify-center gap-2"
                >
                  <span>Resume Context (Optional)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: RESUME CONTEXT */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Upload your resume (Optional):</h3>
                <p className="text-xs text-zinc-400">Allows the AI Assistant to ask questions about your actual projects.</p>
              </div>

              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-3">
                <div className="flex items-center gap-3">
                  <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFileUpload} id="onboarding-resume" className="hidden" />
                  <label htmlFor="onboarding-resume" className="cursor-pointer bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" /> Choose Resume File
                  </label>
                  {uploadedFileName && <span className="text-xs text-emerald-400 font-mono font-semibold">{uploadedFileName}</span>}
                </div>

                <textarea
                  rows={3}
                  placeholder="Or paste resume text summary here..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="w-full p-3 rounded-xl bg-zinc-900 text-purple-200 outline-none border border-zinc-800 text-xs font-mono"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-semibold"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setStep(5);
                    handleFinalSubmit();
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-xs shadow-lg shadow-blue-600/20 transition flex items-center justify-center gap-2"
                >
                  <span>Generate Personal AI Plan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: AI ROADMAP GENERATION */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-blue-600/20 border-2 border-blue-500 text-blue-400 flex items-center justify-center mx-auto animate-pulse">
                <Bot className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">
                  {isGenerating ? "Building Your AI Interview Plan..." : "Personal AI Plan Ready!"}
                </h3>
                <p className="text-xs text-zinc-400">
                  Customizing recruiter persona for <span className="text-blue-400 font-semibold">{targetRole}</span> @ <span className="text-purple-400 font-semibold">{targetCompany}</span>.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
