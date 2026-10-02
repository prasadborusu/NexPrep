import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FileCheck2,
  Code2,
  FileText,
  ScanSearch,
  Sparkles,
  Milestone,
  MessagesSquare,
  Building2,
  Bell,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  ChevronRight,
  GraduationCap
} from 'lucide-react';

export const StudentLayout: React.FC = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Protected Route Check
  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const studentNavItems = [
    { label: 'Dashboard', to: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Assessments', to: '/student/assessments', icon: FileCheck2 },
    { label: 'Coding Practice', to: '/student/coding', icon: Code2 },
    { label: 'AI Resume', to: '/student/resume', icon: FileText },
    { label: 'Skill Intelligence', to: '/student/skills', icon: Sparkles },
    { label: 'Roadmap', to: '/student/roadmap', icon: Milestone },
    { label: 'Interview Prep', to: '/student/interview', icon: MessagesSquare },
    { label: 'Placements', to: '/student/placements', icon: Building2 },
    { label: 'Notifications', to: '/student/notifications', icon: Bell },
    { label: 'Settings', to: '/student/settings', icon: Settings },
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

          {/* NexPrep Student Portal Brand */}
          <Link to="/student/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6D28D9] via-[#8B5CF6] to-[#EC4899] p-0.5 shadow-xs">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center p-1.5">
                <img src="/logo.svg" alt="NexPrep" className="w-full h-full object-contain" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-[#181525] leading-none">
                NexPrep
              </span>
              <span className="text-[10px] font-semibold text-[#6D28D9] uppercase tracking-wider mt-0.5">
                Student Workspace
              </span>
            </div>
          </Link>
        </div>

        {/* Right side: Notifications & Student Profile */}
        <div className="flex items-center gap-3">
          <Link
            to="/student/notifications"
            className="p-2 rounded-xl text-[#77718A] hover:text-[#6D28D9] hover:bg-purple-50/60 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EC4899]" />
          </Link>

          <div className="h-5 w-px bg-[#EAE6F5]" />

          <Link
            to="/student/profile"
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-purple-50/60 transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-100 border border-purple-200 text-[#6D28D9] font-bold text-xs flex items-center justify-center">
              {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-[#181525] leading-tight">
                {user.full_name || 'Student Candidate'}
              </span>
              <span className="text-[10px] text-[#77718A] leading-tight truncate max-w-[120px]">
                {user.target_role || 'Engineering Student'}
              </span>
            </div>
          </Link>
        </div>
      </header>

      {/* Main Workspace Body: Sidebar + Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-64 bg-white border-r border-[#EAE6F5] flex-col justify-between py-4 px-3 shrink-0">
          <div className="space-y-1">
            <div className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-wider text-[#77718A]">
              Navigation
            </div>
            {studentNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/student/dashboard'}
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

          {/* Bottom user action card */}
          <div className="pt-4 border-t border-[#EAE6F5] space-y-1.5">
            <NavLink
              to="/student/profile"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-purple-100 text-[#6D28D9] font-bold'
                    : 'text-[#77718A] hover:bg-purple-50 hover:text-[#181525]'
                }`
              }
            >
              <User className="w-4 h-4 shrink-0" />
              <span>My Profile</span>
            </NavLink>

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
                  <span className="text-xs font-bold text-[#181525]">Student Portal</span>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {studentNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === '/student/dashboard'}
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

              <div className="pt-4 border-t border-[#EAE6F5] space-y-1">
                <NavLink
                  to="/student/profile"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-[#77718A] hover:bg-purple-50"
                >
                  <User className="w-4 h-4" />
                  <span>My Profile</span>
                </NavLink>
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

        {/* Content Outlet Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
