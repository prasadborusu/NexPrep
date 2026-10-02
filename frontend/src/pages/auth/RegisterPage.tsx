import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { ArrowRight, User, Mail, GraduationCap, Building2, Briefcase, AlertCircle, Lock, Shield, CheckCircle2, InboxIcon } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
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
  const [emailSent, setEmailSent] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

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
      const res = await api.auth.register({
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
      // If Supabase sends a verification email, show pending screen
      if (res.email_verification_required) {
        setRegisteredEmail(email.trim());
        setEmailSent(true);
      } else {
        // Auto-login returned
        navigate(res.user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Email Verification Pending Screen ───────────────────
  if (emailSent) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-[#FBFAFF]">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-soft-lg border border-[#EAE6F5] p-10 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mx-auto">
            <Mail className="w-10 h-10 text-[#6D28D9]" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-[#181525]">Check your inbox!</h2>
            <p className="mt-2 text-[#77718A] text-sm leading-relaxed">
              We sent a verification link to:
            </p>
            <p className="mt-1 font-bold text-[#6D28D9] text-base">{registeredEmail}</p>
            <p className="mt-3 text-[#77718A] text-sm leading-relaxed">
              Click the link in the email to activate your NexPrep account. Check your spam folder if you don't see it within a few minutes.
            </p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 text-left space-y-2.5">
            <div className="flex items-center gap-2 text-xs text-[#6D28D9] font-semibold">
              <CheckCircle2 className="w-4 h-4" /> Account created successfully
            </div>
            <div className="flex items-center gap-2 text-xs text-[#6D28D9] font-semibold">
              <CheckCircle2 className="w-4 h-4" /> Verification email sent
            </div>
            <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
              <div className="w-4 h-4 rounded-full border-2 border-purple-200 flex-shrink-0" />
              Click link in email to activate
            </div>
          </div>
          <Link
            to="/login"
            className="block w-full py-3 rounded-xl bg-[#6D28D9] text-white font-bold text-sm text-center hover:bg-[#5B21B6] transition-colors"
          >
            Go to Login →
          </Link>
          <p className="text-xs text-[#77718A]">
            Didn't receive the email?{' '}
            <button onClick={() => setEmailSent(false)} className="text-[#6D28D9] font-semibold hover:underline">
              Try again
            </button>
          </p>
        </div>
      </div>
    );
  }

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
                <User className="w-4 h-4 text-[#77718A] absolute left-3.5 top-3 pointer-events-none" />
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
                <Mail className="w-4 h-4 text-[#77718A] absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#EAE6F5] text-sm focus:outline-none focus:border-[#6D28D9] focus:ring-2 focus:ring-purple-100 bg-[#FBFAFF]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#181525] mb-2">Create Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#77718A] absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#EAE6F5] text-sm focus:outline-none focus:border-[#6D28D9] focus:ring-2 focus:ring-purple-100 bg-[#FBFAFF]"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE6F5] text-sm focus:outline-none focus:border-[#6D28D9] focus:ring-2 focus:ring-purple-100 bg-[#FBFAFF]"
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
                  <label className="block text-xs font-semibold text-[#181525] mb-1.5">College / Institution</label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-[#77718A] absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      placeholder="College or University name"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#EAE6F5] text-sm focus:outline-none focus:border-[#6D28D9] focus:ring-2 focus:ring-purple-100 bg-[#FBFAFF]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[#181525] mb-1.5">Degree</label>
                  <input
                    type="text"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    placeholder="e.g. B.Tech"
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE6F5] text-xs focus:outline-none focus:border-[#6D28D9] bg-[#FBFAFF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#181525] mb-1.5">Branch</label>
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    placeholder="e.g. CSE"
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE6F5] text-xs focus:outline-none focus:border-[#6D28D9] bg-[#FBFAFF]"
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
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE6F5] text-xs focus:outline-none focus:border-[#6D28D9] bg-[#FBFAFF]"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#181525] mb-1.5">Institution / University</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-[#77718A] absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="Institution or University name"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#EAE6F5] text-sm focus:outline-none focus:border-[#6D28D9] focus:ring-2 focus:ring-purple-100 bg-[#FBFAFF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#181525] mb-1.5">Designation / Role</label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-[#77718A] absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={adminDesignation}
                    onChange={(e) => setAdminDesignation(e.target.value)}
                    placeholder="Your designation or title"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#EAE6F5] text-sm focus:outline-none focus:border-[#6D28D9] focus:ring-2 focus:ring-purple-100 bg-[#FBFAFF]"
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
            {isLoading ? 'Creating Account...' : `Complete Registration as ${role === 'admin' ? 'Placement Admin' : 'Candidate'}`}
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
