import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-[#EAE6F5] py-12 text-[#77718A] text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#6D28D9] via-[#8B5CF6] to-[#EC4899] p-0.5 shadow-xs">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center p-1">
                  <img src="/logo.svg" alt="NexPrep" className="w-full h-full object-contain" />
                </div>
              </div>
              <span className="font-bold text-base text-[#181525] tracking-tight">NexPrep</span>
            </Link>
            <p className="text-xs text-[#77718A] leading-relaxed max-w-sm">
              AI-powered career preparation platform designed to help engineering students evaluate skills, build ATS-compliant resumes, close gaps, and prepare for campus placements.
            </p>
            <p className="text-xs font-semibold text-[#6D28D9]">
              Learn. Build. Prepare. Get Placed.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#181525]">Platform</h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link to="/features" className="hover:text-[#6D28D9] transition-colors">Features</Link></li>
              <li><Link to="/how-it-works" className="hover:text-[#6D28D9] transition-colors">How It Works</Link></li>
              <li><Link to="/ai-resume" className="hover:text-[#6D28D9] transition-colors">AI Resume</Link></li>
              <li><Link to="/assessments" className="hover:text-[#6D28D9] transition-colors">Assessments Overview</Link></li>
              <li><Link to="/about" className="hover:text-[#6D28D9] transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Portals & Security */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#181525]">Access</h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link to="/login" className="hover:text-[#6D28D9] transition-colors">Candidate Login</Link></li>
              <li><Link to="/register" className="hover:text-[#6D28D9] transition-colors">Student Registration</Link></li>
              <li><Link to="/login" className="hover:text-[#6D28D9] transition-colors">Institutional Admin</Link></li>
              <li><Link to="/forgot-password" className="hover:text-[#6D28D9] transition-colors">Account Recovery</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[#EAE6F5] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#77718A]">
          <p>© {new Date().getFullYear()} NexPrep. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#181525] cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#181525] cursor-pointer">Terms of Service</span>
            <span className="hover:text-[#181525] cursor-pointer">Security Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
