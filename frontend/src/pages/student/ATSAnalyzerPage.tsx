import React, { useState } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { ATSAnalysisResult } from '../../types';
import {
  ScanSearch,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileCode,
  Layers,
  HelpCircle
} from 'lucide-react';

export const ATSAnalyzerPage: React.FC = () => {
  const { user } = useAuth();

  const [inputMode, setInputMode] = useState<'text' | 'file'>('text');
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [targetRole, setTargetRole] = useState(user?.target_role || 'Full Stack Engineer');
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ATSAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMode === 'text' && !resumeText.trim()) {
      setError('Please paste your resume text to begin analysis.');
      return;
    }
    if (inputMode === 'file' && !file) {
      setError('Please upload a resume file (PDF or TXT) to begin analysis.');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please provide the target job description to match against.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    try {
      if (inputMode === 'file' && file) {
        const formData = new FormData();
        formData.append('resume_file', file);
        formData.append('job_description', jobDescription);
        formData.append('target_role', targetRole);
        formData.append('student_id', user?.id || '');
        const res = await api.ats.analyze(formData);
        setAnalysis(res);
      } else {
        const res = await api.ats.analyzeText({
          resume_text: resumeText,
          job_description: jobDescription,
          target_role: targetRole,
          student_id: user?.id || ''
        });
        setAnalysis(res);
      }
    } catch (err: any) {
      setError(err.message || 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-100">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">ATS Resume Intelligence</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200">
              Deterministic Parser
            </span>
          </div>
          <p className="text-xs text-slate-500">Benchmark your resume against live employer job descriptions with zero synthetic numbers</p>
        </div>
      </div>

      {/* Main Grid: Form Inputs vs Analysis Scorecard */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (5/12): Inputs */}
        <form onSubmit={handleAnalyze} className="lg:col-span-5 space-y-5">
          {/* Target Role Selector */}
          <div className="bg-white rounded-2xl p-5 border border-purple-100/80 shadow-soft space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Target Role Benchmark</label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:border-purple-600 focus:outline-none"
            >
              <option value="Python Developer">Python Developer</option>
              <option value="Full Stack Engineer">Full Stack Engineer</option>
              <option value="Frontend Specialist">Frontend Specialist</option>
              <option value="Backend Engineer">Backend Engineer</option>
              <option value="Software Development Engineer">Software Development Engineer</option>
              <option value="Data Engineer">Data Engineer</option>
            </select>
          </div>

          {/* Resume Input Area */}
          <div className="bg-white rounded-2xl p-5 border border-purple-100/80 shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Candidate Resume</span>
              <div className="flex gap-1 text-[11px] bg-slate-100 p-0.5 rounded-lg">
                <button
                  type="button"
                  onClick={() => setInputMode('text')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    inputMode === 'text' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Paste Text
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('file')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    inputMode === 'file' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Upload PDF / TXT
                </button>
              </div>
            </div>

            {inputMode === 'text' ? (
              <textarea
                rows={10}
                required
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste the full text of your resume here..."
                className="w-full p-3 rounded-xl border border-slate-200 text-xs font-mono leading-relaxed focus:border-purple-600 focus:outline-none"
              />
            ) : (
              <div className="p-8 border-2 border-dashed border-purple-200 rounded-xl bg-purple-50/40 text-center space-y-2">
                <UploadCloud className="w-8 h-8 text-purple-600 mx-auto" />
                <p className="text-xs font-bold text-slate-800">
                  {file ? file.name : 'Select or drop your PDF resume'}
                </p>
                <p className="text-[10px] text-slate-500">Standard PDF or TXT up to 5MB</p>
                <input
                  type="file"
                  accept=".pdf,.txt"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="resumeUpload"
                />
                <label
                  htmlFor="resumeUpload"
                  className="inline-block px-4 py-1.5 rounded-xl bg-purple-700 text-white text-xs font-semibold cursor-pointer hover:bg-purple-800"
                >
                  Browse Files
                </label>
              </div>
            )}
          </div>

          {/* Job Description Input Area */}
          <div className="bg-white rounded-2xl p-5 border border-purple-100/80 shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Target Job Description</span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setTargetRole('Python Developer');
                    setJobDescription(
                      'We are looking for a Python Developer proficient in Python 3, Django or FastAPI, PostgreSQL, and Git. Experience building RESTful APIs, writing unit tests, and working with Docker or containerized microservices is required. Knowledge of Redis caching and Data Structures is a plus.'
                    );
                  }}
                  className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors"
                >
                  + Python JD
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTargetRole('Full Stack Engineer');
                    setJobDescription(
                      'Seeking a Full Stack Engineer experienced with React, TypeScript, Node.js, and SQL/PostgreSQL. Must understand REST APIs, Git workflows, Docker containers, state management, and modern CI/CD pipelines.'
                    );
                  }}
                  className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
                >
                  + Full Stack JD
                </button>
              </div>
            </div>
            <textarea
              rows={6}
              required
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the requirements section of the job posting or click a sample preset above..."
              className="w-full p-3 rounded-xl border border-slate-200 text-xs leading-relaxed focus:border-purple-600 focus:outline-none"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isAnalyzing}
            className="w-full py-3 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <ScanSearch className="w-4 h-4" />
            {isAnalyzing ? 'Extracting Keywords & Auditing Structure...' : 'Analyze ATS Compatibility'}
          </button>
        </form>

        {/* Right Column (7/12): ATS Results Scorecard */}
        <div className="lg:col-span-7 space-y-6">
          {analysis ? (
            <div className="space-y-6 animate-in fade-in">
              {/* Overall Score Header Banner */}
              <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-100 text-purple-700">
                    ATS Audit Report
                  </span>
                  <h3 className="text-xl font-black text-slate-900">Overall Match Quality</h3>
                  <p className="text-xs text-slate-500">Evaluated against {analysis.target_role} requirements</p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <span className="text-4xl font-black text-purple-700">{analysis.overall_score}</span>
                    <span className="text-slate-400 font-bold text-sm"> / 100</span>
                    <p className={`text-[11px] font-bold ${
                      analysis.overall_score >= 80 ? 'text-emerald-600' :
                      analysis.overall_score >= 60 ? 'text-amber-600' : 'text-rose-600'
                    }`}>
                      {analysis.overall_score >= 80 ? 'High ATS Match' : analysis.overall_score >= 60 ? 'Moderate Fit' : 'Requires Optimization'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Breakdown Bars */}
              <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-soft space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Detailed Metric Breakdown</h4>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Keyword Match Score (45% weight)</span>
                      <span className="text-purple-700 font-bold">{analysis.breakdown.keyword_match_score}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-600 h-full rounded-full" style={{ width: `${analysis.breakdown.keyword_match_score}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Formatting & Readability (25% weight)</span>
                      <span className="text-purple-700 font-bold">{analysis.breakdown.formatting_score}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${analysis.breakdown.formatting_score}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Standard Section Structure (20% weight)</span>
                      <span className="text-purple-700 font-bold">{analysis.breakdown.structure_score}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: `${analysis.breakdown.structure_score}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Impact Metrics & Quantifiable Proof (10% weight)</span>
                      <span className="text-purple-700 font-bold">{analysis.breakdown.impact_metrics_score}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-pink-600 h-full rounded-full" style={{ width: `${analysis.breakdown.impact_metrics_score}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Matched vs Missing Keywords Chips */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-soft space-y-2.5">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Matched Keywords ({analysis.matched_keywords.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {analysis.matched_keywords.map((kw, i) => (
                      <span key={i} className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-soft space-y-2.5">
                  <span className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    Missing Required Skills ({analysis.missing_skills.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {analysis.missing_skills.length === 0 ? (
                      <span className="text-xs text-slate-400">All required skills detected!</span>
                    ) : (
                      analysis.missing_skills.map((kw, i) => (
                        <span key={i} className="px-2.5 py-0.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold">
                          {kw}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Formatting & Structure Audit */}
              <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-soft space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Formatting & Structure Diagnostics</h4>
                <div className="space-y-2">
                  {analysis.formatting_feedback.map((f, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs">
                      {f.type === 'pass' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
                      {f.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
                      {f.type === 'fail' && <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
                      <span className="text-slate-600">{f.message}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable Recommendations */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50/40 rounded-2xl p-6 border border-purple-100 shadow-soft space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-pink-600" />
                  Actionable Steps to Reach 95%+ ATS Score
                </h4>
                <ul className="space-y-2 text-xs text-slate-700">
                  {analysis.actionable_recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <ArrowRight className="w-3.5 h-3.5 text-purple-700 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-purple-100 shadow-soft space-y-3">
              <ScanSearch className="w-12 h-12 text-purple-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">Ready to Analyze</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Paste your resume and target job requirements on the left, then click "Analyze" to see a full ATS parsing scorecard.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
