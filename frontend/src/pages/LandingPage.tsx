import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Play,
  CheckCircle2,
  FileText,
  ScanSearch,
  Code2,
  FileCheck2,
  Cpu,
  Milestone,
  ChevronRight,
  BookOpen,
  Award,
  Terminal
} from 'lucide-react';
import { DemoModal } from '../components/common/DemoModal';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  // 7-Step Product Journey Highlights
  const journeySteps = [
    { title: 'Learn', icon: BookOpen },
    { title: 'Assess', icon: FileCheck2 },
    { title: 'Analyze', icon: ScanSearch },
    { title: 'Personalize', icon: Milestone },
    { title: 'Build', icon: FileText },
    { title: 'Prepare', icon: Cpu },
    { title: 'Get Placed', icon: Award },
  ];

  // 6 Core Features Highlights
  const keyFeatures = [
    {
      title: 'AI Resume Builder',
      description: 'Generate ATS-compliant, quantifiable achievement bullets customized to your target engineering role.',
      icon: FileText,
      link: '/ai-resume'
    },
    {
      title: 'ATS Resume Analyzer',
      description: 'Audit keyword coverage, section formatting, and role alignment without arbitrary score fabrication.',
      icon: ScanSearch,
      link: '/ai-resume'
    },
    {
      title: 'Smart Assessments',
      description: 'Timed multiple-choice exams and coding assessments with autosave, anti-cheat detection, and instant reports.',
      icon: FileCheck2,
      link: '/assessments'
    },
    {
      title: 'Coding Practice',
      description: 'Monaco code editor with Python, Java, C++, and JS support, test cases, and algorithmic complexity feedback.',
      icon: Code2,
      link: '/features'
    },
    {
      title: 'Skill Gap Intelligence',
      description: 'Correlate candidate performance against market criteria with qualitative evidence tiers.',
      icon: Cpu,
      link: '/features'
    },
    {
      title: 'Personalized Roadmap',
      description: 'Adaptive weekly milestone curriculum targeting your exact technical gaps for recruitment readiness.',
      icon: Milestone,
      link: '/features'
    }
  ];

  return (
    <div className="bg-[#FBFAFF] text-[#181525]">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (2-Column Desktop: Text on Left, CGI N-Visual on Right) */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-purple-200/30 via-pink-200/20 to-purple-100/10 blur-3xl -z-10 pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* LEFT: Hero text and CTA */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#EAE6F5] shadow-xs text-xs font-semibold text-[#6D28D9]"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#EC4899]" />
                <span>AI-Powered Career Preparation</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#181525] leading-[1.12]"
              >
                Prepare Smarter.
                <br />
                <span className="bg-gradient-to-r from-[#6D28D9] via-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">
                  Build Your Future.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base sm:text-lg text-[#77718A] font-normal leading-relaxed max-w-xl"
              >
                One intelligent platform to assess your skills, build your resume, close your skill gaps, and prepare for your next opportunity.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap items-center gap-4 pt-2"
              >
                <Link
                  to="/register"
                  className="px-7 py-3.5 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-sm font-semibold transition-all shadow-sm hover:shadow-soft flex items-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/features"
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-purple-50/50 text-[#181525] hover:text-[#6D28D9] border border-[#EAE6F5] text-sm font-semibold transition-all shadow-xs flex items-center gap-2"
                >
                  Explore NexPrep
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="pt-4 flex items-center gap-2 text-xs font-semibold text-[#77718A]"
              >
                <span>Learn</span>
                <span className="text-[#C4B5FD]">•</span>
                <span>Build</span>
                <span className="text-[#C4B5FD]">•</span>
                <span>Prepare</span>
                <span className="text-[#C4B5FD]">•</span>
                <span className="text-[#6D28D9]">Get Placed.</span>
              </motion.div>
            </div>

            {/* RIGHT: CGI-Inspired NexPrep Career Intelligence Visual */}
            <div className="lg:col-span-5 flex items-center justify-center relative">
              <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center">
                {/* Soft breathing background glow */}
                <motion.div
                  animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.35, 0.55, 0.35]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  className="absolute w-64 h-64 rounded-full bg-gradient-to-tr from-purple-400 via-violet-300 to-pink-300 blur-3xl -z-10"
                />

                {/* Orbital Ring 1: Outermost thin ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border border-purple-200/60 pointer-events-none flex items-center justify-center"
                >
                  <div className="absolute top-2 left-1/3 -translate-x-1/2 -translate-y-1/2">
                    <div className="px-2.5 py-1 rounded-full bg-white/95 border border-purple-200 text-[10px] font-semibold text-[#6D28D9] shadow-soft backdrop-blur-sm flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#6D28D9]" />
                      AI Intelligence
                    </div>
                  </div>
                </motion.div>

                {/* Orbital Ring 2: Middle tilted orbital ring */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-6 rounded-full border border-purple-300/40 pointer-events-none flex items-center justify-center"
                >
                  <div className="absolute bottom-4 right-1/4 translate-x-1/2 translate-y-1/2">
                    <div className="px-2.5 py-1 rounded-full bg-white/95 border border-pink-200 text-[10px] font-semibold text-[#EC4899] shadow-soft backdrop-blur-sm flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#EC4899]" />
                      Skills
                    </div>
                  </div>
                </motion.div>

                {/* Orbital Ring 3: Innermost ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-16 rounded-full border border-violet-300/50 pointer-events-none flex items-center justify-center"
                >
                  <div className="absolute top-1/2 -right-3 -translate-y-1/2">
                    <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#6D28D9] to-[#EC4899] shadow-glow" />
                  </div>
                </motion.div>

                {/* Central CGI Element: Floating NexPrep N Emblem */}
                <motion.div
                  animate={{
                    y: [-6, 6, -6],
                    rotate: [0, 1, 0, -1, 0]
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-[#6D28D9] via-[#8B5CF6] to-[#EC4899] p-1 shadow-glow"
                >
                  <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center p-4 shadow-inner relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-20 h-20 bg-purple-100/50 rounded-full blur-md" />
                    <img src="/logo.svg" alt="NexPrep Engine Logo" className="w-full h-full object-contain relative z-10" />
                  </div>
                </motion.div>

                <div className="absolute -bottom-3 z-20 px-3 py-1 rounded-full bg-white/95 border border-[#EAE6F5] text-[11px] font-semibold text-[#181525] shadow-soft backdrop-blur-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Career Intelligence Engine</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. SHORT PRODUCT INTRODUCTION */}
      {/* ========================================================================= */}
      <section className="py-14 border-t border-[#EAE6F5] bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6D28D9]">
            The Career Readiness Platform
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#181525] tracking-tight">
            Built for Students. Trusted by Placement Cells.
          </h2>
          <p className="text-sm text-[#77718A] leading-relaxed max-w-2xl mx-auto">
            Traditional placement portals rely on fragmented tests and unverified claims. NexPrep connects your coding assessments, resume engineering, and personalized skill roadmap into one unified, transparent pipeline.
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SHORT "HOW IT WORKS" OVERVIEW */}
      {/* ========================================================================= */}
      <section className="py-16 border-t border-[#EAE6F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#EC4899]">
                Structured Methodology
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#181525] tracking-tight mt-1">
                How NexPrep Works
              </h2>
            </div>
            <Link
              to="/how-it-works"
              className="text-xs font-bold text-[#6D28D9] hover:text-[#5B21B6] inline-flex items-center gap-1 group"
            >
              <span>Explore complete 7-stage journey</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {journeySteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-4 border border-[#EAE6F5] shadow-xs hover:border-purple-300 transition-all text-center flex flex-col items-center justify-center space-y-2"
                >
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#6D28D9] flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-[#8B5CF6] uppercase">0{idx + 1}</span>
                  <span className="text-xs font-bold text-[#181525]">{step.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SHORT FEATURE OVERVIEW */}
      {/* ========================================================================= */}
      <section className="py-16 border-t border-[#EAE6F5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#6D28D9]">
                Core Modules
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#181525] tracking-tight mt-1">
                Everything In One Intelligent Workspace
              </h2>
            </div>
            <Link
              to="/features"
              className="text-xs font-bold text-[#6D28D9] hover:text-[#5B21B6] inline-flex items-center gap-1 group"
            >
              <span>View all features & specs</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {keyFeatures.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#FBFAFF] rounded-2xl p-5 border border-[#EAE6F5] hover:border-purple-300 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#6D28D9] border border-purple-100 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-[#181525]">{feat.title}</h3>
                    <p className="text-xs text-[#77718A] leading-relaxed">{feat.description}</p>
                  </div>
                  <Link
                    to={feat.link}
                    className="text-xs font-semibold text-[#6D28D9] hover:text-[#5B21B6] inline-flex items-center gap-1 group pt-1"
                  >
                    <span>Learn more</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. AI RESUME PREVIEW */}
      {/* ========================================================================= */}
      <section className="py-16 border-t border-[#EAE6F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#EC4899]">
                Recruiter-Grade Standards
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#181525] tracking-tight">
                AI Resume Builder & ATS Scanner
              </h2>
              <p className="text-xs sm:text-sm text-[#77718A] leading-relaxed">
                Build clean, single-page technical resumes parsed accurately by modern Applicant Tracking Systems. Highlight proven skills with automated phrasing suggestions powered by Hugging Face models.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <Link
                  to="/ai-resume"
                  className="px-5 py-2.5 rounded-xl bg-[#6D28D9] text-white text-xs font-semibold hover:bg-[#5B21B6] transition-all flex items-center gap-1.5"
                >
                  Explore AI Resume Platform
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Resume Preview Mockup Card */}
            <div className="lg:col-span-6 bg-white rounded-2xl p-5 border border-[#EAE6F5] shadow-soft space-y-3 font-mono text-[11px]">
              <div className="flex items-center justify-between pb-2 border-b border-[#EAE6F5] font-sans">
                <span className="text-[10px] font-bold text-[#181525]">CANDIDATE RESUME MOCKUP</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ATS Verified
                </span>
              </div>
              <div className="space-y-1 font-sans">
                <p className="font-bold text-xs text-[#181525]">Role: Software Engineer</p>
                <p className="text-[11px] text-[#77718A]">Skills: Java • Python • SQL • Data Structures • REST APIs</p>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-100 font-sans text-xs text-[#6D28D9] flex items-center justify-between">
                <span>AI Enhancement: Action-driven accomplishment phrasing applied</span>
                <Sparkles className="w-3.5 h-3.5 text-[#EC4899]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. SHORT FINAL CTA */}
      {/* ========================================================================= */}
      <section className="py-20 border-t border-[#EAE6F5] bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#181525] tracking-tight">
            Your Next Step Starts Here.
          </h2>
          <div className="space-y-1 text-sm text-[#77718A] font-medium">
            <p>Build your skills.</p>
            <p>Strengthen your resume.</p>
            <p>Prepare with purpose.</p>
          </div>
          <div className="pt-2">
            <Link
              to="/register"
              className="inline-flex px-8 py-3.5 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-sm font-semibold transition-all shadow-sm hover:shadow-soft"
            >
              Start with NexPrep
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Demo Walkthrough Modal */}
      <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
    </div>
  );
};
