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
  AlertTriangle,
  KeyRound,
  Lock,
  ArrowRight,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Maximize,
  EyeOff
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

  // Passkey gate state
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return Boolean(id && sessionStorage.getItem(`passkey_unlocked_${id}`) === 'true');
  });
  const [gatePasskey, setGatePasskey] = useState('');
  const [gateError, setGateError] = useState<string | null>(null);
  const [isVerifyingGate, setIsVerifyingGate] = useState(false);

  // Strict Proctoring Anti-Cheat States
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [violationsCount, setViolationsCount] = useState(0);
  const [showViolationModal, setShowViolationModal] = useState(false);
  const [lastViolationReason, setLastViolationReason] = useState('');
  const [securityToast, setSecurityToast] = useState<string | null>(null);

  const timerRef = useRef<any>(null);
  const toastTimeoutRef = useRef<any>(null);
  const lastViolationTimeRef = useRef<number>(0);

  const triggerSecurityToast = (msg: string) => {
    setSecurityToast(msg);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setSecurityToast(null);
    }, 3200);
  };

  const requestFullScreen = async () => {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if ((elem as any).webkitRequestFullscreen) {
        await (elem as any).webkitRequestFullscreen();
      }
      setIsFullscreen(true);
    } catch (err) {
      console.warn('Fullscreen request blocked or dismissed:', err);
    }
  };

  const recordViolation = (reason: string) => {
    if (!isUnlocked || isSubmitting) return;
    const now = Date.now();
    if (now - lastViolationTimeRef.current < 2500) return; // Debounce rapid events
    lastViolationTimeRef.current = now;

    setViolationsCount((prev) => {
      const nextCount = prev + 1;
      setLastViolationReason(reason);
      setShowViolationModal(true);

      // Auto-submit on 3rd violation
      if (nextCount >= 3) {
        setTimeout(() => {
          handleFinalSubmit(3);
        }, 1600);
      }
      return nextCount;
    });
  };

  useEffect(() => {
    if (!id) return;
    const fetchExam = async () => {
      try {
        const data = await api.assessments.get(id);
        setAssessment(data.assessment);
        setQuestions(data.questions);
        setTimeLeft(data.assessment.duration_minutes * 60);

        // Auto-unlock if session already authorized or exam requires no passkey
        const isSessionUnlocked = sessionStorage.getItem(`passkey_unlocked_${id}`) === 'true';
        if (isSessionUnlocked || (!data.assessment.requires_passkey && !data.assessment.passkey)) {
          setIsUnlocked(true);
        }

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

  // Countdown Timer - only ticks once unlocked
  useEffect(() => {
    if (!isUnlocked) return;
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
  }, [timeLeft, isUnlocked]);

  // Strict Anti-Cheating & Proctoring Event Listeners
  useEffect(() => {
    if (!isUnlocked || isSubmitting) return;

    // 1. Fullscreen change listener
    const handleFullscreenChange = () => {
      const isFull = Boolean(document.fullscreenElement || (document as any).webkitFullscreenElement);
      setIsFullscreen(isFull);
      if (!isFull && !isSubmitting) {
        recordViolation('Exited fullscreen mode. Proctored examination requires active full-screen display.');
      }
    };

    // 2. Tab switch / screen shift (visibilitychange)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && !isSubmitting) {
        recordViolation('Screen shift or tab switch detected. Leaving the examination window is strictly prohibited.');
      }
    };

    // 3. Window blur (focus lost)
    const handleWindowBlur = () => {
      if (!isSubmitting) {
        recordViolation('Examination window lost focus. Accessing external applications is restricted.');
      }
    };

    // 4. Clipboard events (Copy / Cut / Paste)
    const handleClipboard = (e: ClipboardEvent) => {
      e.preventDefault();
      triggerSecurityToast('Security Restriction: Copy, cut, and paste actions are disabled during proctored exams.');
    };

    // 5. Right Click contextmenu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      triggerSecurityToast('Right-click context menu is disabled.');
    };

    // 6. Keyboard Shortcuts prevention
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        e.key === 'PrintScreen' ||
        (e.ctrlKey && (e.key === 'c' || e.key === 'C' || e.key === 'v' || e.key === 'V' || e.key === 'x' || e.key === 'X' || e.key === 'u' || e.key === 'U' || e.key === 'p' || e.key === 'P' || e.key === 's' || e.key === 'S')) ||
        (e.ctrlKey && e.shiftKey && (e.key === 'i' || e.key === 'I' || e.key === 'j' || e.key === 'J' || e.key === 'c' || e.key === 'C'))
      ) {
        e.preventDefault();
        triggerSecurityToast('Proctoring Notice: Keyboard shortcut disabled.');
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('copy', handleClipboard);
    document.addEventListener('cut', handleClipboard);
    document.addEventListener('paste', handleClipboard);
    document.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);

    // Initial enter fullscreen attempt
    requestFullScreen();

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('copy', handleClipboard);
      document.removeEventListener('cut', handleClipboard);
      document.removeEventListener('paste', handleClipboard);
      document.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isUnlocked, isSubmitting]);

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

  const handleFinalSubmit = async (forcedViolations?: number) => {
    if (!id || !user) return;
    setIsSubmitting(true);
    try {
      await api.assessments.submit(id, {
        student_id: user.id,
        answers,
        is_final_submit: true,
        proctor_violations: forcedViolations !== undefined ? forcedViolations : violationsCount
      } as any);

      // Exit fullscreen mode upon submitting
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }

      navigate(`/student/assessments/${id}/result`);
    } catch (err) {
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyGatePasskey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    const trimmed = gatePasskey.trim();
    if (!trimmed) {
      setGateError('Please enter the 4-digit passkey provided by your administrator.');
      return;
    }
    if (trimmed.length !== 4 || !/^\d{4}$/.test(trimmed)) {
      setGateError('Passkey must be a 4-digit PIN (e.g. 8492).');
      return;
    }
    setIsVerifyingGate(true);
    setGateError(null);
    try {
      const res = await api.assessments.verifyPasskey(id, trimmed);
      if (res.success) {
        sessionStorage.setItem(`passkey_unlocked_${id}`, 'true');
        setIsUnlocked(true);
        requestFullScreen();
      } else {
        setGateError('Invalid 4-digit passkey PIN. Please check with your administrator.');
      }
    } catch (err: any) {
      setGateError(err.message || 'Invalid 4-digit passkey PIN. Please check with your administrator.');
    } finally {
      setIsVerifyingGate(false);
    }
  };

  if (!assessment || questions.length === 0) {
    return <div className="p-12 text-center text-xs text-slate-500">Preparing assessment workstation...</div>;
  }

  // Proctored Passkey Gate (locks timer & questions until verified)
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#FBFAFF] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-7 border border-purple-100 shadow-soft-lg space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-6 h-6" />
          </div>

          <div className="text-center space-y-1.5">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Proctored Verification Gate</h2>
            <p className="text-xs text-slate-500">Official technical screening passkey required to start</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-xs">
            <div className="font-bold text-slate-800">{assessment.title}</div>
            <div className="text-slate-500 flex items-center gap-4 text-[11px]">
              <span>⏱ {assessment.duration_minutes} Mins</span>
              <span>🎯 Pass: {assessment.pass_percentage}%</span>
              <span>📝 {questions.length} Questions</span>
            </div>
          </div>

          {gateError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{gateError}</span>
            </div>
          )}

          <form onSubmit={handleVerifyGatePasskey} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 text-center">
                Enter 4-Digit Passkey PIN
              </label>
              <div className="relative max-w-[240px] mx-auto">
                <input
                  type="text"
                  required
                  autoFocus
                  maxLength={4}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={gatePasskey}
                  onChange={(e) => setGatePasskey(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="••••"
                  className="w-full py-3 px-4 rounded-xl border-2 border-purple-200 text-center text-2xl font-mono tracking-[0.6em] font-bold text-purple-950 placeholder:text-slate-300 focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all bg-purple-50/20"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-2 text-center">
                Obtain your 4-digit examination PIN from your proctor or university administrator.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => navigate('/student/assessments')}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Back to Tests
              </button>
              <button
                type="submit"
                disabled={isVerifyingGate}
                className="flex-1 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                {isVerifyingGate ? 'Verifying...' : 'Unlock & Start'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFAFF] flex flex-col select-none">
      {/* Security Toast Notification */}
      {securityToast && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{securityToast}</span>
        </div>
      )}

      {/* Fullscreen Required Warning Banner */}
      {!isFullscreen && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-bold flex items-center justify-between shadow-xs sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Proctoring Alert: Fullscreen mode is required to maintain proctoring integrity.</span>
          </div>
          <button
            onClick={requestFullScreen}
            className="px-3 py-1 rounded-lg bg-slate-950 text-white hover:bg-slate-800 text-[11px] font-bold transition-colors flex items-center gap-1"
          >
            <Maximize className="w-3 h-3" />
            Enter Fullscreen
          </button>
        </div>
      )}

      {/* Top Proctoring Bar */}
      <header className="h-16 px-6 bg-white border-b border-purple-100 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 truncate max-w-sm">{assessment.title}</h2>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-slate-400">Total: {assessment.total_marks} Pts • Pass: {assessment.pass_percentage}%</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-[10px]">
                <ShieldCheck className="w-3 h-3" />
                Proctor Guard Active
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          {/* Proctoring Violations Indicator */}
          <div className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border ${
            violationsCount === 0
              ? 'bg-slate-50 border-slate-200 text-slate-600'
              : violationsCount === 1
              ? 'bg-amber-50 border-amber-200 text-amber-800'
              : 'bg-rose-50 border-rose-200 text-rose-800 animate-pulse'
          }`}>
            <EyeOff className="w-3.5 h-3.5" />
            <span>Screen Shifts: {violationsCount}/3</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{autosaveText}</span>
          </div>

          {/* Countdown Clock */}
          <div className={`px-3 py-1.5 rounded-xl border text-sm font-mono font-bold flex items-center gap-2 ${
            timeLeft < 300
              ? 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse'
              : 'bg-purple-50 border-purple-100 text-purple-900'
          }`}>
            <Clock className="w-4 h-4 text-purple-700" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          {/* Finish & Submit Button */}
          <button
            onClick={() => setShowConfirmModal(true)}
            className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>Finish Test</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Examination Workstation */}
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
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Your Answer</h4>
              <div className="space-y-2.5">
                {currentQ.options.map((opt) => {
                  const isSelected = currentAns?.selected_option_id === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`w-full p-4 rounded-xl text-left border text-sm font-medium transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-purple-600 bg-purple-50/70 text-purple-950 font-bold shadow-xs'
                          : 'border-slate-200 hover:border-purple-200 hover:bg-slate-50/60 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-bold ${
                          isSelected
                            ? 'bg-purple-600 border-purple-600 text-white'
                            : 'bg-white border-slate-200 text-slate-600'
                        }`}>
                          {opt.id.toUpperCase()}
                        </span>
                        <span>{opt.text}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Coding Problem Mode */}
          {currentQ.type === 'coding' && (
            <div className="bg-white rounded-2xl border border-purple-100/80 shadow-soft flex flex-col overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">Code Solution:</span>
                  <select
                    value={currentAns?.language || 'python'}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-600"
                  >
                    {(currentQ.allowed_languages || ['python', 'javascript', 'java', 'cpp']).map((l) => (
                      <option key={l} value={l}>
                        {l.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleRunCodeSample}
                  disabled={isRunningCode}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  {isRunningCode ? 'Evaluating...' : 'Run Code'}
                </button>
              </div>

              <div className="h-96 border-b border-slate-200">
                <Editor
                  height="100%"
                  language={currentAns?.language === 'cpp' ? 'cpp' : currentAns?.language || 'python'}
                  theme="vs-light"
                  value={currentAns?.code_content || ''}
                  onChange={handleCodeChange}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    fontFamily: 'Fira Code, Menlo, monospace',
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true
                  }}
                />
              </div>

              {/* Code Sample Execution Output */}
              {codeOutput && (
                <div className="p-4 bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto">
                  <span className="text-slate-400 block mb-1 font-sans text-[11px] font-bold">Execution Output:</span>
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
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-1 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous Question
            </button>

            <button
              onClick={() => setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1))}
              disabled={currentIdx === questions.length - 1}
              className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1 disabled:opacity-40"
            >
              Next Question
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Question Palette & Proctor Legend */}
        <aside className="w-72 border-l border-purple-100 bg-white p-6 hidden lg:flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Question Palette</h4>
            <div className="grid grid-cols-4 gap-2">
              {questions.map((q, idx) => {
                const ans = answers[q.id];
                const isCurrent = idx === currentIdx;
                const isAnswered = ans && (ans.selected_option_id || (ans.code_content && ans.code_content.length > 30));
                const isReview = ans?.is_marked_for_review;

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`h-10 rounded-xl text-xs font-bold border transition-all flex items-center justify-center relative ${
                      isCurrent
                        ? 'border-2 border-purple-600 bg-purple-50 text-purple-900 shadow-xs'
                        : isReview
                        ? 'bg-amber-100 border-amber-300 text-amber-900'
                        : isAnswered
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {idx + 1}
                    {isReview && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 absolute top-1 right-1"></span>}
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
            Ensure all responses are verified before finalizing. Your test auto-submits when the timer reaches 00:00 or if maximum screen shifts are reached.
          </div>
        </aside>
      </div>

      {/* Proctoring Violation Alert Modal */}
      {showViolationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl p-7 max-w-md w-full border border-rose-200 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-slate-900">
                {violationsCount >= 3 ? 'Assessment Terminated' : 'Proctoring Security Warning'}
              </h3>
              <p className="text-xs font-semibold text-rose-600">
                Violation {violationsCount} of 3 Recorded
              </p>
            </div>

            <div className="p-3.5 bg-rose-50/70 rounded-xl border border-rose-100 text-xs text-rose-900 space-y-1">
              <p className="font-bold">Detected Event:</p>
              <p>{lastViolationReason || 'Unauthorized screen shift or tab switch detected.'}</p>
            </div>

            {violationsCount >= 3 ? (
              <p className="text-xs text-center text-slate-500">
                You have reached the maximum 3 allowable screen shift violations. Your assessment is terminating and submitting your current answers.
              </p>
            ) : (
              <div className="space-y-3 pt-2">
                <p className="text-[11px] text-slate-500 text-center">
                  Switching tabs, minimizing the browser, exiting fullscreen, or focusing other windows is logged as cheating. 3 violations triggers immediate termination.
                </p>
                <button
                  onClick={() => {
                    setShowViolationModal(false);
                    requestFullScreen();
                  }}
                  className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Maximize className="w-3.5 h-3.5" />
                  Re-enter Full Screen & Resume Test
                </button>
              </div>
            )}
          </div>
        </div>
      )}

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
                onClick={() => handleFinalSubmit()}
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
