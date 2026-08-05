import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService, type UserProfile } from "../services/authService";
import Navbar from "../components/Navbar";
import { subscriptionService, type UserSubscriptionData } from "../services/subscriptionService";
import { SubscriptionBadge } from "../components/subscription/SubscriptionBadge";

const PRESET_AVATARS = [
  "https://api.dicebear.com/7.x/bottts/svg?seed=antigravity1",
  "https://api.dicebear.com/7.x/bottts/svg?seed=developer42",
  "https://api.dicebear.com/7.x/bottts/svg?seed=coder99",
  "https://api.dicebear.com/7.x/bottts/svg?seed=techstar",
  "https://api.dicebear.com/7.x/bottts/svg?seed=engineer12",
];

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userSub, setUserSub] = useState<UserSubscriptionData>(subscriptionService.getSubscription());

  // Profile Edit Form State
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Password Change Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setUser(currentUser);
    setName(currentUser.name || "");
    setAvatar(currentUser.avatar || "");

    subscriptionService.fetchSubscriptionFromBackend().then((sub) => {
      setUserSub(sub);
    });

    // Fetch fresh profile from backend
    authService.fetchProfile().then((freshUser) => {
      if (freshUser) {
        setUser(freshUser);
        setName(freshUser.name || "");
        setAvatar(freshUser.avatar || "");
      }
    });
  }, [navigate]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileSuccess(null);
    setProfileError(null);

    try {
      const res = await authService.updateProfile(name, avatar);
      setUser(res.user);
      setProfileSuccess("Profile updated successfully!");
      setTimeout(() => setProfileSuccess(null), 3000);
    } catch (err: any) {
      setProfileError(err.message || "Failed to update profile.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    setPasswordLoading(true);
    setPasswordSuccess(null);
    setPasswordError(null);

    try {
      const res = await authService.changePassword(currentPassword, newPassword);
      setPasswordSuccess(res.message || "Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(null), 3000);
    } catch (err: any) {
      setPasswordError(err.message || "Failed to change password.");
    } finally {
      setPasswordLoading(false);
    }
  };


  if (!user) return null;

  const formattedJoinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recently Joined";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="max-w-4xl w-full mx-auto p-6 flex-1 space-y-8 my-6">
        {/* Page Title */}
        <div>
          <h1 className="text-3xl font-bold text-white">Account Settings & Profile 👤</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage your personal profile details, account status, and security settings.
          </p>
        </div>

        {/* User Info Overview Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar Section */}
          <div className="relative group">
            {avatar ? (
              <img
                src={avatar}
                alt={user.name}
                className="w-24 h-24 rounded-2xl object-cover border-2 border-blue-500/50 shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-3xl flex items-center justify-center border-2 border-blue-500/50 shadow-lg uppercase">
                {user.name.charAt(0)}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                <p className="text-gray-400 text-sm">{user.email}</p>
              </div>

              {/* Status Badges */}
              <div className="flex items-center justify-center md:justify-end gap-2 flex-wrap">
                {/* Email Verification Status Badge */}
                <span
                  className={`text-xs px-3 py-1 rounded-full font-semibold border ${
                    user.isEmailVerified || user.isVerified
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                  }`}
                >
                  {user.isEmailVerified || user.isVerified ? "Verified ✓" : "Unverified ⏳"}
                </span>

                {/* Provider Badge */}
                <span className="text-xs px-3 py-1 rounded-full font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30 capitalize">
                  {user.provider || user.authProvider || "email"} Login
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs text-gray-400">
              <div>
                <span className="block text-gray-500 uppercase font-semibold">Account Provider</span>
                <span className="font-medium text-slate-200 capitalize">{user.provider || "email"}</span>
              </div>
              <div>
                <span className="block text-gray-500 uppercase font-semibold">Email Verification</span>
                <span className="font-medium text-slate-200">
                  {user.isEmailVerified || user.isVerified ? "Verified Account" : "Verification Pending"}
                </span>
              </div>
              <div>
                <span className="block text-gray-500 uppercase font-semibold">Joined Date</span>
                <span className="font-medium text-slate-200">{formattedJoinedDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* SUBSCRIPTION & USAGE STATS CARD */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Subscription & Plan Status</h3>
                <SubscriptionBadge plan={userSub.plan} />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Status: <span className="font-semibold text-emerald-400">{userSub.plan === "FREE" ? "Active Free Tier" : `${userSub.plan} Plan Active`}</span>
              </p>
            </div>

            <Link
              to="/pricing"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg transition"
            >
              {userSub.plan === "FREE" ? "Upgrade Plan" : "Manage Subscription"}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-1">
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
              <span className="text-gray-400 font-semibold block">AI Interviews Today</span>
              <span className="text-lg font-extrabold text-white font-mono">
                {userSub.plan === "FREE" ? `${userSub.dailyInterviewCount} / 3` : "Unlimited"}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
              <span className="text-gray-400 font-semibold block">Resume Analyses Today</span>
              <span className="text-lg font-extrabold text-white font-mono">
                {userSub.plan === "FREE" ? `${userSub.dailyResumeCount} / 3` : "Unlimited"}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
              <span className="text-gray-400 font-semibold block">Coding Challenges Today</span>
              <span className="text-lg font-extrabold text-white font-mono">
                {userSub.plan === "FREE" ? `${userSub.dailyCodingCount} / 5` : "Unlimited"}
              </span>
            </div>
          </div>
        </div>

        {/* Update Profile & Change Password Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form 1: Update Profile */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Update Profile Details</h2>
              <p className="text-xs text-gray-400 mb-6">
                Update your display name and avatar picture.
              </p>

              {profileSuccess && (
                <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-lg text-center font-medium">
                  {profileSuccess}
                </div>
              )}

              {profileError && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg text-center">
                  {profileError}
                </div>
              )}

              <form id="profile-form" onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 rounded-lg bg-slate-800 text-white outline-none border border-slate-700 focus:border-blue-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Avatar Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/avatar.jpg"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className="w-full p-3 rounded-lg bg-slate-800 text-white outline-none border border-slate-700 focus:border-blue-500 transition"
                  />
                </div>

                {/* Preset Avatar Selection */}
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Or Choose a Preset Avatar:</label>
                  <div className="flex gap-2 flex-wrap">
                    {PRESET_AVATARS.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatar(url)}
                        className={`p-1 rounded-xl border transition ${
                          avatar === url ? "border-blue-500 bg-blue-500/20" : "border-slate-700 hover:border-slate-500 bg-slate-800"
                        }`}
                      >
                        <img src={url} alt={`Avatar ${idx}`} className="w-10 h-10 rounded-lg" />
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            </div>

            <button
              type="submit"
              form="profile-form"
              disabled={profileLoading}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition py-3 rounded-lg text-white font-semibold shadow-lg shadow-blue-600/30"
            >
              {profileLoading ? "Saving Changes..." : "Update Profile"}
            </button>
          </div>

          {/* Form 2: Change Password */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Change Password</h2>
              <p className="text-xs text-gray-400 mb-6">
                Update your account password for enhanced security.
              </p>

              {passwordSuccess && (
                <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-lg text-center font-medium">
                  {passwordSuccess}
                </div>
              )}

              {passwordError && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg text-center">
                  {passwordError}
                </div>
              )}

              <form id="password-form" onSubmit={handleChangePassword} className="space-y-4">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full p-3 pr-10 rounded-lg bg-slate-800 text-white outline-none border border-slate-700 focus:border-blue-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition"
                    >
                      {showCurrentPassword ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full p-3 pr-10 rounded-lg bg-slate-800 text-white outline-none border border-slate-700 focus:border-blue-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition"
                    >
                      {showNewPassword ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full p-3 pr-10 rounded-lg bg-slate-800 text-white outline-none border border-slate-700 focus:border-blue-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition"
                    >
                      {showConfirmPassword ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <button
              type="submit"
              form="password-form"
              disabled={passwordLoading}
              className="mt-6 w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 disabled:opacity-50 transition py-3 rounded-lg text-white font-semibold"
            >
              {passwordLoading ? "Updating Password..." : "Change Password"}
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-gray-600 text-xs py-4 border-t border-slate-900">
        © {new Date().getFullYear()} InterviewAI Pro. All rights reserved.
      </footer>
    </div>
  );
}

export default Profile;
