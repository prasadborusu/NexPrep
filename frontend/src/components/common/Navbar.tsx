import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles,
  ShieldCheck,
  User,
  LogOut,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, role, switchRole, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isLanding = location.pathname === '/';

  return (
    <header className="sticky top-0 z-50 glass-nav border-b border-purple-100/60 bg-[#FBFAFF]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-700 via-purple-600 to-pink-500 p-0.5 shadow-sm group-hover:shadow-glow transition-all">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center p-1.5">
              <img src="/logo.svg" alt="NexPrep Logo" className="w-full h-full object-contain" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-purple-800 via-purple-700 to-pink-600 bg-clip-text text-transparent">
                NEXPREP
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                AI MVP
              </span>
            </div>
          </div>
        </Link>

        {/* Center Nav for Landing */}
        {isLanding && (
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <a href="#journey" className="hover:text-purple-700 transition-colors">The Journey</a>
            <a href="#features" className="hover:text-purple-700 transition-colors">Core Modules</a>
            <a href="#ats" className="hover:text-purple-700 transition-colors">ATS Intelligence</a>
            <a href="#coding" className="hover:text-purple-700 transition-colors">Live Compiler</a>
            <a href="#placements" className="hover:text-purple-700 transition-colors">Placement Drives</a>
          </nav>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Role Switcher for Evaluators / Hackathon Judges */}
          <div className="hidden sm:flex items-center bg-purple-50/80 border border-purple-100 p-1 rounded-xl">
            <button
              onClick={() => switchRole('student')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                role === 'student'
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-purple-700'
              }`}
              title="Switch to Student Persona"
            >
              <User className="w-3.5 h-3.5" />
              Student View
            </button>
            <button
              onClick={() => switchRole('admin')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                role === 'admin'
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-purple-700'
              }`}
              title="Switch to Admin Persona"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin View
            </button>
          </div>

          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(role === 'admin' ? '/admin' : '/dashboard')}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-xl transition-all shadow-sm hover:shadow-soft flex items-center gap-1.5"
              >
                Go to {role === 'admin' ? 'Admin Portal' : 'Dashboard'}
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/auth/login"
                className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-purple-700 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/auth/register"
                className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-800 hover:to-purple-700 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
              >
                Get Started
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
