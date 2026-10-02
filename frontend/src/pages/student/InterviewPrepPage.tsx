import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { InterviewSession, InterviewQuestion } from '../../types';
import confetti from 'canvas-confetti';
import {
  MessagesSquare,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Award,
  ChevronRight,
  RotateCcw,
  Zap
} from 'lucide-react';

export const InterviewPrepPage: React.FC = () => {
  const { user } = useAuth();
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answerInput, setAnswerInput] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchLatestOrStart = async () => {
      try {
        const history = await api.interview.getHistory(user.id);
        if (history.length > 0) {
          setSession(history[0]);
        } else {
          startNewSession();
        }
      } catch (err) {
        console.error('Error fetching interview session:', err);
      }
    };
    fetchLatestOrStart();
  }, [user]);

  const startNewSession = async () => {
    if (!user) return;
    setIsStarting(true);
    try {
      const newSession = await api.interview.start(user.id, user.target_role);
      setSession(newSession);
      setCurrentQIndex(0);
      setAnswerInput('');
    } catch (err) {
      console.error('Failed to start interview:', err);
    } finally {
      setIsStarting(false);
    }
  };

  const handleEvaluate = async () => {
    if (!session || !answerInput.trim()) return;
    const currentQ = session.questions[currentQIndex];
    if (!currentQ) return;

    setIsEvaluating(true);
    try {
      const res = await api.interview.evaluate(session.id, currentQ.id, answerInput);
      setSession(res.session);

      if (res.session.status === 'completed' && (res.session.overall_score || 0) >= 75) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error('Evaluation failed:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const currentQ: InterviewQuestion | undefined = session?.questions[currentQIndex];

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-100">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">AI Mock Interview Simulator</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-100 text-pink-700 border border-pink-200">
              Qwen3-8B Evaluator
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Real-world Technical, HR, and System Design interview questions with instant automated feedback and keyword grading.
          </p>
        </div>

        <button
          onClick={startNewSession}
          disabled={isStarting}
          className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          {isStarting ? 'Starting...' : 'New Mock Interview Session'}
        </button>
      </div>

      {session && (
        <div className="space-y-6">
          {/* Question Stepper Indicator */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {session.questions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => {
                  setCurrentQIndex(idx);
                  setAnswerInput(q.user_answer || '');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border ${
                  currentQIndex === idx
                    ? 'bg-purple-700 text-white border-purple-700 shadow-sm'
                    : q.feedback
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>Question {idx + 1} ({q.type})</span>
                {q.feedback && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              </button>
            ))}
          </div>

          {currentQ && (
            <div className="space-y-6">
              {/* Question Card */}
              <div className="bg-white rounded-2xl p-6 border border-purple-100/80 shadow-soft space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    currentQ.type === 'technical' ? 'bg-blue-100 text-blue-800' :
                    currentQ.type === 'hr' ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {currentQ.type} Question
                  </span>

                  {currentQ.feedback && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      Evaluated Score: {currentQ.feedback.score} / 100
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {currentQ.question}
                </h3>

                <div className="pt-2 flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
                  <span className="font-semibold text-slate-500">Expected Competencies:</span>
                  {currentQ.expected_keywords.map((kw, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-mono border border-purple-100">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Response Textarea */}
              <div className="bg-white rounded-2xl p-6 border border-purple-100/80 shadow-soft space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Your Formulated Response</span>
                  <span className="text-[11px] text-slate-400">Type detailed answer using the STAR method or technical definitions</span>
                </div>

                <textarea
                  rows={6}
                  value={answerInput}
                  onChange={(e) => setAnswerInput(e.target.value)}
                  placeholder="Structure your answer clearly, including runtime trade-offs, architecture choices, or concrete project anecdotes..."
                  className="w-full p-4 rounded-xl border border-slate-200 text-xs sm:text-sm leading-relaxed focus:border-purple-600 focus:outline-none"
                />

                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleEvaluate}
                    disabled={isEvaluating || !answerInput.trim()}
                    className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-40"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                    {isEvaluating ? 'AI Evaluating Response...' : 'Submit Answer for AI Evaluation'}
                  </button>
                </div>
              </div>

              {/* AI Feedback Diagnostics */}
              {currentQ.feedback && (
                <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-soft space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-700" />
                      Detailed AI Feedback & Suggestions
                    </h4>
                    <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                      Match Score: {currentQ.feedback.score}%
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Strengths */}
                    <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
                      <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Demonstrated Strengths
                      </span>
                      <ul className="space-y-1 text-xs text-emerald-950">
                        {currentQ.feedback.strengths.map((str, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-emerald-600">•</span>
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Areas for Improvement */}
                    <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-2">
                      <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        Key Improvements Needed
                      </span>
                      <ul className="space-y-1 text-xs text-amber-950">
                        {currentQ.feedback.improvements.map((imp, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-amber-600">•</span>
                            <span>{imp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Optimal Phrasing Tip */}
                  {currentQ.feedback.better_phrasing && (
                    <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-100 space-y-1.5">
                      <span className="text-xs font-bold text-purple-900 flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5 text-purple-700" />
                        Executive Level Model Phrasing:
                      </span>
                      <p className="text-xs text-purple-900 leading-relaxed font-sans">
                        "{currentQ.feedback.better_phrasing}"
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
