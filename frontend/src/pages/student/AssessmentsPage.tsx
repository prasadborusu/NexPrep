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
  AlertCircle,
  KeyRound,
  ShieldAlert,
  Lock,
  X
} from 'lucide-react';

export const AssessmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Passkey Modal State
  const [selectedExam, setSelectedExam] = useState<Assessment | null>(null);
  const [passkeyInput, setPasskeyInput] = useState('');
  const [passkeyError, setPasskeyError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

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

  const handleOpenPasskeyModal = (exam: Assessment) => {
    if (!exam.requires_passkey && !exam.passkey) {
      sessionStorage.setItem(`passkey_unlocked_${exam.id}`, 'true');
      navigate(`/student/assessments/${exam.id}`);
      return;
    }
    if (sessionStorage.getItem(`passkey_unlocked_${exam.id}`) === 'true') {
      navigate(`/student/assessments/${exam.id}`);
      return;
    }
    setSelectedExam(exam);
    setPasskeyInput('');
    setPasskeyError(null);
  };

  const handleClosePasskeyModal = () => {
    setSelectedExam(null);
    setPasskeyInput('');
    setPasskeyError(null);
  };

  const handleVerifyPasskey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExam) return;

    const trimmed = passkeyInput.trim();
    if (!trimmed) {
      setPasskeyError('Please enter the 4-digit passkey provided by your administrator.');
      return;
    }

    if (trimmed.length !== 4 || !/^\d{4}$/.test(trimmed)) {
      setPasskeyError('Passkey must be a 4-digit PIN (e.g. 8492).');
      return;
    }

    setIsVerifying(true);
    setPasskeyError(null);

    try {
      const res = await api.assessments.verifyPasskey(selectedExam.id, trimmed);
      if (res.success) {
        // Store unlock state in session
        sessionStorage.setItem(`passkey_unlocked_${selectedExam.id}`, 'true');
        navigate(`/student/assessments/${selectedExam.id}`);
      } else {
        setPasskeyError('Invalid passkey PIN. Please check with your administrator.');
      }
    } catch (err: any) {
      setPasskeyError(err.message || 'Invalid passkey PIN. Please check with your administrator.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-100">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Proctored Assessments</h1>
          <p className="text-xs text-slate-500">Official technical screening evaluations with automated scoring & passkey verification</p>
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
                  onClick={() => handleOpenPasskeyModal(ass)}
                  className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Take Assessment
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Admin Passkey Verification Modal */}
      {selectedExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 sm:p-7 max-w-md w-full space-y-5 border border-purple-100 shadow-soft-lg animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-700">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Enter Assessment Passkey</h3>
                  <p className="text-xs text-slate-500">Official Exam Proctoring Gate</p>
                </div>
              </div>
              <button
                onClick={handleClosePasskeyModal}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
              <div className="font-semibold text-slate-800">{selectedExam.title}</div>
              <div className="text-slate-500 flex items-center gap-4 text-[11px]">
                <span>⏱ Duration: {selectedExam.duration_minutes} Mins</span>
                <span>🎯 Passing: {selectedExam.pass_percentage}%</span>
              </div>
            </div>

            {passkeyError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{passkeyError}</span>
              </div>
            )}

            <form onSubmit={handleVerifyPasskey} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 text-center">
                  Enter 4-Digit Passkey PIN
                </label>
                <div className="relative max-w-[240px] mx-auto">
                  <input
                    type="text"
                    required
                    autoFocus
                    maxLength={4}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={passkeyInput}
                    onChange={(e) => setPasskeyInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="••••"
                    className="w-full py-3 px-4 rounded-xl border-2 border-purple-200 text-center text-2xl font-mono tracking-[0.6em] font-bold text-purple-950 placeholder:text-slate-300 focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all bg-purple-50/20"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-2 text-center">
                  Obtain your 4-digit test access PIN from your invigilator or university administrator.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleClosePasskeyModal}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="flex-1 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  {isVerifying ? 'Verifying...' : 'Verify & Start Exam'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
