import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../lib/api';
import {
  Users,
  FileCheck2,
  Code2,
  Building2,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Plus
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const data = await api.admin.getAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error('Failed to load admin analytics:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const metrics = analytics?.metrics || {
    total_students: 0,
    active_assessments: 0,
    total_assessment_submissions: 0,
    assessment_pass_rate: 0,
    coding_problems_count: 0,
    total_code_submissions: 0,
    coding_acceptance_rate: 0,
    active_drives: 0,
    total_applications: 0
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-soft-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-purple-200 border border-white/10 inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-pink-400" />
            NexPrep Placement Cell & Academic Administration
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Institutional Dashboard</h1>
          <p className="text-xs sm:text-sm text-purple-100 font-normal leading-relaxed max-w-xl">
            Monitor real-time candidate readiness, proctored test results, coding sandbox submissions, and corporate drives.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/admin/assessments"
            className="px-4 py-2.5 rounded-xl bg-white text-purple-950 text-xs font-bold hover:bg-purple-50 transition-all shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Create Exam
          </Link>
          <Link
            to="/admin/bulk-email"
            className="px-4 py-2.5 rounded-xl bg-purple-700/80 hover:bg-purple-700 text-white text-xs font-semibold transition-all border border-white/20 flex items-center gap-1.5"
          >
            <Mail className="w-4 h-4" />
            Bulk Communication
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-soft">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Registered Students</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{metrics.total_students}</div>
          <p className="text-[11px] text-slate-500 mt-1">Active candidate cohort</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-soft">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Exam Pass Rate</span>
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{metrics.assessment_pass_rate}%</div>
          <p className="text-[11px] text-slate-500 mt-1">{metrics.total_assessment_submissions} Total attempts</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-soft">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Coding Accuracy</span>
            <Code2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{metrics.coding_acceptance_rate}%</div>
          <p className="text-[11px] text-slate-500 mt-1">{metrics.total_code_submissions} Code submissions</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-soft">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Placement Drives</span>
            <Building2 className="w-4 h-4 text-pink-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{metrics.active_drives} Drives</div>
          <p className="text-[11px] text-slate-500 mt-1">{metrics.total_applications} Applications received</p>
        </div>
      </div>

      {/* Tables: Recent Submissions & Applications */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Assessment Submissions */}
        <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Recent Exam Submissions</h3>
            <Link to="/admin/assessments" className="text-xs font-bold text-purple-700 hover:text-purple-800">
              Manage Exams
            </Link>
          </div>

          {analytics?.recent_submissions?.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No student submissions recorded yet. Take an assessment from the student portal to populate real-time logs.
            </div>
          ) : (
            <div className="space-y-2.5">
              {analytics?.recent_submissions?.map((s: any) => (
                <div key={s.id} className="p-3 rounded-xl border border-slate-100 bg-[#FBFAFF] flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-slate-800">{s.student_name}</h4>
                    <p className="text-[11px] text-slate-400">{s.assessment_title}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      s.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {s.percentage}% • {s.passed ? 'Passed' : 'Failed'}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(s.submitted_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Placement Applications */}
        <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Placement Drive Applications</h3>
            <Link to="/admin/placements" className="text-xs font-bold text-purple-700 hover:text-purple-800">
              Manage Drives
            </Link>
          </div>

          {analytics?.recent_applications?.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No drive applications yet. Students can apply directly from the Placement Drives module.
            </div>
          ) : (
            <div className="space-y-2.5">
              {analytics?.recent_applications?.map((a: any) => (
                <div key={a.id} className="p-3 rounded-xl border border-slate-100 bg-[#FBFAFF] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800">{a.drive?.company_name || 'Placement Opportunity'}</span>
                    <p className="text-[11px] text-slate-400">Student ID: {a.student_id}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-700 text-[10px] font-bold uppercase">
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
