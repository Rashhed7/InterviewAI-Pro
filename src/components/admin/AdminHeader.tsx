import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Sun, Moon, ShieldCheck, User, LogOut } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { authService } from "../../services/authService";
import { GlobalAdminSearchModal } from "./GlobalAdminSearchModal";

interface AdminHeaderProps {
  title?: string;
}

export function AdminHeader({ title = "Enterprise Admin Console" }: AdminHeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const currentUser = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <>
      <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 sm:px-6 backdrop-blur-xl dark:border-slate-800 dark:bg-[#090d16]/95 warm:border-[#e2d9c8] warm:bg-[#fffdf9]/95">
        {/* Left: Section Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold text-xs lg:hidden">
            <ShieldCheck className="h-4 w-4 text-amber-500" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tight text-slate-900 dark:text-slate-100 uppercase">
              {title}
            </h1>
            <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Systems Operational</span>
            </div>
          </div>
        </div>

        {/* Middle / Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Global Search Button */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-100/70 px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-200/60 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400 dark:hover:bg-slate-800 transition-all"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Search platform...</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[9px] font-mono font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* User Dashboard Switch */}
          <Link
            to="/dashboard"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            User App →
          </Link>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            title={`Switch theme (Current: ${theme})`}
          >
            {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-600" />}
          </button>

          {/* Admin Profile Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-xl p-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-white text-xs font-bold dark:bg-indigo-600">
                {currentUser?.name ? currentUser.name[0] : "A"}
              </div>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-slate-200/80 bg-white p-2 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in duration-150 z-50">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{currentUser?.name || "Admin"}</p>
                  <p className="text-[10px] text-slate-400 truncate">{currentUser?.email}</p>
                </div>
                <div className="py-1 space-y-1">
                  <Link
                    to="/admin/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <User className="h-3.5 w-3.5" /> Profile & Settings
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40"
                  >
                    <LogOut className="h-3.5 w-3.5" /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Admin Search Modal */}
      <GlobalAdminSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
