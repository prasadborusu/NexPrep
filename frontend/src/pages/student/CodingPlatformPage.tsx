import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { CodingProblem, CodeSubmission } from '../../types';
import Editor from '@monaco-editor/react';
import confetti from 'canvas-confetti';
import {
  Code2,
  Play,
  Send,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  History,
  Terminal,
  FileCode,
  Tag,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const CodingPlatformPage: React.FC = () => {
  const { user } = useAuth();

  const [problems, setProblems] = useState<CodingProblem[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<CodingProblem | null>(null);
  const [language, setLanguage] = useState<'python' | 'javascript' | 'java' | 'cpp'>('python');
  const [code, setCode] = useState<string>('');
  const [customInput, setCustomInput] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'problem' | 'submissions'>('problem');
  const [outputTab, setOutputTab] = useState<'testcases' | 'console'>('testcases');

  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [runResult, setRunResult] = useState<any>(null);
  const [submitEvaluation, setSubmitEvaluation] = useState<any>(null);
  const [submissionsHistory, setSubmissionsHistory] = useState<CodeSubmission[]>([]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const list = await api.coding.listProblems();
        setProblems(list);
        if (list.length > 0) {
          selectProblem(list[0]);
        }
      } catch (err) {
        console.error('Failed to load coding problems:', err);
      }
    };
    fetchProblems();
  }, []);

  const selectProblem = (prob: CodingProblem) => {
    setSelectedProblem(prob);
    const starter = prob.starter_code?.[language] || prob.starter_code?.python || '# Write solution\n';
    setCode(starter);
    setRunResult(null);
    setSubmitEvaluation(null);
    if (prob.examples?.[0]?.input) {
      setCustomInput(prob.examples[0].input);
    }
    loadSubmissions(prob.id);
  };

  const loadSubmissions = async (probId: string) => {
    if (!user) return;
    try {
      const history = await api.coding.getSubmissions(user.id);
      setSubmissionsHistory(history.filter(h => h.problem_id === probId));
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  };

  const handleLanguageChange = (newLang: 'python' | 'javascript' | 'java' | 'cpp') => {
    setLanguage(newLang);
    if (selectedProblem) {
      setCode(selectedProblem.starter_code?.[newLang] || '# Write solution in ' + newLang + '\n');
    }
  };

  const handleResetCode = () => {
    if (selectedProblem) {
      setCode(selectedProblem.starter_code?.[language] || '');
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutputTab('console');
    setRunResult(null);
    try {
      const stdin = customInput || selectedProblem?.test_cases?.[0]?.input || '';
      const res = await api.coding.runCode(language, code, stdin);
      setRunResult(res);
    } catch (err: any) {
      setRunResult({ stderr: err.message || 'Execution failed' });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!selectedProblem || !user) return;
    setIsSubmitting(true);
    setOutputTab('testcases');
    setSubmitEvaluation(null);
    try {
      const res = await api.coding.submitCode({
        student_id: user.id,
        problem_id: selectedProblem.id,
        language,
        code
      });
      setSubmitEvaluation(res.evaluation);
      loadSubmissions(selectedProblem.id);

      if (res.evaluation.status === 'Accepted') {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    } catch (err: any) {
      alert('Submission error: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-[#FBFAFF]">
      {/* Top Problem Navigation & Actions Bar */}
      <div className="h-14 bg-white border-b border-purple-100 px-6 flex items-center justify-between shadow-xs sticky top-16 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <Code2 className="w-4 h-4" />
          </div>

          <select
            value={selectedProblem?.id || ''}
            onChange={(e) => {
              const p = problems.find(prob => prob.id === e.target.value);
              if (p) selectProblem(p);
            }}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-[#FBFAFF] focus:outline-none focus:border-purple-600 max-w-xs"
          >
            {problems.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.difficulty.toUpperCase()})
              </option>
            ))}
          </select>

          {selectedProblem && (
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
              selectedProblem.difficulty === 'easy' ? 'bg-emerald-100 text-emerald-800' :
              selectedProblem.difficulty === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {selectedProblem.difficulty}
            </span>
          )}
        </div>

        {/* Compiler Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500">Language:</span>
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-purple-900 bg-purple-50/70 focus:outline-none focus:border-purple-600"
            >
              <option value="python">Python 3.10</option>
              <option value="javascript">JavaScript (Node.js 18)</option>
              <option value="java">Java 15</option>
              <option value="cpp">C++ 10</option>
            </select>
          </div>

          <button
            onClick={handleResetCode}
            title="Reset Starter Code"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleRunCode}
            disabled={isRunning || isSubmitting}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            {isRunning ? 'Running...' : 'Run Code'}
          </button>

          <button
            onClick={handleSubmitCode}
            disabled={isRunning || isSubmitting}
            className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            {isSubmitting ? 'Evaluating...' : 'Submit'}
          </button>
        </div>
      </div>

      {/* 2-Column Split: Problem Description vs Editor */}
      <div className="flex-1 grid lg:grid-cols-12 overflow-hidden">
        {/* Left Column (5/12): Problem Description & History */}
        <div className="lg:col-span-5 bg-white border-r border-purple-100 flex flex-col h-[calc(100vh-7.5rem)] overflow-y-auto">
          {/* Tabs */}
          <div className="flex border-b border-slate-100 px-6 pt-3 gap-6 bg-[#FBFAFF]/60 text-xs font-semibold text-slate-500">
            <button
              onClick={() => setActiveTab('problem')}
              className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'problem' ? 'border-purple-700 text-purple-900 font-bold' : 'border-transparent hover:text-slate-800'
              }`}
            >
              <FileCode className="w-4 h-4" />
              Description
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'submissions' ? 'border-purple-700 text-purple-900 font-bold' : 'border-transparent hover:text-slate-800'
              }`}
            >
              <History className="w-4 h-4" />
              Submissions ({submissionsHistory.length})
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 space-y-5 flex-1">
            {activeTab === 'problem' && selectedProblem && (
              <>
                <div className="space-y-1">
                  <h2 className="text-xl font-black text-slate-900">{selectedProblem.title}</h2>
                  <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                    <span>Category: {selectedProblem.category}</span>
                    <span>•</span>
                    <span>Acceptance: {selectedProblem.acceptance_rate}%</span>
                  </div>
                </div>

                <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                  {selectedProblem.description}
                </div>

                {/* Examples */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Examples:</h4>
                  {selectedProblem.examples.map((ex, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100 text-xs font-mono space-y-1">
                      <p><span className="text-purple-700 font-bold">Input:</span> {ex.input}</p>
                      <p><span className="text-emerald-700 font-bold">Output:</span> {ex.output}</p>
                      {ex.explanation && <p className="text-slate-500 font-sans text-[11px] pt-1">{ex.explanation}</p>}
                    </div>
                  ))}
                </div>

                {/* Constraints */}
                {selectedProblem.constraints?.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Constraints:</h4>
                    <ul className="list-disc list-inside text-xs font-mono text-slate-600 space-y-1">
                      {selectedProblem.constraints.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}

            {activeTab === 'submissions' && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Your Submission History</h3>
                {submissionsHistory.length === 0 ? (
                  <p className="text-xs text-slate-400">No submissions yet for this problem. Click "Submit" to test your code!</p>
                ) : (
                  submissionsHistory.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-[#FBFAFF] flex items-center justify-between text-xs"
                    >
                      <div className="space-y-1">
                        <span className={`font-bold ${
                          sub.status === 'Accepted' ? 'text-emerald-600' : 'text-rose-600'
                        }`}>
                          {sub.status}
                        </span>
                        <div className="text-[11px] text-slate-400">
                          {sub.passed_test_cases}/{sub.total_test_cases} Test cases passed • {sub.language}
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(sub.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (7/12): Monaco Editor & Output Sandbox */}
        <div className="lg:col-span-7 flex flex-col h-[calc(100vh-7.5rem)]">
          {/* Monaco Editor Container */}
          <div className="flex-1 bg-slate-950">
            <Editor
              height="100%"
              language={language === 'cpp' ? 'cpp' : language}
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val || '')}
              options={{
                fontSize: 13,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                roundedSelection: true,
                padding: { top: 12, bottom: 12 }
              }}
            />
          </div>

          {/* Bottom Execution Drawer */}
          <div className="h-64 bg-white border-t border-slate-200 flex flex-col shadow-soft">
            <div className="flex items-center justify-between px-6 py-2 border-b border-slate-100 bg-[#FBFAFF]">
              <div className="flex gap-4 text-xs font-bold">
                <button
                  onClick={() => setOutputTab('testcases')}
                  className={`py-1 transition-all ${
                    outputTab === 'testcases' ? 'text-purple-700 border-b-2 border-purple-700' : 'text-slate-500'
                  }`}
                >
                  Test Results
                </button>
                <button
                  onClick={() => setOutputTab('console')}
                  className={`py-1 transition-all ${
                    outputTab === 'console' ? 'text-purple-700 border-b-2 border-purple-700' : 'text-slate-500'
                  }`}
                >
                  Run Console
                </button>
              </div>

              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5" />
                Piston Sandboxed Execution
              </span>
            </div>

            <div className="p-4 flex-1 overflow-y-auto font-mono text-xs">
              {outputTab === 'testcases' && (
                <div>
                  {submitEvaluation ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-bold ${
                          submitEvaluation.status === 'Accepted' ? 'text-emerald-600' : 'text-rose-600'
                        }`}>
                          {submitEvaluation.status === 'Accepted' ? '✓ Accepted — All Tests Passed!' : `✗ ${submitEvaluation.status}`}
                        </span>
                        <span className="text-xs text-slate-500">
                          Passed: {submitEvaluation.passed_test_cases} / {submitEvaluation.total_test_cases} cases
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {submitEvaluation.test_case_results?.map((tc: any, i: number) => (
                          <div
                            key={i}
                            className={`p-2.5 rounded-xl border text-[11px] ${
                              tc.passed ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
                            }`}
                          >
                            <div className="flex items-center justify-between font-bold">
                              <span>Test Case {i + 1}</span>
                              <span>{tc.passed ? 'Passed' : 'Failed'}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 truncate mt-1">
                              {tc.is_hidden ? 'Hidden Case' : `Input: ${tc.input}`}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-400 text-center py-8">
                      Click <strong className="text-slate-600">"Submit"</strong> to run against all public and hidden test suites.
                    </div>
                  )}
                </div>
              )}

              {outputTab === 'console' && (
                <div>
                  {runResult ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-slate-400 text-[11px]">
                        <span>Exit Code: {runResult.exitCode}</span>
                        <span>Execution Time: {runResult.executionTimeMs}ms</span>
                      </div>
                      <div className="p-3 bg-slate-900 rounded-xl text-slate-200 whitespace-pre-wrap">
                        {runResult.output || runResult.stdout || runResult.stderr || 'No console output.'}
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-400 text-center py-8">
                      Click <strong className="text-slate-600">"Run Code"</strong> to test custom stdin input against your function.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
