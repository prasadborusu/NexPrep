import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, User, Mail, GraduationCap, Award, BookOpen, AlertCircle, Lock } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetRole, setTargetRole] = useState('Full Stack Engineer');
  const [college, setCollege] = useState('');
  const [degree, setDegree] = useState('B.Tech');
  const [branch, setBranch] = useState('Computer Science & Engineering');
  const [graduationYear, setGraduationYear] = useState('2026');
  const [cgpa, setCgpa] = useState('');
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const user = await register({
        full_name: fullName.trim(),
        email: email.trim(),
        password: password.trim(),
        target_role: targetRole,
        college: college.trim(),
        degree,
        branch,
        graduation_year: parseInt(graduationYear, 10) || new Date().getFullYear(),
        cgpa: cgpa ? parseFloat(cgpa) : undefined,
        role,
        skills: []
      });
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-[#FBFAFF]">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-soft-lg border border-[#EAE6F5] p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6D28D9] via-[#8B5CF6] to-[#EC4899] p-0.5 mx-auto shadow-sm">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center p-2">
              <img src="/logo.svg" alt="NexPrep" className="w-full h-full object-contain" />
            </div>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#181525]">Create Account</h1>
          <p className="text-xs text-[#77718A]">Join the AI-powered career preparation workspace</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#181525] mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#77718A] absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#EAE6F5] text-sm focus:outline-none focus:border-[#6D28D9] focus:ring-2 focus:ring-purple-100 bg-[#FBFAFF]"
                />
              </div>
            </div>

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
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#181525] mb-1.5">Create Password</label>
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

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#181525] mb-1.5">Target Career Role</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE6F5] text-sm focus:outline-none focus:border-[#6D28D9] focus:ring-2 focus:ring-purple-100 bg-[#FBFAFF]"
              >
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
                  placeholder="e.g. Institute of Technology"
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
                placeholder="B.Tech"
                className="w-full px-3 py-2 rounded-xl border border-[#EAE6F5] text-xs focus:outline-none focus:border-[#6D28D9] bg-[#FBFAFF]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#181525] mb-1.5">Branch</label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="CSE"
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

          <div>
            <label className="block text-xs font-semibold text-[#181525] mb-1.5">Account Role</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                  role === 'student'
                    ? 'bg-[#6D28D9] text-white border-[#6D28D9]'
                    : 'bg-white text-[#77718A] border-[#EAE6F5] hover:bg-slate-50'
                }`}
              >
                Student Candidate
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                  role === 'admin'
                    ? 'bg-[#6D28D9] text-white border-[#6D28D9]'
                    : 'bg-white text-[#77718A] border-[#EAE6F5] hover:bg-slate-50'
                }`}
              >
                Institutional Placement Admin
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-sm font-bold transition-all shadow-sm hover:shadow-soft flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? 'Creating Account...' : 'Complete Registration'}
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
