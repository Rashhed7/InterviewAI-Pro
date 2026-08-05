import { motion } from "framer-motion";
import { FileUp, Cpu, Video } from "lucide-react";

const STEPS = [
  {
    step: "01",
    icon: FileUp,
    title: "Select Role & Attach Resume",
    description: "Choose your target role (Full Stack, Backend, System Design, HR) and optionally upload your resume to contextualize questions.",
  },
  {
    step: "02",
    icon: Video,
    title: "1-on-1 Voice AI Interview Room",
    description: "Engage in continuous voice dialogue with the AI recruiter. Answer technical questions, write code solutions, and respond to follow-ups.",
  },
  {
    step: "03",
    icon: Cpu,
    title: "Per-Question Executive Report & Roadmap",
    description: "Receive 15+ sub-scores, proctoring logs, gold-standard STAR answers, winning answer rewrites, and a step-by-step learning plan.",
  },
];

function HowItWorks() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-200 dark:border-zinc-800/80">
      <div className="text-center space-y-3 mb-16">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          Workflow
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
          Three Steps to Hiring Confidence
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm max-w-xl mx-auto">
          Automated end-to-end interview simulation engineered for maximum candidate growth.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111113] relative space-y-4 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="font-mono font-bold text-2xl text-zinc-300 dark:text-zinc-700">
                  {step.step}
                </span>
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                {step.title}
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

export default HowItWorks;