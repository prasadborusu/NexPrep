import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ChevronRight, Menu, X, LogIn, UserPlus, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Features', to: '/features' },
    { label: 'How It Works', to: '/how-it-works' },
    { label: 'AI Resume', to: '/ai-resume' },
    { label: 'Assessments', to: '/assessments' },
    { label: 'About', to: '/about' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FBFAFF]/95 backdrop-blur-md border-b border-[#EAE6F5]">
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

        {/* CENTER: React Router Navigation Links (No anchor # hashes) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `transition-colors duration-150 py-1 ${
                  isActive
                    ? 'text-[#6D28D9] font-bold border-b-2 border-[#6D28D9]'
                    : 'text-[#77718A] hover:text-[#181525]'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* RIGHT: Login & Get Started or Active Session Dashboard */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <button
              onClick={() => navigate(role === 'admin' ? '/admin/dashboard' : '/student/dashboard')}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#6D28D9] hover:bg-[#5B21B6] rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Go to {role === 'admin' ? 'Admin Portal' : 'Student Dashboard'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-[#181525] hover:text-[#6D28D9] transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-semibold text-white bg-[#6D28D9] hover:bg-[#5B21B6] rounded-xl transition-all shadow-sm hover:shadow-soft flex items-center gap-1.5"
              >
                Get Started
                <ChevronRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-[#77718A] hover:text-[#181525] hover:bg-purple-50 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#EAE6F5] bg-white px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
          <nav className="space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-xl text-sm font-medium ${
                    isActive
                      ? 'bg-purple-50 text-[#6D28D9] font-bold'
                      : 'text-[#77718A] hover:bg-slate-50 hover:text-[#181525]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="pt-3 border-t border-[#EAE6F5] flex flex-col gap-2">
            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate(role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#6D28D9] text-white text-xs font-semibold text-center"
              >
                Go to {role === 'admin' ? 'Admin Portal' : 'Student Dashboard'}
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2 px-4 rounded-xl border border-[#EAE6F5] text-sm font-semibold text-[#181525] text-center flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2 px-4 rounded-xl bg-[#6D28D9] text-white text-sm font-semibold text-center flex items-center justify-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
