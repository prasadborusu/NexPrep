import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle2, ChevronLeft } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="max-w-md w-full bg-white rounded-2xl shadow-soft-lg border border-purple-100/90 p-8 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black tracking-tight text-slate-900">Reset Password</h2>
        <p className="text-xs text-slate-500">
          Enter your registered institutional or candidate email to receive recovery instructions.
        </p>
      </div>

      {submitted ? (
        <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-purple-100 text-[#6D28D9] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-[#181525]">Password Reset Link Sent</h4>
          <p className="text-xs text-[#77718A]">
            If an account is associated with <strong>{email}</strong>, a secure password reset link has been dispatched.
          </p>
          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6D28D9] hover:underline"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Return to Sign In
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@university.edu"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 bg-[#FBFAFF]/60"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-xs sm:text-sm font-bold transition-all shadow-sm hover:shadow-soft flex items-center justify-center gap-2"
          >
            {loading ? 'Sending Instructions...' : 'Send Reset Link'}
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center pt-2">
            <Link
              to="/login"
              className="text-xs font-semibold text-[#77718A] hover:text-[#6D28D9] inline-flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Back to Login
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};
