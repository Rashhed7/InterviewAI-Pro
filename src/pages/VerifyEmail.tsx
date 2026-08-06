import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "../services/authService";

function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !otp) {
      setError("Please enter both your email address and 6-digit OTP code.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await authService.verifyEmailOTP(email, otp);
      // Clear token so user logs in cleanly on login page
      authService.logout();
      setSuccessMsg(res.message || "Email verified successfully! Redirecting to login...");

      setTimeout(() => {
        navigate(`/login?verified=true&email=${encodeURIComponent(email)}`);
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Verification failed. Please check your OTP code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      setError("Please enter your email address to resend the code.");
      return;
    }

    setResending(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await authService.resendOTP(email);
      setSuccessMsg(res.message || "Verification code sent to your email!");
    } catch (err: any) {
      setError(err.message || "Failed to resend code.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between p-6">
      {/* Navbar */}
      <div className="flex justify-between items-center max-w-6xl w-full mx-auto">
        <Link
          to="/"
          className="text-2xl font-bold text-white hover:opacity-90 transition"
        >
          🤖 InterviewAI Pro
        </Link>
        <Link
          to="/login"
          className="text-gray-400 hover:text-white transition text-sm font-medium"
        >
          Back to Login →
        </Link>
      </div>

      {/* Main Form */}
      <div className="flex justify-center items-center flex-1 my-auto">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
          <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-xl flex items-center justify-center mx-auto mb-4 text-2xl">
            ✉️
          </div>

          <h1 className="text-2xl font-bold text-center text-white">
            Verify Email Address
          </h1>
          <p className="text-center text-gray-400 mt-2 text-sm">
            Enter the 6-digit OTP code sent to your email address (check Inbox & Spam folder).
          </p>

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm text-center font-medium">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-4 mt-6">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-slate-800 border border-slate-700 p-3 text-white focus:border-blue-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">
                6-Digit Verification Code (OTP)
              </label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="w-full rounded-lg bg-slate-800 border border-slate-700 p-3 text-center text-2xl tracking-widest font-mono text-white focus:border-blue-500 outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition rounded-lg py-3 text-white font-semibold shadow-lg shadow-blue-600/30 mt-2"
            >
              {loading ? "Verifying..." : "Verify Email & Continue"}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-xs text-gray-400 border-t border-slate-800 pt-4">
            <span>Didn't get code?</span>
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={resending}
              className="text-blue-400 hover:underline font-medium disabled:opacity-50"
            >
              {resending ? "Sending..." : "Resend OTP Code"}
            </button>
          </div>
        </div>
      </div>

      <div className="text-center text-gray-600 text-xs py-4">
        © {new Date().getFullYear()} InterviewAI Pro. All rights reserved.
      </div>
    </div>
  );
}

export default VerifyEmail;
