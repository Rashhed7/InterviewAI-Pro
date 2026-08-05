import { useState, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from "lucide-react";

export function AlgorithmVisualizer() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(600);

  const stepsHistory = [
    { label: "Initial Unsorted Array", compareIdx: [-1, -1], array: [35, 12, 89, 42, 67, 21, 95, 18] },
    { label: "Compare index 0 (35) and index 1 (12) -> Swap", compareIdx: [0, 1], array: [12, 35, 89, 42, 67, 21, 95, 18] },
    { label: "Compare index 1 (35) and index 2 (89) -> No swap", compareIdx: [1, 2], array: [12, 35, 89, 42, 67, 21, 95, 18] },
    { label: "Compare index 2 (89) and index 3 (42) -> Swap", compareIdx: [2, 3], array: [12, 35, 42, 89, 67, 21, 95, 18] },
    { label: "Compare index 3 (89) and index 4 (67) -> Swap", compareIdx: [3, 4], array: [12, 35, 42, 67, 89, 21, 95, 18] },
    { label: "Compare index 4 (89) and index 5 (21) -> Swap", compareIdx: [4, 5], array: [12, 35, 42, 67, 21, 89, 95, 18] },
    { label: "Array Sorted State", compareIdx: [-1, -1], array: [12, 18, 21, 35, 42, 67, 89, 95] },
  ];

  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveStep((prev) => {
          if (prev >= stepsHistory.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speedMs);
    }
    return () => clearInterval(timer);
  }, [isPlaying, speedMs, stepsHistory.length]);

  const current = stepsHistory[activeStep] || stepsHistory[0];

  return (
    <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-4 text-xs font-sans">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
        <span className="font-bold text-white uppercase tracking-wider text-[11px]">
          Step-by-Step Algorithm State Tracer
        </span>
        <span className="font-mono text-zinc-400 text-[10px]">
          Step {activeStep + 1} of {stepsHistory.length}
        </span>
      </div>

      <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 text-zinc-300 font-mono text-[11px]">
        {current.label}
      </div>

      {/* VISUAL ARRAY BARS */}
      <div className="h-36 bg-[#09090B] border border-zinc-800 rounded-xl p-4 flex items-end justify-center gap-2">
        {current.array.map((val, idx) => {
          const isHighlighted = current.compareIdx.includes(idx);
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] font-mono text-zinc-400">{val}</span>
              <div
                className={`w-full rounded-t-lg transition-all duration-300 ${
                  isHighlighted ? "bg-purple-500 shadow-lg shadow-purple-500/40" : "bg-blue-600"
                }`}
                style={{ height: `${val * 1.2}px` }}
              />
              <span className="text-[9px] font-mono text-zinc-500">i={idx}</span>
            </div>
          );
        })}
      </div>

      {/* CONTROLS BAR */}
      <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
            title="Previous Step"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition shadow-md shadow-blue-600/20"
            title={isPlaying ? "Pause" : "Play Animation"}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setActiveStep((prev) => Math.min(stepsHistory.length - 1, prev + 1))}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
            title="Next Step"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setActiveStep(0);
              setIsPlaying(false);
            }}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-400 font-mono">Speed:</span>
          <input
            type="range"
            min={200}
            max={1200}
            step={100}
            value={1400 - speedMs}
            onChange={(e) => setSpeedMs(1400 - Number(e.target.value))}
            className="w-24 accent-blue-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
