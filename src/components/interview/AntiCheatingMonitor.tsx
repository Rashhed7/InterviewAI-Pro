import { useEffect, useState } from "react";
import { AlertTriangle, ShieldAlert } from "lucide-react";
import type { AntiCheatWarning } from "../../services/interviewService";

interface AntiCheatingMonitorProps {
  active: boolean;
  onWarning: (warning: AntiCheatWarning) => void;
}

export function AntiCheatingMonitor({ active, onWarning }: AntiCheatingMonitorProps) {
  const [warnings, setWarnings] = useState<AntiCheatWarning[]>([]);
  const [recentWarning, setRecentWarning] = useState<string | null>(null);

  const addWarning = (type: AntiCheatWarning["type"], message: string) => {
    const warning: AntiCheatWarning = {
      type,
      timestamp: Date.now(),
      message,
    };
    setWarnings((prev) => [...prev, warning]);
    setRecentWarning(message);
    onWarning(warning);

    setTimeout(() => {
      setRecentWarning(null);
    }, 4000);
  };

  useEffect(() => {
    if (!active) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        addWarning("tab_switch", "Tab switch detected! Please remain focused on the interview window.");
      }
    };

    const handleWindowBlur = () => {
      addWarning("window_blur", "Window focus lost! Navigating away from the interview screen triggers an alert.");
    };

    const handlePaste = () => {
      addWarning("copy_paste", "Clipboard paste detected in interview field.");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      document.removeEventListener("paste", handlePaste);
    };
  }, [active]);

  if (!active && warnings.length === 0) return null;

  return (
    <div className="space-y-2">
      {/* Live Warning Toast Banner */}
      {recentWarning && (
        <div className="bg-red-500/20 border border-red-500/40 text-red-300 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between animate-bounce shadow-xl">
          <span className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            Anti-Cheating Alert: {recentWarning}
          </span>
          <span className="text-[10px] bg-red-950 px-2 py-0.5 rounded font-mono">Logged</span>
        </div>
      )}

      {/* Warnings HUD Badge */}
      {warnings.length > 0 && (
        <div className="flex items-center justify-between text-[11px] bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl text-zinc-400">
          <span className="flex items-center gap-1.5 font-semibold">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Proctoring Integrity Monitor:
          </span>
          <span className={`font-mono font-bold ${warnings.length > 2 ? "text-red-400" : "text-amber-400"}`}>
            {warnings.length} Warning(s) Logged
          </span>
        </div>
      )}
    </div>
  );
}
