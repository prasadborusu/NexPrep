import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Cpu,
  Target,
  Users,
  Building2,
  ArrowRight
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[#6D28D9]">
          About NexPrep
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#181525] tracking-tight">
          Bridging Academic Learning & Technical Placement
        </h1>
        <p className="text-sm sm:text-base text-[#77718A] leading-relaxed max-w-2xl mx-auto">
          NexPrep is an intelligent career preparation and assessment workspace engineered to replace fragmented recruitment prep with a unified, verified methodology.
        </p>
      </section>

      {/* Mission & Problem Statement */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 border border-[#EAE6F5] shadow-soft space-y-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#EC4899]">
              The Problem We Solve
            </span>
            <h2 className="text-2xl font-extrabold text-[#181525] tracking-tight">
              Placement Preparation Has Been Broken for Too Long
            </h2>
            <p className="text-xs sm:text-sm text-[#77718A] leading-relaxed">
              Engineering students prepare for campus hiring across four disjointed platforms: practicing algorithms on one site, taking conceptual tests on another, formatting resumes manually in word processors, and guessing what recruiters actually want.
            </p>
            <p className="text-xs sm:text-sm text-[#77718A] leading-relaxed">
              Meanwhile, college placement officers struggle with manual spreadsheets, unverified student claims, and cumbersome mass email communication.
            </p>
          </div>

          <div className="bg-[#FBFAFF] rounded-2xl p-6 border border-[#EAE6F5] space-y-4">
            <h3 className="text-sm font-bold text-[#181525] flex items-center gap-2">
              <Target className="w-4 h-4 text-[#6D28D9]" />
              The NexPrep Solution
            </h3>
            <ul className="space-y-3 text-xs text-[#77718A]">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6D28D9] mt-1 shrink-0" />
                <span><strong>Single Source of Truth:</strong> Assessments, live code compiler, and ATS resumes live in one unified workspace.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6D28D9] mt-1 shrink-0" />
                <span><strong>Evidence-Based Skills:</strong> No fake percentages. Skills are mapped to verified test cases and coding solutions.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6D28D9] mt-1 shrink-0" />
                <span><strong>Institutional Alignment:</strong> College placement cells can schedule assessments and coordinate drives seamlessly.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6D28D9]">
            Architectural Tenets
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#181525] tracking-tight">
            Designed on Core Principles
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-[#EAE6F5] shadow-soft space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6D28D9] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#181525]">Zero Fabricated Data</h3>
            <p className="text-xs text-[#77718A] leading-relaxed">
              We never fabricate arbitrary ATS scores or fake recruitment statistics. Everything shown to candidates is grounded in verifiable rubric criteria.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#EAE6F5] shadow-soft space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6D28D9] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#EC4899]" />
            </div>
            <h3 className="text-sm font-bold text-[#181525]">AI as an Accelerator</h3>
            <p className="text-xs text-[#77718A] leading-relaxed">
              We integrate open-source language models (Hugging Face Qwen) specifically for targeted tasks: quantifying achievements and evaluating interview answers.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#EAE6F5] shadow-soft space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6D28D9] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#181525]">Campus Ready</h3>
            <p className="text-xs text-[#77718A] leading-relaxed">
              Engineered with institutional role-based access control, allowing placement directors to supervise student cohorts and communicate in bulk.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="p-8 rounded-2xl bg-[#FBFAFF] border border-[#EAE6F5] text-center space-y-4">
        <h3 className="text-xl font-bold text-[#181525]">Experience NexPrep Today</h3>
        <p className="text-xs sm:text-sm text-[#77718A] max-w-md mx-auto">
          Join engineering candidates preparing smarter for the upcoming campus recruitment cycle.
        </p>
        <div className="pt-2">
          <Link
            to="/register"
            className="inline-flex px-6 py-3 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-xs font-semibold shadow-sm"
          >
            Create Your Account
          </Link>
        </div>
      </section>
    </div>
  );
};
