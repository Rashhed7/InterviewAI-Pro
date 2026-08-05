import { useEffect, useRef, useState } from "react";
import { Mic, Volume2 } from "lucide-react";

interface AudioVisualizerProps {
  micEnabled: boolean;
  onVolumeChange?: (volume: number) => void;
}

export function AudioVisualizer({ micEnabled, onVolumeChange }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [micVolume, setMicVolume] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!micEnabled) {
      setMicVolume(0);
      return;
    }

    const initAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        mediaStreamRef.current = stream;

        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;

        const audioCtx = new AudioContextClass();
        audioContextRef.current = audioCtx;
        if (audioCtx.state === "suspended") await audioCtx.resume();

        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        analyser.smoothingTimeConstant = 0.6;
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");

        const drawWaveform = () => {
          if (!analyser || !ctx || !canvas) return;

          analyser.getByteFrequencyData(dataArray);

          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
          const avg = sum / dataArray.length;
          const scaledVolume = Math.min(100, Math.round((avg / 25) * 100));
          setMicVolume(scaledVolume);
          if (onVolumeChange) onVolumeChange(scaledVolume);

          // Draw Canvas Waveform
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const barWidth = (canvas.width / dataArray.length) * 1.5;
          let x = 0;

          for (let i = 0; i < dataArray.length; i++) {
            const barHeight = (dataArray[i] / 255) * canvas.height;
            const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
            gradient.addColorStop(0, "#10b981");
            gradient.addColorStop(1, "#3b82f6");

            ctx.fillStyle = gradient;
            ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);
            x += barWidth;
          }

          animationFrameRef.current = requestAnimationFrame(drawWaveform);
        };

        drawWaveform();
      } catch (err) {
        console.warn("Audio visualizer microphone error:", err);
      }
    };

    initAudio();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      if (audioContextRef.current) audioContextRef.current.close().catch(() => {});
    };
  }, [micEnabled]);

  return (
    <div className="p-3 bg-[#111113] rounded-2xl border border-zinc-800 space-y-2">
      <div className="flex justify-between items-center text-xs font-semibold">
        <span className="text-zinc-300 font-bold flex items-center gap-1.5">
          <Mic className="w-4 h-4 text-blue-400" /> Acoustic Noise Filtered Mic Level:
        </span>
        {micVolume > 5 ? (
          <span className="text-[11px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded font-bold animate-pulse flex items-center gap-1">
            <Volume2 className="w-3 h-3" /> Voice ({micVolume} dB)
          </span>
        ) : (
          <span className="text-[11px] bg-zinc-800 text-zinc-400 border border-zinc-700 px-2 py-0.5 rounded font-medium">
            Listening...
          </span>
        )}
      </div>

      {/* Live Waveform Canvas */}
      <div className="relative rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 p-2 h-12 flex items-center">
        <canvas ref={canvasRef} width={280} height={40} className="w-full h-full" />
      </div>
    </div>
  );
}
