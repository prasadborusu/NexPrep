import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ScanSearch, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ResumeHubPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-[#6D28D9]">
          Resume Workspace
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#181525] tracking-tight">
          AI Resume & ATS Optimization Suite
        </h1>
        <p className="text-xs sm:text-sm text-[#77718A]">
          Create a fresh ATS-compliant resume or evaluate your existing document against target job descriptions.
        </p>
      </div>

      {/* Two Core Action Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Card 1: AI Resume Builder */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#EAE6F5] shadow-soft flex flex-col justify-between space-y-6 hover:border-purple-300 transition-all">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#6D28D9] border border-purple-100 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B5CF6]">
                Interactive Form Wizard
              </span>
              <h2 className="text-lg font-bold text-[#181525] mt-1">
                AI Resume Builder
              </h2>
              <p className="text-xs text-[#77718A] mt-2 leading-relaxed">
                Step-by-step resume construction with guided sections for education, projects, skills, and experience. Use AI phrasing to craft quantifiable bullets using the Google X-Y-Z framework and export to high-resolution single-page PDF.
              </p>
            </div>

            <div className="space-y-1.5 pt-2 text-xs text-[#181525]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Standard single-column ATS layout</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Hugging Face AI phrasing assistance</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Instant high-resolution PDF download</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#EAE6F5]">
            <Link
              to="/student/resume/builder"
              className="w-full py-3 px-4 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <span>Open Resume Builder</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Card 2: ATS Resume Analyzer */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#EAE6F5] shadow-soft flex flex-col justify-between space-y-6 hover:border-purple-300 transition-all">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-50 text-[#EC4899] border border-pink-100 flex items-center justify-center">
              <ScanSearch className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#EC4899]">
                Audit & Match
              </span>
              <h2 className="text-lg font-bold text-[#181525] mt-1">
                ATS Resume Analyzer
              </h2>
              <p className="text-xs text-[#77718A] mt-2 leading-relaxed">
                Paste your current resume content along with a job description. The analyzer checks keyword density, identifies missing skills, audits layout parseability, and provides constructive feedback without fabricated scores.
              </p>
            </div>

            <div className="space-y-1.5 pt-2 text-xs text-[#181525]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Job Description keyword alignment</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Identified skill gaps & missing tools</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Structure & formatting compliance</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#EAE6F5]">
            <Link
              to="/student/resume/analyzer"
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-purple-50 text-[#6D28D9] border border-[#6D28D9] text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <span>Scan Existing Resume</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
