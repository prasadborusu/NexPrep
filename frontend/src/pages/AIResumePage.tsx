import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  ScanSearch,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  Download,
  AlertCircle
} from 'lucide-react';

export const AIResumePage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="text-center max-w-3xl mx-auto space-y-5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#EAE6F5] text-xs font-semibold text-[#6D28D9] shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#EC4899]" />
          <span>Hugging Face AI Resume Engine</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#181525] tracking-tight leading-tight">
          Engineered for Recruiters.{' '}
          <span className="bg-gradient-to-r from-[#6D28D9] via-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">
            Optimized for ATS.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-[#77718A] leading-relaxed max-w-2xl mx-auto">
          Create verified, recruiter-compliant technical resumes with AI-assisted quantifiable bullet points and comprehensive keyword audit tools.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            to="/student/resume/builder"
            className="px-6 py-3.5 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow-soft flex items-center gap-2 transition-all"
          >
            <FileText className="w-4 h-4" />
            Build My Resume
          </Link>

          <Link
            to="/student/resume/analyzer"
            className="px-6 py-3.5 rounded-xl bg-white hover:bg-purple-50/50 text-[#181525] hover:text-[#6D28D9] border border-[#EAE6F5] text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-2 transition-all"
          >
            <ScanSearch className="w-4 h-4" />
            Analyze My Resume
          </Link>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. AI RESUME BUILDER OVERVIEW */}
      {/* ========================================================================= */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 border border-[#EAE6F5] shadow-soft space-y-8">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6D28D9]">
            Structured Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#181525] tracking-tight">
            How The AI Resume Builder Works
          </h2>
          <p className="text-xs sm:text-sm text-[#77718A]">
            A guided 10-step wizard ensuring zero formatting mistakes, clean section hierarchy, and verified technical phrasing.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              step: 'Step 1',
              title: 'Personal Info & Degree',
              desc: 'Standardized contact header, degree, branch, and graduation year with institutional verification.'
            },
            {
              step: 'Step 2',
              title: 'Skills & Tech Stack',
              desc: 'Categorized languages, frameworks, developer tools, and databases with verified evidence tags.'
            },
            {
              step: 'Step 3',
              title: 'Projects & Work',
              desc: 'Structured project descriptions focusing on engineering challenges, architecture, and impact.'
            },
            {
              step: 'Step 4',
              title: 'AI Enhancement & Export',
              desc: 'AI refines phrasing using Google X-Y-Z formula before direct high-resolution single-page PDF rendering.'
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-[#FBFAFF] rounded-2xl p-5 border border-[#EAE6F5] space-y-2">
              <span className="text-[10px] font-bold text-[#8B5CF6] uppercase">{item.step}</span>
              <h3 className="text-sm font-bold text-[#181525]">{item.title}</h3>
              <p className="text-xs text-[#77718A] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. RESUME INFORMATION & AI GENERATION */}
      {/* ========================================================================= */}
      <section className="grid lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#EC4899]">
            AI Phrasing Engine
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#181525] tracking-tight">
            Turn Generic Bullet Points Into Quantifiable Wins
          </h2>
          <p className="text-xs sm:text-sm text-[#77718A] leading-relaxed">
            Hiring managers and ATS parsers discard vague statements like "worked on backend". NexPrep connects to Hugging Face models (Qwen/Qwen3-8B) via secure server-side endpoints to restructure your technical contributions.
          </p>

          <div className="space-y-3 pt-2">
            <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200 text-xs space-y-1">
              <span className="text-[10px] font-bold text-rose-700 uppercase">Before (Weak Draft)</span>
              <p className="text-slate-700">"Built a website using React and Node.js with database connection."</p>
            </div>

            <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200 text-xs space-y-1">
              <span className="text-[10px] font-bold text-[#6D28D9] uppercase flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#EC4899]" />
                After (NexPrep AI Phrasing)
              </span>
              <p className="text-[#181525] font-medium">
                "Engineered a full-stack web portal utilizing React and Node.js REST APIs; optimized SQL indexing to reduce query latency by 35% across 5,000+ records."
              </p>
            </div>
          </div>
        </div>

        {/* Live Resume Mockup Preview */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-[#EAE6F5] shadow-soft space-y-4 font-serif text-[11px] text-[#181525]">
          <div className="flex items-center justify-between pb-2 border-b border-[#EAE6F5] font-sans">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#77718A]">
              Single-Column Clean Layout
            </span>
            <span className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-semibold border border-purple-100">
              Standard 1-Page
            </span>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-bold tracking-tight text-[#181525]">CANDIDATE NAME</h4>
            <p className="text-[10px] text-[#77718A] font-sans">
              Software Engineer • email@university.edu • github.com/profile
            </p>
          </div>

          <div className="space-y-1 font-sans">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#6D28D9] border-b border-[#EAE6F5] pb-0.5">
              Technical Proficiencies
            </p>
            <p className="text-[10px] text-[#77718A]">
              <strong>Languages:</strong> Java, Python, TypeScript, SQL <br />
              <strong>Tools & Cloud:</strong> Docker, Git, PostgreSQL, REST APIs, Linux
            </p>
          </div>

          <div className="space-y-1 font-sans">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#6D28D9] border-b border-[#EAE6F5] pb-0.5">
              Featured Technical Projects
            </p>
            <p className="font-semibold text-[#181525]">Distributed Key-Value Cache (Java, Raft)</p>
            <p className="text-[#77718A] leading-relaxed">
              • Implemented distributed leader election and log replication conforming to Raft consensus. <br />
              • Benchmarked concurrent thread pools, achieving sub-10ms response times under load.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. ATS ANALYSIS & JOB DESCRIPTION MATCHING */}
      {/* ========================================================================= */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 border border-[#EAE6F5] shadow-soft space-y-8">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6D28D9]">
            Audit & Match
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#181525] tracking-tight">
            ATS Scanner & Job Description Alignment
          </h2>
          <p className="text-xs sm:text-sm text-[#77718A]">
            Compare your resume against any target Job Description (JD) to uncover missing technologies, keyword gaps, and layout warnings without fabricated percentages.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-[#FBFAFF] border border-[#EAE6F5] space-y-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
              1. Keyword Alignment
            </span>
            <p className="text-xs text-[#77718A] leading-relaxed">
              Identifies which technical skills and domain frameworks mentioned in the job description are present in your document.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FBFAFF] border border-[#EAE6F5] space-y-2">
            <span className="text-xs font-bold text-rose-800 uppercase tracking-wider block">
              2. Missing Competencies
            </span>
            <p className="text-xs text-[#77718A] leading-relaxed">
              Highlights essential requirements listed in the JD that you have not included, prompting you to address them before applying.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FBFAFF] border border-[#EAE6F5] space-y-2">
            <span className="text-xs font-bold text-[#6D28D9] uppercase tracking-wider block">
              3. Formatting Audit
            </span>
            <p className="text-xs text-[#77718A] leading-relaxed">
              Flags complex multi-column tables, graphics, or icons that cause OCR scanners and ATS parsers to misread your details.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. FINAL ACTION CTA */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-tr from-[#6D28D9] via-[#8B5CF6] to-[#EC4899] rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-soft">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Create Your Recruiter-Ready Resume
        </h2>
        <p className="text-xs sm:text-sm text-purple-100 max-w-lg mx-auto">
          Sign in to the student workspace to launch the full-screen AI Resume Builder or run your draft through the ATS Scanner.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            to="/student/resume/builder"
            className="px-6 py-3.5 rounded-xl bg-white text-[#6D28D9] hover:bg-purple-50 text-xs sm:text-sm font-bold transition-all shadow-sm"
          >
            Build My Resume
          </Link>
          <Link
            to="/student/resume/analyzer"
            className="px-6 py-3.5 rounded-xl bg-purple-900/40 hover:bg-purple-900/60 text-white border border-white/20 text-xs sm:text-sm font-bold transition-all"
          >
            Analyze My Resume
          </Link>
        </div>
      </section>
    </div>
  );
};
