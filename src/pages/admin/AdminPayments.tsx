import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { adminService, type AdminPayment } from "../../services/adminService";

export default function AdminPayments() {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    adminService.getPayments().then((res) => {
      if (res.success) setPayments(res.payments);
    });
  }, []);

  const handleRefund = (payId: string) => {
    if (confirm("Initiate refund for this payment transaction?")) {
      setPayments((prev) =>
        prev.map((p) => (p.id === payId ? { ...p, status: "REFUNDED" } : p))
      );
    }
  };

  const filteredPayments = payments.filter(
    (p) =>
      p.userName.toLowerCase().includes(search.toLowerCase()) ||
      p.paymentId.toLowerCase().includes(search.toLowerCase()) ||
      p.userEmail.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Payment Ledger & Transactions">
      <div className="space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search payments by ID, user, or email..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Payments Table */}
        <div className="glass-card rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-400 uppercase text-[10px] font-extrabold tracking-wider">
                  <th className="px-4 py-3">Transaction ID</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Gateway</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Coupon</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filteredPayments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                    <td className="px-4 py-3.5 font-mono text-[11px] font-bold text-slate-900 dark:text-slate-100">
                      {pay.paymentId}
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-bold text-slate-900 dark:text-slate-100">{pay.userName}</p>
                      <p className="text-[11px] text-slate-400">{pay.userEmail}</p>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">{pay.gateway}</td>
                    <td className="px-4 py-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      ₹{pay.amount}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-[11px] text-slate-500">
                      {pay.couponCode || "-"}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                        pay.status === "SUCCESS" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-red-500/10 text-red-600 dark:text-red-400"
                      }`}>
                        {pay.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-[11px] text-slate-500">
                      {new Date(pay.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3.5 text-right space-x-2">
                      {pay.status === "SUCCESS" && (
                        <button
                          type="button"
                          onClick={() => handleRefund(pay.id)}
                          className="px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 font-bold hover:bg-red-100 transition text-[11px]"
                        >
                          Refund
                        </button>
                      )}
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
