import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Video,
  Code2,
  FileText,
  History,
  BarChart3,
  Settings as SettingsIcon,
  Sparkles,
  PanelLeftClose,
  LogOut,
} from "lucide-react";
import { authService } from "../services/authService";

export const sidebarNavLinks = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "AI Interview", path: "/ai-interview", icon: Video },
  { label: "Coding Studio", path: "/coding-challenge", icon: Code2 },
  { label: "Resume Analyzer", path: "/resume-analyzer", icon: FileText },
  { label: "Reports", path: "/interview-history", icon: History },
  { label: "Analytics", path: "/analytics", icon: BarChart3 },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ collapsed: externalCollapsed, onToggleCollapse }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const [internalCollapsed, setInternalCollapsed] = useState(false);

  const collapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;
  const toggleCollapse = onToggleCollapse || (() => setInternalCollapsed((prev) => !prev));

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <aside
      className={`hidden lg:flex shrink-0 flex-col sticky top-0 h-screen border-r border-slate-200/80 bg-white/90 backdrop-blur-xl transition-all duration-300 z-30 dark:border-slate-800 dark:bg-[#0b0f19]/90 warm:border-[#e2d9c8] warm:bg-[#fffdf9]/95 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Sidebar Header Logo */}
      <div className={`flex h-16 items-center border-b border-slate-200/80 px-3.5 dark:border-slate-800 warm:border-[#e2d9c8] ${collapsed ? "justify-center" : "justify-between gap-2"}`}>
        {collapsed ? (
          <button
            type="button"
            onClick={toggleCollapse}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 transition hover:bg-amber-500/20 dark:bg-indigo-500/20 dark:text-indigo-400 warm:bg-amber-600/20 warm:text-amber-800"
            title="Expand Sidebar"
          >
            <Sparkles className="h-5 w-5" />
          </button>
        ) : (
          <>
            <Link to="/dashboard" className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-950 warm:bg-[#d97706] warm:text-white">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <span className="truncate text-xs font-extrabold tracking-tight text-slate-900 dark:text-slate-100 warm:text-[#2c251e]">
                InterviewAI <span className="font-mono text-[10px] text-amber-600 dark:text-indigo-400 warm:text-amber-700">PRO</span>
              </span>
            </Link>

            <button
              type="button"
              onClick={toggleCollapse}
              className="shrink-0 rounded-xl p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white warm:text-[#736758] warm:hover:bg-[#eae3d2]"
              aria-label="Collapse sidebar"
              title="Collapse sidebar"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 p-3 overflow-y-auto custom-scrollbar">
        {sidebarNavLinks.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-xs font-bold transition-all duration-200 ${
                isActive
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/10 dark:bg-indigo-600 dark:text-white warm:bg-[#d97706] warm:text-white"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100 warm:text-[#736758] warm:hover:bg-[#eae3d2]/70 warm:hover:text-[#2c251e]"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-amber-400 dark:text-white warm:text-white" : ""}`} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer User Info & Settings */}
      <div className="border-t border-slate-200/80 p-3.5 dark:border-slate-800 warm:border-[#e2d9c8]">
        {currentUser && (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-xs font-bold text-amber-700 dark:bg-indigo-500/20 dark:text-indigo-400 warm:bg-amber-600/20 warm:text-amber-800 uppercase">
              {currentUser.name ? currentUser.name[0] : "U"}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-slate-900 dark:text-slate-100 warm:text-[#2c251e]">{currentUser.name}</p>
                <p className="truncate text-[10px] text-slate-500 dark:text-slate-400 warm:text-[#736758]">{currentUser.email}</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-3 flex items-center gap-1">
          <Link
            to="/settings"
            className={`flex items-center gap-2 rounded-xl p-2 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white warm:text-[#736758] warm:hover:bg-[#eae3d2] ${
              collapsed ? "w-full justify-center" : "flex-1"
            }`}
            title="Account Settings"
          >
            <SettingsIcon className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Settings</span>}
          </Link>

          {!collapsed && (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl p-2 text-red-500 hover:bg-red-50 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-950/30 warm:hover:bg-red-100/50"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
