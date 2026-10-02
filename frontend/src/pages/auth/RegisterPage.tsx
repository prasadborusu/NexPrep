import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import confetti from 'canvas-confetti';
import {
  ArrowRight,
  User,
  Mail,
  GraduationCap,
  Building2,
  Briefcase,
  AlertCircle,
  Lock,
  Shield,
  CheckCircle2,
  KeyRound,
  RotateCw,
  Edit2
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithUser } = useAuth();
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [college, setCollege] = useState('');
  const [degree, setDegree] = useState('');
  const [branch, setBranch] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [adminDesignation, setAdminDesignation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // OTP Verification State
  const [otpStep, setOtpStep] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState(30);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState<string | null>(null);

  const digitRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  // Resend Timer Countdown
  useEffect(() => {
    let timer: any;
    if (otpStep && resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpStep, resendCountdown]);

  // Focus first digit when OTP step opens
  useEffect(() => {
    if (otpStep) {
      setTimeout(() => {
        digitRefs[0].current?.focus();
      }, 100);
    }
  }, [otpStep]);

  // Step 1: Submit Registration Form & Send 4-Digit OTP
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      setError('Please provide your name and email address.');
      return;
    }
    if (!password.trim() || password.trim().length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await api.auth.register({
        full_name: fullName.trim(),
        email: email.trim(),
        password: password.trim(),
        target_role: role === 'student' ? targetRole : adminDesignation,
        college: college.trim(),
        degree: role === 'student' ? degree : undefined,
        branch: role === 'student' ? branch : undefined,
        graduation_year: role === 'student' ? (parseInt(graduationYear, 10) || new Date().getFullYear()) : undefined,
        cgpa: role === 'student' && cgpa ? parseFloat(cgpa) : undefined,
        role,
        skills: []
      });

      setRegisteredEmail(email.trim().toLowerCase());
      setOtpDigits(['', '', '', '']);
      setOtpError(null);
      setResendCountdown(30);
      setOtpStep(true);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your details and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle individual digit input
  const handleDigitChange = (index: number, val: string) => {
    // Only accept numbers
    const clean = val.replace(/\D/g, '');
    if (!clean) {
      const updated = [...otpDigits];
      updated[index] = '';
      setOtpDigits(updated);
      return;
    }

    // Single digit entry
    const lastChar = clean.slice(-1);
    const updated = [...otpDigits];
    updated[index] = lastChar;
    setOtpDigits(updated);
    setOtpError(null);

    // Auto advance to next box
    if (index < 3) {
      digitRefs[index + 1].current?.focus();
    }
  };

  // Handle Backspace navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      digitRefs[index - 1].current?.focus();
    }
  };

  // Handle Paste of full 4-digit code
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (!pastedData) return;

    const updated = ['', '', '', ''];
    for (let i = 0; i < pastedData.length; i++) {
      updated[i] = pastedData[i];
    }
    setOtpDigits(updated);
    setOtpError(null);

    const focusIdx = Math.min(pastedData.length, 3);
    digitRefs[focusIdx].current?.focus();
  };

  // Step 2: Verify 4-Digit OTP
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const otpCode = otpDigits.join('');
    if (otpCode.length < 4) {
      setOtpError('Please enter all 4 digits of your verification code.');
      return;
    }

    setIsVerifying(true);
    setOtpError(null);
    try {
      const res = await api.auth.verifyOtp({
        email: registeredEmail,
        otp: otpCode
      });

      // Confetti celebration
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });

      // Update Auth context and redirect
      loginWithUser(res.user);
      navigate(res.user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
    } catch (err: any) {
      setOtpError(err.message || 'Invalid verification code. Please check your email and try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Resend 4-digit OTP code
  const handleResendOtp = async () => {
    if (resendCountdown > 0 || isResending) return;
    setIsResending(true);
    setOtpError(null);
    setResendSuccess(null);
    try {
      const res = await api.auth.resendOtp(registeredEmail);
      setResendSuccess(res.message || 'New 4-digit code sent!');
      setResendCountdown(30);
      setOtpDigits(['', '', '', '']);
      digitRefs[0].current?.focus();
      setTimeout(() => setResendSuccess(null), 4000);
    } catch (err: any) {
      setOtpError(err.message || 'Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  // ── Step 2: 4-Digit OTP Verification Screen ─────────────────────
  if (otpStep) {
    const isOtpComplete = otpDigits.every(d => d !== '');

    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-[#FBFAFF]">
        <div className="max-w-lg w-full bg-white rounded-3xl shadow-soft-lg border border-[#EAE6F5] p-8 sm:p-10 text-center space-y-7">
          {/* Top Icon */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#6D28D9] to-[#8B5CF6] text-white flex items-center justify-center mx-auto shadow-md shadow-purple-200">
            <KeyRound className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#181525] tracking-tight">
              Enter Verification Code
            </h2>
            <p className="mt-2 text-sm text-[#77718A] leading-relaxed">
              We've sent a 4-digit code to your email:
            </p>
            <div className="mt-1.5 inline-flex items-center gap-2 bg-purple-50 px-3.5 py-1.5 rounded-full border border-purple-100">
              <span className="font-bold text-[#6D28D9] text-sm">{registeredEmail}</span>
              <button
                onClick={() => setOtpStep(false)}
                className="text-slate-400 hover:text-[#6D28D9] transition-colors"
                title="Change email address"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Error Message */}
          {otpError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{otpError}</span>
            </div>
          )}

          {/* Resend Success Message */}
          {resendSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{resendSuccess}</span>
            </div>
          )}

          {/* 4 Digit Input Boxes */}
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={digitRefs[idx]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  onPaste={handlePaste}
                  className={`w-14 h-16 sm:w-16 sm:h-20 text-3xl sm:text-4xl font-extrabold text-center rounded-2xl border-2 transition-all outline-none bg-[#FBFAFF] ${
                    digit
                      ? 'border-[#6D28D9] bg-purple-50/50 text-[#6D28D9] ring-2 ring-purple-100'
                      : 'border-[#EAE6F5] text-[#181525] focus:border-[#6D28D9] focus:ring-4 focus:ring-purple-100'
                  }`}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={!isOtpComplete || isVerifying}
              className={`w-full py-4 px-4 rounded-xl text-base font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${
                isOtpComplete && !isVerifying
                  ? 'bg-[#6D28D9] hover:bg-[#5B21B6] text-white cursor-pointer hover:shadow-soft'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isVerifying ? (
                <>
                  <RotateCw className="w-5 h-5 animate-spin" />
                  Verifying Code...
                </>
              ) : (
                <>
                  Verify & Enter NexPrep
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Resend OTP Section */}
          <div className="pt-2 border-t border-[#EAE6F5] flex items-center justify-between text-xs text-[#77718A]">
            <span>Didn't receive the code?</span>
            {resendCountdown > 0 ? (
              <span className="font-semibold text-slate-400">
                Resend in <span className="text-[#6D28D9] font-bold">{resendCountdown}s</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isResending}
                className="font-bold text-[#6D28D9] hover:text-[#5B21B6] hover:underline flex items-center gap-1"
              >
                {isResending ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : null}
                Resend Code
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Step 1: Initial Registration Form ──────────────────────────
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-[#FBFAFF]">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-soft-lg border border-[#EAE6F5] p-10 space-y-7">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#6D28D9] via-[#8B5CF6] to-[#EC4899] p-0.5 mx-auto shadow-sm">
            <div className="w-full h-full bg-white rounded-[18px] flex items-center justify-center p-2.5">
              <img src="/logo.svg" alt="NexPrep" className="w-full h-full object-contain" />
            </div>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-[#181525]">Create NexPrep Account</h1>
          <p className="text-sm text-[#77718A]">Select your account type to personalize your workspace</p>
        </div>

        {/* Role Choice Cards */}
        <div>
          <label className="block text-sm font-bold text-[#181525] mb-3 uppercase tracking-wider">Select Account Type</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`p-5 rounded-2xl border text-left transition-all ${
                role === 'student'
                  ? 'border-purple-600 bg-purple-50/60 ring-2 ring-purple-100'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
                <User className="w-5 h-5" />
              </div>
              <p className="font-bold text-sm text-slate-900">Student Candidate</p>
              <p className="text-xs text-slate-500 mt-1 leading-snug">Practice coding, build AI resumes & prep for interviews</p>
            </button>

            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`p-5 rounded-2xl border text-left transition-all ${
                role === 'admin'
                  ? 'border-pink-600 bg-pink-50/60 ring-2 ring-pink-100'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center mb-3">
                <Shield className="w-5 h-5" />
              </div>
              <p className="font-bold text-sm text-slate-900">Placement Admin</p>
              <p className="text-xs text-slate-500 mt-1 leading-snug">Manage assessments, question banks, drives & student analytics</p>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#181525] mb-2">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#77718A] absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-[#EAE6F5] text-sm focus:outline-none focus:border-[#6D28D9] focus:ring-2 focus:ring-purple-100 bg-[#FBFAFF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#181525] mb-2">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#77718A] absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-[#EAE6F5] text-sm focus:outline-none focus:border-[#6D28D9] focus:ring-2 focus:ring-purple-100 bg-[#FBFAFF]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#181525] mb-2">Create Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#77718A] absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-[#EAE6F5] text-sm focus:outline-none focus:border-[#6D28D9] focus:ring-2 focus:ring-purple-100 bg-[#FBFAFF]"
              />
            </div>
          </div>

          {role === 'student' ? (
            <>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#181525] mb-2">Target Career Role</label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl border border-[#EAE6F5] text-sm focus:outline-none focus:border-[#6D28D9] focus:ring-2 focus:ring-purple-100 bg-[#FBFAFF]"
                  >
                    <option value="">Select target role...</option>
                    <option value="Full Stack Engineer">Full Stack Engineer</option>
                    <option value="Backend Engineer">Backend Engineer</option>
                    <option value="Frontend Engineer">Frontend Engineer</option>
                    <option value="Software Engineer">Software Engineer (Generalist)</option>
                    <option value="Data Engineer">Data Engineer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#181525] mb-2">College / Institution</label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-[#77718A] absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="text"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      placeholder="College or University name"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#EAE6F5] text-sm focus:outline-none focus:border-[#6D28D9] focus:ring-2 focus:ring-purple-100 bg-[#FBFAFF]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#181525] mb-1.5">Degree</label>
                  <input
                    type="text"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    placeholder="e.g. B.Tech"
                    className="w-full px-3 py-2.5 rounded-xl border border-[#EAE6F5] text-xs focus:outline-none focus:border-[#6D28D9] bg-[#FBFAFF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#181525] mb-1.5">Branch</label>
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    placeholder="e.g. CSE"
                    className="w-full px-3 py-2.5 rounded-xl border border-[#EAE6F5] text-xs focus:outline-none focus:border-[#6D28D9] bg-[#FBFAFF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#181525] mb-1.5">CGPA (optional)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={cgpa}
                    onChange={(e) => setCgpa(e.target.value)}
                    placeholder="e.g. 8.5"
                    className="w-full px-3 py-2.5 rounded-xl border border-[#EAE6F5] text-xs focus:outline-none focus:border-[#6D28D9] bg-[#FBFAFF]"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#181525] mb-2">Institution / University</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-[#77718A] absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="Institution or University name"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#EAE6F5] text-sm focus:outline-none focus:border-[#6D28D9] focus:ring-2 focus:ring-purple-100 bg-[#FBFAFF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#181525] mb-2">Designation / Role</label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-[#77718A] absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={adminDesignation}
                    onChange={(e) => setAdminDesignation(e.target.value)}
                    placeholder="Your designation or title"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#EAE6F5] text-sm focus:outline-none focus:border-[#6D28D9] focus:ring-2 focus:ring-purple-100 bg-[#FBFAFF]"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-4 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-base font-bold transition-all shadow-sm hover:shadow-soft flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? 'Sending Verification Code...' : 'Continue & Verify Email'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-[#77718A] pt-2 border-t border-[#EAE6F5]">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#6D28D9] hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};
