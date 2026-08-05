import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQS = [
  {
    question: "Are interview questions hardcoded or dynamically generated?",
    answer: "Every question, follow-up, evaluation, and report is generated dynamically using our AI Interview Engine. Zero hardcoded question arrays exist in the engine.",
  },
  {
    question: "How does the per-question STAR method analysis work?",
    answer: "After your session, our AI Assistant analyzes every turn you spoke. It breaks down the gold-standard STAR answer, highlights missed technical keywords, and rewrites your response into an interview-winning answer.",
  },
  {
    question: "How does the Resume ATS Bullet Rewriter function?",
    answer: "Upload your resume or paste resume text. The engine parses structure, keyword match, formatting, action verbs, and identifies weak bullets to rewrite them with quantifiable metrics.",
  },
  {
    question: "What anti-cheating proctoring controls are monitored?",
    answer: "The studio monitors tab switching, window blur events, clipboard copy-pasting, eye contact tracking, and long silence. A proctoring integrity score is generated in your report.",
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-zinc-200 dark:border-zinc-800/80">
      <div className="text-center space-y-3 mb-16">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center justify-center gap-1.5">
          <HelpCircle className="w-4 h-4" /> Frequently Asked Questions
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
          Everything You Need to Know
        </h2>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111113] overflow-hidden shadow-sm"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <span>{faq.question}</span>
                <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-blue-500" : ""}`} />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-5 pb-5 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800/60 pt-3"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default FAQ;