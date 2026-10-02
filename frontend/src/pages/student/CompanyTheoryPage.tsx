import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Search,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Send,
  Tag,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface TheoryQuestion {
  id: string;
  question: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  expected_concepts: string[];
  source_type: string;
  source_note: string;
}

interface Feedback {
  score: number;
  strengths: string[];
  improvements: string[];
  better_phrasing?: string;
}

const DIFFICULTY_BADGE: Record<string, string> = {
  easy: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  hard: 'bg-red-100 text-red-700 border-red-200'
};

export const CompanyTheoryPage: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const { user } = useAuth();

  const [questions, setQuestions] = useState<TheoryQuestion[]>([]);
  const [filtered, setFiltered] = useState<TheoryQuestion[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [companyName, setCompanyName] = useState('');

  // Per-question state
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [evaluating, setEvaluating] = useState<Record<string, boolean>>({});
  const [feedbacks, setFeedbacks] = useState<Record<string, Feedback>>({});

  useEffect(() => {
    if (!companyId) return;
    const load = async () => {
      try {
        const [theoryRes, companyRes] = await Promise.all([
          fetch(`/api/companies/${companyId}/theory`).then(r => r.json()),
          fetch(`/api/companies/${companyId}`).then(r => r.json())
        ]);
        setQuestions(theoryRes.questions || []);
        setTopics(['All', ...(theoryRes.available_topics || [])]);
        setCompanyName(companyRes.name || '');
      } catch {
        setQuestions([]);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [companyId]);

  useEffect(() => {
    let result = questions;
    if (selectedTopic !== 'All') result = result.filter(q => q.topic === selectedTopic);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(x => x.question.toLowerCase().includes(q) || x.topic.toLowerCase().includes(q));
    }
    setFiltered(result);
  }, [questions, selectedTopic, search]);

  const handleEvaluate = async (q: TheoryQuestion) => {
    const answer = answers[q.id]?.trim();
    if (!answer) return;
    setEvaluating(prev => ({ ...prev, [q.id]: true }));
    try {
      const res = await fetch(`/api/companies/${companyId}/theory/${q.id}/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAnswer: answer, student_id: user?.id })
      });
      if (!res.ok) throw new Error('Evaluation failed');
      const data = await res.json();
      setFeedbacks(prev => ({ ...prev, [q.id]: data.feedback }));
    } catch {
      setFeedbacks(prev => ({ ...prev, [q.id]: {
        score: 0,
        strengths: [],
        improvements: ['Unable to evaluate at this time. Please try again.'],
        better_phrasing: undefined
      }}));
    } finally {
      setEvaluating(prev => ({ ...prev, [q.id]: false }));
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto space-y-6">
      {/* Back nav */}
      <Link
        to={`/student/interview/company/${companyId}`}
        className="inline-flex items-center gap-1.5 text-xs text-[#77718A] hover:text-[#6D28D9] font-semibold transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to {companyName || 'Company'}
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-blue-700" />
        </div>
        <div>
          <h1 className="text-xl font-black text-[#181525]">{companyName} — Theory Questions</h1>
          <p className="text-xs text-[#77718A]">Core CS concepts practice with AI evaluation</p>
        </div>
      </div>

      {/* AI Disclaimer */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex gap-2">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-800">
          Questions are AI-generated for practice. Submit your answer to receive instant AI feedback on accuracy, completeness, and improvement areas.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#77718A]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search questions..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#EAE6F5] bg-white text-sm focus:outline-none focus:border-[#6D28D9]"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {topics.map(topic => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                selectedTopic === topic
                  ? 'bg-[#6D28D9] text-white border-[#6D28D9]'
                  : 'bg-white text-[#77718A] border-[#EAE6F5] hover:border-[#6D28D9] hover:text-[#6D28D9]'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Questions */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="w-10 h-10 text-slate-200 mx-auto mb-3" />
          <p className="text-sm text-[#77718A]">No questions found for this filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((q, idx) => (
            <QuestionCard
              key={q.id}
              question={q}
              index={idx + 1}
              isExpanded={!!expanded[q.id]}
              onToggle={() => setExpanded(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
              answer={answers[q.id] || ''}
              onAnswerChange={val => setAnswers(prev => ({ ...prev, [q.id]: val }))}
              isEvaluating={!!evaluating[q.id]}
              feedback={feedbacks[q.id]}
              onEvaluate={() => handleEvaluate(q)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface QuestionCardProps {
  question: TheoryQuestion;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  answer: string;
  onAnswerChange: (val: string) => void;
  isEvaluating: boolean;
  feedback?: Feedback;
  onEvaluate: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question, index, isExpanded, onToggle, answer, onAnswerChange, isEvaluating, feedback, onEvaluate
}) => {
  const diffBadge = DIFFICULTY_BADGE[question.difficulty];

  return (
    <div className="bg-white rounded-2xl border border-[#EAE6F5] overflow-hidden transition-all hover:border-purple-100">
      {/* Question Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-start gap-4 p-5 text-left hover:bg-purple-50/30 transition-colors"
      >
        <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#6D28D9] text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
          {index}
        </span>
        <div className="flex-1 min-w-0 space-y-1.5">
          <p className="text-sm font-semibold text-[#181525] leading-snug">{question.question}</p>
          <div className="flex flex-wrap gap-1.5">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border capitalize ${diffBadge}`}>
              {question.difficulty}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
              <Tag className="w-2.5 h-2.5" />
              {question.topic}
            </span>
            {feedback && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5" />
                Evaluated • {feedback.score}%
              </span>
            )}
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
        )}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-[#EAE6F5] p-5 space-y-4">
          {/* Expected concepts */}
          <div>
            <p className="text-[10px] font-bold text-[#77718A] uppercase tracking-wider mb-2">Expected Concepts</p>
            <div className="flex flex-wrap gap-1.5">
              {question.expected_concepts.map((c, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 text-[10px] font-mono border border-purple-100">
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Answer textarea */}
          <div>
            <label className="text-xs font-bold text-[#181525] block mb-2">Your Answer</label>
            <textarea
              rows={5}
              value={answer}
              onChange={e => onAnswerChange(e.target.value)}
              placeholder="Write your answer here. Be thorough — include definitions, examples, and trade-offs..."
              className="w-full p-4 rounded-xl border border-[#EAE6F5] text-xs leading-relaxed focus:border-[#6D28D9] focus:outline-none resize-none transition-colors"
            />
          </div>

          {/* Evaluate button */}
          <div className="flex justify-end">
            <button
              onClick={onEvaluate}
              disabled={isEvaluating || !answer.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-xs font-bold transition-all disabled:opacity-40"
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-300" />
              {isEvaluating ? 'AI Evaluating...' : 'Get AI Feedback'}
              {!isEvaluating && <Send className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* AI Feedback */}
          {feedback && (
            <div className="space-y-3 pt-2 border-t border-[#EAE6F5]">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-[#181525] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#6D28D9]" />
                  AI Feedback
                </h4>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  feedback.score >= 75 ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                  feedback.score >= 50 ? 'bg-amber-100 text-amber-700 border-amber-200' :
                  'bg-red-100 text-red-700 border-red-200'
                }`}>
                  Score: {feedback.score} / 100
                </span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {feedback.strengths.length > 0 && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                    <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Strengths
                    </p>
                    <ul className="space-y-1">
                      {feedback.strengths.map((s, i) => (
                        <li key={i} className="text-xs text-emerald-900 flex gap-1.5">
                          <span className="text-emerald-600">•</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {feedback.improvements.length > 0 && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                    <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> To Improve
                    </p>
                    <ul className="space-y-1">
                      {feedback.improvements.map((s, i) => (
                        <li key={i} className="text-xs text-amber-900 flex gap-1.5">
                          <span className="text-amber-600">•</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              {feedback.better_phrasing && (
                <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                  <p className="text-[10px] font-bold text-purple-800 mb-1">Model Answer Hint:</p>
                  <p className="text-xs text-purple-900 leading-relaxed">"{feedback.better_phrasing}"</p>
                </div>
              )}
            </div>
          )}

          {/* Source note */}
          <p className="text-[10px] text-slate-400 italic">{question.source_note}</p>
        </div>
      )}
    </div>
  );
};
