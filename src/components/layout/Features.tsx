import { motion } from "framer-motion";
import { Brain, Mic, Code2, FileCheck, ShieldCheck, BarChart3 } from "lucide-react";

const FEATURES = [
  {
    icon: Brain,
    title: "Dynamic AI Recruiter",
    description: "No hardcoded question arrays. Evaluates candidate terms in real-time to generate natural follow-ups and adapt difficulty.",
  },
  {
    icon: Mic,
    title: "Acoustic Noise-Filtered Voice Mode",
    description: "Studio Neural voice synthesis with real-time Web Speech transcription, decibel level monitoring, and auto-punctuation.",
  },
  {
    icon: Code2,
    title: "Coding Challenge Sandbox",
    description: "Real-time algorithm problem solver with Big-O time & space complexity estimation, edge-case testing, and code quality scoring.",
  },
  {
    icon: FileCheck,
    title: "ATS Resume & Metric Rewriter",
    description: "Scan your resume for ATS score breakdowns, keyword optimization, and metric-driven bullet point rewrites.",
  },
  {
    icon: ShieldCheck,
    title: "Anti-Cheating Proctoring Audit",
    description: "Real-time browser tab-switch detection, window blur alerts, copy-paste monitors, and integrity reports.",
  },
  {
    icon: BarChart3,
    title: "Executive STAR Report & Roadmap",
    description: "Per-question gold standard STAR answers, candidate response rewrites, and personalized daily practice roadmaps.",
  },
];

function Features() {
  return (
    <section id="features" className="py-20 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Everything Required for Technical Interview Success
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm max-w-2xl mx-auto">
            Built for software engineers, product managers, and technical candidates targeting top-tier tech roles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111113] hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-200 group shadow-lg hover:shadow-xl"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {feat.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Features;