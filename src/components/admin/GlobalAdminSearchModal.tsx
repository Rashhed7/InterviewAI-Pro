import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, User } from "lucide-react";
import { adminService, type AdminUser } from "../../services/adminService";

interface GlobalAdminSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalAdminSearchModal({ isOpen, onClose }: GlobalAdminSearchModalProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<AdminUser[]>([]);

  useEffect(() => {
    if (isOpen) {
      adminService.getUsers().then((res) => setUsers(res.users));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase()) ||
      u.plan.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="glass-card relative w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users, subscriptions, payments, tickets, coupons..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1 text-xs">
          {query.trim() === "" ? (
            <div className="p-6 text-center text-slate-400 text-xs font-medium">
              Type to search across all platform resources...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs">
              No matching resources found.
            </div>
          ) : (
            <div className="space-y-1">
              <span className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                Users & Accounts ({filteredUsers.length})
              </span>
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate(`/admin/users/${user.id}`);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-100">{user.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{user.email}</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {user.plan}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
