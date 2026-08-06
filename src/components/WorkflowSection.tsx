import { motion } from "framer-motion";
import { workflowSteps } from "../data/landing";
import { ArrowRight } from "lucide-react";

export default function WorkflowSection() {
  return (
    <section id="workflow" className="py-24 bg-slate-950 text-slate-100 relative z-10 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-cyan-400">
            WORKFLOW
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight leading-tight">
            Simple enough to use every day.
          </h2>
          <p className="text-base text-slate-400 leading-relaxed">
            Each session has a clear beginning, a realistic practice loop, and a report that turns feedback into action.
          </p>
        </div>

        {/* 3 Step-by-Step Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {workflowSteps.map((step, idx) => (
            <motion.div
              key={step.stepNumber}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="relative bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md space-y-4 hover:border-cyan-500/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl font-extrabold font-mono text-cyan-400">
                  {step.stepNumber}
                </span>
                {idx < workflowSteps.length - 1 && (
                  <ArrowRight className="hidden md:block w-4 h-4 text-slate-600" />
                )}
              </div>

              <h3 className="text-xl font-bold text-slate-100 tracking-tight">
                {step.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
