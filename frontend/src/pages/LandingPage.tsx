import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Building2,
  ShieldCheck,
  TrendingUp,
  Award,
  Zap,
  ChevronRight
} from 'lucide-react';
import { DemoModal } from '../components/common/DemoModal';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  const journeySteps = [
    { title: 'Learn', subtitle: 'Master Core Stacks', color: 'from-purple-500 to-indigo-600', icon: Zap },
    { title: 'Assess', subtitle: 'Timed Proctored Tests', color: 'from-indigo-600 to-blue-600', icon: FileCheck2 },
    { title: 'Analyze', subtitle: 'ATS Match Mining', color: 'from-blue-600 to-cyan-600', icon: ScanSearch },
    { title: 'Personalize', subtitle: 'Targeted Roadmap', color: 'from-cyan-600 to-teal-600', icon: Milestone },
    { title: 'Build Resume', subtitle: 'AI ATS Generation', color: 'from-teal-600 to-emerald-600', icon: FileText },
    { title: 'Prepare', subtitle: 'AI Mock Interviews', color: 'from-emerald-600 to-amber-600', icon: Cpu },
    { title: 'Get Placed', subtitle: 'Verified Offers', color: 'from-amber-600 to-pink-600', icon: Award },
  ];

  const featureCards = [
    {
      title: 'AI Resume Builder',
      badge: 'Hugging Face Qwen3-8B',
      description: 'Generate ATS-friendly resumes with Google X-Y-Z quantifiable bullet points. Live editing, section reordering, and direct PDF generation.',
      icon: FileText,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      action: '/resume-builder'
    },
    {
      title: 'Resume Analyzer',
      badge: 'Deterministic ATS Engine',
      description: 'Upload your resume PDF and paste a job description. Computes keyword coverage, structure completeness, formatting risks, and tailored fixes.',
      icon: ScanSearch,
      color: 'bg-pink-50 text-pink-700 border-pink-200',
      action: '/ats-analyzer'
    },
    {
      title: 'Coding Practice',
      badge: 'Monaco + Piston API',
      description: 'Full-featured code editor supporting Java, Python, C++, and JavaScript. Runs code in real-time and verifies against hidden test cases.',
      icon: Code2,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      action: '/coding'
    },
    {
      title: 'Assessments',
      badge: 'Screening Module',
      description: 'Timed exams featuring MCQ, Coding, and mixed modes. Includes autosave, question palette, review markers, and detailed scorecards.',
      icon: FileCheck2,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      action: '/assessments'
    },
    {
      title: 'Skill Intelligence',
      badge: 'Real-Time Gap Analysis',
      description: 'Aggregates your test performance, coding submissions, and resume keywords against target job benchmarks to identify strong, weak, and missing skills.',
      icon: Cpu,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      action: '/skill-gap'
    },
    {
      title: 'Roadmap',
      badge: 'Dynamic 6-Week Path',
      description: 'Week-by-week curriculum tailored to close your skill gaps. Track item completion interactively to see your placement readiness increase.',
      icon: Milestone,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      action: '/roadmap'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FBFAFF] text-slate-800 selection:bg-purple-100 selection:text-purple-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32">
        {/* Subtle background glow orbs */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-purple-200/40 via-pink-200/30 to-purple-100/20 blur-3xl -z-10 pointer-events-none rounded-full"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill Announcement */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-purple-200/80 shadow-soft text-xs font-semibold text-purple-800"
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
              <span>Next-Gen Placement Preparation Powered by AI</span>
              <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
            </motion.div>

            {/* Main Hero Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.08]"
            >
              Prepare Smarter.
              <br />
              <span className="bg-gradient-to-r from-purple-700 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Build Your Future.
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto"
            >
              One intelligent platform to assess your skills, build your resume, close your skill gaps, and prepare for your next opportunity.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-3.5 pt-2"
            >
              <button
                onClick={() => navigate(role === 'admin' ? '/admin' : '/dashboard')}
                className="px-7 py-3.5 text-sm sm:text-base font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-2xl transition-all shadow-md hover:shadow-soft-lg flex items-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsDemoOpen(true)}
                className="px-6 py-3.5 text-sm sm:text-base font-semibold text-slate-700 hover:text-purple-700 bg-white hover:bg-purple-50/50 border border-slate-200/90 rounded-2xl transition-all shadow-soft flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
                Watch Demo
              </button>
            </motion.div>

            {/* Trust Points */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Zero Fake Statistics
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Live Compiler (Piston API)
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Qwen3-8B AI Inference
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Row-Level Security Architecture
              </span>
            </div>
          </div>

          {/* Hero Custom Illustration (NO Stock Images) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-14 max-w-5xl mx-auto relative"
          >
            <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-soft-lg border border-purple-100/90 relative overflow-hidden">
              {/* Background gradient grid accents */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-purple-100/50 rounded-full blur-3xl -z-10 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-100/40 rounded-full blur-3xl -z-10 pointer-events-none"></div>

              {/* Mockup Dashboard Header Bar */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 via-purple-600 to-pink-500 p-0.5 shadow-sm">
                    <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center p-1.5">
                      <img src="/logo.svg" alt="NexPrep" className="w-full h-full object-contain" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-800">NexPrep Career Intelligence Dashboard</h3>
                    <p className="text-xs text-slate-500">Alex Johnson • NIT Trichy • Target: Full Stack Engineer</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Ready for Placement
                  </span>
                </div>
              </div>

              {/* Grid of Custom Vector SaaS Cards */}
              <div className="grid md:grid-cols-3 gap-5 pt-6">
                {/* Card 1: ATS Resume Score */}
                <div className="bg-white rounded-2xl p-5 border border-purple-100/80 shadow-soft space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">ATS Score</span>
                    <span className="p-1 rounded-lg bg-pink-50 text-pink-600"><ScanSearch className="w-4 h-4" /></span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900">92</span>
                    <span className="text-xs font-semibold text-emerald-600">/ 100 • Strong Match</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-500 h-full w-[92%]"></div>
                  </div>
                  <p className="text-[11px] text-slate-500">14/15 target competencies verified against Atlassian & Razorpay benchmark profiles.</p>
                </div>

                {/* Card 2: Live Code Sandbox */}
                <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 text-white shadow-soft space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-400">solution.py</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">100% Passed</span>
                  </div>
                  <div className="font-mono text-[11px] text-purple-300 space-y-1">
                    <p><span className="text-pink-400">def</span> <span className="text-blue-300">twoSum</span>(nums, target):</p>
                    <p className="pl-3 text-slate-400"># O(n) Hash lookup</p>
                    <p className="pl-3 text-emerald-400">return [seen[diff], i]</p>
                  </div>
                  <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800">
                    <span>Piston API: 14ms</span>
                    <span className="text-emerald-400">✓ 3/3 Cases Verified</span>
                  </div>
                </div>

                {/* Card 3: Active Placement Drive */}
                <div className="bg-white rounded-2xl p-5 border border-purple-100/80 shadow-soft space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Placement Drive</span>
                    <span className="p-1 rounded-lg bg-purple-50 text-purple-600"><Building2 className="w-4 h-4" /></span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Atlassian</h4>
                    <p className="text-xs text-slate-500">Associate Software Engineer</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100 text-xs flex items-center justify-between">
                    <span className="font-semibold text-purple-900">CTC: 26 - 32 LPA</span>
                    <span className="text-emerald-700 font-bold">Eligible (8.75 CGPA)</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Applications close in 12 days • Direct portal link verified.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Journey Section */}
      <section id="journey" className="py-20 border-t border-purple-100/60 bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-700">
              The Placement Pipeline
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              A Seamless 7-Step Journey
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              From foundational concepts to real recruitment offers, follow a proven pipeline designed for modern tech placements.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {journeySteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-4 border border-purple-100/80 shadow-soft card-hover flex flex-col items-center text-center relative group"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${step.color} text-white flex items-center justify-center mb-3 shadow-sm`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-purple-600 mb-0.5">Phase {idx + 1}</span>
                  <h4 className="font-bold text-sm text-slate-900">{step.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1">{step.subtitle}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Modules Grid */}
      <section id="features" className="py-24 border-t border-purple-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-pink-100 text-pink-700">
              Platform Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Engineered with Precision & Elegance
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Every tool feels fast, purposeful, and uncluttered. No fluff, no synthetic stats—just real career acceleration.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-purple-100/80 shadow-soft card-hover flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${feat.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {feat.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-2">{feat.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{feat.description}</p>
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={() => navigate(feat.action)}
                      className="text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center gap-1 group"
                    >
                      Open {feat.title}
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 border-t border-purple-100/60 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-950 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-purple-200 border border-white/15">
            Production Ready MVP
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Ready to Accelerate Your Placement?
          </h2>
          <p className="text-base sm:text-lg text-purple-200 max-w-xl mx-auto">
            Experience the clean, AI-powered preparation environment students and campus administrators rely on.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-3.5 text-sm sm:text-base font-bold text-purple-950 bg-white hover:bg-purple-50 rounded-2xl transition-all shadow-lg hover:shadow-xl"
            >
              Launch Student Dashboard
            </button>
            <button
              onClick={() => navigate('/admin')}
              className="px-8 py-3.5 text-sm sm:text-base font-bold text-white bg-purple-700/60 hover:bg-purple-700 border border-white/20 rounded-2xl transition-all"
            >
              Explore Admin Portal
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-white border-t border-slate-200 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="NexPrep" className="w-5 h-5" />
            <span className="font-bold text-slate-800">NEXPREP</span>
            <span>— Learn. Build. Prepare. Get Placed.</span>
          </div>
          <div>Built for ambitious students & forward-looking campus placement cells.</div>
        </div>
      </footer>

      {/* Demo Walkthrough Modal */}
      <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
    </div>
  );
};
