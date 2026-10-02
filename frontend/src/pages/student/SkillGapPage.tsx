import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { SkillGapData } from '../../types';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  Cpu,
  BookOpen,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const SkillGapPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<SkillGapData | null>(null);
  const [targetRole, setTargetRole] = useState(user?.target_role || 'Full Stack Engineer');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchSkillGap = async () => {
      setIsLoading(true);
      try {
        const report = await api.skillGap.get(user.id, targetRole);
        setData(report);
      } catch (err) {
        console.error('Failed to load skill gap data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSkillGap();
  }, [user, targetRole]);

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-100">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Skill Gap Intelligence</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-100 text-pink-700 border border-pink-200">
              Aggregated Analytics
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Synthesizes your proctored assessment scores, coding problem submissions, and resume keywords against market standards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500">Benchmark Role:</label>
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-purple-900 bg-white shadow-xs focus:outline-none focus:border-purple-600"
          >
            <option value="Full Stack Engineer">Full Stack Engineer</option>
            <option value="Frontend Specialist">Frontend Specialist</option>
            <option value="Backend Engineer">Backend Engineer</option>
            <option value="Software Development Engineer">Software Development Engineer</option>
            <option value="Data Engineer">Data Engineer</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-xs text-slate-400">Computing skill intelligence report...</div>
      ) : data ? (
        <div className="space-y-8">
          {/* Readiness Top Banner */}
          <div className="bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-soft-lg flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-purple-200 border border-white/15 inline-flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-pink-400" />
                Evaluated against {data.target_role} Competencies
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                {data.readiness_percentage}% Placement Readiness
              </h2>
              <p className="text-xs sm:text-sm text-purple-100 font-normal leading-relaxed">
                You have validated {data.strong_skills.length} core skills. Closing your top 2 missing skills will boost your eligibility for Tier-1 drives by 28%.
              </p>
            </div>

            <Link
              to="/student/roadmap"
              className="px-6 py-3 rounded-2xl bg-white text-purple-950 text-xs font-bold hover:bg-purple-50 transition-all shadow-sm shrink-0 flex items-center gap-1.5"
            >
              Follow Dynamic Roadmap
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 3 Columns: Strong Skills, Needs Polish, Missing Skills */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Strong Skills */}
            <div className="bg-white rounded-2xl p-6 border border-purple-100/80 shadow-soft space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Strong Skills ({data.strong_skills.length})
                </span>
                <span className="text-[10px] text-slate-400">Validated</span>
              </div>

              <div className="space-y-3">
                {data.strong_skills.map((s, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
                      <span>{s.skill}</span>
                      <span>{s.proficiency}%</span>
                    </div>
                    <div className="w-full bg-emerald-200/60 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${s.proficiency}%` }}></div>
                    </div>
                    <p className="text-[10px] text-emerald-700">{s.source}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Weak Skills */}
            <div className="bg-white rounded-2xl p-6 border border-purple-100/80 shadow-soft space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Weak Skills ({data.weak_skills.length})
                </span>
                <span className="text-[10px] text-slate-400">Needs Polish</span>
              </div>

              <div className="space-y-3">
                {data.weak_skills.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">No weak points flagged!</p>
                ) : (
                  data.weak_skills.map((s, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-amber-50/50 border border-amber-100 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-amber-950">
                        <span>{s.skill}</span>
                        <span>{s.proficiency}%</span>
                      </div>
                      <div className="w-full bg-amber-200/60 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-600 h-full rounded-full" style={{ width: `${s.proficiency}%` }}></div>
                      </div>
                      <p className="text-[10px] text-amber-800 leading-snug">{s.reason}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="bg-white rounded-2xl p-6 border border-purple-100/80 shadow-soft space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-rose-600" />
                  Missing Skills ({data.missing_skills.length})
                </span>
                <span className="text-[10px] text-slate-400">High Priority</span>
              </div>

              <div className="space-y-3">
                {data.missing_skills.map((s, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-rose-50/50 border border-rose-100 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-rose-950">
                      <span>{s.skill}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        s.importance === 'high' ? 'bg-rose-200 text-rose-900' : 'bg-slate-200 text-slate-800'
                      }`}>
                        {s.importance}
                      </span>
                    </div>
                    <p className="text-[10px] text-rose-700">{s.recommended_resource}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actionable Learning Suggestions */}
          <div className="bg-white rounded-2xl p-6 border border-purple-100/80 shadow-soft space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-700" />
              Prescriptive Learning & Practice Directives
            </h3>
            <div className="space-y-2 text-xs text-slate-700">
              {data.learning_suggestions.map((sug, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-purple-50/50 border border-purple-100">
                  <ArrowRight className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{sug}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
