import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HRQuestion {
  id: string;
  question: string;
  category: 'behavioral' | 'situational' | 'company_specific' | 'general';
  tips: string[];
  source_note: string;
}

interface Feedback {
  score: number;
  strengths: string[];
  improvements: string[];
  better_phrasing?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  behavioral: 'Behavioral',
  situational: 'Situational',
  company_specific: 'Company Specific',
  general: 'General'
};

const CATEGORY_COLORS: Record<string, string> = {
  behavioral: 'bg-blue-100 text-blue-700 border-blue-200',
  situational: 'bg-amber-100 text-amber-700 border-amber-200',
  company_specific: 'bg-purple-100 text-purple-700 border-purple-200',
  general: 'bg-slate-100 text-slate-600 border-slate-200'
};

export const CompanyHRPage: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const { user } = useAuth();
  const [questions, setQuestions] = useState<HRQuestion[]>([]);
  const [companyName, setCompanyName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [evaluating, setEvaluating] = useState<Record<string, boolean>>({});
  const [feedbacks, setFeedbacks] = useState<Record<string, Feedback>>({});

  useEffect(() => {
    if (!companyId) return;
    const load = async () => {
      try {
        const [hrRes, compRes] = await Promise.all([
          fetch(`/api/companies/${companyId}/hr`).then(r => r.json()),
          fetch(`/api/companies/${companyId}`).then(r => r.json())
        ]);
        setQuestions(hrRes.questions || []);
        setCompanyName(compRes.name || '');
      } catch {
        setQuestions([]);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [companyId]);

  const handleEvaluate = async (q: HRQuestion) => {
    const answer = answers[q.id]?.trim();
    if (!answer) return;
    setEvaluating(prev => ({ ...prev, [q.id]: true }));
    try {
      const res = await fetch(`/api/companies/${companyId}/hr/${q.id}/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAnswer: answer, student_id: user?.id })
      });
      const data = await res.json();
      setFeedbacks(prev => ({ ...prev, [q.id]: data.feedback }));
    } catch {
      setFeedbacks(prev => ({ ...prev, [q.id]: {
        score: 0,
        strengths: [],
        improvements: ['Evaluation temporarily unavailable. Review the tips below.']
      }}));
    } finally {
      setEvaluating(prev => ({ ...prev, [q.id]: false }));
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
      {/* Back */}
      <Link
        to={`/student/interview/company/${companyId}`}
        className="inline-flex items-center gap-1.5 text-xs text-[#77718A] hover:text-[#6D28D9] font-semibold"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to {companyName}
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center">
          <Users className="w-5 h-5 text-purple-700" />
        </div>
        <div>
          <h1 className="text-xl font-black text-[#181525]">{companyName} — HR Preparation</h1>
          <p className="text-xs text-[#77718A]">Behavioral, situational & company-specific HR questions with AI feedback</p>
        </div>
      </div>

      {/* Tips Banner */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex gap-3">
        <Lightbulb className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
        <div className="text-xs text-purple-800 space-y-1">
          <p className="font-bold">How to prepare for HR rounds:</p>
          <p>Use the <strong>STAR method</strong> (Situation, Task, Action, Result) for behavioral questions. Be authentic, specific, and concise. Review the preparation tips under each question.</p>
        </div>
      </div>

      {/* Questions */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-16">
          <Users className="w-10 h-10 text-slate-200 mx-auto mb-3" />
          <p className="text-sm text-[#77718A]">No HR questions available for this company.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q, idx) => {
            const isOpen = !!expanded[q.id];
            const feedback = feedbacks[q.id];

            return (
              <div key={q.id} className="bg-white rounded-2xl border border-[#EAE6F5] overflow-hidden">
                {/* Question Header */}
                <button
                  onClick={() => setExpanded(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                  className="w-full flex items-start gap-4 p-5 text-left hover:bg-purple-50/30 transition-colors"
                >
                  <span className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 text-[11px] font-black flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1 space-y-1.5">
                    <p className="text-sm font-semibold text-[#181525] leading-snug">{q.question}</p>
                    <div className="flex gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${CATEGORY_COLORS[q.category]}`}>
                        {CATEGORY_LABELS[q.category]}
                      </span>
                      {feedback && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Practiced
                        </span>
                      )}
                    </div>
                  </div>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400 mt-1 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 mt-1 shrink-0" />}
                </button>

                {/* Expanded */}
                {isOpen && (
                  <div className="border-t border-[#EAE6F5] p-5 space-y-4">
                    {/* Tips */}
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 space-y-2">
                      <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                        <Lightbulb className="w-3 h-3" />
                        Preparation Tips
                      </p>
                      <ul className="space-y-1.5">
                        {q.tips.map((tip, i) => (
                          <li key={i} className="text-xs text-amber-900 flex gap-2">
                            <span className="text-amber-500 font-bold shrink-0">{i + 1}.</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Answer textarea */}
                    <div>
                      <label className="text-xs font-bold text-[#181525] block mb-2">
                        Practice Your Answer
                        <span className="text-[#77718A] font-normal ml-2">(use STAR: Situation → Task → Action → Result)</span>
                      </label>
                      <textarea
                        rows={5}
                        value={answers[q.id] || ''}
                        onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                        placeholder="Write your answer here. Start with the situation, describe your role, explain actions taken, and quantify the result..."
                        className="w-full p-4 rounded-xl border border-[#EAE6F5] text-xs leading-relaxed focus:border-[#6D28D9] focus:outline-none resize-none"
                      />
                    </div>

                    {/* Evaluate */}
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleEvaluate(q)}
                        disabled={evaluating[q.id] || !answers[q.id]?.trim()}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-xs font-bold transition-all disabled:opacity-40"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-pink-300" />
                        {evaluating[q.id] ? 'AI Evaluating...' : 'Get AI Feedback'}
                        {!evaluating[q.id] && <Send className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* Feedback */}
                    {feedback && (
                      <div className="space-y-3 pt-2 border-t border-[#EAE6F5]">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-[#181525] flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-[#6D28D9]" />
                            AI Feedback
                          </h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                            feedback.score >= 70 ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                            feedback.score >= 40 ? 'bg-amber-100 text-amber-700 border-amber-200' :
                            'bg-red-100 text-red-700 border-red-200'
                          }`}>
                            Score: {feedback.score} / 100
                          </span>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {feedback.strengths.length > 0 && (
                            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                              <p className="text-[10px] font-bold text-emerald-800 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> What Works
                              </p>
                              <ul className="space-y-1">
                                {feedback.strengths.map((s, i) => (
                                  <li key={i} className="text-xs text-emerald-900 flex gap-1.5">
                                    <span className="text-emerald-500">•</span>{s}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {feedback.improvements.length > 0 && (
                            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                              <p className="text-[10px] font-bold text-amber-800 flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5" /> To Improve
                              </p>
                              <ul className="space-y-1">
                                {feedback.improvements.map((s, i) => (
                                  <li key={i} className="text-xs text-amber-900 flex gap-1.5">
                                    <span className="text-amber-500">•</span>{s}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        {feedback.better_phrasing && (
                          <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                            <p className="text-[10px] font-bold text-purple-800 mb-1">Suggested Structure:</p>
                            <p className="text-xs text-purple-900 leading-relaxed">"{feedback.better_phrasing}"</p>
                          </div>
                        )}
                      </div>
                    )}

                    <p className="text-[10px] text-slate-400 italic">{q.source_note}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
