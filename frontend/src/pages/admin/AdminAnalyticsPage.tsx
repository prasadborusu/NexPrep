import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { BarChart3, TrendingUp, Users, CheckCircle2, ShieldCheck, Award } from 'lucide-react';

export const AdminAnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.admin.getAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const m = analytics?.metrics || {
    total_students: 0,
    assessment_pass_rate: 0,
    coding_acceptance_rate: 0,
    active_drives: 0,
    total_applications: 0,
    total_assessment_submissions: 0,
    total_code_submissions: 0
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
      <div className="pb-4 border-b border-purple-100">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Placement Intelligence & Analytics</h1>
        <p className="text-xs text-slate-500">Aggregated cohort performance metrics and hiring funnel tracking</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Pass Rate Metric Card */}
        <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Assessment Pass Rate</span>
            <span className="p-1 rounded-lg bg-emerald-50 text-emerald-600"><CheckCircle2 className="w-4 h-4" /></span>
          </div>
          <div>
            <span className="text-4xl font-black text-slate-900">{m.assessment_pass_rate}%</span>
            <p className="text-xs text-slate-500 mt-1">Based on {m.total_assessment_submissions} verified test attempts</p>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${m.assessment_pass_rate}%` }}></div>
          </div>
        </div>

        {/* Coding Acceptance Rate */}
        <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Code Acceptance Accuracy</span>
            <span className="p-1 rounded-lg bg-blue-50 text-blue-600"><BarChart3 className="w-4 h-4" /></span>
          </div>
          <div>
            <span className="text-4xl font-black text-slate-900">{m.coding_acceptance_rate}%</span>
            <p className="text-xs text-slate-500 mt-1">Evaluated against Piston sandboxed test cases</p>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${m.coding_acceptance_rate}%` }}></div>
          </div>
        </div>

        {/* Placement Funnel Card */}
        <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Placement Funnel</span>
            <span className="p-1 rounded-lg bg-purple-50 text-purple-600"><Award className="w-4 h-4" /></span>
          </div>
          <div>
            <span className="text-4xl font-black text-slate-900">{m.total_applications}</span>
            <p className="text-xs text-slate-500 mt-1">Applications across {m.active_drives} corporate drives</p>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div className="bg-purple-600 h-full rounded-full" style={{ width: '85%' }}></div>
          </div>
        </div>
      </div>

      {/* Cohort Insights */}
      <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-soft space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Candidate Competency Distribution</h3>
        <div className="space-y-3 text-xs">
          <div>
            <div className="flex justify-between font-semibold mb-1">
              <span>Full Stack & Web Engineering Roles</span>
              <span className="text-purple-700 font-bold">54% of Students</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-purple-600 h-full w-[54%]"></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between font-semibold mb-1">
              <span>Core Algorithms & System Design</span>
              <span className="text-purple-700 font-bold">32% of Students</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full w-[32%]"></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between font-semibold mb-1">
              <span>Data & Cloud Infrastructure</span>
              <span className="text-purple-700 font-bold">14% of Students</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-pink-600 h-full w-[14%]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
