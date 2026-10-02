import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { CodingTopic, CodingProblem } from '../../types';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  ExternalLink,
  Code2,
  Sparkles,
  ChevronRight,
  Clock,
  ArrowRight,
  Filter
} from 'lucide-react';

export const CodingTopicDetailPage: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [topic, setTopic] = useState<CodingTopic | null>(null);
  const [problems, setProblems] = useState<CodingProblem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  useEffect(() => {
    if (!topicId) return;

    const fetchTopicData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await api.coding.getTopicDetail(topicId, user?.id);
        setTopic(data.topic);
        setProblems(data.problems);
      } catch (err: any) {
        setError(err.message || 'Failed to load topic details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopicData();
  }, [topicId, user?.id]);

  const filteredProblems = problems.filter((p) => {
    if (filterDifficulty === 'all') return true;
    return p.difficulty === filterDifficulty;
  });

  const easyList = filteredProblems.filter((p) => p.difficulty === 'easy');
  const mediumList = filteredProblems.filter((p) => p.difficulty === 'medium');
  const hardList = filteredProblems.filter((p) => p.difficulty === 'hard');

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/student/coding" className="hover:text-purple-700 font-medium transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          Coding Practice
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-bold text-slate-800">{topic?.name || 'Topic'}</span>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-slate-400 text-xs">Loading topic curriculum...</div>
      ) : error || !topic ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-rose-100 shadow-soft space-y-3">
          <p className="text-xs text-rose-600 font-semibold">{error || 'Topic not found'}</p>
          <Link
            to="/student/coding"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-700 text-white text-xs font-bold"
          >
            Back to Topics
          </Link>
        </div>
      ) : (
        <>
          {/* Topic Overview Banner */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-purple-100 shadow-soft space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">{topic.name}</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-100">
                    {topic.total_problems} Problems
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                  {topic.description}
                </p>
              </div>

              {/* Progress Box */}
              <div className="sm:text-right shrink-0 bg-purple-50/50 p-4 rounded-xl border border-purple-100/70">
                <span className="text-[11px] font-semibold text-slate-500 block">Topic Progress</span>
                <span className="text-xl font-black text-purple-900 block mt-0.5">
                  {topic.solved_problems} of {topic.total_problems} Solved
                </span>
                <div className="w-36 bg-purple-200/50 rounded-full h-2 mt-2 overflow-hidden sm:ml-auto">
                  <div
                    className="bg-purple-700 h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${topic.total_problems > 0 ? (topic.solved_problems / topic.total_problems) * 100 : 0}%`
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Difficulty Filter Tabs */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                {(['all', 'easy', 'medium', 'hard'] as const).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setFilterDifficulty(diff)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                      filterDifficulty === diff
                        ? 'bg-purple-700 text-white shadow-xs'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {diff === 'all' ? `All (${problems.length})` : `${diff} (${problems.filter(p => p.difficulty === diff).length})`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Problem List Grouped */}
          {filteredProblems.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-purple-100 shadow-soft space-y-2">
              <Code2 className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700">No Problems in this Category</h3>
              <p className="text-xs text-slate-400">Try selecting a different difficulty filter.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Easy Section */}
              {easyList.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <h2 className="text-sm font-bold text-slate-800 tracking-wide uppercase">
                      Easy ({easyList.length})
                    </h2>
                  </div>
                  <div className="grid gap-3">
                    {easyList.map((problem) => (
                      <ProblemCard key={problem.id} problem={problem} navigate={navigate} />
                    ))}
                  </div>
                </div>
              )}

              {/* Medium Section */}
              {mediumList.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <h2 className="text-sm font-bold text-slate-800 tracking-wide uppercase">
                      Medium ({mediumList.length})
                    </h2>
                  </div>
                  <div className="grid gap-3">
                    {mediumList.map((problem) => (
                      <ProblemCard key={problem.id} problem={problem} navigate={navigate} />
                    ))}
                  </div>
                </div>
              )}

              {/* Hard Section */}
              {hardList.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <h2 className="text-sm font-bold text-slate-800 tracking-wide uppercase">
                      Hard ({hardList.length})
                    </h2>
                  </div>
                  <div className="grid gap-3">
                    {hardList.map((problem) => (
                      <ProblemCard key={problem.id} problem={problem} navigate={navigate} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

interface ProblemCardProps {
  problem: CodingProblem;
  navigate: (path: string) => void;
}

const ProblemCard: React.FC<ProblemCardProps> = ({ problem, navigate }) => {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-purple-100/80 shadow-soft hover:shadow-soft-lg hover:border-purple-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-2 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {problem.solved ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Solved
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-semibold flex items-center gap-1">
              <Circle className="w-3 h-3 text-slate-400" />
              Not Solved
            </span>
          )}

          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
              problem.difficulty === 'easy'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                : problem.difficulty === 'medium'
                ? 'bg-amber-50 text-amber-700 border border-amber-100'
                : 'bg-rose-50 text-rose-700 border border-rose-100'
            }`}
          >
            {problem.difficulty}
          </span>

          <span className="text-[11px] text-slate-400 font-mono">
            {problem.category || problem.topic}
          </span>
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-900 hover:text-purple-700 transition-colors">
            {problem.problem_number ? `#${problem.problem_number} ` : ''}{problem.title}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
            {problem.description.replace(/\n+/g, ' ')}
          </p>
        </div>

        {problem.tags && problem.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {problem.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 text-[10px] font-medium border border-slate-100"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
        {problem.leetcode_url && (
          <a
            href={problem.leetcode_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:text-purple-700 hover:border-purple-200 text-xs font-semibold transition-all flex items-center gap-1.5 bg-white shadow-xs"
            title="Open verified problem on LeetCode"
          >
            <span>View on LeetCode</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        )}

        <button
          onClick={() => navigate(`/student/coding/problem/${problem.slug || problem.id}`)}
          className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
        >
          <span>Practice</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
