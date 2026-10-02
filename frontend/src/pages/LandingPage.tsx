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
  Check,
  ChevronRight,
  BookOpen,
  Briefcase,
  UserCheck,
  Award,
  Layers,
  Terminal,
  CircleDot
} from 'lucide-react';
import { DemoModal } from '../components/common/DemoModal';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  // 7-Step Product Journey (No statistics)
  const journeyNodes = [
    {
      title: 'Learn',
      description: 'Master core languages, algorithms, and system design fundamentals.',
      icon: BookOpen
    },
    {
      title: 'Assess',
      description: 'Validate knowledge via timed, proctored multiple-choice and coding assessments.',
      icon: FileCheck2
    },
    {
      title: 'Analyze',
      description: 'Audit your resume formatting, keywords, and structure against role requirements.',
      icon: ScanSearch
    },
    {
      title: 'Personalize',
      description: 'Generate an adaptive weekly trajectory targeted directly at identified skill gaps.',
      icon: Milestone
    },
    {
      title: 'Build',
      description: 'Craft ATS-compliant resumes with AI-assisted quantifiable achievement bullets.',
      icon: FileText
    },
    {
      title: 'Prepare',
      description: 'Practice simulated Technical, HR, and System Design interview drills with AI evaluation.',
      icon: Cpu
    },
    {
      title: 'Get Placed',
      description: 'Meet verified hiring criteria and apply to campus recruitment opportunities.',
      icon: Award
    }
  ];

  // 6 Minimal Feature Cards (No fake numbers, no fake company names)
  const featureCards = [
    {
      title: 'AI Resume Builder',
      description: 'Draft publication-ready resumes with structured formatting and AI-generated quantifiable achievement bullets.',
      icon: FileText,
      link: '/auth/register'
    },
    {
      title: 'ATS Resume Analyzer',
      description: 'Evaluate keyword alignment, structure compliance, and formatting readability against target job descriptions.',
      icon: ScanSearch,
      link: '/auth/register'
    },
    {
      title: 'Smart Assessments',
      description: 'Conduct timed evaluations featuring multiple-choice questions, live coding challenges, and autosave proctoring.',
      icon: FileCheck2,
      link: '/auth/register'
    },
    {
      title: 'Coding Practice',
      description: 'Solve algorithmic challenges inside an integrated Monaco code editor with real-time compilation and test suites.',
      icon: Code2,
      link: '/auth/register'
    },
    {
      title: 'Skill Gap Intelligence',
      description: 'Correlate test performance and resume evidence against market standards to highlight focus areas.',
      icon: Cpu,
      link: '/auth/register'
    },
    {
      title: 'Personalized Roadmap',
      description: 'Follow an adaptive week-by-week curriculum with interactive milestones that update as you learn.',
      icon: Milestone,
      link: '/auth/register'
    }
  ];

  // Roadmap Stages
  const roadmapStages = [
    { title: 'Start', detail: 'Profile & Goal Setting' },
    { title: 'Learn', detail: 'Core Computer Science Concepts' },
    { title: 'Practice', detail: 'Algorithmic Problem Solving' },
    { title: 'Build', detail: 'ATS-Optimized Tech Resume' },
    { title: 'Interview', detail: 'Technical & Behavioral Simulations' },
    { title: 'Career Ready', detail: 'Verified Opportunity Applications' }
  ];

  return (
    <div className="min-h-screen bg-[#FBFAFF] text-[#181525] selection:bg-purple-100 selection:text-purple-900 font-sans">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (2-Column Desktop: Text on Left, CGI N-Visual on Right) */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        {/* Soft background ambient gradient lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-purple-200/30 via-pink-200/20 to-purple-100/10 blur-3xl -z-10 pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* LEFT: Hero text and CTA */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Small Badge */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#EAE6F5] shadow-xs text-xs font-semibold text-[#6D28D9]"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#EC4899]" />
                <span>AI-Powered Career Preparation</span>
              </motion.div>

              {/* Main Heading */}
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

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base sm:text-lg text-[#77718A] font-normal leading-relaxed max-w-xl"
              >
                One intelligent platform to assess your skills, build your resume, close your skill gaps, and prepare for your next opportunity.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap items-center gap-4 pt-2"
              >
                <button
                  onClick={() => navigate('/auth/register')}
                  className="px-7 py-3.5 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-sm font-semibold transition-all shadow-sm hover:shadow-soft flex items-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsDemoOpen(true)}
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-purple-50/50 text-[#181525] hover:text-[#6D28D9] border border-[#EAE6F5] text-sm font-semibold transition-all shadow-xs flex items-center gap-2"
                >
                  <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center text-[#6D28D9]">
                    <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                  </div>
                  Watch Demo
                </button>
              </motion.div>

              {/* Below Buttons Tagline */}
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
                  {/* Orbital Node: AI */}
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
                  {/* Orbital Node: Skills */}
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
                  {/* Orbital Node: Career Growth */}
                  <div className="absolute top-1/2 -right-3 -translate-y-1/2">
                    <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#6D28D9] to-[#EC4899] shadow-glow" />
                  </div>
                  <div className="absolute bottom-6 left-6">
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                  </div>
                </motion.div>

                {/* Central CGI Element: Floating NexPrep N Emblem with Depth & Gloss */}
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
                    {/* Inner sheen reflection */}
                    <div className="absolute -top-10 -right-10 w-20 h-20 bg-purple-100/50 rounded-full blur-md" />
                    <img src="/logo.svg" alt="NexPrep Engine Logo" className="w-full h-full object-contain relative z-10" />
                  </div>
                </motion.div>

                {/* Subtitle floating pill */}
                <motion.div
                  animate={{ y: [4, -4, 4] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -bottom-3 z-20 px-3 py-1 rounded-full bg-white/95 border border-[#EAE6F5] text-[11px] font-semibold text-[#181525] shadow-soft backdrop-blur-sm flex items-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Career Intelligence Engine</span>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. PRODUCT JOURNEY SECTION (7 Nodes with Thin Connecting Lines) */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-20 border-t border-[#EAE6F5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6D28D9]">
              The Systematic Pipeline
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#181525] tracking-tight">
              Everything You Need to Become Career Ready
            </h2>
            <p className="text-xs sm:text-sm text-[#77718A]">
              Seven integrated phases designed to prepare engineering students for technical placements.
            </p>
          </div>

          {/* 7 Clean Nodes in Sequence */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4 relative">
            {journeyNodes.map((node, idx) => {
              const Icon = node.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#FBFAFF] rounded-2xl p-5 border border-[#EAE6F5] card-hover flex flex-col items-center text-center relative"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6D28D9] border border-purple-100 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-[#8B5CF6] uppercase mb-0.5">Phase 0{idx + 1}</span>
                  <h3 className="text-sm font-bold text-[#181525]">{node.title}</h3>
                  <p className="text-[11px] text-[#77718A] mt-1.5 leading-relaxed">{node.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CORE FEATURES GRID (6 Minimal Cards, No Fake Data) */}
      {/* ========================================================================= */}
      <section id="features" className="py-20 border-t border-[#EAE6F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#EC4899]">
              Platform Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#181525] tracking-tight">
              Your Career, One Intelligent Platform.
            </h2>
            <p className="text-xs sm:text-sm text-[#77718A]">
              Purpose-built preparation modules engineered with clean interfaces and zero distraction.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-[#EAE6F5] shadow-soft card-hover flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6D28D9] border border-purple-100 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-[#181525]">{feat.title}</h3>
                    <p className="text-xs text-[#77718A] leading-relaxed">{feat.description}</p>
                  </div>

                  <Link
                    to={feat.link}
                    className="text-xs font-semibold text-[#6D28D9] hover:text-[#5B21B6] inline-flex items-center gap-1 group pt-2"
                  >
                    <span>Explore module</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. AI RESUME & ATS SECTION (Generic Placeholder Content, No Fake Scores) */}
      {/* ========================================================================= */}
      <section id="ai-resume" className="py-20 border-t border-[#EAE6F5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6D28D9]">
              Resume Engineering
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#181525] tracking-tight">
              AI Resume & ATS Optimization
            </h2>
            <p className="text-xs sm:text-sm text-[#77718A]">
              Build recruiter-ready resumes and benchmark keyword coverage without arbitrary numbers.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
            {/* Left: Generic Resume Preview Mockup */}
            <div className="lg:col-span-7 bg-[#FBFAFF] rounded-2xl p-6 border border-[#EAE6F5] shadow-soft space-y-4 font-serif text-[11px] text-[#181525]">
              <div className="flex items-center justify-between pb-2 border-b border-[#EAE6F5] font-sans">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#77718A]">UI Preview • Resume Document</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-semibold">
                  Standard ATS Format
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-bold tracking-tight text-[#181525]">CANDIDATE NAME</h4>
                <p className="text-[10px] text-[#77718A] font-sans">
                  Target Role: <strong className="text-[#181525]">Software Developer</strong> • Core Skills: Java, SQL, DSA
                </p>
              </div>

              <div className="space-y-1 font-sans">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#6D28D9] border-b border-[#EAE6F5] pb-0.5">
                  Professional Summary
                </p>
                <p className="text-[10px] text-[#77718A] leading-relaxed">
                  Software developer with foundations in object-oriented architecture, data structures, and database optimization. Experienced in developing RESTful services and clean full-stack modules.
                </p>
              </div>

              <div className="space-y-1 font-sans">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#6D28D9] border-b border-[#EAE6F5] pb-0.5">
                  Technical Projects
                </p>
                <div className="text-[10px] space-y-0.5">
                  <p className="font-semibold text-[#181525]">Distributed Key-Value Store</p>
                  <p className="text-[#77718A]">• Implemented consensus replication and concurrent query processing in Java.</p>
                  <p className="text-[#77718A]">• Optimized relational indexing queries in SQL, reducing access latency.</p>
                </div>
              </div>
            </div>

            {/* Right: ATS Audit Feedback Mockup (Qualitative, No Numeric Scores) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Keywords Coverage */}
              <div className="bg-white rounded-2xl p-5 border border-[#EAE6F5] shadow-soft space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#181525] block">
                  Role-Matched Keywords
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['Java', 'SQL', 'DSA', 'REST APIs', 'Object-Oriented Design', 'Git'].map((kw, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-purple-50 text-[#6D28D9] text-[11px] font-semibold border border-purple-100">
                      ✓ {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills Identified */}
              <div className="bg-white rounded-2xl p-5 border border-[#EAE6F5] shadow-soft space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-800 block">
                  Identified Skill Gaps
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['Docker', 'Redis', 'Unit Testing'].map((sk, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[11px] font-semibold border border-rose-200">
                      • {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* AI Recommendations */}
              <div className="bg-purple-50/60 rounded-2xl p-5 border border-purple-100 shadow-soft space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6D28D9] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#EC4899]" />
                  AI Improvement Suggestions
                </span>
                <ul className="text-xs text-[#77718A] space-y-1.5">
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#6D28D9]">•</span>
                    <span>Quantify accomplishments using the Google X-Y-Z framework.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#6D28D9]">•</span>
                    <span>Explicitly highlight containerization and automated test coverage.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. SKILL INTELLIGENCE SECTION (Skills -> Evidence -> Gaps -> Roadmap) */}
      {/* ========================================================================= */}
      <section className="py-20 border-t border-[#EAE6F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#EC4899]">
              Competency Synthesis
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#181525] tracking-tight">
              Skill Intelligence Flow
            </h2>
            <p className="text-xs sm:text-sm text-[#77718A]">
              Connect learning, screening evidence, and roadmap progression through qualitative validation.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-5 border border-[#EAE6F5] shadow-soft space-y-2 text-center">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-[#6D28D9] mx-auto flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h3 className="text-sm font-bold text-[#181525]">Candidate Skills</h3>
              <p className="text-xs text-[#77718A]">Academic coursework, declared proficiencies, and project tools.</p>
              <div className="pt-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-[#6D28D9]">Input Profile</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#EAE6F5] shadow-soft space-y-2 text-center">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 mx-auto flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="text-sm font-bold text-[#181525]">Assessment Evidence</h3>
              <p className="text-xs text-[#77718A]">Performance in proctored tests and coding challenge test cases.</p>
              <div className="pt-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Strong Evidence
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#EAE6F5] shadow-soft space-y-2 text-center">
              <div className="w-8 h-8 rounded-lg bg-pink-100 text-[#EC4899] mx-auto flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h3 className="text-sm font-bold text-[#181525]">Skill Gaps</h3>
              <p className="text-xs text-[#77718A]">Competencies absent from profile or requiring additional practical validation.</p>
              <div className="pt-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  Needs Practice
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#EAE6F5] shadow-soft space-y-2 text-center">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 mx-auto flex items-center justify-center font-bold text-xs">
                4
              </div>
              <h3 className="text-sm font-bold text-[#181525]">Personalized Roadmap</h3>
              <p className="text-xs text-[#77718A]">Actionable weekly curriculum addressing detected gaps directly.</p>
              <div className="pt-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-[#6D28D9]">Targeted Plan</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. ASSESSMENT & CODING PREVIEW SECTION (Clean UI Mockups) */}
      {/* ========================================================================= */}
      <section id="assessments" className="py-20 border-t border-[#EAE6F5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6D28D9]">
              Evaluation Interfaces
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#181525] tracking-tight">
              Smart Assessments & Live Practice
            </h2>
            <p className="text-xs sm:text-sm text-[#77718A]">
              Designed to simulate real-world screening environments with clarity and focus.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* MCQ Assessment UI Mockup */}
            <div className="bg-[#FBFAFF] rounded-2xl p-6 border border-[#EAE6F5] shadow-soft space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#EAE6F5]">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-purple-100 text-[#6D28D9] text-[10px] font-bold uppercase">
                    MCQ Mode
                  </span>
                  <span className="text-xs font-semibold text-[#181525]">Core CS Screening</span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-white border border-[#EAE6F5] text-[11px] font-mono font-semibold text-[#77718A]">
                  Timer: 45:00
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-[#181525]">
                  Q1. What is the average time complexity of retrieving an element from a well-distributed Hash Table?
                </p>
                <div className="space-y-1.5 pt-1">
                  <div className="p-2.5 rounded-xl bg-[#6D28D9] text-white text-xs flex items-center justify-between font-medium">
                    <span>A) O(1)</span>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#EAE6F5] text-xs text-[#77718A]">
                    <span>B) O(log n)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#EAE6F5] text-xs text-[#77718A]">
                    <span>C) O(n)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Coding Editor UI Mockup */}
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 text-white shadow-soft space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400 text-[11px]">two_sum.py</span>
                <span className="text-emerald-400 text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded">
                  Sample Tests Passed
                </span>
              </div>

              <div className="space-y-1 text-slate-300 text-[11px] leading-relaxed">
                <p><span className="text-purple-400">def</span> <span className="text-blue-300">twoSum</span>(nums, target):</p>
                <p className="pl-4 text-slate-500"># Hash map lookup</p>
                <p className="pl-4">seen = &#123;&#125;</p>
                <p className="pl-4"><span className="text-pink-400">for</span> i, num <span className="text-pink-400">in</span> enumerate(nums):</p>
                <p className="pl-8 text-emerald-400">return [seen[diff], i]</p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-sans">
                <span>Multi-language: Python, Java, C++, JS</span>
                <span className="text-slate-300">Hidden Edge Test Validation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. ROADMAP SECTION (Purple/Pink Path, No Fake %) */}
      {/* ========================================================================= */}
      <section className="py-20 border-t border-[#EAE6F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6D28D9]">
              Sequential Progression
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#181525] tracking-tight">
              Personalized Learning Roadmap
            </h2>
            <p className="text-xs sm:text-sm text-[#77718A]">
              Follow a clear path tailored to role expectations and skill requirements.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 relative">
              {roadmapStages.map((stage, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-4 border border-[#EAE6F5] shadow-soft text-center space-y-1 relative"
                >
                  <span className="text-[10px] font-bold text-[#6D28D9] uppercase">Stage 0{idx + 1}</span>
                  <h4 className="text-xs font-bold text-[#181525]">{stage.title}</h4>
                  <p className="text-[10px] text-[#77718A] leading-tight pt-1">{stage.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. ABOUT SECTION */}
      {/* ========================================================================= */}
      <section id="about" className="py-16 border-t border-[#EAE6F5] bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#77718A]">
            About NexPrep
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#181525] tracking-tight">
            Bridging Academic Learning & Tech Recruitment
          </h2>
          <p className="text-xs sm:text-sm text-[#77718A] leading-relaxed max-w-2xl mx-auto">
            NexPrep provides a unified workspace where students can systematically identify gaps, practice live code, and generate verified ATS resumes, while enabling academic institutions to coordinate proctored assessments transparently.
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. FINAL CTA SECTION */}
      {/* ========================================================================= */}
      <section className="py-20 border-t border-[#EAE6F5] bg-[#FBFAFF]">
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
            <button
              onClick={() => navigate('/auth/register')}
              className="px-8 py-3.5 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-sm font-semibold transition-all shadow-sm hover:shadow-soft"
            >
              Start with NexPrep
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FOOTER */}
      {/* ========================================================================= */}
      <footer className="py-8 bg-white border-t border-[#EAE6F5] text-xs text-[#77718A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="NexPrep" className="w-5 h-5" />
            <span className="font-bold text-[#181525]">NexPrep</span>
            <span>— Learn. Build. Prepare. Get Placed.</span>
          </div>
          <div>Minimal, intelligent career preparation for engineering students.</div>
        </div>
      </footer>

      {/* Interactive Demo Walkthrough Modal */}
      <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
    </div>
  );
};
