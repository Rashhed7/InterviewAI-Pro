import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQS = [
  {
    question: "Can I use it for different roles?",
    answer: "Yes. You can prepare for technical, HR, behavioral, system design, and coding rounds by choosing the session type that matches your target role.",
  },
  {
    question: "Does the feedback include answer rewrites?",
    answer: "The report highlights missed points, suggests stronger structure, and helps you reshape answers into clearer interview-ready responses.",
  },
  {
    question: "Can I review my resume before interviews?",
    answer: "Yes. The resume analyzer checks alignment, wording, keyword coverage, and measurable impact so your profile supports the role you are targeting.",
  },
  {
    question: "Is dark mode fully supported?",
    answer: "Yes. The interface uses shared color tokens and has been designed to remain readable and polished in both light and dark mode.",
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
          <HelpCircle className="h-4 w-4" />
          FAQ
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl dark:text-white">
          Questions before you start.
        </h2>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={faq.question}
              className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left text-sm font-semibold text-zinc-950 transition hover:bg-zinc-50 dark:text-white dark:hover:bg-zinc-900"
              >
                <span>{faq.question}</span>
                <ChevronDown className={`h-4 w-4 shrink-0 text-zinc-400 transition ${isOpen ? "rotate-180 text-blue-500" : ""}`} />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="border-t border-zinc-100 px-5 py-4 text-sm leading-7 text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
                      {faq.answer}
                    </div>
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
