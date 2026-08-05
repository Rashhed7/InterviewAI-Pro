import { motion } from "framer-motion";
import { FileUp, MessageSquareText, Target } from "lucide-react";

const STEPS = [
  {
    step: "01",
    icon: FileUp,
    title: "Set the target",
    description: "Choose a role, experience level, topic, and optional resume context so the session starts with the right expectations.",
  },
  {
    step: "02",
    icon: MessageSquareText,
    title: "Practice like it is live",
    description: "Answer with voice or text, solve coding prompts, and handle follow-ups in a focused interview room.",
  },
  {
    step: "03",
    icon: Target,
    title: "Review the next move",
    description: "Use the report to understand weak spots, rewrite stronger answers, and decide what to practice next.",
  },
];

function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
        <div className="lg:sticky lg:top-24">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">Workflow</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl dark:text-white">
            Simple enough to use every day.
          </h2>
          <p className="mt-4 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
            Each session has a clear beginning, a realistic practice loop, and a report that turns feedback into action.
          </p>
        </div>

        <div className="space-y-4">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: 18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                className="grid gap-5 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 sm:grid-cols-[auto_1fr_auto] sm:items-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-zinc-950 dark:text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-400">{step.description}</p>
                </div>
                <span className="font-mono text-3xl font-semibold text-zinc-200 dark:text-zinc-800">{step.step}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
