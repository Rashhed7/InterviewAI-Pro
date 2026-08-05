import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Sun,
  Moon,
  Eye,
  Bell,
  LogOut,
  ChevronDown,
  Menu,
  X,
  LayoutDashboard,
  Video,
  Code2,
  FileText,
  History,
  BarChart3,
  Settings as SettingsIcon,
  ShieldCheck,
  Zap,
  CreditCard,
} from "lucide-react";
import { authService } from "../services/authService";
import { useTheme } from "../context/ThemeContext";
import { subscriptionService } from "../services/subscriptionService";
import { SubscriptionBadge } from "./subscription/SubscriptionBadge";

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const { effectiveTheme, toggleTheme } = useTheme();

  const [menuBarOpen, setMenuBarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userPlan, setUserPlan] = useState(subscriptionService.getSubscription().plan);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    subscriptionService.fetchSubscriptionFromBackend().then((sub) => {
      setUserPlan(sub.plan);
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const navLinks = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "AI Interview", path: "/ai-interview", icon: Video },
    { label: "Coding Studio", path: "/coding-challenge", icon: Code2 },
    { label: "Resume Analyzer", path: "/resume-analyzer", icon: FileText },
    { label: "Reports", path: "/interview-history", icon: History },
    { label: "Analytics", path: "/analytics", icon: BarChart3 },
    { label: "Pricing", path: "/pricing", icon: CreditCard },
  ];

  // Determine page title for desktop header
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/dashboard": return "Dashboard";
      case "/ai-interview": return "AI Interview Studio";
      case "/coding-challenge": return "Coding Challenge Studio";
      case "/resume-analyzer": return "ATS Resume Analyzer";
      case "/interview-history": return "Interview Reports";
      case "/analytics": return "Performance Analytics";
      case "/pricing": return "Subscription Plans";
      case "/settings": return "Account Settings";
      default: return "InterviewAI PRO";
    }
  };

  return (
    <header className="sticky top-0 z-20 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-xl transition-colors duration-200 dark:border-slate-800 dark:bg-[#0b0f19]/90 warm:border-[#e2d9c8] warm:bg-[#fffdf9]/95">
      <div className="mx-auto flex h-16 w-full items-center justify-between gap-4 px-4 sm:px-6">
        {/* Navbar Logo & Section Title */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm transition-transform duration-200 group-hover:scale-105 dark:bg-white dark:text-slate-950 warm:bg-[#d97706] warm:text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="flex items-center gap-1 text-sm font-bold text-slate-900 dark:text-slate-100 warm:text-[#2c251e]">
              InterviewAI <span className="text-xs font-mono text-amber-600 dark:text-indigo-400 warm:text-amber-700">PRO</span>
            </span>
          </Link>

          <span className="hidden sm:inline text-xs text-slate-300 dark:text-slate-700 warm:text-[#e2d9c8]">&bull;</span>

          <h1 className="hidden sm:inline text-xs font-bold text-slate-600 dark:text-slate-300 warm:text-[#736758]">
            {getPageTitle()}
          </h1>
        </div>

        {/* Center Navigation (Visible on tablet, hidden on desktop where Sidebar is active) */}
        <nav className="hidden md:flex lg:hidden items-center gap-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800/80 dark:text-zinc-50"
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-blue-600 dark:text-blue-500" : ""}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Conditional Upgrade Button for FREE Users */}
          {userPlan === "FREE" && (
            <Link
              to="/pricing"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-md transition-all hover:scale-105 active:scale-95 shrink-0"
            >
              <Zap className="w-3.5 h-3.5 animate-pulse text-amber-300" />
              <span>Upgrade</span>
            </Link>
          )}

          {/* Theme Switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50/80 px-2.5 py-1.5 text-xs font-semibold text-zinc-700 transition-all hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 warm:border-[#e2d9c8] warm:bg-[#eae3d2]/80 warm:text-[#2c251e] warm:hover:bg-[#dfd7c4]"
            title={
              effectiveTheme === "dark"
                ? "Switch to Eye Comfort Warm Mode"
                : effectiveTheme === "warm"
                ? "Switch to Light Mode"
                : "Switch to Dark Mode"
            }
          >
            {effectiveTheme === "dark" ? (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline text-[11px]">Dark</span>
              </>
            ) : effectiveTheme === "warm" ? (
              <>
                <Eye className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline text-[11px] text-amber-700 font-bold">Eye Comfort</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline text-[11px]">Light</span>
              </>
            )}
          </button>

          {currentUser ? (
            <>
              {/* Notifications Toggle */}
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors relative"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-500" />
                </button>

                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-80 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111113] p-4 shadow-2xl z-50 space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                          Notifications
                        </span>
                        <span className="text-[10px] bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded font-mono font-bold">
                          Live Updates
                        </span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
                          <span className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> Production AI Engine Ready
                          </span>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                            Session memory & per-question analysis active.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center uppercase">
                    {currentUser.name ? currentUser.name.charAt(0) : "U"}
                  </div>
                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 hidden sm:inline">
                    {currentUser.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                </button>

                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111113] p-2 shadow-2xl z-50 space-y-1 text-xs"
                    >
                      <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-zinc-900 dark:text-zinc-100 truncate">{currentUser.name}</p>
                          <SubscriptionBadge plan={userPlan} />
                        </div>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">{currentUser.email}</p>
                      </div>

                      <Link
                        to="/pricing"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full text-left px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 flex items-center gap-2 font-medium"
                      >
                        <CreditCard className="w-4 h-4 text-zinc-400" /> Subscription & Pricing
                      </Link>

                      {((currentUser as any).role === "ADMIN" || (currentUser as any).role === "admin" || currentUser.email === "admin@interviewai.pro" || currentUser.email === "admin@gmail.com") && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="w-full text-left px-3 py-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 flex items-center gap-2 font-extrabold"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-500" /> Admin Console
                        </Link>
                      )}

                      <Link
                        to="/settings"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full text-left px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 flex items-center gap-2 font-medium"
                      >
                        <SettingsIcon className="w-4 h-4 text-zinc-400" /> Account Settings
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2 font-semibold"
                      >
                        <LogOut className="w-4 h-4" /> Log Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="hidden rounded-lg px-4 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-zinc-100 sm:inline-flex"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-zinc-950 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 sm:px-4"
              >
                <span className="sm:hidden">Start</span>
                <span className="hidden sm:inline">Get Started</span>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMenuBarOpen(!menuBarOpen)}
            className="rounded-lg border border-zinc-200 p-2 text-zinc-600 dark:border-zinc-800 dark:text-zinc-400 md:hidden"
          >
            {menuBarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuBarOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090B] px-4 py-3 space-y-2"
          >
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMenuBarOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                >
                  <Icon className="w-4 h-4 text-blue-500" />
                  {item.label}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
