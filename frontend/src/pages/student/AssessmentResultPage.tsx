import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { AssessmentSubmission, Question } from '../../types';
import confetti from 'canvas-confetti';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Sparkles,
  HelpCircle,
  FileCheck2
} from 'lucide-react';

export const AssessmentResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [submission, setSubmission] = useState<AssessmentSubmission | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id || !user) return;
    const fetchResult = async () => {
      try {
        const data = await api.assessments.getResult(id, user.id);
        setSubmission(data.submission);
        setQuestions(data.questions);

        if (data.submission.passed) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      } catch (err) {
        console.error('Error fetching assessment result:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResult();
  }, [id, user]);

  if (isLoading) {
    return <div className="p-12 text-center text-xs text-slate-500">Calculating evaluation scorecard...</div>;
  }

  if (!submission) {
    return (
      <div className="p-12 text-center space-y-4">
        <p className="text-sm text-slate-500">No submission found for this assessment.</p>
        <button
          onClick={() => navigate('/assessments')}
          className="px-4 py-2 bg-purple-700 text-white rounded-xl text-xs font-semibold"
        >
          Back to Assessments
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-8">
      {/* Result Hero Banner */}
      <div className={`rounded-3xl p-8 text-white shadow-soft-lg text-center space-y-4 ${
        submission.passed
          ? 'bg-gradient-to-tr from-purple-800 via-purple-700 to-indigo-800'
          : 'bg-gradient-to-tr from-slate-800 to-slate-900'
      }`}>
        <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto border border-white/20">
          {submission.passed ? (
            <Trophy className="w-8 h-8 text-amber-300" />
          ) : (
            <FileCheck2 className="w-8 h-8 text-slate-300" />
          )}
        </div>

        <div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            submission.passed ? 'bg-emerald-400 text-emerald-950' : 'bg-rose-400 text-rose-950'
          }`}>
            {submission.passed ? 'PASSED QUALIFYING CRITERIA' : 'EVALUATION COMPLETED'}
          </span>
          <h1 className="text-3xl font-black mt-2 tracking-tight">{submission.assessment_title}</h1>
          <p className="text-xs text-purple-200 mt-1">Submitted on {new Date(submission.submitted_at || Date.now()).toLocaleDateString()}</p>
        </div>

        {/* Score metrics */}
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto pt-2 text-center">
          <div className="p-3 rounded-2xl bg-white/10 border border-white/15">
            <span className="text-[10px] uppercase font-semibold text-purple-200 block">Total Score</span>
            <span className="text-2xl font-black block mt-0.5">{submission.score} / {submission.total_marks}</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/10 border border-white/15">
            <span className="text-[10px] uppercase font-semibold text-purple-200 block">Percentage</span>
            <span className="text-2xl font-black block mt-0.5">{submission.percentage}%</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/10 border border-white/15">
            <span className="text-[10px] uppercase font-semibold text-purple-200 block">Status</span>
            <span className="text-2xl font-black block mt-0.5">{submission.passed ? 'Passed' : 'Needs Polish'}</span>
          </div>
        </div>

        <div className="pt-2 flex justify-center gap-3">
          <Link
            to="/skill-gap"
            className="px-5 py-2.5 rounded-xl bg-white text-purple-900 text-xs font-bold hover:bg-purple-50 transition-all shadow-sm flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            View Updated Skill Gap
          </Link>
          <Link
            to="/dashboard"
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all border border-white/20"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Detailed Question Review */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Question-by-Question Review & Canonical Explanations</h2>

        <div className="space-y-4">
          {questions.map((q, idx) => {
            const result = submission.question_results?.[q.id];
            const studentAns = submission.answers?.[q.id];
            const isCorrect = result?.correct;

            return (
              <div
                key={q.id}
                className="bg-white rounded-2xl p-6 border border-purple-100/80 shadow-soft space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">Q{idx + 1}.</span>
                    <h3 className="text-sm font-bold text-slate-800">{q.title}</h3>
                  </div>

                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                    isCorrect
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    {result?.marks_obtained || 0} / {q.marks} Marks
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{q.description}</p>

                {/* MCQ Breakdown */}
                {q.type === 'mcq' && q.options && (
                  <div className="space-y-2 pt-1">
                    {q.options.map((opt) => {
                      const isStudentSelected = studentAns?.selected_option_id === opt.id;
                      const isCanonicalCorrect = (q as any).correct_option_id === opt.id || result?.correct_option_id === opt.id;

                      let rowClass = 'bg-slate-50 text-slate-600 border-slate-200';
                      if (isCanonicalCorrect) {
                        rowClass = 'bg-emerald-50 text-emerald-900 border-emerald-300 font-semibold';
                      } else if (isStudentSelected && !isCanonicalCorrect) {
                        rowClass = 'bg-rose-50 text-rose-900 border-rose-300 line-through';
                      }

                      return (
                        <div
                          key={opt.id}
                          className={`p-3 rounded-xl border text-xs flex items-center justify-between ${rowClass}`}
                        >
                          <span>{opt.text}</span>
                          {isCanonicalCorrect && (
                            <span className="text-[11px] font-bold text-emerald-700">✓ Correct Answer</span>
                          )}
                          {isStudentSelected && !isCanonicalCorrect && (
                            <span className="text-[11px] font-bold text-rose-600">Your Selection</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Coding Breakdown */}
                {q.type === 'coding' && (
                  <div className="space-y-2 pt-1 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-slate-900 text-slate-200 text-xs">
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Your Submitted Code ({studentAns?.language || 'python'}):</p>
                      <pre className="whitespace-pre-wrap">{studentAns?.code_content || '// No code submitted'}</pre>
                    </div>
                    {result?.status && (
                      <p className="text-xs font-bold text-purple-700">
                        Result: {result.status} ({result.passed_cases || 0}/{result.total_cases || 0} Test Cases Passed)
                      </p>
                    )}
                  </div>
                )}

                {/* Explanation */}
                {q.explanation && (
                  <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-100 text-xs text-purple-950 space-y-1">
                    <p className="font-bold flex items-center gap-1 text-purple-800">
                      <HelpCircle className="w-3.5 h-3.5" />
                      Canonical Solution Explanation:
                    </p>
                    <p className="text-[11px] text-purple-900 leading-relaxed">{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
