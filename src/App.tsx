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
    <div className="min-h-screen bg-white dark:bg-[#09090B] text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <FAQ />
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090B] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-zinc-900 dark:text-zinc-100">
              InterviewAI <span className="text-blue-500 font-mono">PRO</span>
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/ai-interview" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition">AI Studio</Link>
            <Link to="/resume-analyzer" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition">Resume ATS</Link>
            <Link to="/coding-challenge" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition">Coding Studio</Link>
            <Link to="/settings" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition">Settings</Link>
          </div>

          <p>© {new Date().getFullYear()} InterviewAI Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;