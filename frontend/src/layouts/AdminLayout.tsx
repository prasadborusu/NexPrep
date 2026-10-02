import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  FileCheck2,
  Database,
  Code2,
  Building2,
  Mail,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  ShieldCheck
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Protected Route Check
  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (role !== 'admin') {
    return <Navigate to="/student/dashboard" replace />;
  }

  const adminNavItems = [
    { label: 'Admin Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Students Roster', to: '/admin/students', icon: Users },
    { label: 'Assessments', to: '/admin/assessments', icon: FileCheck2 },
    { label: 'Question Bank', to: '/admin/questions', icon: Database },
    { label: 'Coding Problems', to: '/admin/coding', icon: Code2 },
    { label: 'Placement Drives', to: '/admin/placements', icon: Building2 },
    { label: 'Bulk Email', to: '/admin/emails', icon: Mail },
    { label: 'Analytics & Trends', to: '/admin/analytics', icon: BarChart3 },
    { label: 'Settings', to: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#FBFAFF] text-[#181525] flex flex-col font-sans">
      {/* Top Application Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EAE6F5] h-16 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          {/* Mobile sidebar toggle button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-xl text-[#77718A] hover:text-[#181525] hover:bg-purple-50 transition-colors"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* NexPrep Admin Brand */}
          <Link to="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6D28D9] via-[#8B5CF6] to-[#EC4899] p-0.5 shadow-xs">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center p-1.5">
                <img src="/logo.svg" alt="NexPrep" className="w-full h-full object-contain" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-[#181525] leading-none">
                NexPrep
              </span>
              <span className="text-[10px] font-bold text-[#EC4899] uppercase tracking-wider mt-0.5 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Institutional Administration
              </span>
            </div>
          </Link>
        </div>

        {/* Right side: Admin profile & Logout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-100">
            <Shield className="w-3.5 h-3.5 text-[#6D28D9]" />
            <span className="text-xs font-bold text-[#6D28D9]">
              {user.full_name || 'Placement Director'}
            </span>
          </div>

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-xs font-semibold flex items-center gap-1.5"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Admin Workspace: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Admin Sidebar */}
        <aside className="hidden md:flex w-64 bg-white border-r border-[#EAE6F5] flex-col justify-between py-4 px-3 shrink-0">
          <div className="space-y-1">
            <div className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-wider text-[#77718A]">
              Administration
            </div>
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/admin/dashboard'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#6D28D9] text-white shadow-sm shadow-purple-200'
                        : 'text-[#77718A] hover:text-[#181525] hover:bg-purple-50/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              );
            })}
          </div>

          <div className="pt-4 border-t border-[#EAE6F5]">
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Mobile Slide-in Drawer */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="relative w-64 max-w-[80vw] bg-white h-full border-r border-[#EAE6F5] p-4 flex flex-col justify-between z-10 shadow-2xl">
              <div className="space-y-1">
                <div className="flex items-center justify-between pb-3 border-b border-[#EAE6F5] mb-2">
                  <span className="text-xs font-bold text-[#181525]">Admin Portal</span>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {adminNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === '/admin/dashboard'}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-[#6D28D9] text-white'
                            : 'text-[#77718A] hover:bg-purple-50 hover:text-[#181525]'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-[#EAE6F5]">
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Admin Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
