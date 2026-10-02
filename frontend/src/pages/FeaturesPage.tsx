import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  ScanSearch,
  FileCheck2,
  Code2,
  Cpu,
  Milestone,
  MessagesSquare,
  Building2,
  ChevronRight,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Terminal,
  Layers,
  Award
} from 'lucide-react';

export const FeaturesPage: React.FC = () => {
  const features = [
    {
      id: 'ai-resume-builder',
      title: 'AI Resume Builder',
      badge: 'Resume Suite',
      description: 'Draft single-page, ATS-compliant technical resumes with step-by-step guidance. Use our Hugging Face Qwen AI model to generate quantifiable, action-oriented bullet points tailored to your target software role.',
      icon: FileText,
      link: '/student/resume/builder',
      linkText: 'Launch Resume Builder',
      preview: (
        <div className="bg-[#FBFAFF] rounded-xl p-4 border border-[#EAE6F5] space-y-2 text-xs font-sans">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#EAE6F5]">
            <span className="font-bold text-[#181525]">Resume Preview</span>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">Ready to Export</span>
          </div>
          <div className="text-[11px] text-[#77718A] space-y-1">
            <p className="font-semibold text-[#181525]">Backend Developer • Java, Spring Boot, PostgreSQL</p>
            <p className="line-clamp-2">"Engineered high-throughput RESTful services processing 10,000+ daily requests with 99.9% uptime."</p>
          </div>
        </div>
      )
    },
    {
      id: 'ats-analyzer',
      title: 'ATS Resume Analyzer',
      badge: 'Audit & Compliance',
      description: 'Upload your resume and paste target job descriptions. The engine performs deep keyword matching, identifies missing critical technologies, audits layout readability, and provides concrete improvement prompts without arbitrary numeric scores.',
      icon: ScanSearch,
      link: '/student/resume/analyzer',
      linkText: 'Scan with ATS Engine',
      preview: (
        <div className="bg-white rounded-xl p-4 border border-[#EAE6F5] space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#181525]">Keyword Density Audit</span>
            <span className="text-[10px] font-semibold text-[#6D28D9] bg-purple-50 px-2 py-0.5 rounded">High Alignment</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {['Java', 'SQL', 'Data Structures', 'REST APIs', 'System Design'].map((k) => (
              <span key={k} className="px-2 py-0.5 rounded bg-purple-50 text-[#6D28D9] text-[10px] font-medium border border-purple-100">
                ✓ {k}
              </span>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'smart-assessments',
      title: 'Smart Assessments',
      badge: 'Screening Engine',
      description: 'Timed proctored evaluations with mixed multiple-choice questions and live programming challenges. Features local autosave, anti-tab-switch detection, automated grading, and instant performance breakdowns.',
      icon: FileCheck2,
      link: '/assessments',
      linkText: 'View Assessments Portal',
      preview: (
        <div className="bg-[#FBFAFF] rounded-xl p-4 border border-[#EAE6F5] space-y-2 text-xs">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#EAE6F5]">
            <span className="font-semibold text-[#181525]">MCQ Assessment</span>
            <span className="font-mono text-[10px] text-[#77718A]">Time Remaining: 28:45</span>
          </div>
          <p className="text-[11px] text-[#77718A]">"Which data structure delivers amortized O(1) time complexity for insert and search operations?"</p>
          <div className="p-1.5 rounded-lg bg-[#6D28D9] text-white text-[10px] font-semibold flex items-center justify-between">
            <span>Hash Table</span>
            <CheckCircle2 className="w-3 h-3" />
          </div>
        </div>
      )
    },
    {
      id: 'coding-practice',
      title: 'Coding Practice',
      badge: 'Interactive Sandbox',
      description: 'Solve real interview algorithmic problems directly inside Monaco Editor. Features multi-language syntax support (Python, Java, C++, JavaScript), real-time sandbox execution, hidden edge cases, and runtime profiling.',
      icon: Code2,
      link: '/student/coding',
      linkText: 'Open Coding Platform',
      preview: (
        <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 text-white font-mono text-[11px] space-y-1.5">
          <div className="flex items-center justify-between text-[10px] text-slate-400 pb-1 border-b border-slate-800">
            <span>solution.py</span>
            <span className="text-emerald-400">All 5 Tests Passed</span>
          </div>
          <p className="text-purple-400">def <span className="text-blue-300">maxSubArray</span>(nums):</p>
          <p className="pl-3 text-slate-400">cur = ans = nums[0]</p>
          <p className="pl-3 text-pink-400">return ans</p>
        </div>
      )
    },
    {
      id: 'skill-intelligence',
      title: 'Skill Intelligence',
      badge: 'Competency Mapping',
      description: 'Aggregate verified evidence across all your mock screenings, coding challenges, and resume statements. Organizes skills into qualitative tiers (Strong Evidence, Needs Practice, Not Evaluated) so you know exactly where to focus.',
      icon: Cpu,
      link: '/student/skills',
      linkText: 'Explore Skill Intelligence',
      preview: (
        <div className="bg-white rounded-xl p-4 border border-[#EAE6F5] space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#181525]">Competency Matrix</span>
            <span className="text-[10px] text-[#77718A]">Evaluated</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="p-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">
              Data Structures: Strong Evidence
            </div>
            <div className="p-2 rounded bg-amber-50 border border-amber-200 text-amber-800 font-semibold">
              System Design: Needs Practice
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'personalized-roadmap',
      title: 'Personalized Roadmap',
      badge: 'Adaptive Path',
      description: 'Never guess what to study next. NexPrep generates an adaptive, milestone-driven preparation plan based on your target role and detected skill gaps, guiding you step-by-step towards placement eligibility.',
      icon: Milestone,
      link: '/student/roadmap',
      linkText: 'Open Preparation Roadmap',
      preview: (
        <div className="bg-[#FBFAFF] rounded-xl p-4 border border-[#EAE6F5] space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#181525]">Current Milestone</span>
            <span className="text-[10px] font-semibold text-[#6D28D9]">Stage 03 / 06</span>
          </div>
          <p className="text-[11px] text-[#77718A]">Algorithmic Mastery: Dynamic Programming & Graph Traversals</p>
          <div className="w-full bg-purple-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-[#6D28D9] h-full w-2/3" />
          </div>
        </div>
      )
    },
    {
      id: 'interview-prep',
      title: 'Interview Preparation',
      badge: 'Simulation Drills',
      description: 'Practice simulated Technical, System Design, and Behavioral HR interviews. Receive structured AI feedback analyzing communication clarity, depth of explanation, and technical precision.',
      icon: MessagesSquare,
      link: '/student/interview',
      linkText: 'Start Interview Practice',
      preview: (
        <div className="bg-white rounded-xl p-4 border border-[#EAE6F5] space-y-2 text-xs">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#EAE6F5]">
            <span className="font-semibold text-[#181525]">Technical Interview Drill</span>
            <span className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-semibold">Active Session</span>
          </div>
          <p className="text-[11px] text-[#77718A]">"Explain the trade-offs between SQL database normalization and NoSQL document sharding."</p>
        </div>
      )
    },
    {
      id: 'placement-drives',
      title: 'Placement Drives',
      badge: 'Campus Recruitment',
      description: 'Browse active placement drives, verified eligibility criteria, registration deadlines, and compensation details managed directly by your college placement cell.',
      icon: Building2,
      link: '/student/placements',
      linkText: 'Browse Placement Drives',
      preview: (
        <div className="bg-[#FBFAFF] rounded-xl p-4 border border-[#EAE6F5] space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#181525]">Campus Recruitment Drive</span>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-semibold">Open for Registration</span>
          </div>
          <p className="text-[11px] text-[#77718A]">Software Development Engineer • Batch 2026</p>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Page Header */}
      <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#6D28D9]">
          Platform Capabilities
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#181525] tracking-tight">
          Everything You Need to Become Career Ready
        </h1>
        <p className="text-sm sm:text-base text-[#77718A] leading-relaxed">
          Explore the modular architecture engineered to replace scattered tools with one cohesive, verified preparation system.
        </p>
      </div>

      {/* Feature Cards Grid with Previews */}
      <div className="grid md:grid-cols-2 gap-8">
        {features.map((feat) => {
          const Icon = feat.icon;
          return (
            <div
              key={feat.id}
              className="bg-white rounded-2xl p-6 border border-[#EAE6F5] shadow-soft hover:shadow-soft-lg transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6D28D9] border border-purple-100 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-[#8B5CF6] uppercase tracking-wider bg-[#FBFAFF] px-2.5 py-1 rounded-full border border-[#EAE6F5]">
                    {feat.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#181525]">{feat.title}</h3>
                  <p className="text-xs text-[#77718A] mt-2 leading-relaxed">{feat.description}</p>
                </div>

                {/* Embedded UI Preview Component */}
                <div className="pt-2">
                  {feat.preview}
                </div>
              </div>

              {/* Action Link */}
              <div className="pt-2 border-t border-[#EAE6F5]">
                <Link
                  to={feat.link}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#FBFAFF] hover:bg-purple-50 text-xs font-bold text-[#6D28D9] border border-[#EAE6F5] hover:border-purple-200 transition-all flex items-center justify-center gap-1.5 group"
                >
                  <span>{feat.linkText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA Banner */}
      <div className="mt-16 p-8 rounded-2xl bg-gradient-to-tr from-[#6D28D9] to-[#8B5CF6] text-white text-center space-y-4 shadow-soft">
        <h2 className="text-xl sm:text-2xl font-black tracking-tight">Ready to begin your preparation?</h2>
        <p className="text-xs sm:text-sm text-purple-100 max-w-xl mx-auto">
          Start assessing your skills and generating an ATS-verified resume today.
        </p>
        <div className="pt-2">
          <Link
            to="/register"
            className="inline-flex px-6 py-3 rounded-xl bg-white text-[#6D28D9] hover:bg-purple-50 text-xs font-bold transition-all shadow-sm"
          >
            Create Free Account
          </Link>
        </div>
      </div>
    </div>
  );
};
