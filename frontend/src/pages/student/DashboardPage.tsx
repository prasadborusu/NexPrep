import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import {
  Sparkles,
  ArrowRight,
  FileCheck2,
  Code2,
  FileText,
  ScanSearch,
  Milestone,
  Building2,
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import {
  Assessment,
  AssessmentSubmission,
  CodeSubmission,
  StudentRoadmap,
  PlacementDrive,
  SkillGapData
} from '../../types';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [submissions, setSubmissions] = useState<AssessmentSubmission[]>([]);
  const [codeSubmissions, setCodeSubmissions] = useState<CodeSubmission[]>([]);
  const [roadmap, setRoadmap] = useState<StudentRoadmap | null>(null);
  const [drives, setDrives] = useState<PlacementDrive[]>([]);
  const [skillGap, setSkillGap] = useState<SkillGapData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const [assList, userSubs, codeSubs, rm, plList, sg] = await Promise.all([
          api.assessments.list().catch(() => []),
          api.assessments.getStudentSubmissions(user.id).catch(() => []),
          api.coding.getSubmissions(user.id).catch(() => []),
          api.roadmap.get(user.id).catch(() => null),
          api.placements.list().catch(() => []),
          api.skillGap.get(user.id, user.target_role).catch(() => null)
        ]);

        setAssessments(assList);
        setSubmissions(userSubs);
        setCodeSubmissions(codeSubs);
        setRoadmap(rm);
        setDrives(plList);
        setSkillGap(sg);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  const solvedProblemsCount = codeSubmissions.filter(s => s.status === 'Accepted').length;
  const completedAssessments = submissions.filter(s => s.status === 'evaluated' || s.status === 'submitted');
  const readiness = skillGap?.readiness_percentage !== undefined
    ? skillGap.readiness_percentage
    : (completedAssessments.length > 0
        ? Math.round(completedAssessments.reduce((acc, curr) => acc + (curr.percentage || 0), 0) / completedAssessments.length)
        : 0);

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-soft-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-purple-200 border border-white/10 inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              Target Career: {user?.target_role || 'Full Stack Engineer'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome back, {user?.full_name || 'Candidate'}!
            </h1>
            <p className="text-sm text-purple-100 font-normal leading-relaxed">
              Your preparation pipeline is active. Track your assessments, coding milestones, and verified placement applications.
            </p>
          </div>

          {/* Readiness Gauge Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shrink-0">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/20"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-pink-400"
                  strokeDasharray={`${readiness}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute font-black text-sm text-white">{readiness}%</span>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-purple-200">Readiness Score</p>
              <p className="text-sm font-bold text-white">
                {readiness > 0 ? (readiness >= 75 ? 'Placement Ready' : 'In Progress') : 'Pending Evaluation'}
              </p>
              <Link to="/student/skills" className="text-[11px] text-pink-300 hover:text-white flex items-center gap-1 mt-0.5">
                View skill gaps <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stat Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-purple-100/80 shadow-soft">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Assessments</span>
            <FileCheck2 className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{assessments.length} Available</div>
          <p className="text-[11px] text-slate-500 mt-1">Screening tests scheduled</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-purple-100/80 shadow-soft">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Coding Solved</span>
            <Code2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{solvedProblemsCount} Problems</div>
          <p className="text-[11px] text-slate-500 mt-1">{codeSubmissions.length} Total submissions</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-purple-100/80 shadow-soft">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Roadmap Status</span>
            <Milestone className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{roadmap?.progress_percentage || 0}% Done</div>
          <p className="text-[11px] text-slate-500 mt-1">6-Week tailored milestones</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-purple-100/80 shadow-soft">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Placement Drives</span>
            <Building2 className="w-4 h-4 text-pink-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{drives.length} Open Drives</div>
          <p className="text-[11px] text-slate-500 mt-1">Verified campus opportunities</p>
        </div>
      </div>

      {/* Main Grid: Assessments & Roadmap */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Upcoming Assessments & Skill Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Assessments */}
          <div className="bg-white rounded-2xl p-6 border border-purple-100/80 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Upcoming Assessments</h3>
                <p className="text-xs text-slate-500">Proctored technical and coding evaluations</p>
              </div>
              <Link to="/student/assessments" className="text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center gap-1">
                View all <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {assessments.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No active assessments currently scheduled.
              </div>
            ) : (
              <div className="space-y-3">
                {assessments.slice(0, 3).map((ass) => (
                  <div
                    key={ass.id}
                    className="p-4 rounded-xl border border-slate-100 hover:border-purple-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FBFAFF]/50"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          ass.type === 'coding' ? 'bg-blue-100 text-blue-700' :
                          ass.type === 'mixed' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {ass.type}
                        </span>
                        <h4 className="font-bold text-sm text-slate-800">{ass.title}</h4>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1">{ass.description}</p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {ass.duration_minutes} Mins</span>
                        <span>•</span>
                        <span>Pass: {ass.pass_percentage}%</span>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/student/assessments/${ass.id}`)}
                      className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold transition-all shrink-0 flex items-center justify-center gap-1.5"
                    >
                      Start Exam
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Skill Gap Snapshot */}
          <div className="bg-white rounded-2xl p-6 border border-purple-100/80 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Skill Intelligence Matrix</h3>
                <p className="text-xs text-slate-500">Benchmark comparison for {user?.target_role}</p>
              </div>
              <Link to="/student/skills" className="text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center gap-1">
                Deep Dive <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {skillGap && (
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-2">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Strong Skills ({skillGap.strong_skills.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {skillGap.strong_skills.slice(0, 4).map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-white text-emerald-700 text-[11px] font-medium border border-emerald-200">
                        {s.skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-100 space-y-2">
                  <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Needs Polish ({skillGap.weak_skills.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {skillGap.weak_skills.slice(0, 4).map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-white text-amber-700 text-[11px] font-medium border border-amber-200">
                        {s.skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-100 space-y-2">
                  <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Missing Gaps ({skillGap.missing_skills.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {skillGap.missing_skills.slice(0, 4).map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-white text-rose-700 text-[11px] font-medium border border-rose-200">
                        {s.skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Roadmap Progress & Quick Tools */}
        <div className="space-y-6">
          {/* Roadmap Widget */}
          <div className="bg-white rounded-2xl p-6 border border-purple-100/80 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Weekly Roadmap</h3>
              <Link to="/student/roadmap" className="text-xs font-bold text-purple-700 hover:text-purple-800">
                View All
              </Link>
            </div>

            {roadmap?.weeks && roadmap.weeks.length > 0 ? (
              <div className="space-y-3">
                {roadmap.weeks.slice(0, 3).map((w) => (
                  <div key={w.week_number} className="p-3 rounded-xl bg-[#FBFAFF] border border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-purple-700">Week {w.week_number}</span>
                      <span className="text-[10px] text-slate-400">
                        {w.items.filter(i => i.completed).length}/{w.items.length} Done
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800">{w.theme}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{w.focus}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 space-y-3">
                <p className="text-xs">No active roadmap generated yet.</p>
                <button
                  onClick={() => navigate('/student/roadmap')}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold transition-all inline-flex items-center gap-1.5 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-pink-300" />
                  Generate Roadmap
                </button>
              </div>
            )}
          </div>

          {/* Quick Preparation Actions */}
          <div className="bg-gradient-to-br from-purple-50 via-pink-50/40 to-white rounded-2xl p-6 border border-purple-100 shadow-soft space-y-3">
            <h3 className="text-sm font-bold text-slate-800">Career Tool Shortcuts</h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/student/resume/builder')}
                className="w-full p-2.5 rounded-xl bg-white hover:bg-purple-100/50 border border-purple-100 text-left text-xs font-semibold text-slate-700 flex items-center justify-between transition-colors shadow-xs"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-600" />
                  AI Resume Builder
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => navigate('/student/resume/analyzer')}
                className="w-full p-2.5 rounded-xl bg-white hover:bg-pink-100/50 border border-purple-100 text-left text-xs font-semibold text-slate-700 flex items-center justify-between transition-colors shadow-xs"
              >
                <span className="flex items-center gap-2">
                  <ScanSearch className="w-4 h-4 text-pink-600" />
                  ATS Scanner & Fixes
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => navigate('/student/coding')}
                className="w-full p-2.5 rounded-xl bg-white hover:bg-blue-100/50 border border-purple-100 text-left text-xs font-semibold text-slate-700 flex items-center justify-between transition-colors shadow-xs"
              >
                <span className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-blue-600" />
                  Monaco Compiler Sandbox
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => navigate('/student/interview')}
                className="w-full p-2.5 rounded-xl bg-white hover:bg-emerald-100/50 border border-purple-100 text-left text-xs font-semibold text-slate-700 flex items-center justify-between transition-colors shadow-xs"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  AI Mock Interview Drills
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
