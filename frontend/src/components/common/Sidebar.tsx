import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  UserCheck,
  FileCheck2,
  Code2,
  FileText,
  ScanSearch,
  Sparkles,
  Milestone,
  MessagesSquare,
  Building2,
  Settings,
  Users,
  Database,
  Mail,
  BarChart3,
  GraduationCap
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { role, user } = useAuth();

  const studentNav = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Profile', path: '/profile', icon: UserCheck },
    { label: 'Assessments', path: '/assessments', icon: FileCheck2 },
    { label: 'Coding Practice', path: '/coding', icon: Code2 },
    { label: 'AI Resume Builder', path: '/resume-builder', icon: FileText },
    { label: 'ATS Analyzer', path: '/ats-analyzer', icon: ScanSearch },
    { label: 'Skill Gap Intelligence', path: '/skill-gap', icon: Sparkles },
    { label: 'Personalized Roadmap', path: '/roadmap', icon: Milestone },
    { label: 'Interview Prep', path: '/interview-prep', icon: MessagesSquare },
    { label: 'Placement Drives', path: '/placements', icon: Building2 },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const adminNav = [
    { label: 'Admin Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Students Roster', path: '/admin/students', icon: Users },
    { label: 'Assessments Manager', path: '/admin/assessments', icon: FileCheck2 },
    { label: 'Question Bank', path: '/admin/questions', icon: Database },
    { label: 'Coding Problems', path: '/admin/coding', icon: Code2 },
    { label: 'Placement Drives', path: '/admin/placements', icon: Building2 },
    { label: 'Bulk Email Automation', path: '/admin/bulk-email', icon: Mail },
    { label: 'Analytics & Trends', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const navItems = role === 'admin' ? adminNav : studentNav;

  return (
    <aside className="w-64 bg-white/80 backdrop-blur-md border-r border-slate-200/80 flex flex-col h-[calc(100vh-4rem)] sticky top-16 shadow-soft">
      {/* Role Pill Banner */}
      <div className="p-4 pb-2">
        <div className={`p-3 rounded-2xl border flex items-center gap-3 ${
          role === 'admin'
            ? 'bg-purple-50/70 border-purple-200/70 text-purple-900'
            : 'bg-indigo-50/70 border-indigo-200/70 text-indigo-900'
        }`}>
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white shadow-sm ${
            role === 'admin' ? 'bg-purple-700' : 'bg-indigo-600'
          }`}>
            <GraduationCap className="w-4 h-4" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {role === 'admin' ? 'Placement Cell' : 'Student Portal'}
            </p>
            <p className="text-sm font-bold truncate text-slate-800">
              {user?.full_name || 'NexPrep User'}
            </p>
          </div>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard' || item.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-purple-700 text-white shadow-sm shadow-purple-200 font-semibold'
                    : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50/60'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Footer Info */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/40 text-[11px] text-slate-500 flex items-center justify-between">
        <span className="font-semibold text-purple-700">NEXPREP v1.0</span>
        <span className="text-emerald-600 font-medium flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Live API
        </span>
      </div>
    </aside>
  );
};
