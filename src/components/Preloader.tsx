import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PreloaderProps {
  onComplete?: () => void;
  minDurationMs?: number;
}

export default function Preloader({ onComplete, minDurationMs = 2200 }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Lock body scrolling while active
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Smooth progress increment timer
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const calculatedProgress = Math.min(100, Math.round((elapsedTime / minDurationMs) * 100));
      
      setProgress(calculatedProgress);

      if (calculatedProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsComplete(true);
          document.body.style.overflow = "unset";
          if (onComplete) onComplete();
        }, 300);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [minDurationMs, onComplete]);

  // Determine dynamic status text based on current percentage
  const getStatusText = (currentProgress: number) => {
    if (currentProgress < 35) return "Initializing Interview Environment...";
    if (currentProgress < 75) return "Loading Models & Canvas Sequence...";
    if (currentProgress < 100) return "Finalizing AI Neural Engine...";
    return "Ready";
  };

  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          key="app-preloader"
          initial={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] bg-[#020617] flex flex-col items-center justify-center overflow-hidden font-sans select-none"
        >
          {/* Subtle Radial Backdrop Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

          {/* Central Animation Container */}
          <div className="relative flex flex-col items-center justify-center space-y-8 z-10">
            {/* 3D AI Brain Icon with Circular Progress Ring */}
            <div className="relative w-44 h-44 flex items-center justify-center">
              {/* Circular SVG Progress Ring */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                {/* Track Circle */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  className="stroke-slate-800/80"
                  strokeWidth="3"
                  fill="transparent"
                />
                {/* Animated Indicator Circle */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  className="stroke-cyan-400 transition-all duration-150 ease-out"
                  strokeWidth="3.5"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              {/* Floating Central 3D AI Brain Image */}
              <motion.div
                animate={{
                  y: [-6, 6, -6],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute w-24 h-24 flex items-center justify-center drop-shadow-[0_0_25px_rgba(6,182,212,0.4)]"
              >
                <img
                  src="/images/ai-brain.png"
                  alt="InterviewAI Pro Brain"
                  className="w-full h-full object-contain"
                />
              </motion.div>
            </div>

            {/* Brand Typography & Shimmer */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-extrabold text-slate-50 tracking-tight">
                  InterviewAI
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full font-mono shadow-[0_0_12px_rgba(6,182,212,0.3)]">
                  PRO
                </span>
              </div>

              {/* Progress Counter & Status Text */}
              <div className="space-y-1">
                <div className="text-xl font-bold font-mono text-cyan-400">
                  {progress}%
                </div>
                <p className="text-xs text-slate-400 font-medium h-4">
                  {getStatusText(progress)}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
