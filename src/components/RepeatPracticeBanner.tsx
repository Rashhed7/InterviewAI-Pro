import { motion } from "framer-motion";
import { repeatPracticePoints } from "../data/landing";
import { CheckCircle2 } from "lucide-react";

export default function RepeatPracticeBanner() {
  return (
    <section className="py-20 bg-slate-950 text-slate-100 relative z-10 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-emerald-400">
            REPEAT PRACTICE
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight leading-tight">
            Built for Repeat Practice
          </h2>
        </div>

        {/* 3-Column Minimal Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {repeatPracticePoints.map((point, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.1 }}
              className="rounded-2xl bg-slate-900/40 border border-slate-800/80 p-6 backdrop-blur-md space-y-3"
            >
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{point.title}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {point.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
