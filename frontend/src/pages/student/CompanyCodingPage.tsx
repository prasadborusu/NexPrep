import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Code2,
  ExternalLink,
  ChevronRight,
  Target,
  Info,
  Zap
} from 'lucide-react';

interface CodingProblem {
  id: string;
  title: string;
  slug: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  tags: string[];
  leetcode_url?: string;
  acceptance_rate: number;
  total_submissions: number;
}

interface Company {
  id: string;
  name: string;
  logo_emoji: string;
  category: string;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  medium: 'text-amber-600 bg-amber-50 border-amber-200',
  hard: 'text-red-600 bg-red-50 border-red-200'
};

export const CompanyCodingPage: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const [problems, setProblems] = useState<CodingProblem[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [diffFilter, setDiffFilter] = useState<string>('all');

  useEffect(() => {
    if (!companyId) return;
    const load = async () => {
      try {
        const res = await fetch(`/api/companies/${companyId}/coding`);
        const data = await res.json();
        setProblems(data.problems || []);
        setCompany(data.company || null);
      } catch {
        setProblems([]);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [companyId]);

  const filtered = diffFilter === 'all'
    ? problems
    : problems.filter(p => p.difficulty === diffFilter);

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto space-y-6">
      {/* Back */}
      <Link
        to={`/student/interview/company/${companyId}`}
        className="inline-flex items-center gap-1.5 text-xs text-[#77718A] hover:text-[#6D28D9] font-semibold transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to {company?.name || 'Company'}
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
          <Code2 className="w-5 h-5 text-emerald-700" />
        </div>
        <div>
          <h1 className="text-xl font-black text-[#181525]">
            {company?.name} — Coding Problems
          </h1>
          <p className="text-xs text-[#77718A]">Practice DSA problems relevant to this company's interview difficulty</p>
        </div>
      </div>

      {/* Info */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex gap-3">
        <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <p className="text-xs text-emerald-800">
          Click <strong>Practice</strong> to open the full-screen Monaco IDE with code execution. 
          Click <strong>View on LeetCode</strong> to practice on LeetCode directly.
        </p>
      </div>

      {/* Difficulty Filter */}
      <div className="flex gap-2">
        {['all', 'easy', 'medium', 'hard'].map(d => (
          <button
            key={d}
            onClick={() => setDiffFilter(d)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all capitalize ${
              diffFilter === d
                ? 'bg-[#6D28D9] text-white border-[#6D28D9]'
                : 'bg-white text-[#77718A] border-[#EAE6F5] hover:border-[#6D28D9]'
            }`}
          >
            {d === 'all' ? 'All' : d}
          </button>
        ))}
      </div>

      {/* Problems Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Code2 className="w-10 h-10 text-slate-200 mx-auto mb-3" />
          <p className="text-sm text-[#77718A]">No problems found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#EAE6F5] overflow-hidden">
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-x-4 px-5 py-3 bg-slate-50 border-b border-[#EAE6F5] text-[10px] font-bold text-[#77718A] uppercase tracking-wider">
            <span>#</span>
            <span>Problem</span>
            <span className="text-center">Difficulty</span>
            <span className="text-center">Topic</span>
            <span className="text-right">Actions</span>
          </div>
          {filtered.map((problem, idx) => (
            <div
              key={problem.id}
              className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-x-4 px-5 py-4 border-b border-[#EAE6F5] last:border-0 hover:bg-purple-50/30 transition-colors items-center"
            >
              <span className="text-xs font-mono text-[#77718A]">{idx + 1}</span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#181525] truncate">{problem.title}</p>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {problem.tags.slice(0, 2).map((tag, i) => (
                    <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border capitalize ${DIFFICULTY_COLORS[problem.difficulty]}`}>
                {problem.difficulty}
              </span>
              <span className="text-[10px] text-[#77718A] font-medium text-center">{problem.category}</span>
              <div className="flex gap-2 items-center justify-end">
                {problem.leetcode_url && (
                  <a
                    href={problem.leetcode_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 transition-colors"
                    title="View on LeetCode"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  onClick={() => navigate(`/student/coding/problem/${problem.id}`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-[11px] font-bold transition-colors"
                >
                  <Zap className="w-3 h-3" />
                  Practice
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      {!isLoading && problems.length > 0 && (
        <div className="flex flex-wrap gap-4 text-xs text-[#77718A]">
          {['easy', 'medium', 'hard'].map(d => (
            <span key={d} className={`font-semibold capitalize ${d === 'easy' ? 'text-emerald-600' : d === 'medium' ? 'text-amber-600' : 'text-red-600'}`}>
              {problems.filter(p => p.difficulty === d).length} {d}
            </span>
          ))}
          <span className="ml-auto">Total: {problems.length} problems</span>
        </div>
      )}
    </div>
  );
};
