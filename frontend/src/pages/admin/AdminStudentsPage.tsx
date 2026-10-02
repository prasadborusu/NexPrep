import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Users, Search, GraduationCap, Award, CheckCircle2 } from 'lucide-react';

export const AdminStudentsPage: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const list = await api.admin.getStudents();
        setStudents(list);
      } catch (err) {
        console.error('Failed to fetch students:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filtered = students.filter(s =>
    s.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase()) ||
    s.target_role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-100">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Student Candidate Roster</h1>
          <p className="text-xs text-slate-500">Track student readiness, performance metrics, and verified profiles</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidates or skills..."
            className="w-full pl-9 pr-3.5 py-1.5 rounded-xl border border-slate-200 text-xs focus:border-purple-600 focus:outline-none bg-white"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-xs text-slate-400">Loading student directory...</div>
      ) : (
        <div className="bg-white rounded-2xl border border-purple-100 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FBFAFF] text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Target Role</th>
                  <th className="py-3 px-4">College / Major</th>
                  <th className="py-3 px-4">CGPA</th>
                  <th className="py-3 px-4">Exams Taken</th>
                  <th className="py-3 px-4">Coding Solved</th>
                  <th className="py-3 px-4">Drives Applied</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-purple-50/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div>
                        {s.full_name}
                        <span className="block text-[11px] font-normal text-slate-400">{s.email}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-purple-700">{s.target_role || 'General SDE'}</td>
                    <td className="py-3.5 px-4">
                      {s.college || 'Engineering Institute'}
                      <span className="block text-[10px] text-slate-400">{s.branch} ({s.graduation_year})</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{s.cgpa || 8.5}</td>
                    <td className="py-3.5 px-4 font-semibold">{s.assessments_taken || 0}</td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-600">{s.code_problems_solved || 0}</td>
                    <td className="py-3.5 px-4 font-semibold text-purple-700">{s.drives_applied || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
