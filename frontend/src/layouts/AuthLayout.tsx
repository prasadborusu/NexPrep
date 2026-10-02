import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FBFAFF] text-[#181525] flex flex-col justify-between font-sans selection:bg-purple-100 selection:text-purple-900">
      {/* Top minimal header */}
      <header className="h-16 border-b border-[#EAE6F5] bg-white/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6D28D9] via-[#8B5CF6] to-[#EC4899] p-0.5 shadow-xs">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center p-1.5">
              <img src="/logo.svg" alt="NexPrep" className="w-full h-full object-contain" />
            </div>
          </div>
          <span className="font-extrabold text-lg tracking-tight text-[#181525]">
            NexPrep
          </span>
        </Link>
        <Link
          to="/"
          className="text-xs font-semibold text-[#77718A] hover:text-[#6D28D9] transition-colors"
        >
          ← Back to Homepage
        </Link>
      </header>

      {/* Main Form Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <Outlet />
      </main>

      {/* Bottom minimal footer */}
      <footer className="py-6 border-t border-[#EAE6F5] text-center text-xs text-[#77718A]">
        <p>© {new Date().getFullYear()} NexPrep Career Intelligence. Secure institutional encryption.</p>
      </footer>
    </div>
  );
};
