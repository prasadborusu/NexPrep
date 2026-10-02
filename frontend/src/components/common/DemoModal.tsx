import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  BookOpen,
  FileCheck2,
  ScanSearch,
  Milestone,
  FileText,
  MessagesSquare,
  Code2,
  Building2,
  Trophy,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  const steps = [
    {
      title: '1. Learn',
      icon: BookOpen,
      badge: 'Core Concepts',
      heading: 'Foundational Knowledge Built from Ground Up',
      description: 'Systematic curriculum covering Java, Python, C++, Data Structures, Algorithms, SQL, and Object-Oriented Principles.',
      visual: (
        <div className="bg-slate-900 rounded-xl p-4 text-xs font-mono text-emerald-400 border border-slate-800 space-y-2">
          <p className="text-slate-400">// Concept: Memory Layout & JVM Mechanics</p>
          <p><span className="text-purple-400">class</span> <span className="text-amber-300">Solution</span> &#123;</p>
          <p className="pl-4"><span className="text-blue-400">public static void</span> main(String[] args) &#123;</p>
          <p className="pl-8 text-slate-300">System.out.println("Mastery unlocked!");</p>
          <p className="pl-4">&#125;</p>
          <p>&#125;</p>
        </div>
      )
    },
    {
      title: '2. Assess',
      icon: FileCheck2,
      badge: 'Real-Time Proctoring',
      heading: 'Timed Exams with Mixed MCQ & Live Coding',
      description: 'Autosave, question palette navigation, mark-for-review, and instant automated grading with canonical explanations.',
      visual: (
        <div className="bg-white rounded-xl p-4 border border-purple-100 shadow-soft space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-500">Assessment: Core CS Screening</span>
            <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-700">Timer: 42:15</span>
          </div>
          <div className="p-2.5 rounded-lg bg-purple-50/50 border border-purple-100 text-xs">
            <p className="font-semibold text-slate-800">Q1. Average lookup time in a Hash Table?</p>
            <div className="mt-2 space-y-1">
              <div className="p-1.5 rounded bg-purple-600 text-white flex items-center justify-between text-[11px]">
                <span>A) O(1)</span> <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div className="p-1.5 rounded bg-white text-slate-600 text-[11px] border border-slate-200">
                <span>B) O(N)</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: '3. Analyze',
      icon: ScanSearch,
      badge: 'ATS Parser',
      heading: 'Deterministic ATS Keyword & Structure Mining',
      description: 'Upload your resume, paste any job description, and receive a calculated keyword match score with actionable fixes.',
      visual: (
        <div className="bg-white rounded-xl p-4 border border-purple-100 shadow-soft space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700">ATS Match Analysis</span>
            <span className="text-lg font-black text-purple-700">86%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-500 h-full w-[86%]"></div>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px]">✓ React</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px]">✓ Node.js</span>
            <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-[11px]">⚠ Docker (Missing)</span>
          </div>
        </div>
      )
    },
    {
      title: '4. Personalize',
      icon: Milestone,
      badge: 'AI Roadmap',
      heading: '6-Week Targeted Learning Trajectory',
      description: 'Dynamically adapts based on your identified weak points, guiding you through core concepts, DSA, and mock tests.',
      visual: (
        <div className="bg-white rounded-xl p-4 border border-purple-100 shadow-soft space-y-2 text-xs">
          <div className="flex items-center justify-between font-bold text-slate-800">
            <span>Week 2: OOP & SOLID Principles</span>
            <span className="text-purple-600">66% Done</span>
          </div>
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center gap-2 text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="line-through text-slate-400">SOLID Design Principles</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="line-through text-slate-400">Design Patterns Deep-Dive</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 font-medium">
              <div className="w-4 h-4 rounded border-2 border-purple-400 shrink-0"></div>
              <span>Refactor Monolithic Microservice</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: '5. Build Resume',
      icon: FileText,
      badge: 'Qwen3-8B AI',
      heading: 'ATS-Friendly PDF Generator with AI Copilot',
      description: 'Generate high-impact bullet points using Google’s X-Y-Z formula and export publication-ready standard PDFs.',
      visual: (
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-[11px] text-slate-600 space-y-2">
          <div className="text-center pb-1 border-b border-slate-200">
            <p className="font-bold text-slate-800 text-xs">CANDIDATE NAME</p>
            <p className="text-[10px] text-slate-500">candidate@university.edu • Campus Placement Candidate</p>
          </div>
          <p className="font-semibold text-purple-700 uppercase tracking-wider text-[10px]">Technical Projects</p>
          <p className="text-slate-700 font-medium">Full Stack Cloud Application</p>
          <p className="text-[10px] text-slate-500 leading-relaxed">• Architected asynchronous queue with Node.js & Redis, cutting latency by 45%.</p>
        </div>
      )
    },
    {
      title: '6. Prepare',
      icon: MessagesSquare,
      badge: 'AI Mock Interview',
      heading: 'Simulated Technical, HR & Project Interviews',
      description: 'Practice real questions, get scored on technical keywords and depth, and read model answers and phrasing tips.',
      visual: (
        <div className="bg-white rounded-xl p-4 border border-purple-100 shadow-soft space-y-2 text-xs">
          <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 font-semibold text-[10px]">Technical Question</span>
          <p className="font-semibold text-slate-800">"How does Node.js Event Loop process microtasks?"</p>
          <div className="p-2 rounded bg-emerald-50 border border-emerald-100 text-[11px] text-emerald-800">
            <span className="font-bold">AI Feedback Score: 88/100</span>
            <p className="text-[10px] text-emerald-700 mt-0.5">Strong mention of microtask queue, Promise resolution, and call stack clearing.</p>
          </div>
        </div>
      )
    },
    {
      title: '7. Code',
      icon: Code2,
      badge: 'Piston Compiler',
      heading: 'Monaco Editor with Multi-Language Sandboxing',
      description: 'Write Java, Python, C++, or JavaScript. Run sample test cases and submit against hidden edge cases.',
      visual: (
        <div className="bg-slate-900 rounded-xl p-3 text-[11px] font-mono text-slate-200 space-y-1.5 border border-slate-800">
          <div className="flex items-center justify-between text-[10px] text-slate-400 pb-1 border-b border-slate-800">
            <span>two_sum.py</span>
            <span className="text-emerald-400">Accepted (14ms)</span>
          </div>
          <p className="text-purple-300">def twoSum(nums, target):</p>
          <p className="pl-4 text-slate-400">seen = &#123;&#125;</p>
          <p className="pl-4 text-emerald-300"># All 3/3 Test Cases Passed ✓</p>
        </div>
      )
    },
    {
      title: '8. Placement',
      icon: Building2,
      badge: 'Verified Opportunities',
      heading: 'Direct Eligibility Filtering & Applications',
      description: 'Browse verified corporate placement drives, check eligibility thresholds, and submit direct applications.',
      visual: (
        <div className="bg-white rounded-xl p-3.5 border border-purple-100 shadow-soft flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 font-bold flex items-center justify-center">
              C
            </div>
            <div>
              <p className="font-bold text-slate-800">Enterprise Partner Drive</p>
              <p className="text-[11px] text-slate-500">Associate Software Engineer</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
            Eligible
          </span>
        </div>
      )
    },
    {
      title: '9. Get Placed',
      icon: Trophy,
      badge: 'Milestone Achieved',
      heading: 'Complete Career Readiness Achieved',
      description: 'Every phase is tied together into an auditable career trajectory that campus recruiters and placement cells trust.',
      visual: (
        <div className="text-center p-6 bg-gradient-to-br from-purple-50 via-white to-pink-50 rounded-xl border border-purple-100 space-y-2">
          <Trophy className="w-10 h-10 text-amber-500 mx-auto" />
          <p className="font-bold text-sm text-slate-800">Placement Offer Secured!</p>
          <p className="text-xs text-slate-500">You are in the top 5% of candidate readiness nationwide.</p>
        </div>
      )
    }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-soft-lg max-w-3xl w-full overflow-hidden border border-purple-100 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-[#FBFAFF]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-700 to-pink-500 p-0.5">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-purple-700" />
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">The NexPrep End-to-End Journey</h3>
                <p className="text-xs text-slate-500">Interactive walkthrough of the 9 career preparation phases</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Tabs */}
          <div className="flex items-center overflow-x-auto px-6 py-3 border-b border-slate-100 gap-1.5 bg-slate-50/50">
            {steps.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === idx
                    ? 'bg-purple-700 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-white hover:text-purple-700'
                }`}
              >
                <span>{s.title}</span>
              </button>
            ))}
          </div>

          {/* Content Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">
                  {steps[activeTab].badge}
                </span>
                <h4 className="text-xl font-bold text-slate-800 tracking-tight leading-snug">
                  {steps[activeTab].heading}
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {steps[activeTab].description}
                </p>
              </div>

              <div>
                {steps[activeTab].visual}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-100 bg-[#FBFAFF] flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Step {activeTab + 1} of {steps.length}
            </div>
            <div className="flex items-center gap-3">
              {activeTab < steps.length - 1 ? (
                <button
                  onClick={() => setActiveTab(prev => prev + 1)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-purple-700 bg-white border border-slate-200 rounded-xl hover:border-purple-200 transition-all flex items-center gap-1.5"
                >
                  Next Step
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : null}
              <button
                onClick={() => {
                  onClose();
                  navigate('/dashboard');
                }}
                className="px-5 py-2 text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
              >
                Try Live Platform
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
