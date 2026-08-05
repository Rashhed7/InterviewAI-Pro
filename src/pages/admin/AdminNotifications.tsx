import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { adminService } from "../../services/adminService";

export default function AdminNotifications() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState("EVERYONE");
  const [type, setType] = useState("INFO");
  const [sentToast, setSentToast] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    const res = await adminService.sendNotification({ title, message, target, type });
    if (res.success) {
      setSentToast(true);
      setTimeout(() => setSentToast(false), 3000);
      setTitle("");
      setMessage("");
    }
  };

  return (
    <AdminLayout title="System Broadcast Notifications">
      <div className="space-y-6">
        {sentToast && (
          <div className="p-4 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xl animate-in fade-in flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> System notification dispatched to target segment: {target}.
          </div>
        )}

        <div className="glass-card p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Broadcast Alert to Users</h3>

          <form onSubmit={handleSend} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Target Audience</label>
                <select
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-bold"
                >
                  <option value="EVERYONE">All Registered Users</option>
                  <option value="FREE">Free Tier Users Only</option>
                  <option value="PRO">Pro Subscribers Only</option>
                  <option value="PREMIUM">Premium Subscribers Only</option>
                </select>
              </div>

              <div>
                <label className="font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Notification Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-bold"
                >
                  <option value="INFO">Information Notice</option>
                  <option value="SUCCESS">Success Announcement</option>
                  <option value="WARNING">Important Warning</option>
                  <option value="MAINTENANCE">Scheduled Maintenance</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Notification Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Scheduled Maintenance Notice"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-slate-100 font-bold"
              />
            </div>

            <div>
              <label className="font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Broadcast Message Body</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter detailed message to broadcast..."
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-slate-100"
              />
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xl transition"
            >
              <Send className="w-4 h-4" /> Dispatch System Notification
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
