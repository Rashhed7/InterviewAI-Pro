import { useEffect, useRef, useState, useCallback } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { getFrameUrl, TOTAL_FRAMES, type HeroFeature } from "../data/landing";
import { Loader2, Play, Pause, RotateCcw } from "lucide-react";

interface InteractiveCanvasHeroProps {
  activeFeature: HeroFeature;
  isFullScreen?: boolean;
}

export default function InteractiveCanvasHero({ activeFeature, isFullScreen = true }: InteractiveCanvasHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [imagesLoadedCount, setImagesLoadedCount] = useState<number>(0);
  const [isPreloading, setIsPreloading] = useState<boolean>(true);
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Global window scroll bound frame index transformation
  const { scrollYProgress } = useScroll();

  const scrollFrameIndex = useTransform(scrollYProgress, [0, 0.85], [1, TOTAL_FRAMES]);

  // Preload image sequence frames
  useEffect(() => {
    let isCancelled = false;
    setIsPreloading(true);
    setImagesLoadedCount(0);

    const loadedImages: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    let loadedCounter = 0;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFrameUrl(i, activeFeature.folderPath);
      
      img.onload = () => {
        if (isCancelled) return;
        loadedImages[i - 1] = img;
        loadedCounter++;
        setImagesLoadedCount(loadedCounter);

        if (loadedCounter >= 15 && isPreloading) {
          setIsPreloading(false);
        }
      };

      img.onerror = () => {
        if (isCancelled) return;
        loadedCounter++;
        setImagesLoadedCount(loadedCounter);
      };
    }

    setImages(loadedImages);

    return () => {
      isCancelled = true;
    };
  }, [activeFeature.folderPath]);

  // Render current frame onto HTML5 Canvas with High-Quality Sharpening
  const renderFrame = useCallback((frameNumber: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imgIndex = Math.min(Math.max(Math.floor(frameNumber) - 1, 0), TOTAL_FRAMES - 1);
    const img = images[imgIndex];

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const dpr = Math.max(window.devicePixelRatio || 1, 2); // Force minimum 2x Retina DPI for razor sharpness
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    // High quality sharp image smoothing settings
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Aspect cover scaling algorithm
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = width / height;

    let drawWidth = width;
    let drawHeight = height;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasAspect > imgAspect) {
      drawHeight = width / imgAspect;
      offsetY = (height - drawHeight) / 2;
    } else {
      drawWidth = height * imgAspect;
      offsetX = (width - drawWidth) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    ctx.restore();
  }, [images]);

  // Auto-play interval animation when enabled
  useEffect(() => {
    if (!isPlaying || isPreloading) return;

    const interval = setInterval(() => {
      setCurrentFrameIndex((prev) => (prev >= TOTAL_FRAMES ? 1 : prev + 1));
    }, 40); // ~25 FPS

    return () => clearInterval(interval);
  }, [isPlaying, isPreloading]);

  // Sync scroll animation
  useEffect(() => {
    const unsubscribe = scrollFrameIndex.on("change", (latest) => {
      if (!isPlaying) {
        const frame = Math.round(latest);
        setCurrentFrameIndex(frame);
      }
    });
    return () => unsubscribe();
  }, [scrollFrameIndex, isPlaying]);

  // Render on frame index change
  useEffect(() => {
    renderFrame(currentFrameIndex);
  }, [currentFrameIndex, renderFrame]);

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      renderFrame(currentFrameIndex);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentFrameIndex, renderFrame]);

  // Trigger initial frame render as soon as images are ready
  useEffect(() => {
    if (images.length > 0 && images[0]?.complete) {
      renderFrame(currentFrameIndex);
    }
  }, [images, currentFrameIndex, renderFrame]);

  // Mouse move interactive scrubbing handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPlaying) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const frame = Math.max(1, Math.round(percentage * TOTAL_FRAMES));
    setCurrentFrameIndex(frame);
  };

  const loadProgress = Math.min(100, Math.round((imagesLoadedCount / TOTAL_FRAMES) * 100));

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={
        isFullScreen
          ? "fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-[#09090B]"
          : "relative w-full h-[380px] sm:h-[480px] lg:h-[540px] rounded-3xl overflow-hidden bg-slate-950 border border-slate-800/80 shadow-2xl group cursor-crosshair z-10"
      }
    >
      {/* HTML5 Canvas Element - Crisp High-DPI Sharpness */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover opacity-100 block transition-opacity duration-300"
      />

      {/* Ambient Radial Vignette */}
      {isFullScreen ? (
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090B]/70 via-transparent to-[#09090B]/30 pointer-events-none z-10" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/20 pointer-events-none z-10" />
      )}

      {/* Preloading Overlay */}
      {isPreloading && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center space-y-4 z-30 pointer-events-auto">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-xs font-bold text-slate-200">Loading High-Definition 240-Frame Canvas</p>
            <p className="text-[11px] text-slate-400 font-mono">{loadProgress}% ({imagesLoadedCount}/{TOTAL_FRAMES} Frames)</p>
          </div>
          <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-300"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* HUD Controls */}
      <div className={isFullScreen ? "fixed bottom-6 right-6 flex items-center gap-3 z-40 pointer-events-auto" : "absolute bottom-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-auto"}>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 text-xs font-bold text-slate-200 shadow-2xl">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span style={{ color: activeFeature.themeColor }}>{activeFeature.badge}</span>
          <span className="text-slate-600">|</span>
          <span className="font-mono text-cyan-400">FRAME {currentFrameIndex}/{TOTAL_FRAMES}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2.5 rounded-xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 text-slate-200 hover:text-white hover:border-slate-700 transition shadow-2xl"
            title={isPlaying ? "Pause Auto-play" : "Play Sequence"}
          >
            {isPlaying ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-cyan-400" />}
          </button>

          <button
            type="button"
            onClick={() => setCurrentFrameIndex(1)}
            className="p-2.5 rounded-xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 text-slate-200 hover:text-white hover:border-slate-700 transition shadow-2xl"
            title="Reset Animation to Frame 1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
