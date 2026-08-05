import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { adminService } from "../../services/adminService";
import { SubscriptionBadge } from "../../components/subscription/SubscriptionBadge";

export default function AdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    adminService.getSubscriptions().then((res: any) => {
      if (res.success) setSubscriptions(res.subscriptions);
    });
  }, []);

  const handleExtend = (_subId: string, days: number) => {
    alert(`Extended subscription by ${days} days.`);
  };

  const filteredSubs = subscriptions.filter(
    (s) =>
      s.userName.toLowerCase().includes(search.toLowerCase()) ||
      s.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      s.plan.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Subscription Management">
      <div className="space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search subscriptions by user or plan..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Subscriptions Table */}
        <div className="glass-card rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-400 uppercase text-[10px] font-extrabold tracking-wider">
                  <th className="px-4 py-3">Subscriber</th>
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3">Recurring Price</th>
                  <th className="px-4 py-3">Cycle</th>
                  <th className="px-4 py-3">Expires At</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filteredSubs.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                    <td className="px-4 py-3.5">
                      <p className="font-bold text-slate-900 dark:text-slate-100">{sub.userName}</p>
                      <p className="text-[11px] text-slate-400">{sub.userEmail}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <SubscriptionBadge plan={sub.plan} />
                    </td>
                    <td className="px-4 py-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      ₹{sub.amount}/mo
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">{sub.billingCycle}</td>
                    <td className="px-4 py-3.5 font-mono text-[11px]">
                      {new Date(sub.expiresAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleExtend(sub.id, 30)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition text-[11px]"
                      >
                        +30 Days
                      </button>
                      <button
                        type="button"
                        onClick={() => handleExtend(sub.id, 365)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 font-bold hover:bg-indigo-100 transition text-[11px]"
                      >
                        +1 Year
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
