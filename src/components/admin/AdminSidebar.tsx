import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Receipt,
  Ticket,
  Cpu,
  Sliders,
  FileSpreadsheet,
  HelpCircle,
  Bell,
  LineChart,
  History,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { authService } from "../../services/authService";

export const adminSidebarLinks = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Users", path: "/admin/users", icon: Users },
  { label: "Subscriptions", path: "/admin/subscriptions", icon: CreditCard },
  { label: "Payments", path: "/admin/payments", icon: Receipt },
  { label: "Coupons", path: "/admin/coupons", icon: Ticket },
  { label: "AI Usage", path: "/admin/ai-usage", icon: Cpu },
  { label: "Feature Limits", path: "/admin/feature-limits", icon: Sliders },
  { label: "Reports", path: "/admin/reports", icon: FileSpreadsheet },
  { label: "Support", path: "/admin/support", icon: HelpCircle },
  { label: "Notifications", path: "/admin/notifications", icon: Bell },
  { label: "Analytics", path: "/admin/analytics", icon: LineChart },
  { label: "Activity Logs", path: "/admin/logs", icon: History },
  { label: "Settings", path: "/admin/settings", icon: Settings },
];

interface AdminSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function AdminSidebar({ collapsed: externalCollapsed, onToggleCollapse }: AdminSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const currentUser = authService.getCurrentUser();

  const collapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;
  const toggleCollapse = onToggleCollapse || (() => setInternalCollapsed((prev) => !prev));

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <aside
      className={`hidden lg:flex shrink-0 flex-col sticky top-0 h-screen border-r border-slate-200/80 bg-white/90 backdrop-blur-xl transition-all duration-300 z-30 dark:border-slate-800 dark:bg-[#090d16]/95 warm:border-[#e2d9c8] warm:bg-[#fffdf9]/95 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header with Enterprise Logo */}
      <div className={`flex h-16 items-center border-b border-slate-200/80 px-4 dark:border-slate-800 warm:border-[#e2d9c8] ${collapsed ? "justify-center" : "justify-between"}`}>
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold text-xs">
              <ShieldCheck className="h-4.5 w-4.5 text-amber-500" />
            </div>
            <div>
              <span className="text-xs font-black tracking-tight text-slate-900 dark:text-slate-100 uppercase">
                InterviewAI
              </span>
              <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 block font-bold">
                Console Console v2.0
              </span>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={toggleCollapse}
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50/80 text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1 p-3 overflow-y-auto custom-scrollbar">
        {adminSidebarLinks.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path !== "/admin" && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-all duration-150 ${
                isActive
                  ? "bg-slate-900 text-white shadow-sm dark:bg-indigo-600 dark:text-white warm:bg-[#2c251e] warm:text-white"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-amber-400 dark:text-white" : ""}`} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer User Info */}
      <div className="border-t border-slate-200/80 p-3.5 dark:border-slate-800 warm:border-[#e2d9c8]">
        {currentUser && (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white text-xs font-bold uppercase dark:bg-indigo-600">
              {currentUser.name ? currentUser.name[0] : "A"}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-slate-900 dark:text-slate-100">{currentUser.name}</p>
                <span className="inline-block px-1.5 py-0.2 text-[9px] font-extrabold uppercase bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded">
                  System Admin
                </span>
              </div>
            )}

            {!collapsed && (
              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
