import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  FileCheck2,
  ScanSearch,
  Milestone,
  FileText,
  Cpu,
  Award,
  ArrowRight,
  ArrowDown,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const stages = [
    {
      step: '01',
      title: 'LEARN',
      headline: 'Foundations & Core Technical Concepts',
      icon: BookOpen,
      color: 'from-purple-500 to-indigo-600',
      description: 'Master core computer science fundamentals including Data Structures, Algorithms, Object-Oriented Architecture, Database Management, and Operating Systems before entering assessment screenings.',
      studentAction: 'Review topic guides, practice sample questions, and align technical foundations with role expectations.',
      systemAutomation: 'Curates recommended subject areas and prerequisites based on current technology trends.'
    },
    {
      step: '02',
      title: 'ASSESS',
      headline: 'Timed Proctored Knowledge Validation',
      icon: FileCheck2,
      color: 'from-indigo-600 to-blue-600',
      description: 'Take standardized screenings consisting of multiple-choice conceptual questions and live coding challenges under timed conditions.',
      studentAction: 'Complete proctored assessment sessions with live autosave and strict anti-tab switching guards.',
      systemAutomation: 'Automatically grades MCQ responses and evaluates live code against test suites and edge cases in real time.'
    },
    {
      step: '03',
      title: 'ANALYZE',
      headline: 'Audit Performance & Existing Profile',
      icon: ScanSearch,
      color: 'from-blue-600 to-teal-600',
      description: 'Synthesize assessment outcomes and scan existing resume drafts to identify technical keyword density and structural compliance.',
      studentAction: 'Upload previous resumes and review detailed breakdowns of strong competencies versus uncovered topics.',
      systemAutomation: 'Parses resume layout, audits ATS readability, and benchmarks student credentials against target company expectations.'
    },
    {
      step: '04',
      title: 'PERSONALIZE',
      headline: 'Dynamic Skill Gap & Trajectory Synthesis',
      icon: Milestone,
      color: 'from-teal-600 to-emerald-600',
      description: 'Convert diagnostic data into an actionable week-by-week preparation roadmap tailored specifically to your target software role.',
      studentAction: 'Follow scheduled weekly milestones and focus study time exclusively on identified skill gaps.',
      systemAutomation: 'Recalculates milestone priorities as you pass new coding challenges and mock screenings.'
    },
    {
      step: '05',
      title: 'BUILD',
      headline: 'AI-Enhanced ATS-Optimized Resume',
      icon: FileText,
      color: 'from-emerald-600 to-amber-600',
      description: 'Construct a professional, recruiter-ready resume. Use the integrated Qwen AI engine to formulate impactful, quantifiable accomplishment bullets.',
      studentAction: 'Input education, projects, and work experience using structured form controls and AI phrasing prompts.',
      systemAutomation: 'Generates clean, single-column ATS PDF exports with zero parsing friction for corporate hiring systems.'
    },
    {
      step: '06',
      title: 'PREPARE',
      headline: 'Simulated Interviews & Mock Drills',
      icon: Cpu,
      color: 'from-amber-600 to-rose-600',
      description: 'Engage in realistic Technical, System Design, and Behavioral interview drills with instant AI evaluation of your responses.',
      studentAction: 'Answer challenging technical questions and receive guidance on clarity, problem-solving structure, and depth.',
      systemAutomation: 'Analyzes technical vocabulary, conciseness, and structural alignment to hiring rubrics.'
    },
    {
      step: '07',
      title: 'GET PLACED',
      headline: 'Institutional Verification & Placement Drives',
      icon: Award,
      color: 'from-rose-600 to-purple-700',
      description: 'Apply directly to verified campus recruitment opportunities and on-campus placement drives organized by your institution.',
      studentAction: 'Register for recruitment drives with one click using your verified NexPrep preparation portfolio.',
      systemAutomation: 'Validates candidate eligibility criteria, registers students with the placement cell, and sends automated updates.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#6D28D9]">
          The Systematic Pipeline
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#181525] tracking-tight">
          How NexPrep Works
        </h1>
        <p className="text-sm sm:text-base text-[#77718A] leading-relaxed">
          From fundamental computer science concepts to on-campus placement offers, explore how NexPrep guides your preparation at every step.
        </p>
      </div>

      {/* 7 Stages Vertical Timeline */}
      <div className="space-y-8 relative">
        {/* Background connecting line */}
        <div className="hidden md:block absolute left-8 top-10 bottom-10 w-0.5 bg-gradient-to-b from-[#6D28D9] via-[#8B5CF6] to-[#EC4899] z-0" />

        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          return (
            <div
              key={stage.step}
              className="relative z-10 bg-white rounded-2xl p-6 sm:p-8 border border-[#EAE6F5] shadow-soft hover:shadow-soft-lg transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                {/* Step Icon Badge */}
                <div className="flex items-center gap-3 md:flex-col md:items-center shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-100 text-[#6D28D9] flex items-center justify-center shadow-xs">
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-black text-[#8B5CF6] uppercase tracking-wider">
                    Stage {stage.step}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#6D28D9]">
                      {stage.title}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-[#181525] mt-0.5">
                      {stage.headline}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#77718A] mt-2 leading-relaxed">
                      {stage.description}
                    </p>
                  </div>

                  {/* Two-Column Details */}
                  <div className="grid sm:grid-cols-2 gap-4 pt-2 text-xs">
                    <div className="p-3.5 rounded-xl bg-[#FBFAFF] border border-[#EAE6F5] space-y-1">
                      <span className="font-bold text-[#181525] block">Student Experience</span>
                      <p className="text-[#77718A] leading-relaxed">{stage.studentAction}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100 space-y-1">
                      <span className="font-bold text-[#6D28D9] block flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-[#EC4899]" />
                        NexPrep Intelligence
                      </span>
                      <p className="text-[#77718A] leading-relaxed">{stage.systemAutomation}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Bottom Section */}
      <div className="mt-16 p-8 rounded-2xl bg-[#FBFAFF] border border-[#EAE6F5] text-center space-y-4">
        <h3 className="text-xl font-bold text-[#181525]">Ready to start your preparation journey?</h3>
        <p className="text-xs sm:text-sm text-[#77718A] max-w-lg mx-auto">
          Create your candidate account to access proctored assessments, coding compilers, and our AI resume builder.
        </p>
        <div className="pt-2">
          <Link
            to="/register"
            className="inline-flex px-6 py-3 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-xs font-semibold shadow-sm"
          >
            Get Started with NexPrep
          </Link>
        </div>
      </div>
    </div>
  );
};
