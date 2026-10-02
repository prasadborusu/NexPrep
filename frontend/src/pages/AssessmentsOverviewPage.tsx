import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FileCheck2,
  Code2,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  BrainCircuit,
  ArrowRight,
  Terminal,
  HelpCircle,
  Sparkles
} from 'lucide-react';

export const AssessmentsOverviewPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleStartAssessment = () => {
    if (user) {
      navigate('/student/assessments');
    } else {
      navigate('/login?redirect=/student/assessments');
    }
  };

  const assessmentCategories = [
    {
      title: 'Technical Multiple Choice (MCQ)',
      badge: 'Core Computer Science',
      icon: HelpCircle,
      description: 'Rigorous conceptual questions spanning Data Structures, Algorithms, Operating Systems, Database Management Systems, and Computer Networks.',
      features: [
        'Single and multiple correct formats',
        'Detailed explanation breakdown upon completion',
        'Time management pacing metrics'
      ]
    },
    {
      title: 'Aptitude & Quantitative Reasoning',
      badge: 'Placement Screening',
      icon: BrainCircuit,
      description: 'Standard campus placement aptitude evaluations including Numerical Ability, Logical Deduction, Verbal Ability, and Data Interpretation.',
      features: [
        'Speed and accuracy diagnostic scoring',
        'Realistic campus placement exam timing',
        'Categorized topic breakdowns'
      ]
    },
    {
      title: 'Technical Domain Evaluations',
      badge: 'Specialized Stacks',
      icon: Cpu,
      description: 'Role-specific assessments evaluating practical understanding of Full Stack Development, Backend APIs, Cloud Infrastructure, and DevOps.',
      features: [
        'Framework-specific scenario questions',
        'Database query optimization drills',
        'Architecture pattern identification'
      ]
    },
    {
      title: 'Live Coding Challenges',
      badge: 'Interactive Sandbox',
      icon: Code2,
      description: 'Algorithmic problem solving inside an integrated Monaco code editor with live execution against visible and hidden edge test suites.',
      features: [
        'Support for Python, Java, C++, and JavaScript',
        'Instant test runner with runtime profiling',
        'Execution sandboxed via Piston API'
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      {/* Header & Hero */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[#6D28D9]">
          Evaluation Engine
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#181525] tracking-tight">
          Smart Assessments & Live Coding
        </h1>
        <p className="text-sm sm:text-base text-[#77718A] leading-relaxed max-w-2xl mx-auto">
          Experience realistic placement screening environments with automated grading, anti-cheat detection, and comprehensive diagnostic reports.
        </p>

        <div className="pt-2">
          <button
            onClick={handleStartAssessment}
            className="px-8 py-3.5 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-xs sm:text-sm font-bold transition-all shadow-sm hover:shadow-soft inline-flex items-center gap-2"
          >
            <FileCheck2 className="w-4 h-4" />
            Start Assessment
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 4 Assessment Categories */}
      <section className="grid md:grid-cols-2 gap-8">
        {assessmentCategories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 sm:p-8 border border-[#EAE6F5] shadow-soft space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6D28D9] border border-purple-100 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-[#8B5CF6] uppercase tracking-wider bg-[#FBFAFF] px-2.5 py-1 rounded-full border border-[#EAE6F5]">
                    {cat.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#181525]">{cat.title}</h3>
                  <p className="text-xs text-[#77718A] mt-1.5 leading-relaxed">{cat.description}</p>
                </div>

                <div className="pt-2 space-y-2">
                  {cat.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 text-xs text-[#181525]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#EAE6F5]">
                <button
                  onClick={handleStartAssessment}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#FBFAFF] hover:bg-purple-50 text-[#6D28D9] hover:border-purple-200 border border-[#EAE6F5] text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Launch this assessment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </section>

      {/* Proctoring & Examination Integrity System */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 border border-[#EAE6F5] shadow-soft space-y-8">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#EC4899]">
            Examination Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#181525] tracking-tight">
            How The Assessment Engine Works
          </h2>
          <p className="text-xs sm:text-sm text-[#77718A]">
            Engineered for fair, resilient evaluation under simulated campus placement pressure.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-[#FBFAFF] border border-[#EAE6F5] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#6D28D9] flex items-center justify-center mb-1">
              <Clock className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-[#181525]">Continuous Local Autosave</h4>
            <p className="text-xs text-[#77718A] leading-relaxed">
              Every selected MCQ answer and code modification is saved instantly to local browser cache and periodic server sync to prevent data loss.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FBFAFF] border border-[#EAE6F5] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-pink-50 text-[#EC4899] flex items-center justify-center mb-1">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-[#181525]">Tab Switch & Blur Detection</h4>
            <p className="text-xs text-[#77718A] leading-relaxed">
              Tracks window blur events and tab shifts with visual warnings to emulate strict institutional placement proctoring conditions.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FBFAFF] border border-[#EAE6F5] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center mb-1">
              <Terminal className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-[#181525]">Real-time Sandbox Execution</h4>
            <p className="text-xs text-[#77718A] leading-relaxed">
              Coding submissions execute in isolated sandbox environments with strict timeout guards and automatic validation against hidden test cases.
            </p>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="bg-gradient-to-tr from-[#6D28D9] to-[#8B5CF6] rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-soft">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Test Your Skills Under Real Placement Conditions
        </h2>
        <p className="text-xs sm:text-sm text-purple-100 max-w-lg mx-auto">
          Access the student portal to select from scheduled mock screenings and live coding problems.
        </p>
        <div className="pt-2">
          <button
            onClick={handleStartAssessment}
            className="px-8 py-3.5 rounded-xl bg-white text-[#6D28D9] hover:bg-purple-50 text-xs sm:text-sm font-bold transition-all shadow-sm"
          >
            Start Assessment Now
          </button>
        </div>
      </section>
    </div>
  );
};
