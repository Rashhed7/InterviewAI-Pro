import { motion } from "framer-motion";
import { CheckCircle2, Clock3, LineChart, LockKeyhole } from "lucide-react";

const OUTCOMES = [
  {
    icon: Clock3,
    title: "Short sessions fit real schedules",
    description: "Run a focused interview round, review the output, and return later without losing your preparation history.",
  },
  {
    icon: LineChart,
    title: "Feedback becomes measurable",
    description: "Track patterns across answers so you know whether structure, confidence, or technical depth needs attention.",
  },
  {
    icon: LockKeyhole,
    title: "Practice data stays purposeful",
    description: "Account, resume, and interview context are used to support the product workflow instead of adding visual clutter.",
  },
];

function Testimonials() {
  return (
    <section className="border-y border-zinc-200 bg-white py-20 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/60 lg:p-8">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Built for repeat practice
              </div>
              <h2 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl dark:text-white">
                Less noise, more preparation signal.
              </h2>
              <p className="mt-4 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                The interface is designed around the habits that matter before interviews: speaking clearly, solving under pressure, and reviewing feedback while it is still fresh.
              </p>
            </div>

            <div className="grid gap-4">
              {OUTCOMES.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.35, delay: index * 0.05 }}
                    className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
                  >
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">{item.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{item.description}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
