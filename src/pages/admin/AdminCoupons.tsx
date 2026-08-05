import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { adminService, type AdminCoupon } from "../../services/adminService";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<AdminCoupon[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState<"PERCENTAGE" | "FIXED">("PERCENTAGE");
  const [amount, setAmount] = useState("50");
  const [maxUses, setMaxUses] = useState("100");

  useEffect(() => {
    adminService.getCoupons().then((res) => {
      if (res.success) setCoupons(res.coupons);
    });
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const res = await adminService.createCoupon({
      code: code.toUpperCase(),
      description,
      discountType,
      amount: Number(amount),
      maxUses: Number(maxUses),
    });

    if (res.success) {
      setCoupons((prev) => [
        {
          id: "cpn_" + Date.now(),
          code: code.toUpperCase(),
          description,
          discountType,
          amount: Number(amount),
          expiryDate: "2026-12-31T23:59:59.000Z",
          maxUses: Number(maxUses),
          currentUses: 0,
          minPurchase: 0,
          allowedPlans: "PRO,PREMIUM",
          status: "ACTIVE",
        },
        ...prev,
      ]);
      setShowModal(false);
      setCode("");
      setDescription("");
    }
  };

  return (
    <AdminLayout title="Promotional Coupons & Discounts">
      <div className="space-y-6">
        {/* Top Header Controls */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">Create and manage active promotional codes for subscription checkouts.</p>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg transition"
          >
            <Plus className="w-4 h-4" /> Create Coupon
          </button>
        </div>

        {/* Coupons Table */}
        <div className="glass-card rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-400 uppercase text-[10px] font-extrabold tracking-wider">
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Discount</th>
                  <th className="px-4 py-3">Usage</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {coupons.map((cpn) => (
                  <tr key={cpn.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                    <td className="px-4 py-3.5 font-mono font-black text-indigo-600 dark:text-indigo-400 text-sm">
                      {cpn.code}
                    </td>
                    <td className="px-4 py-3.5 text-slate-700 dark:text-slate-300">{cpn.description}</td>
                    <td className="px-4 py-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {cpn.discountType === "PERCENTAGE" ? `${cpn.amount}% OFF` : `₹${cpn.amount} OFF`}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-[11px] text-slate-500">
                      {cpn.currentUses} / {cpn.maxUses} uses
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        {cpn.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setCoupons((prev) => prev.filter((c) => c.id !== cpn.id))}
                        className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="glass-card w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl">
              <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-slate-100">Create Promotional Coupon</h3>
              <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
                <div>
                  <label className="font-extrabold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">Coupon Code</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. SUMMER2026"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-slate-100 uppercase font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">Description</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Special promo description"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-extrabold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">Discount Type</label>
                    <select
                      value={discountType}
                      onChange={(e: any) => setDiscountType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                    >
                      <option value="PERCENTAGE">Percentage (%)</option>
                      <option value="FIXED">Fixed Amount (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-extrabold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">Amount</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-slate-100 font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-extrabold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">Max Uses</label>
                  <input
                    type="number"
                    value={maxUses}
                    onChange={(e) => setMaxUses(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-slate-100 font-mono font-bold"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                  >
                    Save Coupon
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
