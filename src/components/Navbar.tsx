import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Moon,
  Bell,
  LogOut,
  ChevronDown,
  Menu,
  X,
  ShieldCheck,
  Settings as SettingsIcon,
  CreditCard,
} from "lucide-react";
import { authService } from "../services/authService";
import { useTheme } from "../context/ThemeContext";
import { subscriptionService } from "../services/subscriptionService";
import { SubscriptionBadge } from "./subscription/SubscriptionBadge";

export function Navbar() {
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
    navigate("/");
  };

  // Smooth scroll handler for section anchors
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetElement = document.querySelector(href);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="sticky top-4 z-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      <div className="flex items-center justify-between gap-4 rounded-full bg-slate-950/70 border border-slate-800/60 backdrop-blur-xl px-5 py-2.5 shadow-2xl transition-all duration-300">
        {/* BRAND LOGO (LEFT) */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <span className="text-base font-extrabold text-slate-100 tracking-tight group-hover:text-cyan-400 transition-colors">
            InterviewAI
          </span>
          <span className="px-2 py-0.5 text-[11px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full font-mono">
            PRO
          </span>
        </Link>

        {/* CENTER NAVIGATION LINKS */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            onClick={(e) => handleNavClick(e, "#features")}
            className="text-sm font-medium text-slate-400 hover:text-slate-100 transition-colors"
          >
            Features
          </a>
          <a
            href="#workflow"
            onClick={(e) => handleNavClick(e, "#workflow")}
            className="text-sm font-medium text-slate-400 hover:text-slate-100 transition-colors"
          >
            Workflow
          </a>
          <Link
            to="/pricing"
            className="text-sm font-medium text-slate-400 hover:text-slate-100 transition-colors"
          >
            Pricing
          </Link>
          <a
            href="#faq"
            onClick={(e) => handleNavClick(e, "#faq")}
            className="text-sm font-medium text-slate-400 hover:text-slate-100 transition-colors"
          >
            FAQ
          </a>
        </nav>

        {/* ACTIONS & CONTROLS (RIGHT) */}
        <div className="flex items-center gap-3">
          {/* Elegant Icon-Only Theme Switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-full border border-slate-800/80 bg-slate-900/60 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 hover:bg-slate-900 transition-all duration-200"
            title="Toggle theme"
          >
            {effectiveTheme === "dark" ? (
              <Moon className="w-4 h-4 text-cyan-400" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {currentUser ? (
            <>
              {/* Notifications Toggle */}
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 rounded-full border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-100 transition relative"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400" />
                </button>

                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-80 rounded-2xl border border-slate-800 bg-slate-950/95 backdrop-blur-2xl p-4 shadow-2xl z-50 space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                          Notifications
                        </span>
                        <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded font-mono font-bold">
                          Live Updates
                        </span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                          <span className="font-semibold text-slate-100 flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Session Engine Ready
                          </span>
                          <p className="text-[11px] text-slate-400">
                            Real-time AI voice evaluation and coding studio active.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-2.5 pr-2 rounded-full border border-slate-800 bg-slate-900/80 hover:border-slate-700 transition"
                >
                  <div className="w-6 h-6 rounded-full bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center uppercase">
                    {currentUser.name ? currentUser.name.charAt(0) : "U"}
                  </div>
                  <span className="text-xs font-semibold text-slate-200 hidden sm:inline">
                    {currentUser.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-56 rounded-2xl border border-slate-800 bg-slate-950/95 backdrop-blur-2xl p-2 shadow-2xl z-50 space-y-1 text-xs"
                    >
                      <div className="p-3 border-b border-slate-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-slate-100 truncate">{currentUser.name}</p>
                          <SubscriptionBadge plan={userPlan} />
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                      </div>

                      <Link
                        to="/pricing"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full text-left px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-900 flex items-center gap-2 font-medium"
                      >
                        <CreditCard className="w-4 h-4 text-slate-400" /> Pricing & Plans
                      </Link>

                      <Link
                        to="/settings"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full text-left px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-900 flex items-center gap-2 font-medium"
                      >
                        <SettingsIcon className="w-4 h-4 text-slate-400" /> Account Settings
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 rounded-xl text-red-400 hover:bg-red-950/40 flex items-center gap-2 font-semibold"
                      >
                        <LogOut className="w-4 h-4" /> Log Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              {/* Sign In Ghost Link */}
              <Link
                to="/login"
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-2 py-1"
              >
                Sign In
              </Link>

              {/* Get Started Gradient Pill Button */}
              <Link
                to="/register"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-95 text-slate-950 font-bold text-sm px-5 py-2 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:scale-[1.03] active:scale-[0.97] shrink-0"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMenuBarOpen(!menuBarOpen)}
            className="p-2 rounded-full border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-100 md:hidden"
          >
            {menuBarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {menuBarOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden mt-2 border border-slate-800 rounded-2xl bg-slate-950/95 backdrop-blur-2xl px-5 py-4 space-y-3 shadow-2xl"
          >
            <a
              href="#features"
              onClick={(e) => {
                handleNavClick(e, "#features");
                setMenuBarOpen(false);
              }}
              className="block text-sm font-medium text-slate-300 hover:text-cyan-400"
            >
              Features
            </a>
            <a
              href="#workflow"
              onClick={(e) => {
                handleNavClick(e, "#workflow");
                setMenuBarOpen(false);
              }}
              className="block text-sm font-medium text-slate-300 hover:text-cyan-400"
            >
              Workflow
            </a>
            <Link
              to="/pricing"
              onClick={() => setMenuBarOpen(false)}
              className="block text-sm font-medium text-slate-300 hover:text-cyan-400"
            >
              Pricing
            </Link>
            <a
              href="#faq"
              onClick={(e) => {
                handleNavClick(e, "#faq");
                setMenuBarOpen(false);
              }}
              className="block text-sm font-medium text-slate-300 hover:text-cyan-400"
            >
              FAQ
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
