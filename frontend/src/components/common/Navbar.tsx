import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, LogOut, ChevronRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isLanding = location.pathname === '/';

  return (
    <header className="sticky top-0 z-50 bg-[#FBFAFF]/90 backdrop-blur-md border-b border-[#EAE6F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* LEFT: NexPrep Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6D28D9] via-[#8B5CF6] to-[#EC4899] p-0.5 shadow-sm group-hover:shadow-glow transition-all">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center p-1.5">
              <img src="/logo.svg" alt="NexPrep Logo" className="w-full h-full object-contain" />
            </div>
          </div>
          <span className="font-bold text-lg tracking-tight text-[#181525]">
            NexPrep
          </span>
        </Link>

        {/* CENTER: Clean minimal links */}
        {isLanding ? (
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#77718A]">
            <a href="#features" className="hover:text-[#6D28D9] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#6D28D9] transition-colors">How It Works</a>
            <a href="#ai-resume" className="hover:text-[#6D28D9] transition-colors">AI Resume</a>
            <a href="#assessments" className="hover:text-[#6D28D9] transition-colors">Assessments</a>
            <a href="#about" className="hover:text-[#6D28D9] transition-colors">About</a>
          </nav>
        ) : (
          <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-[#77718A]">
            <span className="px-2.5 py-1 rounded-full bg-purple-50 text-[#6D28D9] border border-purple-100">
              {role === 'admin' ? 'Institutional Administration' : 'Career Preparation Workspace'}
            </span>
          </div>
        )}

        {/* RIGHT: Login & Get Started */}
        <div className="flex items-center gap-3">
          {isLanding ? (
            <>
              <Link
                to="/auth/login"
                className="px-4 py-2 text-sm font-medium text-[#181525] hover:text-[#6D28D9] transition-colors"
              >
                Login
              </Link>
              <Link
                to="/auth/register"
                className="px-4 py-2 text-sm font-semibold text-white bg-[#6D28D9] hover:bg-[#5B21B6] rounded-xl transition-all shadow-sm hover:shadow-soft flex items-center gap-1.5"
              >
                Get Started
                <ChevronRight className="w-4 h-4" />
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-[#77718A] hidden sm:inline">
                {user?.full_name || 'User'}
              </span>
              <button
                onClick={() => navigate(role === 'admin' ? '/admin' : '/dashboard')}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#6D28D9] hover:bg-[#5B21B6] rounded-xl transition-all shadow-sm"
              >
                Dashboard
              </button>
              <button
                onClick={logout}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
