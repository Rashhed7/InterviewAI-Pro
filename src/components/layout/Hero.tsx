import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Play } from "lucide-react";

function Hero() {
  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 py-20 text-center">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/15 dark:bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Announcement Badge */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 dark:border-blue-800/60 bg-blue-50/80 dark:bg-blue-950/40 backdrop-blur-md text-blue-700 dark:text-blue-400 text-xs font-semibold"
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>Enterprise AI Interview Platform</span>
      </motion.div>

      {/* Main Hero Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight leading-[1.1] max-w-5xl"
      >
        Practice Real 1-on-1 Interviews with an <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Autonomous Recruiter</span>
      </motion.h1>

      {/* Sub-heading Description */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-6 max-w-2xl text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal"
      >
        Dynamic question generation, speech transcription, acoustic noise filtering, live proctoring anti-cheating, and per-question STAR method answer rewrites.
      </motion.p>

      {/* Call to Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto"
      >
        <Link
          to="/register"
          className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold text-sm shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2 group"
        >
          <span>Start Free AI Practice Session</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          to="/ai-interview"
          className="w-full sm:w-auto px-7 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold text-sm transition flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4 text-blue-600 dark:text-blue-400 fill-current" />
          <span>Launch AI Interview Room</span>
        </Link>
      </motion.div>

      {/* 3D Glass Studio Preview Object */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="mt-16 w-full max-w-4xl rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-[#111113]/80 p-4 sm:p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden text-left"
      >
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="ml-2 text-xs font-mono text-zinc-400">AI Recruiter Studio Pro - Live Session</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Active Voice Stream
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
              Recruiter Question:
            </span>
            <p className="text-xs text-zinc-800 dark:text-zinc-200 font-sans leading-relaxed">
              "How would you handle cache invalidation and race conditions in a distributed system handling 100K requests per second?"
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
              Live AI STAR Breakdown & Gap Analysis:
            </span>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 font-mono leading-relaxed">
              Ideal Answer STAR: Situation (High QPS cache desync) ➔ Action (Distributed Mutex & Cache Stampede Locking) ➔ Result (-45% latency).
            </p>
          </div>
        </div>
      </motion.div>

      {/* Live Statistics */}
      <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl w-full text-center border-t border-zinc-200 dark:border-zinc-800/80 pt-10">
        <div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">10,000+</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Interviews Conducted</p>
        </div>
        <div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">98.4%</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Industry Evaluation Accuracy</p>
        </div>
        <div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">15+</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Scoring Sub-Metrics</p>
        </div>
        <div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">&lt; 500ms</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Real-Time Voice Latency</p>
        </div>
      </div>
    </section>
  );
}

export default Hero;