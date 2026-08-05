import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Code2,
  Mic2,
  Play,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const metrics = [
  { label: "Practice sessions", value: "10k+" },
  { label: "Skill signals", value: "15" },
  { label: "Interview modes", value: "4" },
];

function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-14 sm:px-6 lg:px-8 lg:pb-28 lg:pt-20 eye-comfort-glow">
      <div className="hero-grid absolute inset-0 -z-10 opacity-70 dark:opacity-40 warm:opacity-30" />
      <div className="absolute -top-32 right-1/4 -z-10 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl dark:bg-amber-400/5 warm:bg-amber-600/15" />
      <div className="absolute top-1/2 -left-32 -z-10 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-400/5 warm:bg-emerald-600/15" />

      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-50/70 px-3.5 py-1.5 text-xs font-semibold text-amber-900 shadow-sm backdrop-blur-md dark:border-amber-400/20 dark:bg-amber-950/40 dark:text-amber-300 warm:border-amber-700/30 warm:bg-amber-100/60 warm:text-amber-900"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 warm:text-amber-700" />
            <span>Eye-Comfort Design System &bull; Intelligent AI Practice Desk</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="max-w-4xl text-4xl font-bold leading-[1.08] text-slate-900 sm:text-6xl lg:text-7xl dark:text-slate-100 warm:text-[#2c251e]"
          >
            InterviewAI Pro
            <span className="block text-amber-600/90 dark:text-indigo-400 warm:text-amber-700">crafted for glare-free, focused prep.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12 }}
            className="mt-6 max-w-xl text-base leading-8 text-slate-600 dark:text-slate-300 warm:text-[#736758]"
          >
            Practice role-specific interviews, sharpen coding answers, and improve your resume with focused, low-glare feedback designed for multi-hour practice sessions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.18 }}
            className="mt-9 flex flex-col gap-3.5 sm:flex-row"
          >
            <Link
              to="/register"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-indigo-600 dark:text-white dark:hover:bg-indigo-500 warm:bg-[#d97706] warm:text-white warm:hover:bg-[#b45309]"
            >
              Start practicing
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/ai-interview"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-6 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-800 warm:border-[#e2d9c8] warm:bg-[#fffdf9] warm:text-[#2c251e] warm:hover:bg-[#eae3d2]"
            >
              <Play className="h-4 w-4 fill-current text-amber-600 dark:text-indigo-400 warm:text-amber-700" />
              Open interview room
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.24 }}
            className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-slate-200/80 pt-6 dark:border-slate-800 warm:border-[#e2d9c8]"
          >
            {metrics.map((item) => (
              <div key={item.label}>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 warm:text-[#2c251e]">{item.value}</div>
                <div className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400 warm:text-[#736758]">{item.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, rotateX: 6 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="hero-perspective relative min-h-[520px]"
        >
          <div className="absolute inset-x-8 top-8 h-64 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-400/10" />

          <div className="studio-shell relative mx-auto w-full max-w-2xl rounded-[2rem] border border-zinc-200 bg-white/90 p-4 shadow-2xl shadow-zinc-950/10 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/90 dark:shadow-black/30">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-amber-400" />
                <span className="h-3 w-3 rounded-full bg-emerald-400" />
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Live session
              </div>
            </div>

            <div className="grid gap-4 pt-4 lg:grid-cols-[1fr_0.78fr]">
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/70">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">System design interview</p>
                    <h3 className="mt-1 text-lg font-semibold text-zinc-950 dark:text-white">Backend engineer</h3>
                  </div>
                  <Mic2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>

                <div className="space-y-3">
                  <div className="rounded-xl bg-white p-3 text-sm text-zinc-700 shadow-sm dark:bg-zinc-950 dark:text-zinc-300">
                    Walk me through how you would design a resilient notification service.
                  </div>
                  <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900 dark:border-blue-900/70 dark:bg-blue-950/40 dark:text-blue-100">
                    I would start with delivery guarantees, queue backpressure, user preferences, and retry policies.
                  </div>
                </div>

                <div className="mt-5 flex h-16 items-end gap-1.5">
                  {Array.from({ length: 24 }).map((_, index) => (
                    <span
                      key={index}
                      className="voice-bar w-full rounded-full bg-blue-500/70 dark:bg-blue-400/70"
                      style={{ animationDelay: `${index * 0.06}s` }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="floating-card rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl shadow-zinc-950/5 dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-950 dark:text-white">
                    <BarChart3 className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                    Feedback
                  </div>
                  <div className="space-y-3">
                    {[
                      ["Structure", "88%"],
                      ["Depth", "76%"],
                      ["Clarity", "91%"],
                    ].map(([label, score]) => (
                      <div key={label}>
                        <div className="mb-1 flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
                          <span>{label}</span>
                          <span>{score}</span>
                        </div>
                        <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800">
                          <div className="h-2 rounded-full bg-zinc-950 dark:bg-white" style={{ width: score }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="floating-card delay rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl shadow-zinc-950/5 dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-950 dark:text-white">
                    <Code2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    Coding focus
                  </div>
                  <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                    <p className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      Edge cases reviewed
                    </p>
                    <p className="flex items-center gap-2">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                      Session integrity clear
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
