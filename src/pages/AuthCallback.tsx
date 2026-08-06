import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    const userStr = searchParams.get("user");
    const err = searchParams.get("error");

    if (err) {
      setError(decodeURIComponent(err));
      setTimeout(() => navigate("/login"), 3000);
      return;
    }

    if (token && userStr) {
      try {
        localStorage.setItem("token", token);
        const parsedUser = JSON.parse(decodeURIComponent(userStr));
        const userObj = {
          ...parsedUser,
          isEmailVerified: true,
        };
        localStorage.setItem("user", JSON.stringify(userObj));

        setTimeout(() => {
          navigate("/dashboard");
        }, 800);
      } catch (e) {
        setError("Failed to parse user session credentials.");
        setTimeout(() => navigate("/login"), 3000);
      }
    } else {
      setError("No authentication token provided.");
      setTimeout(() => navigate("/login"), 3000);
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 flex items-center justify-center p-4 font-sans">
      <div className="max-w-sm w-full rounded-3xl border border-zinc-800 bg-[#111113] p-8 text-center space-y-6 shadow-2xl">
        <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto text-2xl">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>

        {error ? (
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs text-red-400 font-bold">
              <AlertCircle className="w-4 h-4" /> OAuth Error
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">{error}</p>
            <p className="text-[11px] text-zinc-500">Redirecting to login page...</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" /> Authenticated Successfully
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">Completing Sign In</h2>
            <p className="text-xs text-zinc-400">Loading your interview workspace...</p>
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto pt-2" />
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthCallback;
