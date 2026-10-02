import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Search,
  BookOpen,
  Code2,
  Calculator,
  Users,
  ChevronRight,
  Filter,
  Briefcase,
  Globe,
  Star
} from 'lucide-react';

interface Company {
  id: string;
  name: string;
  slug: string;
  category: 'product' | 'service' | 'consulting' | 'finance' | 'startup';
  description: string;
  website?: string;
  logo_emoji: string;
  interview_rounds: string[];
}

const CATEGORY_LABELS: Record<string, string> = {
  all: 'All Companies',
  product: 'Product',
  service: 'IT Services',
  consulting: 'Consulting',
  finance: 'Finance',
  startup: 'Startup'
};

const CATEGORY_COLORS: Record<string, string> = {
  product: 'bg-blue-100 text-blue-700 border-blue-200',
  service: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  consulting: 'bg-amber-100 text-amber-700 border-amber-200',
  finance: 'bg-purple-100 text-purple-700 border-purple-200',
  startup: 'bg-pink-100 text-pink-700 border-pink-200'
};

export const CompanyDirectoryPage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filtered, setFiltered] = useState<Company[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/companies');
        if (!res.ok) throw new Error('Failed to load companies');
        const data = await res.json();
        setCompanies(data);
        setFiltered(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load companies');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    let result = companies;
    if (category !== 'all') {
      result = result.filter(c => c.category === category);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(c => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
    }
    setFiltered(result);
  }, [search, category, companies]);

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Building2 className="w-6 h-6 text-[#6D28D9]" />
          <h1 className="text-2xl font-black text-[#181525] tracking-tight">Company Interview Preparation</h1>
        </div>
        <p className="text-sm text-[#77718A] max-w-2xl">
          Prepare with company-specific theory, coding, aptitude, and HR practice questions.
          All questions are curated from community interview experiences or AI-generated for practice.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
        <Star className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800">
          <span className="font-bold">Important:</span> Interview patterns vary by role, location, and hiring cycle.
          Questions sourced from community-shared experiences and AI-generated practice content are for preparation only
          and may not reflect actual company interview questions.
        </p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#77718A]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search companies..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#EAE6F5] bg-white text-sm focus:outline-none focus:border-[#6D28D9] transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setCategory(key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                category === key
                  ? 'bg-[#6D28D9] text-white border-[#6D28D9]'
                  : 'bg-white text-[#77718A] border-[#EAE6F5] hover:border-[#6D28D9] hover:text-[#6D28D9]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Companies Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-[#EAE6F5] animate-pulse space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-100 rounded-xl" />
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-slate-100 rounded" />
                  <div className="h-3 w-16 bg-slate-100 rounded" />
                </div>
              </div>
              <div className="h-12 bg-slate-100 rounded" />
              <div className="h-8 bg-slate-100 rounded-xl" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-sm text-[#77718A]">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#6D28D9] text-white text-xs font-semibold rounded-xl"
          >
            Retry
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-sm text-[#77718A]">No companies match your search.</p>
          <button onClick={() => { setSearch(''); setCategory('all'); }} className="mt-3 text-xs text-[#6D28D9] font-semibold">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(company => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#EAE6F5]">
        {[
          { icon: Building2, label: 'Companies', value: companies.length.toString() },
          { icon: BookOpen, label: 'Theory Questions', value: '30+' },
          { icon: Calculator, label: 'Aptitude Questions', value: '10+' },
          { icon: Users, label: 'HR Questions', value: '10+' }
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl p-4 border border-[#EAE6F5] flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
              <stat.icon className="w-4 h-4 text-[#6D28D9]" />
            </div>
            <div>
              <p className="text-lg font-black text-[#181525]">{stat.value}</p>
              <p className="text-[10px] text-[#77718A]">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CompanyCard: React.FC<{ company: Company }> = ({ company }) => {
  const categoryColor = CATEGORY_COLORS[company.category] || 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#EAE6F5] hover:border-[#8B5CF6] hover:shadow-lg hover:shadow-purple-50 transition-all group flex flex-col gap-4">
      {/* Company Header */}
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-[#EAE6F5] flex items-center justify-center text-2xl shrink-0">
          {company.logo_emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-[#181525] truncate">{company.name}</h3>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border capitalize mt-1 ${categoryColor}`}>
            {company.category}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-[#77718A] leading-relaxed line-clamp-2">
        {company.description}
      </p>

      {/* Preparation Sections */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { icon: BookOpen, label: 'Theory', color: 'text-blue-600 bg-blue-50' },
          { icon: Code2, label: 'Coding', color: 'text-emerald-600 bg-emerald-50' },
          { icon: Calculator, label: 'Aptitude', color: 'text-amber-600 bg-amber-50' },
          { icon: Users, label: 'HR', color: 'text-purple-600 bg-purple-50' }
        ].map(section => (
          <div
            key={section.label}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold ${section.color}`}
          >
            <section.icon className="w-3 h-3" />
            {section.label}
          </div>
        ))}
      </div>

      {/* Interview Rounds */}
      <div className="space-y-1.5">
        <p className="text-[10px] font-bold text-[#77718A] uppercase tracking-wider">Interview Rounds</p>
        <div className="flex flex-wrap gap-1">
          {company.interview_rounds.slice(0, 3).map((round, i) => (
            <span key={i} className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded-md text-[10px] text-slate-600">
              {round.length > 25 ? round.substring(0, 25) + '…' : round}
            </span>
          ))}
          {company.interview_rounds.length > 3 && (
            <span className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded-md text-[10px] text-slate-500">
              +{company.interview_rounds.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* CTA */}
      <Link
        to={`/student/interview/company/${company.id}`}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-xs font-bold transition-all group-hover:shadow-md group-hover:shadow-purple-200"
      >
        <Briefcase className="w-3.5 h-3.5" />
        Prepare for {company.name}
        <ChevronRight className="w-3.5 h-3.5 ml-auto" />
      </Link>
    </div>
  );
};
