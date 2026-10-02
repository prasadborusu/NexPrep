import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { PlacementDrive } from '../../types';
import { Building2, Plus, ExternalLink, Calendar, MapPin } from 'lucide-react';

export const AdminPlacementsPage: React.FC = () => {
  const [drives, setDrives] = useState<PlacementDrive[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [ctcRange, setCtcRange] = useState('');
  const [location, setLocation] = useState('');
  const [minCgpa, setMinCgpa] = useState('7.0');
  const [applyUrl, setApplyUrl] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      const list = await api.placements.list();
      setDrives(list);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !roleTitle || !applyUrl) return;
    setIsSubmitting(true);
    try {
      const created = await api.placements.create({
        company_name: companyName,
        role_title: roleTitle,
        ctc_range: ctcRange || 'Competitive',
        location: location || 'Hybrid',
        eligibility: {
          min_cgpa: parseFloat(minCgpa) || 7.0,
          allowed_branches: ['CSE', 'IT', 'ECE'],
          allowed_batches: [2025, 2026],
          backlogs_allowed: false
        },
        job_description: jobDescription || `${roleTitle} recruitment drive at ${companyName}.`,
        apply_url: applyUrl
      });
      setDrives([created, ...drives]);
      setShowModal(false);
      setCompanyName('');
      setRoleTitle('');
      setCtcRange('');
      setLocation('');
      setApplyUrl('');
      setJobDescription('');
    } catch (err: any) {
      alert(err.message || 'Creation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-100">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Placement Drives Management</h1>
          <p className="text-xs text-slate-500">Publish corporate drives, configure eligibility gates, and review applications</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Post New Drive
        </button>
      </div>

      {drives.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-purple-100 shadow-soft space-y-2">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700">No placement drives posted yet.</p>
          <p className="text-xs text-slate-500">
            Click "Post New Drive" to configure corporate recruitment drives and eligibility criteria.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {drives.map((d) => (
            <div key={d.id} className="bg-white rounded-2xl p-6 border border-purple-100 shadow-soft space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{d.company_name}</h3>
                  <p className="text-xs font-semibold text-purple-700">{d.role_title}</p>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Active
                </span>
              </div>

              <p className="text-xs text-slate-500 line-clamp-2">{d.job_description}</p>

              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                <div className="p-2 rounded-xl bg-[#FBFAFF] border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">Package</span>
                  <span className="font-bold text-slate-800">{d.ctc_range || 'Competitive'}</span>
                </div>
                <div className="p-2 rounded-xl bg-[#FBFAFF] border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">Min CGPA</span>
                  <span className="font-bold text-slate-800">{d.eligibility?.min_cgpa || 7.0}</span>
                </div>
                <div className="p-2 rounded-xl bg-[#FBFAFF] border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">Location</span>
                  <span className="font-bold text-slate-800 truncate">{d.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 border border-purple-100 shadow-soft-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900">Post Campus Drive</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Stripe, Razorpay"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Role Title</label>
                <input
                  type="text"
                  required
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  placeholder="e.g. SDE 1"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">CTC Range</label>
                  <input
                    type="text"
                    value={ctcRange}
                    onChange={(e) => setCtcRange(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-purple-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Min CGPA</label>
                  <input
                    type="number"
                    step="0.1"
                    value={minCgpa}
                    onChange={(e) => setMinCgpa(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-purple-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Apply URL</label>
                <input
                  type="url"
                  required
                  value={applyUrl}
                  onChange={(e) => setApplyUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Job Description</label>
                <textarea
                  rows={2}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold"
                >
                  {isSubmitting ? 'Posting...' : 'Post Drive'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
