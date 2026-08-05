import { useNavigate } from "react-router-dom";
import { Sparkles, X, Zap, Lock } from "lucide-react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  featureType?: "interviews" | "resume" | "coding" | "general";
}

export function UpgradeModal({
  isOpen,
  onClose,
  title = "Upgrade Your Plan",
  message = "You have reached today's free usage limit. Upgrade to Pro to unlock unlimited practice and premium features.",
  featureType = "general",
}: UpgradeModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleUpgradeClick = () => {
    onClose();
    navigate("/pricing");
  };

  const getFeatureHeadline = () => {
    if (featureType === "interviews") return "Daily AI Interview Limit Reached";
    if (featureType === "resume") return "Daily Resume Analysis Limit Reached";
    if (featureType === "coding") return "Daily Coding Practice Limit Reached";
    return "Upgrade to Unlock Premium Access";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-card relative w-full max-w-md rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200/80 dark:border-slate-800 warm:border-[#e2d9c8]">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-white warm:hover:bg-[#eae3d2] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 p-0.5 shadow-xl shadow-amber-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400">
              <Zap className="w-7 h-7 animate-pulse" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 warm:text-amber-800 text-[11px] font-extrabold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" /> {getFeatureHeadline()}
          </div>

          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 warm:text-[#2c251e]">
            {title}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 warm:text-[#736758] leading-relaxed">
            {message}
          </p>
        </div>

        {/* Pro Plan Feature Bullets */}
        <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900/70 warm:bg-[#eae3d2]/60 border border-slate-200/80 dark:border-slate-800 warm:border-[#e2d9c8] space-y-2.5">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 warm:text-[#736758] block mb-1">
            Upgrade to Pro to unlock:
          </span>
          <ul className="space-y-2 text-xs text-slate-800 dark:text-slate-200 warm:text-[#2c251e] font-medium">
            <li className="flex items-center gap-2">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">✓</span>
              Unlimited AI Interviews
            </li>
            <li className="flex items-center gap-2">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">✓</span>
              Unlimited Resume Analysis
            </li>
            <li className="flex items-center gap-2">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">✓</span>
              Unlimited Coding Practice
            </li>
            <li className="flex items-center gap-2">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">✓</span>
              Voice & Camera Interview Studio
            </li>
            <li className="flex items-center gap-2">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">✓</span>
              Detailed AI Feedback Reports & Export
            </li>
          </ul>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-1/2 px-4 py-3 rounded-xl border border-slate-200/80 bg-white text-slate-700 text-xs font-bold transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 warm:border-[#e2d9c8] warm:bg-[#fffdf9] warm:text-[#2c251e] order-2 sm:order-1"
          >
            Maybe Later
          </button>
          <button
            type="button"
            onClick={handleUpgradeClick}
            className="w-full sm:w-1/2 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-xl shadow-amber-500/20 transition flex items-center justify-center gap-1.5 order-1 sm:order-2"
          >
            <Sparkles className="w-4 h-4" /> Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
}
