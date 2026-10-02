import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Code2,
  Calculator,
  Users,
  Globe,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Briefcase,
  Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Company {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  website?: string;
  logo_emoji: string;
  interview_rounds: string[];
  interview_disclaimer: string;
}

interface Progress {
  theory: { total: number; completed: number };
  coding: { total: number; solved: number };
  aptitude: { total: number; completed: number };
  hr: { total: number; completed: number };
}

export const CompanyDetailPage: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!companyId) return;
    const load = async () => {
      setIsLoading(true);
      try {
        const [companyRes, progressRes] = await Promise.all([
          fetch(`/api/companies/${companyId}`).then(r => r.json()),
          user ? fetch(`/api/companies/${companyId}/progress/${user.id}`).then(r => r.json()) : Promise.resolve(null)
        ]);
        setCompany(companyRes);
        setProgress(progressRes);
      } catch (err: any) {
        setError('Failed to load company details');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [companyId, user]);

  if (isLoading) {
    return (
      <div className="p-6 sm:p-8 max-w-5xl mx-auto space-y-6">
        <div className="h-8 w-48 bg-slate-100 rounded-xl animate-pulse" />
        <div className="h-40 bg-slate-100 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="p-6 sm:p-8 max-w-5xl mx-auto text-center py-20">
        <AlertCircle className="w-12 h-12 text-red-300 mx-auto mb-4" />
        <p className="text-sm text-[#77718A]">{error || 'Company not found'}</p>
        <Link to="/student/interview" className="mt-4 inline-block text-xs text-[#6D28D9] font-semibold">
          ← Back to Companies
        </Link>
      </div>
    );
  }

  const sections = [
    {
      id: 'theory',
      label: 'Theory Questions',
      icon: BookOpen,
      color: 'bg-blue-50 border-blue-200 text-blue-700',
      iconBg: 'bg-blue-100 text-blue-700',
      description: 'Core CS concepts: OOP, DBMS, OS, Networks, DSA, System Design',
      link: `/student/interview/company/${companyId}/theory`,
      progress: progress ? `${progress.theory.completed} / ${progress.theory.total} completed` : `${getCount('theory', company)} questions`,
      cta: 'Start Theory Prep'
    },
    {
      id: 'coding',
      label: 'Coding Problems',
      icon: Code2,
      color: 'bg-emerald-50 border-emerald-200 text-emerald-700',
      iconBg: 'bg-emerald-100 text-emerald-700',
      description: 'DSA problems relevant to this company\'s difficulty level',
      link: `/student/interview/company/${companyId}/coding`,
      progress: progress ? `${progress.coding.solved} / ${progress.coding.total} solved` : 'Curated DSA problems',
      cta: 'Practice Coding'
    },
    {
      id: 'aptitude',
      label: 'Aptitude Tests',
      icon: Calculator,
      color: 'bg-amber-50 border-amber-200 text-amber-700',
      iconBg: 'bg-amber-100 text-amber-700',
      description: 'Quantitative, Logical Reasoning, Verbal, and Data Interpretation',
      link: `/student/interview/company/${companyId}/aptitude`,
      progress: progress ? `${progress.aptitude.completed} / ${progress.aptitude.total} attempted` : 'Practice questions available',
      cta: 'Take Aptitude Test'
    },
    {
      id: 'hr',
      label: 'HR Preparation',
      icon: Users,
      color: 'bg-purple-50 border-purple-200 text-purple-700',
      iconBg: 'bg-purple-100 text-purple-700',
      description: 'Behavioral, situational, and company-specific HR questions',
      link: `/student/interview/company/${companyId}/hr`,
      progress: progress ? `${progress.hr.completed} / ${progress.hr.total} practiced` : 'Company HR questions',
      cta: 'Prepare for HR'
    }
  ];

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto space-y-8">
      {/* Back navigation */}
      <Link
        to="/student/interview"
        className="inline-flex items-center gap-1.5 text-xs text-[#77718A] hover:text-[#6D28D9] font-semibold transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Company Directory
      </Link>

      {/* Company Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-[#EAE6F5] shadow-sm">
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-[#EAE6F5] flex items-center justify-center text-3xl shrink-0">
            {company.logo_emoji}
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black text-[#181525] tracking-tight">{company.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200 capitalize">
                  {company.category}
                </span>
              </div>
              <p className="text-sm text-[#77718A] mt-1">{company.description}</p>
            </div>

            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#6D28D9] font-semibold hover:underline"
              >
                <Globe className="w-3.5 h-3.5" />
                Official Website
              </a>
            )}

            {/* Interview Rounds */}
            <div>
              <p className="text-[10px] font-bold text-[#77718A] uppercase tracking-wider mb-2 flex items-center gap-1">
                <Layers className="w-3 h-3" /> Interview Rounds
              </p>
              <div className="flex flex-wrap gap-1.5">
                {company.interview_rounds.map((round, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#6D28D9] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-xs text-[#181525] font-medium">{round}</span>
                    {i < company.interview_rounds.length - 1 && (
                      <ChevronRight className="w-3 h-3 text-slate-300" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800">{company.interview_disclaimer}</p>
      </div>

      {/* Preparation Sections */}
      <div>
        <h2 className="text-base font-bold text-[#181525] mb-4">Choose Your Preparation Area</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {sections.map(section => (
            <div
              key={section.id}
              className={`rounded-2xl p-5 border ${section.color} flex flex-col gap-4 hover:shadow-md transition-all`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${section.iconBg} shrink-0`}>
                  <section.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">{section.label}</h3>
                  <p className="text-xs opacity-80 mt-0.5">{section.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold opacity-75 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {section.progress}
                </span>
                <Link
                  to={section.link}
                  className="px-4 py-2 rounded-xl bg-white/80 hover:bg-white border border-current text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  {section.cta}
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mock Interview CTA */}
      <div className="bg-gradient-to-r from-[#6D28D9] to-[#8B5CF6] rounded-2xl p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-base">Ready for a full mock interview?</h3>
          <p className="text-sm text-white/80 mt-1">
            Practice all rounds in one go with AI-powered evaluation and feedback.
          </p>
        </div>
        <Link
          to="/student/interview"
          className="px-5 py-2.5 rounded-xl bg-white text-[#6D28D9] text-sm font-bold hover:bg-purple-50 transition-colors flex items-center gap-2 shrink-0"
        >
          <Briefcase className="w-4 h-4" />
          Start Mock Interview
        </Link>
      </div>
    </div>
  );
};

function getCount(section: string, company: Company): string {
  return 'Questions available';
}
