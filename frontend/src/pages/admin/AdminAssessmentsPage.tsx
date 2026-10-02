import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Assessment, AssessmentType, Question, QuestionOption, TestCase } from '../../types';
import {
  FileCheck2,
  Plus,
  Clock,
  Award,
  CheckCircle2,
  KeyRound,
  Copy,
  Check,
  RefreshCw,
  Trash2,
  HelpCircle,
  Code2,
  X,
  Layers,
  Sparkles,
  AlertCircle,
  Eye,
  Sliders
} from 'lucide-react';

export const AdminAssessmentsPage: React.FC = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Create Assessment Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<AssessmentType>('mixed');
  const [duration, setDuration] = useState('45');
  const [totalMarks, setTotalMarks] = useState('50');
  const [passPercentage, setPassPercentage] = useState('60');
  const [passkey, setPasskey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Copy / Regenerate feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);

  // Manage Questions Modal
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [assessmentQuestions, setAssessmentQuestions] = useState<Question[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [questionTab, setQuestionTab] = useState<'list' | 'add'>('list');

  // Add Question Form State
  const [qTitle, setQTitle] = useState('');
  const [qDesc, setQDesc] = useState('');
  const [qType, setQType] = useState<'mcq' | 'coding'>('mcq');
  const [qMarks, setQMarks] = useState('10');
  const [qExplanation, setQExplanation] = useState('');

  // MCQ Options State
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctOption, setCorrectOption] = useState('opt1');

  // Coding Question State
  const [codingCategory, setCodingCategory] = useState('Algorithms');
  const [codingDifficulty, setCodingDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [codingStarterCode, setCodingStarterCode] = useState('def solution(input_data):\n    # Write your solution here\n    return ""\n');
  const [testCaseInput, setTestCaseInput] = useState('{"nums": [2, 7, 11, 15], "target": 9}');
  const [testCaseOutput, setTestCaseOutput] = useState('[0, 1]');
  const [isTestCaseHidden, setIsTestCaseHidden] = useState(false);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    setIsLoading(true);
    try {
      const data = await api.assessments.listAdmin();
      setAssessments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsSubmitting(true);
    try {
      const created = await api.assessments.create({
        title: title.trim(),
        description: description.trim(),
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
      if (selectedAssessment?.id === assessmentId) {
        setSelectedAssessment(prev => prev ? { ...prev, passkey: res.passkey } : null);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to regenerate passkey');
    } finally {
      setRegeneratingId(null);
    }
  };

  const generateRandomKey = () => {
    const code = String(Math.floor(1000 + Math.random() * 9000));
    setPasskey(code);
  };

  const handleDeleteAssessment = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this assessment and all its questions? This cannot be undone.')) {
      return;
    }
    try {
      await api.assessments.delete(id);
      setAssessments(prev => prev.filter(a => a.id !== id));
      if (selectedAssessment?.id === id) {
        setSelectedAssessment(null);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete assessment');
    }
  };

  const handleToggleStatus = async (assessment: Assessment, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const updated = await api.assessments.update(assessment.id, {
        is_active: !assessment.is_active
      });
      setAssessments(prev => prev.map(a => a.id === assessment.id ? { ...a, is_active: updated.is_active } : a));
    } catch (err: any) {
      alert(err.message || 'Failed to toggle status');
    }
  };

  const handleOpenQuestionsModal = async (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setQuestionTab('list');
    setIsLoadingQuestions(true);
    try {
      const data = await api.assessments.getAdmin(assessment.id);
      setAssessmentQuestions(data.questions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const handleDeleteQuestion = async (qId: string) => {
    if (!selectedAssessment) return;
    if (!confirm('Delete this question from the assessment bank?')) return;

    try {
      await api.assessments.deleteQuestion(selectedAssessment.id, qId);
      setAssessmentQuestions(prev => prev.filter(q => q.id !== qId));
      setAssessments(prev => prev.map(a => {
        if (a.id === selectedAssessment.id) {
          return { ...a, questions_count: Math.max(0, (a.questions_count || 1) - 1) };
        }
        return a;
      }));
    } catch (err: any) {
      alert(err.message || 'Failed to delete question');
    }
  };

  const handleAddQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssessment) return;
    if (!qTitle.trim()) return;

    setIsSubmitting(true);
    try {
      let questionPayload: Partial<Question>;

      if (qType === 'mcq') {
        const options: QuestionOption[] = [
          { id: 'opt1', text: optA.trim() || 'Option A' },
          { id: 'opt2', text: optB.trim() || 'Option B' },
          { id: 'opt3', text: optC.trim() || 'Option C' },
          { id: 'opt4', text: optD.trim() || 'Option D' }
        ];

        questionPayload = {
          title: qTitle.trim(),
          description: qDesc.trim(),
          type: 'mcq',
          marks: parseInt(qMarks, 10) || 10,
          options,
          correct_option_id: correctOption,
          explanation: qExplanation.trim() || 'Official answer verification key.'
        };
      } else {
        const testCases: TestCase[] = [
          {
            id: `tc-${Date.now()}-1`,
            input: testCaseInput.trim(),
            expected_output: testCaseOutput.trim(),
            is_hidden: isTestCaseHidden
          }
        ];

        questionPayload = {
          title: qTitle.trim(),
          description: qDesc.trim(),
          type: 'coding',
          marks: parseInt(qMarks, 10) || 20,
          category: codingCategory,
          difficulty: codingDifficulty,
          allowed_languages: ['python', 'javascript', 'java', 'cpp'],
          starter_code: {
            python: codingStarterCode,
            javascript: 'function solution(input) {\n    return "";\n}\n'
          },
          test_cases: testCases
        };
      }

      const created = await api.assessments.addQuestion(selectedAssessment.id, questionPayload);
      setAssessmentQuestions([...assessmentQuestions, created]);
      setAssessments(prev => prev.map(a => {
        if (a.id === selectedAssessment.id) {
          return { ...a, questions_count: (a.questions_count || 0) + 1 };
        }
        return a;
      }));

      // Reset form
      setQTitle('');
      setQDesc('');
      setOptA('');
      setOptB('');
      setOptC('');
      setOptD('');
      setQExplanation('');
      setQuestionTab('list');
    } catch (err: any) {
      alert(err.message || 'Failed to add question');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalQuestionsBank = assessments.reduce((acc, a) => acc + (a.questions_count || 0), 0);
  const activeCount = assessments.filter(a => a.is_active).length;

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAE6F5]">
        <div>
          <h1 className="text-2xl font-black text-[#181525] tracking-tight">Screening Assessments</h1>
          <p className="text-xs text-[#77718A]">Institutional tests, proctoring passkeys, and question bank administration</p>
        </div>

        <button
          onClick={() => {
            generateRandomKey();
            setShowCreateModal(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Create New Assessment
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 bg-white rounded-2xl border border-[#EAE6F5] shadow-xs">
          <span className="text-[11px] font-semibold text-[#77718A] block">Total Assessments</span>
          <span className="text-xl font-black text-[#181525] mt-1 block">{assessments.length}</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-[#EAE6F5] shadow-xs">
          <span className="text-[11px] font-semibold text-[#77718A] block">Active Screening Tests</span>
          <span className="text-xl font-black text-emerald-600 mt-1 block">{activeCount}</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-[#EAE6F5] shadow-xs">
          <span className="text-[11px] font-semibold text-[#77718A] block">Questions In Bank</span>
          <span className="text-xl font-black text-[#6D28D9] mt-1 block">{totalQuestionsBank}</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-[#EAE6F5] shadow-xs">
          <span className="text-[11px] font-semibold text-[#77718A] block">Security Guard</span>
          <span className="text-xl font-black text-[#181525] mt-1 flex items-center gap-1.5 text-xs text-purple-900 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Passkey & Anti-Cheat
          </span>
        </div>
      </div>

      {/* Assessment Cards Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-[#77718A] text-xs">Loading assessments...</div>
      ) : assessments.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-[#EAE6F5] shadow-xs space-y-3">
          <FileCheck2 className="w-12 h-12 text-[#77718A] mx-auto opacity-40" />
          <h3 className="text-base font-bold text-[#181525]">No Assessments Created Yet</h3>
          <p className="text-xs text-[#77718A] max-w-sm mx-auto">
            Click &ldquo;Create New Assessment&rdquo; to build your first proctored screening examination.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {assessments.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-2xl p-5 border border-[#EAE6F5] shadow-xs hover:border-[#8B5CF6]/50 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    a.type === 'coding' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    a.type === 'mixed' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                    'bg-slate-50 text-slate-700 border border-slate-200'
                  }`}>
                    {a.type} Exam
                  </span>

                  <button
                    onClick={(e) => handleToggleStatus(a, e)}
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-md border transition-colors ${
                      a.is_active
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {a.is_active ? '● Active' : '○ Inactive'}
                  </button>
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#181525] line-clamp-1">{a.title}</h3>
                  <p className="text-xs text-[#77718A] mt-1 line-clamp-2 leading-relaxed">{a.description || 'Standard placement screening test.'}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-[#FBFAFF] border border-[#EAE6F5]">
                    <span className="text-[10px] text-[#77718A] block">Duration</span>
                    <span className="font-bold text-[#181525] mt-0.5 block">{a.duration_minutes}m</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#FBFAFF] border border-[#EAE6F5]">
                    <span className="text-[10px] text-[#77718A] block">Marks</span>
                    <span className="font-bold text-[#181525] mt-0.5 block">{a.total_marks}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#FBFAFF] border border-[#EAE6F5]">
                    <span className="text-[10px] text-[#77718A] block">Pass Mark</span>
                    <span className="font-bold text-[#181525] mt-0.5 block">{a.pass_percentage}%</span>
                  </div>
                </div>

                {/* Proctored Passkey Badge */}
                <div className="p-2.5 rounded-xl bg-[#F8F6FD] border border-[#EAE6F5] flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-[#6D28D9]" />
                    <span className="text-[11px] font-semibold text-[#77718A]">Passkey:</span>
                    <span className="font-mono text-xs font-bold text-[#6D28D9] tracking-wider">
                      {a.passkey || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {a.passkey && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyPasskey(a.passkey!, a.id);
                        }}
                        className="p-1 rounded-md hover:bg-white text-[#77718A] hover:text-[#6D28D9] transition-colors"
                        title="Copy passkey"
                      >
                        {copiedId === a.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRegeneratePasskey(a.id);
                      }}
                      disabled={regeneratingId === a.id}
                      className="p-1 rounded-md hover:bg-white text-[#77718A] hover:text-[#6D28D9] transition-colors disabled:opacity-50"
                      title="Regenerate passkey"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${regeneratingId === a.id ? 'animate-spin text-[#6D28D9]' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#EAE6F5] flex items-center justify-between">
                <button
                  onClick={() => handleOpenQuestionsModal(a)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Questions ({a.questions_count || 0})</span>
                </button>

                <button
                  onClick={(e) => handleDeleteAssessment(a.id, e)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete assessment"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal 1: Create Assessment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 sm:p-7 max-w-lg w-full space-y-4 border border-[#EAE6F5] shadow-soft-lg animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-[#EAE6F5]">
              <h3 className="text-base font-bold text-[#181525]">Create Screening Assessment</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-[#77718A] hover:text-[#181525]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#181525] mb-1">Assessment Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Full Stack System Architecture Assessment"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE6F5] text-xs focus:border-[#6D28D9] focus:outline-none bg-[#FBFAFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#181525] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Comprehensive technical evaluation for engineering candidates..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE6F5] text-xs focus:border-[#6D28D9] focus:outline-none bg-[#FBFAFF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#181525] mb-1">Exam Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE6F5] text-xs focus:border-[#6D28D9] focus:outline-none bg-[#FBFAFF]"
                  >
                    <option value="mixed">Mixed (MCQ + Coding)</option>
                    <option value="mcq">MCQ Only</option>
                    <option value="coding">Coding Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#181525] mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE6F5] text-xs focus:border-[#6D28D9] focus:outline-none bg-[#FBFAFF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#181525] mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE6F5] text-xs focus:border-[#6D28D9] focus:outline-none bg-[#FBFAFF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#181525] mb-1">Passing Mark (%)</label>
                  <input
                    type="number"
                    value={passPercentage}
                    onChange={(e) => setPassPercentage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE6F5] text-xs focus:border-[#6D28D9] focus:outline-none bg-[#FBFAFF]"
                  />
                </div>
              </div>

              {/* Passkey Input */}
              <div className="p-3 bg-[#F8F6FD] rounded-xl border border-[#EAE6F5] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#181525] flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-[#6D28D9]" />
                    4-Digit Exam Passkey PIN
                  </label>
                  <button
                    type="button"
                    onClick={generateRandomKey}
                    className="text-[11px] font-bold text-[#6D28D9] hover:text-[#5B21B6] flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Auto-Generate
                  </button>
                </div>
                <input
                  type="text"
                  maxLength={4}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="e.g. 8492"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#EAE6F5] text-sm font-mono tracking-widest text-center font-bold focus:border-[#6D28D9] focus:outline-none bg-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#EAE6F5] text-xs font-semibold text-[#77718A] hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-xs font-bold transition-all shadow-sm"
                >
                  {isSubmitting ? 'Creating...' : 'Create Assessment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Manage Assessment Questions Modal */}
      {selectedAssessment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-[#EAE6F5] shadow-soft-lg animate-in fade-in">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#EAE6F5] flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#181525]">{selectedAssessment.title}</h3>
                  <span className="font-mono text-[11px] font-bold text-[#6D28D9] bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                    {selectedAssessment.passkey}
                  </span>
                </div>
                <p className="text-xs text-[#77718A] mt-0.5">
                  Manage questions bank • {assessmentQuestions.length} Questions Configured
                </p>
              </div>

              <button
                onClick={() => setSelectedAssessment(null)}
                className="p-1.5 rounded-lg text-[#77718A] hover:text-[#181525] hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sub-Tabs: Question Bank vs Add Question */}
            <div className="px-6 border-b border-[#EAE6F5] flex items-center gap-6">
              <button
                onClick={() => setQuestionTab('list')}
                className={`py-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                  questionTab === 'list'
                    ? 'border-[#6D28D9] text-[#6D28D9]'
                    : 'border-transparent text-[#77718A] hover:text-[#181525]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Question Bank ({assessmentQuestions.length})</span>
              </button>

              <button
                onClick={() => setQuestionTab('add')}
                className={`py-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                  questionTab === 'add'
                    ? 'border-[#6D28D9] text-[#6D28D9]'
                    : 'border-transparent text-[#77718A] hover:text-[#181525]'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add New Question</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {questionTab === 'list' ? (
                isLoadingQuestions ? (
                  <div className="text-center py-10 text-xs text-[#77718A]">Loading questions...</div>
                ) : assessmentQuestions.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="text-xs text-[#77718A]">No questions in this assessment yet.</p>
                    <button
                      onClick={() => setQuestionTab('add')}
                      className="px-4 py-2 rounded-xl bg-[#6D28D9] text-white text-xs font-bold hover:bg-[#5B21B6]"
                    >
                      + Add First Question
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {assessmentQuestions.map((q, idx) => (
                      <div
                        key={q.id}
                        className="p-4 rounded-xl border border-[#EAE6F5] bg-white hover:border-[#8B5CF6]/40 transition-all flex items-start justify-between gap-4"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-purple-50 text-[#6D28D9] text-[10px] font-bold flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className={`px-2 py-0.2 rounded-md text-[10px] font-bold uppercase ${
                              q.type === 'coding' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {q.type}
                            </span>
                            <span className="text-[11px] font-semibold text-[#77718A]">({q.marks} Marks)</span>
                          </div>

                          <h4 className="text-xs font-bold text-[#181525]">{q.title}</h4>
                          <p className="text-[11px] text-[#77718A] line-clamp-2 leading-relaxed">{q.description}</p>

                          {q.type === 'mcq' && q.options && (
                            <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                              {q.options.map(opt => (
                                <span
                                  key={opt.id}
                                  className={`px-2 py-0.5 rounded border ${
                                    opt.id === q.correct_option_id
                                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                                      : 'bg-slate-50 text-slate-600 border-slate-200'
                                  }`}
                                >
                                  {opt.id.toUpperCase()}: {opt.text}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => handleDeleteQuestion(q.id)}
                          className="p-1.5 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
                          title="Delete question"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                /* Add Question Form */
                <form onSubmit={handleAddQuestionSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#181525] mb-1">Question Type</label>
                      <select
                        value={qType}
                        onChange={(e) => setQType(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl border border-[#EAE6F5] text-xs focus:border-[#6D28D9] focus:outline-none bg-[#FBFAFF]"
                      >
                        <option value="mcq">Multiple Choice (MCQ)</option>
                        <option value="coding">Coding Challenge</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#181525] mb-1">Marks Assigned</label>
                      <input
                        type="number"
                        required
                        value={qMarks}
                        onChange={(e) => setQMarks(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#EAE6F5] text-xs focus:border-[#6D28D9] focus:outline-none bg-[#FBFAFF]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#181525] mb-1">Question Prompt / Title</label>
                    <input
                      type="text"
                      required
                      value={qTitle}
                      onChange={(e) => setQTitle(e.target.value)}
                      placeholder="e.g. Time complexity of binary search or Two Sum problem"
                      className="w-full px-3 py-2 rounded-xl border border-[#EAE6F5] text-xs focus:border-[#6D28D9] focus:outline-none bg-[#FBFAFF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#181525] mb-1">Problem Description</label>
                    <textarea
                      rows={2}
                      value={qDesc}
                      onChange={(e) => setQDesc(e.target.value)}
                      placeholder="Provide full problem statement or code snippet..."
                      className="w-full px-3 py-2 rounded-xl border border-[#EAE6F5] text-xs focus:border-[#6D28D9] focus:outline-none bg-[#FBFAFF]"
                    />
                  </div>

                  {/* MCQ Specific Fields */}
                  {qType === 'mcq' && (
                    <div className="space-y-3 pt-2 border-t border-[#EAE6F5]">
                      <span className="text-xs font-bold text-[#181525] block">Options & Correct Answer</span>
                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="text-[11px] font-semibold text-[#77718A]">Option A</label>
                          <input
                            type="text"
                            required
                            value={optA}
                            onChange={(e) => setOptA(e.target.value)}
                            placeholder="e.g. O(1)"
                            className="w-full px-3 py-1.5 rounded-lg border border-[#EAE6F5] text-xs bg-[#FBFAFF]"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-[#77718A]">Option B</label>
                          <input
                            type="text"
                            required
                            value={optB}
                            onChange={(e) => setOptB(e.target.value)}
                            placeholder="e.g. O(log n)"
                            className="w-full px-3 py-1.5 rounded-lg border border-[#EAE6F5] text-xs bg-[#FBFAFF]"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-[#77718A]">Option C</label>
                          <input
                            type="text"
                            required
                            value={optC}
                            onChange={(e) => setOptC(e.target.value)}
                            placeholder="e.g. O(n)"
                            className="w-full px-3 py-1.5 rounded-lg border border-[#EAE6F5] text-xs bg-[#FBFAFF]"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-[#77718A]">Option D</label>
                          <input
                            type="text"
                            required
                            value={optD}
                            onChange={(e) => setOptD(e.target.value)}
                            placeholder="e.g. O(n^2)"
                            className="w-full px-3 py-1.5 rounded-lg border border-[#EAE6F5] text-xs bg-[#FBFAFF]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#181525] mb-1">Correct Option</label>
                        <select
                          value={correctOption}
                          onChange={(e) => setCorrectOption(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-emerald-300 bg-emerald-50 text-xs font-bold text-emerald-800"
                        >
                          <option value="opt1">Option A is Correct</option>
                          <option value="opt2">Option B is Correct</option>
                          <option value="opt3">Option C is Correct</option>
                          <option value="opt4">Option D is Correct</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#181525] mb-1">Answer Explanation</label>
                        <input
                          type="text"
                          value={qExplanation}
                          onChange={(e) => setQExplanation(e.target.value)}
                          placeholder="Brief technical reason shown to candidates after evaluation..."
                          className="w-full px-3 py-2 rounded-xl border border-[#EAE6F5] text-xs bg-[#FBFAFF]"
                        />
                      </div>
                    </div>
                  )}

                  {/* Coding Specific Fields */}
                  {qType === 'coding' && (
                    <div className="space-y-3 pt-2 border-t border-[#EAE6F5]">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-[#181525]">Category</label>
                          <input
                            type="text"
                            value={codingCategory}
                            onChange={(e) => setCodingCategory(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-[#EAE6F5] text-xs bg-[#FBFAFF]"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-[#181525]">Difficulty</label>
                          <select
                            value={codingDifficulty}
                            onChange={(e) => setCodingDifficulty(e.target.value as any)}
                            className="w-full px-3 py-2 rounded-xl border border-[#EAE6F5] text-xs bg-[#FBFAFF]"
                          >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-[#181525]">Sample Input (JSON string)</label>
                          <input
                            type="text"
                            value={testCaseInput}
                            onChange={(e) => setTestCaseInput(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-[#EAE6F5] text-xs font-mono bg-[#FBFAFF]"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-[#181525]">Expected Output</label>
                          <input
                            type="text"
                            value={testCaseOutput}
                            onChange={(e) => setTestCaseOutput(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-[#EAE6F5] text-xs font-mono bg-[#FBFAFF]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setQuestionTab('list')}
                      className="flex-1 py-2.5 rounded-xl border border-[#EAE6F5] text-xs font-semibold text-[#77718A]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-2.5 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-xs font-bold transition-all shadow-sm"
                    >
                      {isSubmitting ? 'Saving...' : 'Add Question to Exam'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
