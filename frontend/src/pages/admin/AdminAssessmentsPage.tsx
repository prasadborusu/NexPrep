import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Assessment, AssessmentType } from '../../types';
import { FileCheck2, Plus, Clock, Award, CheckCircle2 } from 'lucide-react';

export const AdminAssessmentsPage: React.FC = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<AssessmentType>('mixed');
  const [duration, setDuration] = useState('45');
  const [totalMarks, setTotalMarks] = useState('50');
  const [passPercentage, setPassPercentage] = useState('60');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const data = await api.assessments.list();
      setAssessments(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    setIsSubmitting(true);
    try {
      const created = await api.assessments.create({
        title,
        description,
        type,
        duration_minutes: parseInt(duration, 10) || 45,
        total_marks: parseInt(totalMarks, 10) || 50,
        pass_percentage: parseInt(passPercentage, 10) || 60
      });
      setAssessments([created, ...assessments]);
      setShowCreateModal(false);
      setTitle('');
      setDescription('');
    } catch (err: any) {
      alert(err.message || 'Creation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-100">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Assessments Management</h1>
          <p className="text-xs text-slate-500">Configure institutional screening tests, duration limits, and passing criteria</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Create New Assessment
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assessments.map((a) => (
          <div key={a.id} className="bg-white rounded-2xl p-6 border border-purple-100 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-100 text-purple-700">
                {a.type} Exam
              </span>
              <span className="text-xs font-bold text-emerald-600">Active</span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">{a.title}</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{a.description}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-[#FBFAFF] border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Duration</span>
                <span className="font-bold text-slate-800">{a.duration_minutes}m</span>
              </div>
              <div className="p-2 rounded-xl bg-[#FBFAFF] border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Marks</span>
                <span className="font-bold text-slate-800">{a.total_marks}</span>
              </div>
              <div className="p-2 rounded-xl bg-[#FBFAFF] border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Pass</span>
                <span className="font-bold text-slate-800">{a.pass_percentage}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 border border-purple-100 shadow-soft-lg">
            <h3 className="text-base font-bold text-slate-900">Create Screening Assessment</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assessment Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Java & Backend Core Test"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-purple-600 focus:outline-none"
                  >
                    <option value="mcq">MCQ Only</option>
                    <option value="coding">Coding Only</option>
                    <option value="mixed">Mixed (MCQ + Code)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-purple-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-purple-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pass %</label>
                  <input
                    type="number"
                    value={passPercentage}
                    onChange={(e) => setPassPercentage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-purple-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all shadow-sm"
                >
                  {isSubmitting ? 'Creating...' : 'Create Assessment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
