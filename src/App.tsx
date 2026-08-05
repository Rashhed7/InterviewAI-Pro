import Navbar from "./components/Navbar";
import Hero from "./components/layout/Hero";
import Features from "./components/layout/Features";
import HowItWorks from "./components/layout/HowItWorks";
import Testimonials from "./components/layout/Testimonials";
import FAQ from "./components/layout/FAQ";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

function App() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 transition-colors duration-200 dark:bg-[#09090B] dark:text-zinc-100">
      <Navbar />

      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <FAQ />
      </main>

      <footer className="border-t border-zinc-200 bg-zinc-50 px-4 py-10 dark:border-zinc-800 dark:bg-zinc-950 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 text-xs text-zinc-500 dark:text-zinc-400 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              InterviewAI <span className="font-mono text-blue-600 dark:text-blue-400">PRO</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            <Link to="/ai-interview" className="transition hover:text-zinc-900 dark:hover:text-zinc-100">Interview room</Link>
            <Link to="/resume-analyzer" className="transition hover:text-zinc-900 dark:hover:text-zinc-100">Resume review</Link>
            <Link to="/coding-challenge" className="transition hover:text-zinc-900 dark:hover:text-zinc-100">Coding studio</Link>
            <Link to="/settings" className="transition hover:text-zinc-900 dark:hover:text-zinc-100">Settings</Link>
          </div>

          <p>© {new Date().getFullYear()} InterviewAI Pro.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
