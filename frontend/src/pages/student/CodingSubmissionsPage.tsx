import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { CodeSubmission } from '../../types';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  History,
  Filter,
  ExternalLink,
  Code2
} from 'lucide-react';

export const CodingSubmissionsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState<CodeSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    if (!user?.id) return;

    const fetchSubmissions = async () => {
      setIsLoading(true);
      try {
        const data = await api.coding.getSubmissions(user.id);
        setSubmissions(data);
      } catch (err) {
        console.error('Failed to load submissions:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, [user?.id]);

  const filtered = submissions.filter((s) => {
    if (selectedLanguage !== 'all' && s.language.toLowerCase() !== selectedLanguage.toLowerCase()) {
      return false;
    }
    if (selectedStatus !== 'all' && s.status !== selectedStatus) {
      return false;
    }
    return true;
  });

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-100">
        <div>
          <div className="flex items-center gap-2">
            <Link to="/student/coding" className="p-1 rounded-lg text-slate-400 hover:text-purple-700 hover:bg-purple-50 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Code Submissions History</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete record of your algorithmic submissions, runtimes, and evaluation statuses
          </p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-2xl border border-purple-100 shadow-soft">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Filter className="w-3.5 h-3.5 text-purple-700" />
          <span className="font-semibold">Filter:</span>
        </div>

        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="px-3 py-1.5 rounded-xl border border-purple-100 bg-[#FBFAFF] text-xs font-semibold text-slate-700 focus:outline-none focus:border-purple-600 cursor-pointer"
        >
          <option value="all">All Languages</option>
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-1.5 rounded-xl border border-purple-100 bg-[#FBFAFF] text-xs font-semibold text-slate-700 focus:outline-none focus:border-purple-600 cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="Accepted">Accepted</option>
          <option value="Wrong Answer">Wrong Answer</option>
          <option value="Time Limit Exceeded">Time Limit Exceeded</option>
          <option value="Runtime Error">Runtime Error</option>
          <option value="Compilation Error">Compilation Error</option>
        </select>
      </div>

      {/* Submissions Table / List */}
      {isLoading ? (
        <div className="text-center py-16 text-slate-400 text-xs">Loading submission records...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-purple-100 shadow-soft space-y-2">
          <History className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No Submissions Found</h3>
          <p className="text-xs text-slate-400">You haven&apos;t submitted any code matching these filters yet.</p>
          <div className="pt-2">
            <Link
              to="/student/coding"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold"
            >
              Start Practicing
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-purple-100/90 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8FE] border-b border-purple-100 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5">Problem</th>
                  <th className="py-3.5 px-5">Language</th>
                  <th className="py-3.5 px-5">Test Cases</th>
                  <th className="py-3.5 px-5">Runtime</th>
                  <th className="py-3.5 px-5">Submitted At</th>
                  <th className="py-3.5 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((sub) => (
                  <tr key={sub.id} className="hover:bg-purple-50/20 transition-colors">
                    <td className="py-3.5 px-5 font-bold">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                          sub.status === 'Accepted'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {sub.status === 'Accepted' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <XCircle className="w-3 h-3 text-rose-600" />
                        )}
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 font-semibold text-slate-900">
                      {sub.problem_title || 'Algorithmic Problem'}
                    </td>
                    <td className="py-3.5 px-5 font-mono text-purple-900 font-medium capitalize">
                      {sub.language}
                    </td>
                    <td className="py-3.5 px-5 font-mono text-slate-600">
                      {sub.passed_test_cases} / {sub.total_test_cases} passed
                    </td>
                    <td className="py-3.5 px-5 font-mono text-slate-500">
                      {sub.execution_time_ms ? `${sub.execution_time_ms}ms` : '—'}
                    </td>
                    <td className="py-3.5 px-5 text-slate-400">
                      {new Date(sub.created_at).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => navigate(`/student/coding/problem/${sub.problem_id}`)}
                        className="px-3 py-1 rounded-lg border border-purple-200 text-purple-700 hover:bg-purple-50 text-xs font-semibold transition-colors"
                      >
                        View Problem
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
