import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { Assessment } from '../../types';
import {
  FileCheck2,
  Clock,
  Award,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const AssessmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const data = await api.assessments.list();
        setAssessments(data);
      } catch (err) {
        console.error('Error fetching assessments:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssessments();
  }, []);

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-100">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Proctored Assessments</h1>
          <p className="text-xs text-slate-500">Official technical screening evaluations with automated scoring</p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-slate-400 text-xs">Loading available assessments...</div>
      ) : assessments.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-purple-100 shadow-soft space-y-3">
          <FileCheck2 className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No Assessments Available</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Your placement administrator has not scheduled any active tests yet. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {assessments.map((ass) => (
            <div
              key={ass.id}
              className="bg-white rounded-2xl p-6 border border-purple-100/80 shadow-soft card-hover flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    ass.type === 'coding' ? 'bg-blue-100 text-blue-700' :
                    ass.type === 'mixed' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {ass.type} Assessment
                  </span>
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Active
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900">{ass.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{ass.description}</p>

                <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100">
                    <span className="text-slate-400 text-[10px] block">Duration</span>
                    <span className="font-bold text-purple-900 flex items-center justify-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                      {ass.duration_minutes} Mins
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100">
                    <span className="text-slate-400 text-[10px] block">Total Marks</span>
                    <span className="font-bold text-purple-900 block mt-0.5">{ass.total_marks} Pts</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100">
                    <span className="text-slate-400 text-[10px] block">Passing Mark</span>
                    <span className="font-bold text-purple-900 block mt-0.5">{ass.pass_percentage}%</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">Questions: {ass.questions_count || 4} Items</span>
                <button
                  onClick={() => navigate(`/student/assessments/${ass.id}`)}
                  className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5"
                >
                  Take Assessment
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
