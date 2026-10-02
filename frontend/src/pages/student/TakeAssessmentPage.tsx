import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Assessment, Question, StudentAssessmentAnswer } from '../../types';
import Editor from '@monaco-editor/react';
import {
  Clock,
  Bookmark,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Send,
  Code2,
  HelpCircle,
  Play,
  RotateCcw,
  AlertTriangle
} from 'lucide-react';

export const TakeAssessmentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, StudentAssessmentAnswer>>({});
  const [timeLeft, setTimeLeft] = useState<number>(45 * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autosaveText, setAutosaveText] = useState('All changes saved');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [codeOutput, setCodeOutput] = useState<string | null>(null);
  const [isRunningCode, setIsRunningCode] = useState(false);

  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (!id) return;
    const fetchExam = async () => {
      try {
        const data = await api.assessments.get(id);
        setAssessment(data.assessment);
        setQuestions(data.questions);
        setTimeLeft(data.assessment.duration_minutes * 60);

        // Prepopulate starter answers
        const initialAnswers: Record<string, StudentAssessmentAnswer> = {};
        data.questions.forEach((q) => {
          initialAnswers[q.id] = {
            question_id: q.id,
            selected_option_id: undefined,
            code_content: q.type === 'coding' ? (q.starter_code?.python || '# Write solution here\n') : undefined,
            language: 'python',
            is_marked_for_review: false
          };
        });
        setAnswers(initialAnswers);
      } catch (err) {
        console.error('Error loading assessment:', err);
      }
    };
    fetchExam();
  }, [id]);

  // Countdown Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinalSubmit();
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeft]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQ = questions[currentIdx];
  const currentAns = currentQ ? answers[currentQ.id] : undefined;

  // Answer Handlers
  const handleSelectOption = (optionId: string) => {
    if (!currentQ) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: {
        ...prev[currentQ.id],
        selected_option_id: optionId,
        saved_at: new Date().toISOString()
      }
    }));
    triggerAutosave();
  };

  const handleCodeChange = (newCode: string | undefined) => {
    if (!currentQ || !newCode) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: {
        ...prev[currentQ.id],
        code_content: newCode,
        saved_at: new Date().toISOString()
      }
    }));
    triggerAutosave();
  };

  const handleLanguageChange = (lang: string) => {
    if (!currentQ) return;
    const starter = currentQ.starter_code?.[lang] || '# Starter template\n';
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: {
        ...prev[currentQ.id],
        language: lang,
        code_content: starter
      }
    }));
  };

  const toggleMarkForReview = () => {
    if (!currentQ) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: {
        ...prev[currentQ.id],
        is_marked_for_review: !prev[currentQ.id]?.is_marked_for_review
      }
    }));
  };

  const handleClearResponse = () => {
    if (!currentQ) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: {
        ...prev[currentQ.id],
        selected_option_id: undefined,
        code_content: currentQ.type === 'coding' ? (currentQ.starter_code?.[prev[currentQ.id]?.language || 'python'] || '') : undefined
      }
    }));
  };

  const triggerAutosave = () => {
    setAutosaveText('Saving...');
    setTimeout(() => {
      setAutosaveText('Autosaved');
    }, 600);
  };

  const handleRunCodeSample = async () => {
    if (!currentQ || currentQ.type !== 'coding') return;
    const code = currentAns?.code_content || '';
    const lang = currentAns?.language || 'python';
    setIsRunningCode(true);
    setCodeOutput(null);
    try {
      const res = await api.coding.runCode(lang, code, currentQ.test_cases?.[0]?.input || '');
      setCodeOutput(res.output || res.stdout || res.stderr || 'Executed successfully.');
    } catch (err: any) {
      setCodeOutput('Error: ' + err.message);
    } finally {
      setIsRunningCode(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (!id || !user) return;
    setIsSubmitting(true);
    try {
      await api.assessments.submit(id, {
        student_id: user.id,
        answers,
        is_final_submit: true
      });
      navigate(`/student/assessments/${id}/result`);
    } catch (err) {
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!assessment || questions.length === 0) {
    return <div className="p-12 text-center text-xs text-slate-500">Preparing assessment workstation...</div>;
  }

  return (
    <div className="min-h-screen bg-[#FBFAFF] flex flex-col">
      {/* Top Proctoring Bar */}
      <header className="h-16 px-6 bg-white border-b border-purple-100 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 truncate max-w-sm">{assessment.title}</h2>
            <span className="text-[11px] text-slate-400">Total: {assessment.total_marks} Marks • Pass: {assessment.pass_percentage}%</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{autosaveText}</span>
          </div>

          {/* Countdown Clock */}
          <div className={`px-3 py-1.5 rounded-xl border text-sm font-mono font-bold flex items-center gap-2 ${
            timeLeft < 300
              ? 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse'
              : 'bg-purple-50 border-purple-200 text-purple-800'
          }`}>
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <button
            onClick={() => setShowConfirmModal(true)}
            className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            Submit Assessment
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Examination Grid */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Active Question Canvas */}
        <div className="flex-1 flex flex-col p-6 overflow-y-auto space-y-6">
          {/* Question Meta Header */}
          <div className="bg-white rounded-2xl p-6 border border-purple-100/80 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-700 text-xs font-bold uppercase">
                  Question {currentIdx + 1} of {questions.length}
                </span>
                <span className="text-xs font-semibold text-slate-400">({currentQ.marks} Marks)</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMarkForReview}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                    currentAns?.is_marked_for_review
                      ? 'bg-amber-100 border-amber-300 text-amber-900'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  {currentAns?.is_marked_for_review ? 'Marked for Review' : 'Mark for Review'}
                </button>

                <button
                  onClick={handleClearResponse}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Clear
                </button>
              </div>
            </div>

            <h3 className="text-base font-bold text-slate-900 leading-snug">{currentQ.title}</h3>
            <div className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">{currentQ.description}</div>
          </div>

          {/* MCQ Mode */}
          {currentQ.type === 'mcq' && currentQ.options && (
            <div className="bg-white rounded-2xl p-6 border border-purple-100/80 shadow-soft space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Correct Option:</h4>
              <div className="space-y-2.5">
                {currentQ.options.map((opt) => {
                  const isSelected = currentAns?.selected_option_id === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`w-full p-4 rounded-xl text-left text-sm font-medium transition-all flex items-center justify-between border ${
                        isSelected
                          ? 'bg-purple-50/80 border-purple-600 text-purple-900 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-purple-200 text-slate-700'
                      }`}
                    >
                      <span>{opt.text}</span>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-purple-600 bg-purple-600 text-white' : 'border-slate-300'
                      }`}>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Coding Question Mode with Monaco Editor */}
          {currentQ.type === 'coding' && (
            <div className="bg-white rounded-2xl p-6 border border-purple-100/80 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Language:</span>
                  <select
                    value={currentAns?.language || 'python'}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="px-3 py-1 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-600"
                  >
                    <option value="python">Python 3</option>
                    <option value="javascript">JavaScript (Node.js)</option>
                    <option value="java">Java 15</option>
                    <option value="cpp">C++ 10</option>
                  </select>
                </div>

                <button
                  onClick={handleRunCodeSample}
                  disabled={isRunningCode}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  {isRunningCode ? 'Running...' : 'Run Sample Test'}
                </button>
              </div>

              <div className="rounded-xl overflow-hidden border border-slate-200 h-80">
                <Editor
                  height="100%"
                  language={currentAns?.language === 'cpp' ? 'cpp' : currentAns?.language || 'python'}
                  theme="vs-dark"
                  value={currentAns?.code_content || ''}
                  onChange={handleCodeChange}
                  options={{
                    fontSize: 13,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    lineNumbers: 'on',
                    roundedSelection: true
                  }}
                />
              </div>

              {codeOutput && (
                <div className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs space-y-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Console Output:</p>
                  <pre className="whitespace-pre-wrap">{codeOutput}</pre>
                </div>
              )}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous Question
            </button>

            {currentIdx < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1))}
                className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all flex items-center gap-1"
              >
                Next Question
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowConfirmModal(true)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5"
              >
                Ready to Submit
                <Send className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Question Palette & Status Drawer */}
        <aside className="w-72 bg-white border-l border-purple-100 p-6 flex flex-col justify-between hidden md:flex">
          <div className="space-y-5">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Question Palette</h4>
              <p className="text-[11px] text-slate-400">Click any number to jump directly</p>
            </div>

            {/* Grid of question buttons */}
            <div className="grid grid-cols-4 gap-2">
              {questions.map((q, idx) => {
                const ans = answers[q.id];
                const isAnswered = q.type === 'mcq' ? Boolean(ans?.selected_option_id) : Boolean(ans?.code_content && ans.code_content.length > 30);
                const isMarked = ans?.is_marked_for_review;
                const isCurrent = currentIdx === idx;

                let btnClass = 'bg-slate-100 text-slate-700 border-slate-200';
                if (isCurrent) btnClass = 'ring-2 ring-purple-600 bg-purple-50 text-purple-900 border-purple-400 font-bold';
                else if (isMarked) btnClass = 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
                else if (isAnswered) btnClass = 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold';

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`h-10 rounded-xl text-xs font-bold border transition-all flex items-center justify-center ${btnClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="space-y-2 pt-4 border-t border-slate-100 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-emerald-100 border border-emerald-300"></span>
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-amber-100 border border-amber-300"></span>
                <span>Marked for Review</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-slate-100 border border-slate-200"></span>
                <span>Not Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md border-2 border-purple-600 bg-purple-50"></span>
                <span>Current Question</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-purple-50 border border-purple-100 text-[11px] text-purple-900 leading-relaxed">
            Ensure all responses are verified before finalizing. Your test auto-submits when the timer reaches 00:00.
          </div>
        </aside>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 border border-purple-100 shadow-soft-lg">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-center space-y-1">
              <h4 className="text-base font-bold text-slate-900">Submit Assessment?</h4>
              <p className="text-xs text-slate-500">
                You have answered {Object.values(answers).filter(a => a.selected_option_id || (a.code_content && a.code_content.length > 30)).length} of {questions.length} questions.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Keep Reviewing
              </button>
              <button
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all shadow-sm"
              >
                {isSubmitting ? 'Evaluating...' : 'Yes, Submit Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
