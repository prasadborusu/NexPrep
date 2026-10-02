import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calculator,
  CheckCircle2,
  XCircle,
  ChevronRight,
  BarChart2,
  RefreshCw,
  Info
} from 'lucide-react';

interface AptitudeQuestion {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correct_option_id: string;
  explanation: string;
  category: 'quantitative' | 'logical' | 'verbal' | 'data_interpretation';
  difficulty: 'easy' | 'medium' | 'hard';
  source_note: string;
}

interface QuizResult {
  score: number;
  correct: number;
  total: number;
  results: {
    question_id: string;
    selected_option_id: string;
    correct_option_id: string;
    is_correct: boolean;
    explanation: string;
  }[];
}

const CATEGORY_LABELS: Record<string, string> = {
  quantitative: 'Quantitative',
  logical: 'Logical Reasoning',
  verbal: 'Verbal',
  data_interpretation: 'Data Interpretation'
};

const CATEGORY_COLORS: Record<string, string> = {
  quantitative: 'bg-blue-100 text-blue-700 border-blue-200',
  logical: 'bg-purple-100 text-purple-700 border-purple-200',
  verbal: 'bg-green-100 text-green-700 border-green-200',
  data_interpretation: 'bg-orange-100 text-orange-700 border-orange-200'
};

export const CompanyAptitudePage: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const [questions, setQuestions] = useState<AptitudeQuestion[]>([]);
  const [companyName, setCompanyName] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!companyId) return;
    const load = async () => {
      try {
        const [aptRes, compRes] = await Promise.all([
          fetch(`/api/companies/${companyId}/aptitude`).then(r => r.json()),
          fetch(`/api/companies/${companyId}`).then(r => r.json())
        ]);
        setQuestions(aptRes.questions || []);
        setCompanyName(compRes.name || '');
      } catch {
        setQuestions([]);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [companyId]);

  const filtered = categoryFilter === 'all'
    ? questions
    : questions.filter(q => q.category === categoryFilter);

  const handleSelect = (questionId: string, optionId: string) => {
    if (quizSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = async () => {
    const unanswered = filtered.filter(q => !selectedAnswers[q.id]);
    if (unanswered.length > 0) {
      alert(`Please answer all ${unanswered.length} remaining question(s).`);
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/companies/${companyId}/aptitude/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: selectedAnswers })
      });
      const data = await res.json();
      setQuizResult(data);
      setQuizSubmitted(true);
    } catch {
      alert('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizResult(null);
  };

  const allCategories = [...new Set(questions.map(q => q.category))];
  const answeredCount = filtered.filter(q => selectedAnswers[q.id]).length;

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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[#181525]">{companyName} — Aptitude Test</h1>
            <p className="text-xs text-[#77718A]">Quantitative, Logical, Verbal & Data Interpretation</p>
          </div>
        </div>
        {quizSubmitted && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#EAE6F5] text-xs font-semibold text-[#77718A] hover:border-[#6D28D9] hover:text-[#6D28D9] transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        )}
      </div>

      {/* Result Banner */}
      {quizResult && (
        <div className={`rounded-2xl p-5 border flex items-center gap-5 ${
          quizResult.score >= 70 ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'
        }`}>
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black shrink-0 ${
            quizResult.score >= 70 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
          }`}>
            {quizResult.score}%
          </div>
          <div>
            <p className={`font-bold text-base ${quizResult.score >= 70 ? 'text-emerald-800' : 'text-amber-800'}`}>
              {quizResult.score >= 70 ? '🎉 Well done!' : '📚 Keep practicing!'}
            </p>
            <p className={`text-xs mt-1 ${quizResult.score >= 70 ? 'text-emerald-700' : 'text-amber-700'}`}>
              You answered {quizResult.correct} out of {quizResult.total} questions correctly.
            </p>
          </div>
        </div>
      )}

      {/* Category Filter */}
      {!quizSubmitted && (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              categoryFilter === 'all' ? 'bg-[#6D28D9] text-white border-[#6D28D9]' : 'bg-white text-[#77718A] border-[#EAE6F5] hover:border-[#6D28D9]'
            }`}
          >
            All
          </button>
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                categoryFilter === cat ? 'bg-[#6D28D9] text-white border-[#6D28D9]' : 'bg-white text-[#77718A] border-[#EAE6F5] hover:border-[#6D28D9]'
              }`}
            >
              {CATEGORY_LABELS[cat] || cat}
            </button>
          ))}
        </div>
      )}

      {/* Progress */}
      {!quizSubmitted && filtered.length > 0 && (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#6D28D9] rounded-full transition-all"
              style={{ width: `${(answeredCount / filtered.length) * 100}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-[#77718A]">{answeredCount} / {filtered.length} answered</span>
        </div>
      )}

      {/* Questions */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Calculator className="w-10 h-10 text-slate-200 mx-auto mb-3" />
          <p className="text-sm text-[#77718A]">No aptitude questions for this filter.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {filtered.map((q, idx) => {
            const result = quizResult?.results.find(r => r.question_id === q.id);
            const selected = selectedAnswers[q.id];

            return (
              <div key={q.id} className="bg-white rounded-2xl border border-[#EAE6F5] p-5 space-y-4">
                {/* Question */}
                <div className="flex gap-3">
                  <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 text-[11px] font-black flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex gap-2 mb-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${CATEGORY_COLORS[q.category]}`}>
                        {CATEGORY_LABELS[q.category]}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border capitalize ${
                        q.difficulty === 'easy' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                        q.difficulty === 'medium' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                        'bg-red-100 text-red-700 border-red-200'
                      }`}>
                        {q.difficulty}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-[#181525] leading-snug">{q.question}</p>
                  </div>
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-10">
                  {q.options.map(opt => {
                    const isSelected = selected === opt.id;
                    const isCorrect = opt.id === q.correct_option_id;
                    let optStyle = 'border-[#EAE6F5] bg-white hover:border-[#6D28D9] hover:bg-purple-50/30 cursor-pointer';
                    if (quizSubmitted) {
                      if (isCorrect) optStyle = 'border-emerald-400 bg-emerald-50 text-emerald-800';
                      else if (isSelected && !isCorrect) optStyle = 'border-red-400 bg-red-50 text-red-800';
                      else optStyle = 'border-[#EAE6F5] bg-white opacity-60';
                    } else if (isSelected) {
                      optStyle = 'border-[#6D28D9] bg-purple-50 text-[#6D28D9]';
                    }

                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelect(q.id, opt.id)}
                        disabled={quizSubmitted}
                        className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-medium text-left transition-all ${optStyle}`}
                      >
                        <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 font-bold text-[10px] ${
                          isSelected && !quizSubmitted ? 'bg-[#6D28D9] border-[#6D28D9] text-white' :
                          quizSubmitted && isCorrect ? 'bg-emerald-500 border-emerald-500 text-white' :
                          quizSubmitted && isSelected ? 'bg-red-500 border-red-500 text-white' :
                          'border-slate-300 text-slate-400'
                        }`}>
                          {opt.id.toUpperCase()}
                        </span>
                        {opt.text}
                        {quizSubmitted && isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 ml-auto shrink-0" />}
                        {quizSubmitted && isSelected && !isCorrect && <XCircle className="w-3.5 h-3.5 text-red-500 ml-auto shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {result && (
                  <div className={`pl-10 p-3 rounded-xl text-xs leading-relaxed ${
                    result.is_correct ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-50 text-slate-700'
                  }`}>
                    <span className="font-bold">Explanation: </span>{q.explanation}
                  </div>
                )}
                <p className="pl-10 text-[10px] text-slate-400 italic">{q.source_note}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Submit button */}
      {!quizSubmitted && filtered.length > 0 && (
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || answeredCount < filtered.length}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-sm font-bold transition-all disabled:opacity-40 shadow-sm"
          >
            <BarChart2 className="w-4 h-4" />
            {isSubmitting ? 'Evaluating...' : `Submit ${filtered.length} Questions`}
          </button>
        </div>
      )}
    </div>
  );
};
