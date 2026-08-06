import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export default function MinimalFooter() {
  return (
    <footer className="bg-slate-950 text-slate-100 border-t border-slate-800/80 py-12 relative z-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-cyan-400 border border-slate-800 shadow-sm transition-transform duration-200 group-hover:scale-105">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-bold text-sm text-slate-100 tracking-tight">
            InterviewAI <span className="font-mono text-cyan-400 font-extrabold text-xs">PRO</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
          <Link to="/ai-interview" className="hover:text-slate-100 transition-colors">
            Interview room
          </Link>
          <Link to="/resume-analyzer" className="hover:text-slate-100 transition-colors">
            Resume review
          </Link>
          <Link to="/coding-challenge" className="hover:text-slate-100 transition-colors">
            Coding studio
          </Link>
          <Link to="/settings" className="hover:text-slate-100 transition-colors">
            Settings
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-xs text-slate-500 font-mono">
          © 2026 InterviewAI Pro. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
