import { motion } from "framer-motion";
import { BarChart3, Brain, Code2, FileCheck, Mic2, ShieldCheck } from "lucide-react";

const FEATURES = [
  {
    icon: Brain,
    title: "Adaptive interviews",
    description: "Role-based question flow with natural follow-ups, difficulty changes, and focused evaluation after each session.",
  },
  {
    icon: Mic2,
    title: "Voice practice",
    description: "Speak answers out loud, track pacing, and build confidence for remote and on-site interview formats.",
  },
  {
    icon: Code2,
    title: "Coding workspace",
    description: "Practice algorithms with complexity notes, edge-case thinking, and review prompts that mirror real interviews.",
  },
  {
    icon: FileCheck,
    title: "Resume review",
    description: "Improve role alignment, keyword coverage, weak bullets, and measurable impact before applying.",
  },
  {
    icon: ShieldCheck,
    title: "Session integrity",
    description: "Keep practice sessions realistic with focus checks, interruption awareness, and clean post-session notes.",
  },
  {
    icon: BarChart3,
    title: "Progress analytics",
    description: "See where answers are improving across clarity, structure, technical depth, and communication quality.",
  },
];

function Features() {
  return (
    <section id="features" className="border-y border-slate-200/80 bg-slate-50/50 py-20 dark:border-slate-800 dark:bg-slate-900/40 warm:border-[#e2d9c8] warm:bg-[#eae3d2]/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-indigo-400 warm:text-amber-700">What you get</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100 warm:text-[#2c251e]">
            A focused prep desk for every stage before the interview.
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300 warm:text-[#736758]">
            The product keeps the workflow practical: practice, review, adjust, and repeat with zero noise.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                className="glass-card rounded-2xl p-6 transition-all hover:-translate-y-1"
              >
                <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-100/70 text-slate-900 dark:border-slate-700/80 dark:bg-slate-800/70 dark:text-slate-100 warm:border-[#e2d9c8] warm:bg-[#eae3d2]/80 warm:text-[#2c251e]">
                  <Icon className="h-5 w-5 text-amber-600 dark:text-indigo-400 warm:text-amber-700" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 warm:text-[#2c251e]">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300 warm:text-[#736758]">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Features;
