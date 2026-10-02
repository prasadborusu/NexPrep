import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Assessment, Question } from '../../types';
import { Database, Plus, Search, Tag, CheckCircle2 } from 'lucide-react';

export const AdminQuestionsPage: React.FC = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New question form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'mcq' | 'coding'>('mcq');
  const [marks, setMarks] = useState('5');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [opt4, setOpt4] = useState('');
  const [correctOpt, setCorrectOpt] = useState('opt1');
  const [explanation, setExplanation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const assList = await api.assessments.list();
      setAssessments(assList);
      if (assList.length > 0) {
        setSelectedAssessmentId(assList[0].id);
        loadQuestions(assList[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadQuestions = async (assId: string) => {
    try {
      const data = await api.assessments.get(assId);
      setQuestions(data.questions);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssessmentChange = (id: string) => {
    setSelectedAssessmentId(id);
    loadQuestions(id);
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !selectedAssessmentId) return;
    setIsSubmitting(true);
    try {
      const options = type === 'mcq' ? [
        { id: 'opt1', text: opt1 },
        { id: 'opt2', text: opt2 },
        { id: 'opt3', text: opt3 },
        { id: 'opt4', text: opt4 }
      ].filter(o => o.text.trim()) : undefined;

      const newQ = await api.assessments.addQuestion(selectedAssessmentId, {
        title,
        description,
        type,
        marks: parseInt(marks, 10) || 5,
        options,
        correct_option_id: correctOpt,
        explanation
      });

      setQuestions([...questions, newQ]);
      setShowAddModal(false);
      setTitle('');
      setDescription('');
    } catch (err: any) {
      alert(err.message || 'Failed to add question');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-100">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Question Bank Repository</h1>
          <p className="text-xs text-slate-500">Manage curriculum questions, difficulty ratings, and automated answer keys</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedAssessmentId}
            onChange={(e) => handleAssessmentChange(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:border-purple-600"
          >
            {assessments.map((a) => (
              <option key={a.id} value={a.id}>
                {a.title}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add Question
          </button>
        </div>
      </div>

      {/* Questions list */}
      <div className="space-y-4">
        {questions.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-2xl border border-purple-100">
            No questions linked to this assessment yet.
          </div>
        ) : (
          questions.map((q, idx) => (
            <div key={q.id} className="bg-white rounded-2xl p-6 border border-purple-100 shadow-soft space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-100 text-purple-700">
                    Q{idx + 1} • {q.type}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">{q.title}</h3>
                </div>
                <span className="text-xs font-bold text-slate-400">{q.marks} Marks</span>
              </div>

              <p className="text-xs text-slate-600 whitespace-pre-line">{q.description}</p>

              {q.options && (
                <div className="grid sm:grid-cols-2 gap-2 pt-2 text-xs">
                  {q.options.map((opt) => (
                    <div
                      key={opt.id}
                      className={`p-2.5 rounded-xl border ${
                        (q as any).correct_option_id === opt.id
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      {opt.text} {(q as any).correct_option_id === opt.id && '✓'}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4 border border-purple-100 shadow-soft-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900">Add Question to Assessment</h3>
            <form onSubmit={handleAddQuestion} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Question Title / Subject</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Memory Layout of JVM"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Question Body / Problem Statement</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Question Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-purple-600 focus:outline-none"
                  >
                    <option value="mcq">MCQ</option>
                    <option value="coding">Coding</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Marks</label>
                  <input
                    type="number"
                    value={marks}
                    onChange={(e) => setMarks(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-purple-600 focus:outline-none"
                  />
                </div>
              </div>

              {type === 'mcq' && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-800">MCQ Options</label>
                  <input
                    type="text"
                    placeholder="Option A (opt1)"
                    value={opt1}
                    onChange={(e) => setOpt1(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Option B (opt2)"
                    value={opt2}
                    onChange={(e) => setOpt2(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Option C (opt3)"
                    value={opt3}
                    onChange={(e) => setOpt3(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Option D (opt4)"
                    value={opt4}
                    onChange={(e) => setOpt4(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />

                  <div className="pt-1">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Correct Option ID</label>
                    <select
                      value={correctOpt}
                      onChange={(e) => setCorrectOpt(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                    >
                      <option value="opt1">Option A (opt1)</option>
                      <option value="opt2">Option B (opt2)</option>
                      <option value="opt3">Option C (opt3)</option>
                      <option value="opt4">Option D (opt4)</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Explanation</label>
                <textarea
                  rows={2}
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Canonical reasoning shown to student upon completion"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold"
                >
                  {isSubmitting ? 'Saving...' : 'Add Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
