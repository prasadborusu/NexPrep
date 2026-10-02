import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, User, Mail, GraduationCap, Award, BookOpen } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [targetRole, setTargetRole] = useState('Full Stack Engineer');
  const [college, setCollege] = useState('National Institute of Technology');
  const [cgpa, setCgpa] = useState('8.5');
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) {
      setError('Please provide your name and email');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const user = await register({
        full_name: fullName,
        email,
        target_role: targetRole,
        college,
        cgpa: parseFloat(cgpa) || 8.0,
        role,
        skills: ['Python', 'Problem Solving']
      });
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-[#FBFAFF]">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-soft-lg border border-purple-100/90 p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-700 to-pink-500 p-0.5 mx-auto shadow-sm">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center p-2">
              <img src="/logo.svg" alt="NexPrep" className="w-full h-full object-contain" />
            </div>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">Create Your Profile</h2>
          <p className="text-xs text-slate-500">Join the AI career preparation ecosystem</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alex Johnson"
                  className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 bg-[#FBFAFF]/60"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@college.edu"
                  className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 bg-[#FBFAFF]/60"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Target Career Role</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 bg-[#FBFAFF]/60"
              >
                <option value="Full Stack Engineer">Full Stack Engineer</option>
                <option value="Frontend Specialist">Frontend Specialist</option>
                <option value="Backend Engineer">Backend Engineer</option>
                <option value="Software Development Engineer">SDE 1 (Generalist)</option>
                <option value="Data Engineer">Data Engineer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">College / University</label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 bg-[#FBFAFF]/60"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Current CGPA</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 bg-[#FBFAFF]/60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Role Type</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all ${
                    role === 'student'
                      ? 'bg-purple-700 text-white border-purple-700'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all ${
                    role === 'admin'
                      ? 'bg-purple-700 text-white border-purple-700'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Admin / TPO
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-sm font-bold transition-all shadow-sm hover:shadow-soft flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? 'Creating Account...' : 'Complete Registration'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-purple-700 hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};
