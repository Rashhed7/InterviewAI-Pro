import { motion } from "framer-motion";
import { Star } from "lucide-react";

const REVIEWS = [
  {
    name: "Aarav Sharma",
    role: "Senior Software Engineer @ Meta",
    review: "The per-question STAR method answer rewrites were invaluable. It pointed out exact missing keywords in my System Design responses.",
  },
  {
    name: "Priya Nair",
    role: "Frontend Engineer @ Google",
    review: "The camera studio metrics and continuous voice mode made practice sessions feel identical to sitting in front of a real senior engineering interviewer.",
  },
  {
    name: "Rahul Verma",
    role: "Backend Engineer @ Amazon",
    review: "The resume ATS bullet rewriter turned generic bullet points into high-impact metric statements. Boosted my callback rate immediately.",
  },
];

function Testimonials() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-200 dark:border-zinc-800/80">
      <div className="text-center space-y-3 mb-16">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          Proven Outcomes
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
          Engineers Hired at World-Class Companies
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm max-w-xl mx-auto">
          Hear how candidates used InterviewAI Pro to elevate their technical interviews and land offer letters.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {REVIEWS.map((rev, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111113] space-y-4 shadow-lg flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
                "{rev.review}"
              </p>
            </div>

            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                {rev.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{rev.name}</h4>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{rev.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default Testimonials;