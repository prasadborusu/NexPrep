import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Assessment, AssessmentType } from '../../types';
import { FileCheck2, Plus, Clock, Award, CheckCircle2, KeyRound, Copy, Check, RefreshCw } from 'lucide-react';

export const AdminAssessmentsPage: React.FC = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<AssessmentType>('mixed');
  const [duration, setDuration] = useState('45');
  const [totalMarks, setTotalMarks] = useState('50');
  const [passPercentage, setPassPercentage] = useState('60');
  const [passkey, setPasskey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);

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
        pass_percentage: parseInt(passPercentage, 10) || 60,
        passkey: passkey.trim() || undefined
      });
      setAssessments([created, ...assessments]);
      setShowCreateModal(false);
      setTitle('');
      setDescription('');
      setPasskey('');
    } catch (err: any) {
      alert(err.message || 'Creation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyPasskey = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRegeneratePasskey = async (assessmentId: string) => {
    setRegeneratingId(assessmentId);
    try {
      const res = await api.assessments.updatePasskey(assessmentId);
      setAssessments(prev => prev.map(a => a.id === assessmentId ? { ...a, passkey: res.passkey } : a));
    } catch (err: any) {
      alert(err.message || 'Failed to regenerate passkey');
    } finally {
      setRegeneratingId(null);
    }
  };

  const generateRandomKey = () => {
    const code = `NEX-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setPasskey(code);
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

            {/* Admin Passkey Control */}
            <div className="pt-3 border-t border-purple-50 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#6D28D9]" />
                <span className="text-[11px] font-semibold text-slate-500">Passkey:</span>
                <span className="font-mono text-xs font-bold text-[#6D28D9] bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                  {a.passkey || 'N/A'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {a.passkey && (
                  <button
                    type="button"
                    onClick={() => handleCopyPasskey(a.passkey!, a.id)}
                    className="p-1.5 rounded-lg hover:bg-purple-50 text-slate-500 hover:text-[#6D28D9] transition-colors"
                    title="Copy passkey to clipboard"
                  >
                    {copiedId === a.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRegeneratePasskey(a.id)}
                  disabled={regeneratingId === a.id}
                  className="p-1.5 rounded-lg hover:bg-purple-50 text-slate-500 hover:text-[#6D28D9] transition-colors disabled:opacity-50"
                  title="Generate new passkey"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${regeneratingId === a.id ? 'animate-spin text-[#6D28D9]' : ''}`} />
                </button>
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

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">Exam Passkey / Access PIN</label>
                  <button
                    type="button"
                    onClick={generateRandomKey}
                    className="text-[11px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Auto-Generate
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={passkey}
                    onChange={(e) => setPasskey(e.target.value.toUpperCase())}
                    placeholder="e.g. NEX-CS-8492 (or leave blank to auto-generate)"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase focus:border-purple-600 focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Students will be required to enter this key to start the proctored test.</p>
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
