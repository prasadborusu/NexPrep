import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { CodingTopic } from '../../types';
import {
  Code2,
  CheckCircle2,
  Clock,
  ArrowRight,
  Search,
  Filter,
  Flame,
  History,
  Layers,
  Sparkles,
  LayoutGrid,
  Hash,
  Type,
  ArrowLeftRight,
  Maximize2,
  ArrowUpDown,
  Link2,
  ListFilter,
  Repeat,
  GitFork,
  Network,
  Zap,
  Binary
} from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  LayoutGrid: <LayoutGrid className="w-5 h-5" />,
  Type: <Type className="w-5 h-5" />,
  Hash: <Hash className="w-5 h-5" />,
  ArrowLeftRight: <ArrowLeftRight className="w-5 h-5" />,
  Maximize2: <Maximize2 className="w-5 h-5" />,
  Search: <Search className="w-5 h-5" />,
  ArrowUpDown: <ArrowUpDown className="w-5 h-5" />,
  Link2: <Link2 className="w-5 h-5" />,
  Layers: <Layers className="w-5 h-5" />,
  ListFilter: <ListFilter className="w-5 h-5" />,
  Repeat: <Repeat className="w-5 h-5" />,
  GitFork: <GitFork className="w-5 h-5" />,
  Network: <Network className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Flame: <Flame className="w-5 h-5" />,
  Binary: <Binary className="w-5 h-5" />
};

export const CodingTopicsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [topics, setTopics] = useState<CodingTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  useEffect(() => {
    const fetchTopics = async () => {
      setIsLoading(true);
      try {
        const data = await api.coding.getTopics(user?.id);
        setTopics(data);
      } catch (err) {
        console.error('Failed to load coding topics:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTopics();
  }, [user?.id]);

  const filteredTopics = topics.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (difficultyFilter === 'easy') return t.easy_count > 0;
    if (difficultyFilter === 'medium') return t.medium_count > 0;
    if (difficultyFilter === 'hard') return t.hard_count > 0;
    return true;
  });

  const totalProblemsCount = topics.reduce((acc, t) => acc + t.total_problems, 0);
  const totalSolvedCount = topics.reduce((acc, t) => acc + t.solved_problems, 0);
  const overallPercentage = totalProblemsCount > 0 ? Math.round((totalSolvedCount / totalProblemsCount) * 100) : 0;

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-100">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Algorithmic Problem Practice</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700">
              Interactive IDE
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Master foundational data structures and patterns with real-time sandboxed code execution
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/student/coding/submissions"
            className="px-3.5 py-2 rounded-xl border border-purple-200 text-purple-700 hover:bg-purple-50 text-xs font-semibold transition-all flex items-center gap-1.5 bg-white shadow-xs"
          >
            <History className="w-3.5 h-3.5" />
            Submissions History
          </Link>
        </div>
      </div>

      {/* Progress & Stat Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 rounded-2xl p-6 text-white shadow-soft relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-radial from-purple-500/20 to-transparent pointer-events-none" />
        <div className="grid sm:grid-cols-3 gap-6 relative z-10">
          <div>
            <span className="text-purple-200 text-xs font-medium block">Total Solved</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black">{totalSolvedCount}</span>
              <span className="text-xs text-purple-300">/ {totalProblemsCount} Curated Problems</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 mt-3 overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${overallPercentage}%` }}
              />
            </div>
          </div>

          <div className="sm:border-l sm:border-white/10 sm:pl-6">
            <span className="text-purple-200 text-xs font-medium block">Curriculum Depth</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black">{topics.length}</span>
              <span className="text-xs text-purple-300">Core DSA Topics</span>
            </div>
            <p className="text-[11px] text-purple-300/80 mt-2">
              Arrays, Two Pointers, Trees, Dynamic Programming, Stack & Graphs
            </p>
          </div>

          <div className="sm:border-l sm:border-white/10 sm:pl-6">
            <span className="text-purple-200 text-xs font-medium block">Multi-Language Sandbox</span>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {['Python', 'Java', 'C++', 'JavaScript', 'TypeScript'].map((lang) => (
                <span
                  key={lang}
                  className="px-2 py-0.5 rounded-md bg-white/10 text-[11px] font-mono font-medium text-purple-100 border border-white/10"
                >
                  {lang}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-purple-300/80 mt-2">
              Isolated runner with execution time, memory tracking & hidden test cases
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics (e.g. Arrays, Sliding Window, Trees)..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-purple-100 bg-white text-xs focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'easy', 'medium', 'hard'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => setDifficultyFilter(diff)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                difficultyFilter === diff
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-white border border-purple-100 text-slate-600 hover:bg-purple-50/50'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Topics Grid */}
      {isLoading ? (
        <div className="text-center py-16 text-slate-400 text-xs">Loading coding curriculum topics...</div>
      ) : filteredTopics.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-purple-100 shadow-soft space-y-2">
          <Code2 className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No Matching Topics</h3>
          <p className="text-xs text-slate-400">Try adjusting your search query or difficulty filter.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTopics.map((topic) => {
            const topicProgress = topic.total_problems > 0
              ? Math.round((topic.solved_problems / topic.total_problems) * 100)
              : 0;

            return (
              <div
                key={topic.id}
                onClick={() => navigate(`/student/coding/topic/${topic.id}`)}
                className="bg-white rounded-2xl p-5 border border-purple-100/90 shadow-soft hover:shadow-soft-lg hover:border-purple-300 transition-all cursor-pointer flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center group-hover:bg-purple-700 group-hover:text-white transition-colors shadow-xs">
                      {ICON_MAP[topic.icon || 'LayoutGrid'] || <LayoutGrid className="w-5 h-5" />}
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {topic.total_problems} Problems
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                      {topic.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {topic.description}
                    </p>
                  </div>

                  {/* Difficulty Distribution Badges */}
                  <div className="flex items-center gap-2 pt-1 text-[10px] font-bold">
                    {topic.easy_count > 0 && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
                        {topic.easy_count} Easy
                      </span>
                    )}
                    {topic.medium_count > 0 && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-100">
                        {topic.medium_count} Medium
                      </span>
                    )}
                    {topic.hard_count > 0 && (
                      <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-100">
                        {topic.hard_count} Hard
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">Solved</span>
                    <span className="font-bold text-slate-700">
                      {topic.solved_problems} / {topic.total_problems} ({topicProgress}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-purple-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${topicProgress}%` }}
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end text-purple-700 text-xs font-bold gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Practice Topic</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
