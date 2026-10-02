import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, LayoutDashboard, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, role } = useAuth();

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

        {/* RIGHT: Login & Get Started or Go to Dashboard */}
        <div className="flex items-center gap-3">
          {!user && (
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
      </div>
    </header>
  );
};
