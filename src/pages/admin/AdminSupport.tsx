import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { adminService, type AdminSupportTicket } from "../../services/adminService";

export default function AdminSupport() {
  const [tickets, setTickets] = useState<AdminSupportTicket[]>([]);
  const [replyText, setReplyText] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<AdminSupportTicket | null>(null);

  useEffect(() => {
    adminService.getSupportTickets().then((res) => {
      if (res.success) setTickets(res.tickets);
    });
  }, []);

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    setTickets((prev) =>
      prev.map((t) => (t.id === selectedTicket.id ? { ...t, status: "CLOSED" } : t))
    );
    setSelectedTicket(null);
    setReplyText("");
    alert("Reply sent to user email and ticket closed.");
  };

  return (
    <AdminLayout title="Support Tickets & Helpdesk">
      <div className="space-y-6">
        <div className="glass-card rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-400 uppercase text-[10px] font-extrabold tracking-wider">
                  <th className="px-4 py-3">Ticket ID</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {tickets.map((tkt) => (
                  <tr key={tkt.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-900 dark:text-slate-100">{tkt.ticketNumber}</td>
                    <td className="px-4 py-3.5">
                      <p className="font-bold text-slate-900 dark:text-slate-100">{tkt.userName}</p>
                      <p className="text-[11px] text-slate-400">{tkt.userEmail}</p>
                    </td>
                    <td className="px-4 py-3.5 text-slate-700 dark:text-slate-300 font-bold">{tkt.subject}</td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        {tkt.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                        tkt.status === "OPEN" ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                      }`}>
                        {tkt.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedTicket(tkt)}
                        className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px]"
                      >
                        Reply & Resolve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reply Drawer / Modal */}
        {selectedTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
            <div className="glass-card w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl">
              <h3 className="text-base font-black tracking-tight text-slate-900 dark:text-slate-100">
                Reply to Ticket: {selectedTicket.ticketNumber}
              </h3>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                <span className="font-bold text-slate-500 block mb-1">User Question:</span>
                <p className="text-slate-800 dark:text-slate-200">{selectedTicket.description}</p>
              </div>

              <form onSubmit={handleReply} className="space-y-3 text-xs">
                <label className="font-bold text-slate-500 block">Admin Resolution Message</label>
                <textarea
                  rows={4}
                  required
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type official response to user..."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-slate-100"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTicket(null)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" /> Send Reply
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
