import { useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { AdminSidebar, adminSidebarLinks } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { Menu, X } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-[#070a12] dark:text-slate-100 warm:bg-[#faf7f0] warm:text-[#2c251e] font-sans antialiased">
      {/* Desktop Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <AdminHeader title={title} />

        {/* Mobile Navigation Drawer Trigger Bar */}
        <div className="flex items-center justify-between border-b border-slate-200/80 bg-white px-4 py-2 lg:hidden dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-bold uppercase text-slate-500">Navigation</span>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-slate-200/80 bg-white p-3 space-y-1 dark:border-slate-800 dark:bg-slate-900 animate-in slide-in-from-top-2 duration-150">
            {adminSidebarLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition ${
                    isActive
                      ? "bg-slate-900 text-white dark:bg-indigo-600 dark:text-white"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}

        {/* Page Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
