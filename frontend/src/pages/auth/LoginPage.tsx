import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, Lock, Mail, Sparkles, User, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, switchRole } = useAuth();
  const [email, setEmail] = useState('student@nexprep.io');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const user = await login(email);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = (type: 'student' | 'admin') => {
    switchRole(type);
    navigate(type === 'admin' ? '/admin' : '/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-[#FBFAFF]">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-soft-lg border border-purple-100/90 p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-700 to-pink-500 p-0.5 mx-auto shadow-sm">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center p-2">
              <img src="/logo.svg" alt="NexPrep" className="w-full h-full object-contain" />
            </div>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">Welcome Back</h2>
          <p className="text-xs text-slate-500">Sign in to your NexPrep preparation workspace</p>
        </div>

        {/* Quick Demo Switcher Pills */}
        <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-100 space-y-2">
          <p className="text-[11px] font-semibold text-purple-900 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            Quick Demo 1-Click Access:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('student')}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-purple-200 text-xs font-semibold text-purple-800 hover:bg-purple-100 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <User className="w-3.5 h-3.5" />
              Demo Student
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-purple-200 text-xs font-semibold text-purple-800 hover:bg-purple-100 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Demo Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {error}
          </div>
        )}

        {/* Form */}
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

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">Password</label>
              <button
                type="button"
                onClick={() => alert('For this demo, simply submit or click the demo pills above.')}
                className="text-[11px] font-semibold text-purple-700 hover:underline"
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 bg-[#FBFAFF]/60"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-sm font-bold transition-all shadow-sm hover:shadow-soft flex items-center justify-center gap-2"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Don't have an account?{' '}
          <Link to="/auth/register" className="font-semibold text-purple-700 hover:underline">
            Register as Student
          </Link>
        </div>
      </div>
    </div>
  );
};
