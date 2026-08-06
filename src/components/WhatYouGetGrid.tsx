import { motion } from "framer-motion";
import { Brain, Mic, Code, FileText, ShieldCheck, BarChart3 } from "lucide-react";
import { whatYouGetCards } from "../data/landing";

const iconMap: Record<string, any> = {
  Brain,
  Mic,
  Code,
  FileText,
  ShieldCheck,
  BarChart3,
};

export default function WhatYouGetGrid() {
  return (
    <section id="features" className="py-24 bg-slate-950 text-slate-100 relative z-10 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-cyan-400">
            WHAT YOU GET
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight leading-tight">
            A focused prep desk for every stage before the interview.
          </h2>
          <p className="text-base text-slate-400 leading-relaxed">
            The product keeps the workflow practical: practice, review, adjust, and repeat with zero noise.
          </p>
        </div>

        {/* 6 Minimalist Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whatYouGetCards.map((card, idx) => {
            const IconComponent = iconMap[card.icon] || Brain;
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="group relative rounded-2xl bg-slate-900/50 border border-slate-800/80 p-6 backdrop-blur-md transition-all duration-300 hover:border-cyan-500/50 hover:bg-slate-900/80 shadow-lg hover:shadow-cyan-500/10 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-cyan-400 transition-colors group-hover:bg-cyan-500/10 group-hover:border-cyan-500/40">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-100 tracking-tight group-hover:text-cyan-300 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                    {card.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
