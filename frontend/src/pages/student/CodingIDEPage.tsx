import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { CodingProblem, CodeSubmission, TestCase } from '../../types';
import {
  ArrowLeft,
  Play,
  Send,
  RotateCcw,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Terminal,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Maximize2,
  Minimize2,
  Layers,
  History
} from 'lucide-react';

type SupportedLanguage = 'python' | 'javascript' | 'typescript' | 'java' | 'cpp';

const LANGUAGE_CONFIG: Record<SupportedLanguage, { label: string; monacoLang: string; extension: string }> = {
  python: { label: 'Python 3', monacoLang: 'python', extension: 'py' },
  javascript: { label: 'JavaScript (Node.js)', monacoLang: 'javascript', extension: 'js' },
  typescript: { label: 'TypeScript', monacoLang: 'typescript', extension: 'ts' },
  java: { label: 'Java 21', monacoLang: 'java', extension: 'java' },
  cpp: { label: 'C++ (G++ 17)', monacoLang: 'cpp', extension: 'cpp' }
};

export const CodingIDEPage: React.FC = () => {
  const { problemId } = useParams<{ problemId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [problem, setProblem] = useState<CodingProblem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Editor State
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>('python');
  const [code, setCode] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'description' | 'hints' | 'submissions'>('description');
  const [bottomTab, setBottomTab] = useState<'testcases' | 'result' | 'console'>('testcases');
  const [activeTestCaseIdx, setActiveTestCaseIdx] = useState<number>(0);

  // Execution State
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [runResult, setRunResult] = useState<any>(null);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [userSubmissions, setUserSubmissions] = useState<CodeSubmission[]>([]);

  // Load Problem
  useEffect(() => {
    if (!problemId) return;

    const fetchProblem = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await api.coding.getProblem(problemId, user?.id);
        setProblem(data);

        // Load saved language for this problem or default to python
        const savedLang = (localStorage.getItem(`lang_${data.id}`) as SupportedLanguage) || 'python';
        setSelectedLang(savedLang);

        // Load saved code draft or starter code
        const savedDraft = localStorage.getItem(`draft_${data.id}_${savedLang}`);
        if (savedDraft) {
          setCode(savedDraft);
        } else if (data.starter_code && data.starter_code[savedLang]) {
          setCode(data.starter_code[savedLang]);
        }

        // Fetch recent submissions for this problem
        if (user?.id) {
          try {
            const subs = await api.coding.getSubmissions(user.id, { problem_id: data.id });
            setUserSubmissions(subs);
          } catch {}
        }
      } catch (err: any) {
        setError(err.message || 'Problem could not be loaded');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProblem();
  }, [problemId, user?.id]);

  // Handle Language Change
  const handleLanguageChange = (lang: SupportedLanguage) => {
    setSelectedLang(lang);
    if (!problem) return;
    localStorage.setItem(`lang_${problem.id}`, lang);

    // Retrieve saved draft or fallback to starter code
    const savedDraft = localStorage.getItem(`draft_${problem.id}_${lang}`);
    if (savedDraft) {
      setCode(savedDraft);
    } else if (problem.starter_code && problem.starter_code[lang]) {
      setCode(problem.starter_code[lang]);
    } else {
      setCode('// Write your solution here\n');
    }
  };

  // Handle Code Change
  const handleCodeChange = (newCode: string | undefined) => {
    const val = newCode || '';
    setCode(val);
    if (problem) {
      localStorage.setItem(`draft_${problem.id}_${selectedLang}`, val);
    }
  };

  // Reset Code
  const handleResetCode = () => {
    if (!problem) return;
    if (confirm('Reset code to starter template? Your current edits will be cleared.')) {
      const defaultCode = problem.starter_code?.[selectedLang] || '';
      setCode(defaultCode);
      localStorage.removeItem(`draft_${problem.id}_${selectedLang}`);
    }
  };

  // Run Code (Sample Tests)
  const handleRunCode = async () => {
    if (!problem || !code.trim() || isRunning) return;
    setIsRunning(true);
    setBottomTab('result');
    setRunResult(null);

    try {
      const activeTest = problem.test_cases[activeTestCaseIdx];
      const stdin = activeTest ? activeTest.input : '';
      const res = await api.coding.runCode(selectedLang, code, stdin);
      setRunResult({
        ...res,
        testCase: activeTest
      });
    } catch (err: any) {
      setRunResult({
        error: err.message || 'Execution error',
        output: err.message,
        exitCode: 1
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Submit Code (All Test Cases)
  const handleSubmitCode = async () => {
    if (!problem || !code.trim() || isSubmitting) return;
    setIsSubmitting(true);
    setBottomTab('result');
    setSubmissionResult(null);

    try {
      const res = await api.coding.submitCode({
        student_id: user?.id || 'candidate',
        problem_id: problem.id,
        language: selectedLang,
        code
      });

      setSubmissionResult(res);

      if (res.evaluation?.status === 'Accepted') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        setProblem(prev => prev ? { ...prev, solved: true } : null);
      }

      // Refresh submissions
      if (user?.id) {
        const subs = await api.coding.getSubmissions(user.id, { problem_id: problem.id });
        setUserSubmissions(subs);
      }
    } catch (err: any) {
      setSubmissionResult({
        evaluation: {
          status: 'Error',
          passed_test_cases: 0,
          total_test_cases: problem.test_cases.length,
          error: err.message
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-[#181525] flex items-center justify-center text-slate-300 text-xs">
        Preparing coding workspace & sandbox runtime...
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="h-screen w-screen bg-[#181525] flex flex-col items-center justify-center text-slate-300 p-6 space-y-4">
        <p className="text-sm text-rose-400 font-semibold">{error || 'Problem not found'}</p>
        <Link
          to="/student/coding"
          className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold"
        >
          Back to Problem Topics
        </Link>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0F0E17] text-slate-200 overflow-hidden select-none font-sans">
      {/* Top IDE Header Bar */}
      <header className="h-12 border-b border-purple-900/30 bg-[#161426] px-4 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <Link
            to={problem.topic_id ? `/student/coding/topic/${problem.topic_id}` : '/student/coding'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-purple-950/60 transition-colors"
            title="Back to Topic"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-xs sm:text-sm">
              {problem.problem_number ? `#${problem.problem_number} ` : ''}{problem.title}
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                problem.difficulty === 'easy'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : problem.difficulty === 'medium'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}
            >
              {problem.difficulty}
            </span>
            {problem.solved && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Solved
              </span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {problem.leetcode_url && (
            <a
              href={problem.leetcode_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 rounded-lg border border-purple-500/30 text-purple-300 hover:text-white hover:bg-purple-900/30 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <span>LeetCode</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}

          {/* Language Selector */}
          <select
            value={selectedLang}
            onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguage)}
            className="bg-[#211E38] border border-purple-500/30 text-slate-200 text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            {(Object.keys(LANGUAGE_CONFIG) as SupportedLanguage[]).map((lang) => (
              <option key={lang} value={lang} className="bg-[#181525]">
                {LANGUAGE_CONFIG[lang].label}
              </option>
            ))}
          </select>

          <button
            onClick={handleResetCode}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-purple-950/60 transition-colors"
            title="Reset to starter template"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Run Code Button */}
          <button
            onClick={handleRunCode}
            disabled={isRunning || isSubmitting}
            className="px-3.5 py-1.5 rounded-lg bg-[#272344] hover:bg-[#342F5B] text-slate-100 text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50 border border-purple-500/30"
          >
            <Play className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>

          {/* Submit Button */}
          <button
            onClick={handleSubmitCode}
            disabled={isSubmitting || isRunning}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Evaluating...' : 'Submit'}</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Layout (Two-Column Desktop) */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* LEFT PANE: Problem Description & Test Details */}
        <div className="w-full md:w-[45%] lg:w-[40%] border-r border-purple-900/30 flex flex-col bg-[#141224] overflow-hidden">
          {/* Sub-nav tabs */}
          <div className="flex items-center gap-1 px-4 border-b border-purple-900/30 bg-[#17152A] text-xs font-semibold">
            <button
              onClick={() => setActiveTab('description')}
              className={`py-2.5 px-3 border-b-2 transition-all ${
                activeTab === 'description'
                  ? 'border-purple-500 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('hints')}
              className={`py-2.5 px-3 border-b-2 transition-all flex items-center gap-1 ${
                activeTab === 'hints'
                  ? 'border-purple-500 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Hints</span>
              {problem.hints && problem.hints.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-purple-900/60 text-[10px] flex items-center justify-center text-purple-300">
                  {problem.hints.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              className={`py-2.5 px-3 border-b-2 transition-all flex items-center gap-1 ${
                activeTab === 'submissions'
                  ? 'border-purple-500 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Submissions</span>
              {userSubmissions.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-purple-900/60 text-[10px] flex items-center justify-center text-purple-300">
                  {userSubmissions.length}
                </span>
              )}
            </button>
          </div>

          {/* Left Content Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 select-text text-xs sm:text-sm text-slate-300 leading-relaxed custom-scrollbar">
            {activeTab === 'description' && (
              <>
                <div className="space-y-3">
                  <div className="whitespace-pre-line text-slate-200">
                    {problem.description}
                  </div>
                </div>

                {/* Examples */}
                {problem.examples && problem.examples.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Examples</h3>
                    {problem.examples.map((ex, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-[#1D1A33] border border-purple-900/40 space-y-1.5 font-mono text-xs">
                        <div className="text-slate-400">
                          <span className="text-purple-300 font-bold">Input:</span> {ex.input}
                        </div>
                        <div className="text-slate-400">
                          <span className="text-purple-300 font-bold">Output:</span> {ex.output}
                        </div>
                        {ex.explanation && (
                          <div className="text-slate-400 font-sans text-[11px] pt-1 border-t border-purple-900/30">
                            <span className="text-slate-500 font-medium">Explanation:</span> {ex.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Constraints */}
                {problem.constraints && problem.constraints.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Constraints</h3>
                    <ul className="list-disc list-inside space-y-1 font-mono text-xs text-slate-400 bg-[#19172C] p-3.5 rounded-xl border border-purple-900/30">
                      {problem.constraints.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}

            {activeTab === 'hints' && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Algorithmic Hints</h3>
                {problem.hints && problem.hints.length > 0 ? (
                  problem.hints.map((hint, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-[#1D1A33] border border-purple-900/40 space-y-1 text-xs">
                      <span className="font-bold text-purple-300">Hint {idx + 1}:</span>
                      <p className="text-slate-300">{hint}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-xs">No hints configured for this problem yet.</p>
                )}
              </div>
            )}

            {activeTab === 'submissions' && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Your Past Submissions</h3>
                {userSubmissions.length === 0 ? (
                  <p className="text-slate-500 text-xs">No previous submissions for this problem.</p>
                ) : (
                  <div className="space-y-2">
                    {userSubmissions.map((sub) => (
                      <div key={sub.id} className="p-3 rounded-xl bg-[#1D1A33] border border-purple-900/30 flex items-center justify-between text-xs">
                        <div>
                          <span
                            className={`font-bold uppercase tracking-wider ${
                              sub.status === 'Accepted' ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {sub.status}
                          </span>
                          <span className="text-[11px] text-slate-400 ml-2 font-mono">
                            {sub.language} • {sub.passed_test_cases}/{sub.total_test_cases} tests
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(sub.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANE: Monaco Editor + Bottom Console / Test Results */}
        <div className="flex-1 flex flex-col bg-[#0F0E17] overflow-hidden">
          {/* Top Editor Area */}
          <div className="flex-1 relative overflow-hidden">
            <Editor
              height="100%"
              language={LANGUAGE_CONFIG[selectedLang].monacoLang}
              value={code}
              onChange={handleCodeChange}
              theme="vs-dark"
              options={{
                fontSize: 13,
                fontFamily: "'Fira Code', 'Consolas', 'Courier New', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                tabSize: 4,
                automaticLayout: true,
                padding: { top: 12, bottom: 12 }
              }}
            />
          </div>

          {/* BOTTOM PANE: Test Cases, Console Output & Submissions */}
          <div className="h-64 border-t border-purple-900/30 bg-[#161427] flex flex-col shrink-0">
            {/* Bottom Nav Bar */}
            <div className="flex items-center justify-between px-4 border-b border-purple-900/30 bg-[#19172E] text-xs">
              <div className="flex items-center gap-1 font-semibold">
                <button
                  onClick={() => setBottomTab('testcases')}
                  className={`py-2 px-3 border-b-2 transition-all ${
                    bottomTab === 'testcases'
                      ? 'border-purple-500 text-white'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Test Cases
                </button>
                <button
                  onClick={() => setBottomTab('result')}
                  className={`py-2 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
                    bottomTab === 'result'
                      ? 'border-purple-500 text-white'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>Test Results</span>
                  {runResult && (
                    <span
                      className={`w-2 h-2 rounded-full ${
                        runResult.exitCode === 0 ? 'bg-emerald-400' : 'bg-rose-400'
                      }`}
                    />
                  )}
                  {submissionResult && (
                    <span
                      className={`w-2 h-2 rounded-full ${
                        submissionResult.evaluation?.status === 'Accepted' ? 'bg-emerald-400' : 'bg-rose-400'
                      }`}
                    />
                  )}
                </button>
                <button
                  onClick={() => setBottomTab('console')}
                  className={`py-2 px-3 border-b-2 transition-all ${
                    bottomTab === 'console'
                      ? 'border-purple-500 text-white'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Console Output
                </button>
              </div>
            </div>

            {/* Bottom Body */}
            <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-slate-300 custom-scrollbar">
              {bottomTab === 'testcases' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {problem.test_cases.map((tc, idx) => (
                      <button
                        key={tc.id || idx}
                        onClick={() => setActiveTestCaseIdx(idx)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                          activeTestCaseIdx === idx
                            ? 'bg-purple-700 text-white shadow-xs'
                            : 'bg-[#221F3A] text-slate-400 hover:bg-[#2A2649]'
                        }`}
                      >
                        Case {idx + 1}
                      </button>
                    ))}
                  </div>

                  {problem.test_cases[activeTestCaseIdx] && (
                    <div className="space-y-2">
                      <div>
                        <span className="text-slate-500 block text-[11px]">Input:</span>
                        <div className="p-2.5 rounded-lg bg-[#0F0E17] border border-purple-900/30 text-purple-200 mt-1 select-text">
                          {problem.test_cases[activeTestCaseIdx].input}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Expected Output:</span>
                        <div className="p-2.5 rounded-lg bg-[#0F0E17] border border-purple-900/30 text-emerald-300 mt-1 select-text">
                          {problem.test_cases[activeTestCaseIdx].expected_output}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {bottomTab === 'result' && (
                <div className="space-y-3">
                  {/* Submission Evaluation View */}
                  {submissionResult ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-base font-black ${
                            submissionResult.evaluation?.status === 'Accepted'
                              ? 'text-emerald-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {submissionResult.evaluation?.status || 'Evaluated'}
                        </span>
                        <span className="text-xs text-slate-400">
                          {submissionResult.evaluation?.passed_test_cases} /{' '}
                          {submissionResult.evaluation?.total_test_cases} test cases passed
                        </span>
                      </div>

                      {submissionResult.evaluation?.test_case_results && (
                        <div className="space-y-2">
                          {submissionResult.evaluation.test_case_results.map((r: any, i: number) => (
                            <div
                              key={i}
                              className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                                r.passed
                                  ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300'
                                  : 'bg-rose-950/20 border-rose-900/40 text-rose-300'
                              }`}
                            >
                              <span>Test Case {i + 1} {r.is_hidden ? '(Hidden)' : ''}</span>
                              <span className="font-bold">{r.passed ? '✓ Passed' : '✗ Failed'}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : runResult ? (
                    /* Sample Run Result View */
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold text-sm ${
                            runResult.exitCode === 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {runResult.exitCode === 0 ? 'Execution Succeeded' : 'Execution Failed'}
                        </span>
                        <span className="text-slate-500 text-[11px]">
                          ({runResult.executionTimeMs || 0}ms)
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Standard Output:</span>
                        <pre className="p-2.5 rounded-lg bg-[#0F0E17] border border-purple-900/30 text-purple-200 whitespace-pre-wrap select-text mt-1">
                          {runResult.stdout || '(No output produced)'}
                        </pre>
                      </div>
                      {runResult.stderr && (
                        <div>
                          <span className="text-rose-400 block text-[11px]">Standard Error / Traceback:</span>
                          <pre className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-900/40 text-rose-300 whitespace-pre-wrap select-text mt-1">
                            {runResult.stderr}
                          </pre>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-slate-500">Click &quot;Run Code&quot; or &quot;Submit&quot; to test your solution.</p>
                  )}
                </div>
              )}

              {bottomTab === 'console' && (
                <div className="space-y-2 select-text">
                  <span className="text-slate-500 block text-[11px]">Console Log Stream:</span>
                  <pre className="p-3 rounded-lg bg-[#0F0E17] border border-purple-900/30 text-slate-300 font-mono text-xs whitespace-pre-wrap">
                    {runResult?.output || submissionResult?.evaluation?.output || '(Console is clear)'}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
