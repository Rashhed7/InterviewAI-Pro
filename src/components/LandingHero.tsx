import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { heroFeatures } from "../data/landing";
import InteractiveCanvasHero from "./InteractiveCanvasHero";

export default function LandingHero() {
  const [activeTabId, setActiveTabId] = useState<"interview" | "resume" | "coding">("interview");
  const activeFeature = heroFeatures.find((f) => f.id === activeTabId) || heroFeatures[0];

  return (
    <section className="relative min-h-[240vh] w-full bg-[#020617] text-slate-50 font-sans">
      {/* 1. FULL-SCREEN SCROLL ANIMATING CANVAS BACKGROUND */}
      <InteractiveCanvasHero activeFeature={activeFeature} isFullScreen={true} />

      {/* 2. FLOATING EXECUTIVE OVERLAY */}
      <div className="relative z-10 pt-20 pb-20 lg:pt-28 lg:pb-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* HERO HEADER */}
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            {/* Header Pill */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/40 border border-slate-800/60 backdrop-blur-md text-xs font-medium text-slate-300 shadow-xl"
            >
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Trusted by <strong className="text-slate-50 font-semibold">50,000+</strong> Candidates & Engineers</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-50 leading-tight drop-shadow-md"
            >
              Land Your Tech Job with{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">
                Interview AI Pro
              </span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal drop-shadow-sm"
            >
              Practice mock interviews, analyze resumes, and master coding challenges with personalized AI feedback.
            </motion.p>

            {/* Primary Calls to Action (CTAs) */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="pt-2 flex flex-col items-center gap-3"
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                {/* Primary Button */}
                <Link
                  to="/register"
                  className="px-8 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98] w-full sm:w-auto"
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </Link>

                {/* Secondary Button */}
                <Link
                  to="/pricing"
                  className="px-8 py-3.5 rounded-xl font-bold text-sm text-slate-200 bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800/80 hover:border-cyan-500/40 transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98] w-full sm:w-auto backdrop-blur-md"
                >
                  View Pricing Plans
                </Link>
              </div>

              {/* Subtext */}
              <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 pt-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Free 7-Day Access • No Credit Card Required
              </p>
            </motion.div>
          </div>

          {/* MINIMALIST FEATURE TAB SELECTOR */}
          <div className="flex items-center justify-center">
            <div className="inline-flex p-1 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-md shadow-2xl gap-1">
              {heroFeatures.map((feature) => {
                const isActive = feature.id === activeTabId;
                return (
                  <button
                    key={feature.id}
                    type="button"
                    onClick={() => setActiveTabId(feature.id)}
                    className={`relative px-5 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2 select-none ${
                      isActive ? "text-slate-50 shadow-md" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="minimalTabPill"
                        className="absolute inset-0 rounded-xl bg-slate-800/80 border border-slate-700/60 shadow-sm"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: feature.themeColor }}
                      />
                      {feature.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* FEATURE HIGHLIGHT CARD (GLASS OVERLAY MATCHING AMBIENT GLOW) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeature.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="max-w-3xl mx-auto rounded-3xl p-6 sm:p-8 bg-slate-900/40 border border-slate-800/60 backdrop-blur-md shadow-2xl space-y-6"
            >
              <div className="space-y-3 text-left">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-50 tracking-tight leading-snug">
                  {activeFeature.headline}
                </h2>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {activeFeature.description}
                </p>
              </div>

              {/* Stat Grid */}
              <div className="grid grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/60">
                <div className="space-y-0.5 text-center sm:text-left">
                  <div className="text-xl font-bold text-slate-50 font-mono">&lt;200ms</div>
                  <div className="text-xs text-slate-400 font-medium">Response Latency</div>
                </div>
                <div className="space-y-0.5 text-center sm:text-left">
                  <div className="text-xl font-bold text-emerald-400 font-mono">98%</div>
                  <div className="text-xs text-slate-400 font-medium">Score Accuracy</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
