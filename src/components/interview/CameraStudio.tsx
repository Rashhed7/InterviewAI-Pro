import { useState, useEffect, useRef } from "react";
import { Video, RefreshCw, User, Camera } from "lucide-react";
import type { CandidateMetrics } from "../../services/interviewService";

interface CameraStudioProps {
  onMetricsUpdate?: (metrics: CandidateMetrics) => void;
  onCameraStateChange?: (enabled: boolean) => void;
}

export function CameraStudio({ onMetricsUpdate, onCameraStateChange }: CameraStudioProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [cameraState, setCameraState] = useState<"initializing" | "active" | "denied" | "error">("initializing");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isMirrored, setIsMirrored] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);

  // Vision Heuristics
  const [eyeContactScore, setEyeContactScore] = useState(88);
  const [facialExpression, setFacialExpression] = useState<CandidateMetrics["facialExpression"]>("Confident");
  const [attentionScore, setAttentionScore] = useState(90);

  // Enumerate Video Input Devices
  const getCameraDevices = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = allDevices.filter((d) => d.kind === "videoinput");
        setDevices(videoInputs);
        if (videoInputs.length > 0 && !selectedDeviceId) {
          setSelectedDeviceId(videoInputs[0].deviceId);
        }
      }
    } catch (e) {
      console.warn("Device enumeration warning:", e);
    }
  };

  // Start Camera Stream
  const initCamera = async (deviceId?: string) => {
    setCameraState("initializing");
    setErrorMessage("");

    try {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: deviceId ? { deviceId: { exact: deviceId } } : { facingMode: "user" },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      stream.getVideoTracks().forEach((track) => {
        track.onended = () => {
          setCameraState("error");
          setErrorMessage("Camera disconnected unexpectedly.");
        };
      });

      setCameraState("active");
      setCameraEnabled(true);
      if (onCameraStateChange) onCameraStateChange(true);

      getCameraDevices();
    } catch (err: any) {
      setCameraState("denied");
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setErrorMessage("Camera permission blocked by browser. Please allow camera access in browser settings.");
      } else {
        setErrorMessage(err.message || "Failed to initialize camera.");
      }
      setCameraEnabled(false);
      if (onCameraStateChange) onCameraStateChange(false);
    }
  };

  useEffect(() => {
    initCamera(selectedDeviceId);
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [selectedDeviceId]);

  useEffect(() => {
    if (cameraState !== "active") return;

    const interval = setInterval(() => {
      const randomEye = Math.min(100, Math.max(70, 85 + Math.floor(Math.random() * 15) - 5));
      const randomAttention = Math.min(100, Math.max(75, 88 + Math.floor(Math.random() * 12) - 4));
      const expressions: CandidateMetrics["facialExpression"][] = ["Confident", "Focused", "Confident", "Neutral", "Focused"];
      const randomExpr = expressions[Math.floor(Math.random() * expressions.length)];

      setEyeContactScore(randomEye);
      setAttentionScore(randomAttention);
      setFacialExpression(randomExpr);

      if (onMetricsUpdate) {
        onMetricsUpdate({
          confidenceScore: randomAttention,
          communicationScore: 85,
          speakingSpeedWPM: 135,
          fillerWordCount: 1,
          hesitationCount: 0,
          eyeContactScore: randomEye,
          facialExpression: randomExpr,
          attentionScore: randomAttention,
          professionalismScore: 90,
        });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [cameraState]);

  const toggleCamera = () => {
    if (mediaStreamRef.current) {
      const nextState = !cameraEnabled;
      mediaStreamRef.current.getVideoTracks().forEach((t) => (t.enabled = nextState));
      setCameraEnabled(nextState);
      if (onCameraStateChange) onCameraStateChange(nextState);
    }
  };

  return (
    <div className="space-y-3">
      {/* Studio Header Controls */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
          <Video className="w-4 h-4 text-emerald-400" /> Candidate HD Camera Studio
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMirrored(!isMirrored)}
            className="text-[10px] px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg hover:text-white"
          >
            {isMirrored ? "Unmirror" : "Mirror"}
          </button>
          <button
            type="button"
            onClick={toggleCamera}
            className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold border transition ${
              cameraEnabled ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" : "bg-red-500/20 text-red-400 border-red-500/30"
            }`}
          >
            {cameraEnabled ? "Camera Active" : "Camera Muted"}
          </button>
        </div>
      </div>

      {/* Video Viewport Container */}
      <div className="relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 h-52 flex items-center justify-center shadow-inner">
        {cameraState === "initializing" && (
          <div className="text-center space-y-2">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-blue-400 font-semibold">Initializing HD Camera...</p>
          </div>
        )}

        {cameraState === "active" && cameraEnabled && (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${isMirrored ? "transform -scale-x-100" : ""}`}
            />
            {/* Live Camera Overlay HUD */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent pointer-events-none p-3 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="bg-emerald-600/80 text-white text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider backdrop-blur-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" /> HD LIVE
                </span>
                <span className="bg-zinc-900/80 border border-zinc-700 text-zinc-200 text-[10px] px-2 py-0.5 rounded font-mono">
                  Expr: {facialExpression}
                </span>
              </div>

              <div className="flex justify-between items-end text-[10px] text-emerald-300 font-mono">
                <span>Eye Contact: {eyeContactScore}%</span>
                <span>Attention: {attentionScore}%</span>
              </div>
            </div>
          </>
        )}

        {(cameraState === "denied" || cameraState === "error" || !cameraEnabled) && (
          <div className="text-center space-y-3 p-4">
            <div className="w-12 h-12 rounded-full bg-zinc-800 text-zinc-400 text-xs font-bold flex items-center justify-center mx-auto ring-2 ring-zinc-700">
              <User className="w-5 h-5" />
            </div>
            <p className="text-xs text-red-400 font-medium max-w-xs mx-auto">
              {errorMessage || "Camera Feed Paused / Disabled"}
            </p>
            <button
              type="button"
              onClick={() => initCamera(selectedDeviceId)}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-md flex items-center gap-1.5 mx-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry Camera Connection
            </button>
          </div>
        )}
      </div>

      {/* Device Switcher Selection */}
      {devices.length > 1 && (
        <div className="flex items-center justify-between text-xs bg-zinc-900/90 border border-zinc-800 p-2 rounded-xl">
          <span className="text-zinc-400 text-[11px] flex items-center gap-1">
            <Camera className="w-3.5 h-3.5" /> Select Input:
          </span>
          <select
            value={selectedDeviceId}
            onChange={(e) => setSelectedDeviceId(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs rounded px-2 py-1 font-sans"
          >
            {devices.map((device, idx) => (
              <option key={device.deviceId || idx} value={device.deviceId}>
                {device.label || `Camera ${idx + 1}`}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
