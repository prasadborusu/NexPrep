import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { ArrowRight, Lock, Mail, AlertCircle, CheckCircle2, Shield, User, Send } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect');
  const { login } = useAuth();

  const [selectedRole, setSelectedRole] = useState<'student' | 'admin'>('student');
  const [authMode, setAuthMode] = useState<'password' | 'magic_link'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (authMode === 'magic_link') {
      try {
        const res = await api.auth.sendMagicLink(email.trim(), selectedRole);
        setSuccessMessage(res.message || `Magic login email dispatched to ${email.trim()}. Check your inbox.`);
      } catch (err: any) {
        setError(err.message || 'Unable to send magic link. Please check your email and try again.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    try {
      const user = await login(email.trim(), password);
      if (redirectUrl) {
        navigate(redirectUrl);
      } else {
        navigate(user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Unable to sign in. Please verify your email and password, or create an account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-[#FBFAFF]">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-soft-lg border border-[#EAE6F5] p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6D28D9] via-[#8B5CF6] to-[#EC4899] p-0.5 mx-auto shadow-sm">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center p-2">
              <img src="/logo.svg" alt="NexPrep" className="w-full h-full object-contain" />
            </div>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#181525]">Sign In to NexPrep</h1>
          <p className="text-xs text-[#77718A]">Choose your role and enter your credentials</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 p-1 bg-slate-100/80 rounded-xl gap-1">
          <button
            type="button"
            onClick={() => setSelectedRole('student')}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              selectedRole === 'student'
                ? 'bg-white text-purple-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5 text-purple-700" />
            <span>Candidate</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('admin')}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              selectedRole === 'admin'
                ? 'bg-white text-purple-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-pink-600" />
            <span>Placement Admin</span>
          </button>
        </div>

        {redirectUrl && !error && !successMessage && (
          <div className="p-3.5 rounded-xl bg-purple-50/90 border border-purple-200 text-xs text-purple-900 flex items-start gap-2">
            <Lock className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
            <p><strong className="font-semibold">Sign in required:</strong> Please log in or create an account to access this feature.</p>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{error}</p>
              <p className="mt-1 text-[11px] text-rose-600">
                Don't have an account yet? <Link to="/register" className="font-bold underline">Create your account</Link>
              </p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="font-medium">{successMessage}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#181525] mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#77718A] absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={selectedRole === 'admin' ? 'admin@university.edu' : 'student@university.edu'}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#EAE6F5] text-sm focus:outline-none focus:border-[#6D28D9] focus:ring-2 focus:ring-purple-100 bg-[#FBFAFF]"
              />
            </div>
          </div>

          {authMode === 'password' ? (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#181525]">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] font-semibold text-[#6D28D9] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#77718A] absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#EAE6F5] text-sm focus:outline-none focus:border-[#6D28D9] focus:ring-2 focus:ring-purple-100 bg-[#FBFAFF]"
                />
              </div>
            </div>
          ) : (
            <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-xl text-xs text-purple-900">
              <p className="font-semibold flex items-center gap-1.5 mb-1">
                <Send className="w-3.5 h-3.5 text-purple-700" />
                Passwordless Email Authentication
              </p>
              <p className="text-[11px] text-purple-700 leading-relaxed">
                We will send a secure one-click sign-in link via Supabase to your registered email address.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-sm font-bold transition-all shadow-sm hover:shadow-soft flex items-center justify-center gap-2"
          >
            {isLoading
              ? (authMode === 'magic_link' ? 'Sending Magic Link...' : 'Signing In...')
              : (authMode === 'magic_link' ? `Send Magic Link as ${selectedRole === 'admin' ? 'Admin' : 'Candidate'}` : `Sign In as ${selectedRole === 'admin' ? 'Placement Admin' : 'Candidate'}`)}
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Auth mode toggle */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => {
                setAuthMode(prev => prev === 'password' ? 'magic_link' : 'password');
                setError(null);
                setSuccessMessage(null);
              }}
              className="text-xs text-purple-700 font-semibold hover:underline"
            >
              {authMode === 'password' ? 'Or Sign In with Supabase Email Magic Link' : 'Or Sign In with Email & Password'}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-[#77718A] pt-2 border-t border-[#EAE6F5]">
          New to NexPrep?{' '}
          <Link to="/register" className="font-semibold text-[#6D28D9] hover:underline">
            Register as Candidate or Admin
          </Link>
        </div>
      </div>
    </div>
  );
};
