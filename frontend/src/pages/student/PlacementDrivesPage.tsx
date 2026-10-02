import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { PlacementDrive, PlacementApplication } from '../../types';
import {
  Building2,
  Calendar,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Briefcase,
  Layers,
  ArrowRight
} from 'lucide-react';

export const PlacementDrivesPage: React.FC = () => {
  const { user } = useAuth();
  const [drives, setDrives] = useState<PlacementDrive[]>([]);
  const [applications, setApplications] = useState<PlacementApplication[]>([]);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchDrivesAndApplications = async () => {
      try {
        const [dList, aList] = await Promise.all([
          api.placements.list(),
          api.placements.getApplications(user.id)
        ]);
        setDrives(dList);
        setApplications(aList);
      } catch (err) {
        console.error('Error fetching placement drives:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDrivesAndApplications();
  }, [user]);

  const handleApply = async (driveId: string) => {
    if (!user) return;
    setApplyingId(driveId);
    try {
      const res = await api.placements.apply(driveId, user.id);
      setApplications(prev => [...prev, res.application]);
    } catch (err: any) {
      alert(err.message || 'Application failed');
    } finally {
      setApplyingId(null);
    }
  };

  const isApplied = (driveId: string) => applications.some(a => a.drive_id === driveId);

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-100">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Active Placement Drives</h1>
          <p className="text-xs text-slate-500">Verified corporate opportunities with automated eligibility auditing</p>
        </div>

        <span className="px-3 py-1 rounded-xl bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200">
          Your Profile CGPA: {user?.cgpa || 8.75}
        </span>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-xs text-slate-400">Loading placement drives...</div>
      ) : drives.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-purple-100 shadow-soft">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700">No active placement drives currently open.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {drives.map((drive) => {
            const applied = isApplied(drive.id);
            const userCgpa = user?.cgpa || 8.75;
            const isEligible = userCgpa >= drive.eligibility.min_cgpa;

            return (
              <div
                key={drive.id}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-purple-100/80 shadow-soft card-hover flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                {/* Left: Company & Role Details */}
                <div className="space-y-4 max-w-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center font-bold text-lg text-purple-700 overflow-hidden shrink-0">
                      {drive.company_logo ? (
                        <img src={drive.company_logo} alt={drive.company_name} className="w-full h-full object-cover" />
                      ) : (
                        drive.company_name.charAt(0)
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-slate-900">{drive.company_name}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isEligible ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {isEligible ? 'Eligible' : 'CGPA Below Requirement'}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-purple-700">{drive.role_title}</p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{drive.job_description}</p>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100">
                      <span className="text-[10px] text-slate-400 block font-semibold">Compensation</span>
                      <span className="font-bold text-purple-900 block mt-0.5">{drive.ctc_range}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100">
                      <span className="text-[10px] text-slate-400 block font-semibold">Location</span>
                      <span className="font-bold text-slate-800 block mt-0.5">{drive.location}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100">
                      <span className="text-[10px] text-slate-400 block font-semibold">Min CGPA</span>
                      <span className="font-bold text-slate-800 block mt-0.5">{drive.eligibility.min_cgpa} / 10.0</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100">
                      <span className="text-[10px] text-slate-400 block font-semibold">Deadline</span>
                      <span className="font-bold text-slate-800 block mt-0.5">
                        {new Date(drive.deadline).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Hiring Rounds */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
                    <span className="font-semibold text-slate-500 text-[11px]">Rounds:</span>
                    {drive.rounds.map((r, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium">
                        {i + 1}. {r}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right: Application Actions */}
                <div className="flex flex-col gap-2.5 shrink-0 sm:min-w-[180px]">
                  {applied ? (
                    <span className="w-full py-3 px-4 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Applied & Tracked
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApply(drive.id)}
                      disabled={!isEligible || applyingId === drive.id}
                      className="w-full py-3 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:opacity-40 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      {applyingId === drive.id ? 'Submitting...' : 'Record Application'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <a
                    href={drive.apply_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    Direct Company Portal
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
