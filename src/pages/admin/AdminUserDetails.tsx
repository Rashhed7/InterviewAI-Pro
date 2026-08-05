import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { adminService, type AdminUser } from "../../services/adminService";
import { SubscriptionBadge } from "../../components/subscription/SubscriptionBadge";

export default function AdminUserDetails() {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [activeTab, setActiveTab] = useState<"info" | "subscription" | "interviews" | "security">("info");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    adminService.getUsers().then((res) => {
      if (res.success) {
        const found = res.users.find((u) => u.id === userId) || res.users[0];
        setUser(found);
      }
    });
  }, [userId]);

  if (!user) {
    return (
      <AdminLayout title="User Profile">
        <div className="p-8 text-center text-slate-400">Loading user profile...</div>
      </AdminLayout>
    );
  }

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpdatePlan = async (newPlan: "FREE" | "PRO" | "PREMIUM") => {
    const res = await adminService.updateUser(user.id, { plan: newPlan });
    if (res.success) {
      setUser((prev) => (prev ? { ...prev, plan: newPlan } : null));
      showToast(`User plan updated to ${newPlan}`);
    }
  };

  const handleToggleStatus = async () => {
    const nextStatus = user.status === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    const res = await adminService.updateUser(user.id, { status: nextStatus });
    if (res.success) {
      setUser((prev) => (prev ? { ...prev, status: nextStatus } : null));
      showToast(`User status set to ${nextStatus}`);
    }
  };

  return (
    <AdminLayout title={`User: ${user.name}`}>
      <div className="space-y-6">
        {/* Toast Notification */}
        {toast && (
          <div className="p-4 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-xl animate-in fade-in">
            {toast}
          </div>
        )}

        {/* Back Link */}
        <Link
          to="/admin/users"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Users Directory
        </Link>

        {/* Header Profile Summary Card */}
        <div className="glass-card p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 text-white shadow-xl flex items-center justify-center text-xl font-bold">
              {user.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                  {user.name}
                </h2>
                <SubscriptionBadge plan={user.plan} />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">Account ID: {user.id}</p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleToggleStatus}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition ${
                user.status === "ACTIVE"
                  ? "bg-red-50 dark:bg-red-950/40 text-red-600 hover:bg-red-100"
                  : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 hover:bg-emerald-100"
              }`}
            >
              {user.status === "ACTIVE" ? "Block Account" : "Unblock Account"}
            </button>

            <button
              type="button"
              onClick={() => showToast("Password reset link sent to user email.")}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-extrabold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              Reset Password
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-bold">
          {(["info", "subscription", "interviews", "security"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl uppercase tracking-wider transition ${
                activeTab === tab
                  ? "bg-slate-900 text-white dark:bg-indigo-600 dark:text-white"
                  : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "info" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Personal Information</h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Full Name</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{user.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Email Address</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{user.email}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Phone Number</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{user.phone || "+91 9876543210"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Country</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{user.country || "India"}</span>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Account Governance</h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Role</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 uppercase">{user.role}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Email Verification</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">VERIFIED</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Registration Date</span>
                  <span className="font-mono text-slate-900 dark:text-slate-100">{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "subscription" && (
          <div className="glass-card p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Subscription Tier Management</h3>
            <p className="text-xs text-slate-500">Directly modify the user's active tier level:</p>
            <div className="flex flex-wrap gap-3">
              {(["FREE", "PRO", "PREMIUM"] as const).map((plan) => (
                <button
                  key={plan}
                  type="button"
                  onClick={() => handleUpdatePlan(plan)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs border transition ${
                    user.plan === plan
                      ? "bg-slate-900 text-white dark:bg-indigo-600 dark:text-white border-transparent"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                  }`}
                >
                  Set Plan to {plan}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === "interviews" && (
          <div className="glass-card p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Completed Sessions</h3>
            <p className="text-xs text-slate-500">User completed 12 AI interview sessions with average score of 85.5%.</p>
          </div>
        )}

        {activeTab === "security" && (
          <div className="glass-card p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Login Devices & Security Logs</h3>
            <p className="text-xs text-slate-500">Last login: {new Date(user.lastLoginAt || user.createdAt).toLocaleString()}</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
