import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { StudentRoadmap, RoadmapWeek } from '../../types';
import confetti from 'canvas-confetti';
import {
  Milestone,
  CheckCircle2,
  Circle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Calendar,
  Layers
} from 'lucide-react';

export const RoadmapPage: React.FC = () => {
  const { user } = useAuth();
  const [roadmap, setRoadmap] = useState<StudentRoadmap | null>(null);
  const [targetRole, setTargetRole] = useState(user?.target_role || 'Full Stack Engineer');
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchRoadmap = async () => {
      try {
        const data = await api.roadmap.get(user.id);
        setRoadmap(data);
      } catch (err) {
        console.error('Error fetching roadmap:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoadmap();
  }, [user]);

  const handleToggleItem = async (itemId: string) => {
    if (!user || !roadmap) return;
    try {
      const updated = await api.roadmap.toggleItem(user.id, itemId);
      setRoadmap(updated);

      if (updated.progress_percentage === 100) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error('Error toggling roadmap item:', err);
    }
  };

  const handleRegenerate = async () => {
    if (!user) return;
    setIsRegenerating(true);
    try {
      const updated = await api.roadmap.generate(user.id, targetRole);
      setRoadmap(updated);
    } catch (err) {
      console.error('Error regenerating roadmap:', err);
    } finally {
      setIsRegenerating(false);
    }
  };

  if (isLoading) {
    return <div className="p-12 text-center text-xs text-slate-500">Synthesizing personalized roadmap...</div>;
  }

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-100">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Personalized Placement Roadmap</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200">
              Adaptive 6-Week Path
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Systematically closes detected skill gaps through structured core study, algorithmic drills, and mock interviews.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:border-purple-600"
          >
            <option value="Full Stack Engineer">Full Stack Engineer</option>
            <option value="Frontend Specialist">Frontend Specialist</option>
            <option value="Backend Engineer">Backend Engineer</option>
            <option value="Software Development Engineer">SDE Generalist</option>
            <option value="Data Engineer">Data Engineer</option>
          </select>

          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            {isRegenerating ? 'Generating...' : 'Regenerate'}
          </button>
        </div>
      </div>

      {roadmap && (
        <div className="space-y-6">
          {/* Progress Overview Card */}
          <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-soft space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wider">Overall Roadmap Completion</span>
              <span className="text-lg font-black text-purple-700">{roadmap.progress_percentage}% Completed</span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-700 via-purple-600 to-pink-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${roadmap.progress_percentage}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-slate-500">
              Check off completed milestones as you learn. Your placement readiness recalculates dynamically.
            </p>
          </div>

          {/* 6-Week Interactive Timeline */}
          <div className="space-y-5">
            {roadmap.weeks.map((week: RoadmapWeek) => {
              const weekCompletedCount = week.items.filter(i => i.completed).length;
              const isWeekDone = weekCompletedCount === week.items.length;

              return (
                <div
                  key={week.week_number}
                  className={`bg-white rounded-2xl p-6 border transition-all shadow-soft space-y-4 ${
                    isWeekDone ? 'border-emerald-200 bg-emerald-50/20' : 'border-purple-100/80'
                  }`}
                >
                  {/* Week Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isWeekDone
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        W{week.week_number}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{week.theme}</h3>
                        <p className="text-xs text-slate-500">{week.focus}</p>
                      </div>
                    </div>

                    <span className="text-xs font-semibold text-slate-500">
                      {weekCompletedCount} of {week.items.length} Tasks Done
                    </span>
                  </div>

                  {/* Task Items */}
                  <div className="space-y-2.5">
                    {week.items.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleToggleItem(item.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                          item.completed
                            ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                            : 'bg-[#FBFAFF] border-slate-200 hover:border-purple-300 text-slate-800'
                        }`}
                      >
                        <div className="pt-0.5 shrink-0">
                          {item.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-400 hover:text-purple-600" />
                          )}
                        </div>

                        <div className="flex-1 space-y-0.5">
                          <div className="flex items-center justify-between">
                            <h4 className={`text-xs font-bold ${item.completed ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                              {item.title}
                            </h4>
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-slate-100 text-slate-600">
                              {item.category}
                            </span>
                          </div>
                          <p className={`text-[11px] leading-relaxed ${item.completed ? 'text-slate-400' : 'text-slate-500'}`}>
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
