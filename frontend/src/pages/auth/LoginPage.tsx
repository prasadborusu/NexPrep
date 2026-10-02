import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, Lock, Mail, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect');
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    setIsLoading(true);
    setError(null);
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
          <p className="text-xs text-[#77718A]">Access your candidate preparation or institutional administration workspace</p>
        </div>

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
                placeholder="name@university.edu"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#EAE6F5] text-sm focus:outline-none focus:border-[#6D28D9] focus:ring-2 focus:ring-purple-100 bg-[#FBFAFF]"
              />
            </div>
          </div>

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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-sm font-bold transition-all shadow-sm hover:shadow-soft flex items-center justify-center gap-2"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Credentials for Evaluation / Testing */}
        <div className="p-3 bg-[#F8F6FD] rounded-xl border border-[#EAE6F5] space-y-2">
          <p className="text-[11px] font-bold text-[#4B3B70] uppercase tracking-wider">Quick Sign In Options</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setEmail('student@nexprep.io');
                setPassword('StudentPassword123!');
              }}
              className="px-2.5 py-1.5 text-left text-xs bg-white rounded-lg border border-[#EAE6F5] hover:border-[#8B5CF6] transition-colors"
            >
              <span className="font-semibold block text-[#181525]">Candidate / Student</span>
              <span className="text-[10px] text-[#77718A]">student@nexprep.io</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@nexprep.io');
                setPassword('AdminPassword123!');
              }}
              className="px-2.5 py-1.5 text-left text-xs bg-white rounded-lg border border-[#EAE6F5] hover:border-[#8B5CF6] transition-colors"
            >
              <span className="font-semibold block text-[#181525]">Administrator</span>
              <span className="text-[10px] text-[#77718A]">admin@nexprep.io</span>
            </button>
          </div>
        </div>

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
