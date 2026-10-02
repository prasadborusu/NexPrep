import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Course, CourseEnrollment, CourseModule, Lesson } from '../../types';
import confetti from 'canvas-confetti';
import { MarkdownViewer } from '../../components/common/MarkdownViewer';
import {
  ArrowLeft,
  CheckCircle2,
  PlayCircle,
  FileText,
  Code2,
  Clock,
  BookOpen,
  Award,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ExternalLink,
  Layers,
  GraduationCap
} from 'lucide-react';

export const CourseLearnPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<CourseEnrollment | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Load course and enrollment
  const loadCourseData = async () => {
    if (!courseId) return;
    setIsLoading(true);
    try {
      const courseData = await api.courses.getById(courseId);
      setCourse(courseData);

      let enrollData: CourseEnrollment | null = null;
      if (user?.id) {
        try {
          const res = await api.courses.getProgress(courseData.id, user.id);
          if (res.enrolled) {
            enrollData = res as any;
          } else {
            // Auto-enroll if visiting classroom
            const enrRes = await api.courses.enroll(courseData.id, user.id);
            enrollData = enrRes.enrollment;
          }
        } catch {
          // ignore
        }
      }
      setEnrollment(enrollData);

      // Find first lesson to display
      const allLessons: Lesson[] = [];
      courseData.modules.forEach(m => {
        (m.lessons || []).forEach(l => allLessons.push(l));
      });

      const completedIds = enrollData?.completed_lessons || [];
      const firstIncomplete = allLessons.find(l => !completedIds.includes(l.id));
      const initialLesson = firstIncomplete || allLessons[0] || null;
      setCurrentLesson(initialLesson);

      // Open all modules by default
      const openState: Record<string, boolean> = {};
      courseData.modules.forEach(m => {
        openState[m.id] = true;
      });
      setOpenModules(openState);
    } catch (err) {
      console.error('Failed to load course classroom:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCourseData();
  }, [courseId, user?.id]);

  const toggleModule = (modId: string) => {
    setOpenModules(prev => ({ ...prev, [modId]: !prev[modId] }));
  };

  // Flatten lessons list for next / prev navigation
  const allLessonsWithModule = React.useMemo(() => {
    if (!course) return [];
    const list: { lesson: Lesson; module: CourseModule }[] = [];
    course.modules.forEach(m => {
      (m.lessons || []).forEach(l => {
        list.push({ lesson: l, module: m });
      });
    });
    return list;
  }, [course]);

  const currentIndex = allLessonsWithModule.findIndex(item => item.lesson.id === currentLesson?.id);
  const prevLesson = currentIndex > 0 ? allLessonsWithModule[currentIndex - 1]?.lesson : null;
  const nextLesson = currentIndex >= 0 && currentIndex < allLessonsWithModule.length - 1
    ? allLessonsWithModule[currentIndex + 1]?.lesson
    : null;

  const isCurrentCompleted = currentLesson && enrollment?.completed_lessons.includes(currentLesson.id);

  const handleMarkComplete = async () => {
    if (!course || !currentLesson || !user?.id) return;
    setIsCompleting(true);
    try {
      const res = await api.courses.completeLesson(course.id, currentLesson.id, user.id);
      setEnrollment(res.enrollment);

      // If finished course, trigger celebration!
      if (res.enrollment.progress_percentage >= 100) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      }

      // Navigate to next lesson if available
      if (nextLesson) {
        setCurrentLesson(nextLesson);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update lesson progress');
    } finally {
      setIsCompleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
        <p className="text-xs text-slate-500 font-medium">Entering interactive classroom...</p>
      </div>
    );
  }

  if (!course || !currentLesson) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Course not found or no lessons available</h2>
        <Link to="/student/courses" className="px-4 py-2 bg-purple-700 text-white rounded-xl text-xs font-bold">
          Back to Courses
        </Link>
      </div>
    );
  }

  const currentModule = allLessonsWithModule.find(item => item.lesson.id === currentLesson.id)?.module;
  const completedCount = enrollment?.completed_lessons.length || 0;
  const totalCount = allLessonsWithModule.length;
  const progressPct = enrollment?.progress_percentage || 0;

  return (
    <div className="min-h-screen bg-[#FBFAFF] flex flex-col font-sans">
      {/* Top Learning Classroom Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-purple-100 h-16 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link
            to="/student/courses"
            className="p-2 rounded-xl text-slate-500 hover:text-purple-700 hover:bg-purple-50 transition-colors"
            title="Back to Courses Catalog"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="flex flex-col">
            <h1 className="text-sm font-extrabold text-slate-900 truncate max-w-xs sm:max-w-md">
              {course.title}
            </h1>
            <span className="text-[11px] font-semibold text-purple-700 flex items-center gap-1.5">
              <span>{currentModule?.title}</span> • <span>{currentLesson.title}</span>
            </span>
          </div>
        </div>

        {/* Progress & Sidebar Toggle */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-[11px] font-bold text-slate-700">
              {completedCount} of {totalCount} completed ({progressPct}%)
            </span>
            <div className="w-36 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
              <div
                className="bg-gradient-to-r from-purple-600 to-emerald-500 h-full rounded-full transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              sidebarOpen
                ? 'bg-purple-50 text-purple-700 border-purple-200'
                : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Curriculum</span>
          </button>
        </div>
      </header>

      {/* Main Classroom Body: Lesson Content vs Curriculum Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-4xl mx-auto space-y-8">
          {/* Lesson Header */}
          <div className="space-y-3 pb-6 border-b border-purple-100">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 ${
                currentLesson.type === 'video' ? 'bg-rose-100 text-rose-700' :
                currentLesson.type === 'code' ? 'bg-indigo-100 text-indigo-700' : 'bg-purple-100 text-purple-700'
              }`}>
                {currentLesson.type === 'video' && <PlayCircle className="w-3 h-3" />}
                {currentLesson.type === 'code' && <Code2 className="w-3 h-3" />}
                {currentLesson.type === 'article' && <FileText className="w-3 h-3" />}
                {currentLesson.type} Lesson
              </span>

              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {currentLesson.duration_minutes} mins
              </span>

              {isCurrentCompleted && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 flex items-center gap-1 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" />
                  Completed
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {currentLesson.title}
            </h2>
          </div>

          {/* Embedded Video (if video lesson) */}
          {currentLesson.type === 'video' && currentLesson.video_url && (
            <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-soft-lg bg-black border border-purple-200">
              <iframe
                src={currentLesson.video_url}
                title={currentLesson.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {/* Lesson Rich Content Area */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-purple-100/80 shadow-soft space-y-6 text-slate-800 leading-relaxed font-sans">
            <MarkdownViewer content={currentLesson.content} />

            {/* Resources / Notes Box */}
            {currentLesson.resources && currentLesson.resources.length > 0 && (
              <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100 space-y-2 mt-6">
                <span className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-purple-700" /> Supplemental Study Resources
                </span>
                <ul className="space-y-1.5 pt-1">
                  {currentLesson.resources.map((res, idx) => (
                    <li key={idx}>
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-purple-700 hover:text-purple-900 font-semibold flex items-center gap-1 hover:underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        {res.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Course Completion Banner (if 100%) */}
          {progressPct >= 100 && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-soft flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase">
                  <Sparkles className="w-3.5 h-3.5" /> Course Complete
                </div>
                <h4 className="text-lg font-black">Congratulations! You finished {course.title}</h4>
                <p className="text-xs text-emerald-100">
                  Your knowledge in this domain is placement-ready. Practice related coding challenges in the Coding Arena.
                </p>
              </div>
              <Link
                to="/student/coding"
                className="px-4 py-2.5 rounded-xl bg-white text-emerald-800 text-xs font-bold shrink-0 hover:bg-emerald-50 transition-colors shadow-sm"
              >
                Practice Problems
              </Link>
            </div>
          )}

          {/* Bottom Navigation & Complete Action */}
          <div className="pt-6 border-t border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-12">
            <button
              onClick={() => prevLesson && setCurrentLesson(prevLesson)}
              disabled={!prevLesson}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                prevLesson
                  ? 'bg-white text-slate-700 border-slate-200 hover:bg-purple-50'
                  : 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous Lesson
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={handleMarkComplete}
                disabled={isCompleting}
                className={`py-2.5 px-5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${
                  isCurrentCompleted
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    : 'bg-purple-700 hover:bg-purple-800 text-white'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {isCurrentCompleted ? 'Completed (Click to Re-complete)' : 'Mark as Complete & Next'}
              </button>

              {nextLesson && (
                <button
                  onClick={() => setCurrentLesson(nextLesson)}
                  className="px-4 py-2.5 rounded-xl bg-white text-slate-700 border border-slate-200 text-xs font-bold hover:bg-purple-50 flex items-center gap-1.5 transition-all"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </main>

        {/* Right Collapsible Curriculum Sidebar */}
        {sidebarOpen && (
          <aside className="w-80 border-l border-purple-100 bg-white flex flex-col justify-between shrink-0 h-full overflow-hidden shadow-soft">
            <div className="p-4 border-b border-purple-100 flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-purple-700" />
                Course Curriculum
              </span>
              <span className="text-[11px] font-bold text-purple-700">
                {completedCount}/{totalCount} Done
              </span>
            </div>

            {/* Modules Accordion List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {course.modules.map(module => {
                const isOpen = openModules[module.id] !== false;
                const moduleLessons = module.lessons || [];
                const completedInModule = moduleLessons.filter(l => enrollment?.completed_lessons.includes(l.id)).length;

                return (
                  <div key={module.id} className="border border-slate-200 rounded-xl overflow-hidden bg-[#FBFAFF]">
                    {/* Module Title Bar */}
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="w-full p-3 text-left flex items-center justify-between bg-white hover:bg-purple-50/50 transition-colors"
                    >
                      <div className="space-y-0.5 pr-2">
                        <h4 className="text-xs font-bold text-slate-900 leading-snug">
                          {module.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-semibold">
                          {completedInModule} / {moduleLessons.length} lessons
                        </span>
                      </div>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>

                    {/* Module Lessons */}
                    {isOpen && (
                      <div className="p-1.5 space-y-1 bg-[#FBFAFF]">
                        {moduleLessons.map(lesson => {
                          const isSelected = lesson.id === currentLesson.id;
                          const isDone = enrollment?.completed_lessons.includes(lesson.id);

                          return (
                            <button
                              key={lesson.id}
                              onClick={() => setCurrentLesson(lesson)}
                              className={`w-full p-2.5 rounded-lg text-left text-xs transition-all flex items-start gap-2.5 ${
                                isSelected
                                  ? 'bg-purple-700 text-white font-bold shadow-xs'
                                  : 'text-slate-700 hover:bg-purple-50/80 font-medium'
                              }`}
                            >
                              <div className="mt-0.5 shrink-0">
                                {isDone ? (
                                  <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-300' : 'text-emerald-600'}`} />
                                ) : (
                                  lesson.type === 'video' ? (
                                    <PlayCircle className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                                  ) : lesson.type === 'code' ? (
                                    <Code2 className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                                  ) : (
                                    <FileText className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                                  )
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <p className="truncate text-xs leading-tight">{lesson.title}</p>
                                <span className={`text-[10px] ${isSelected ? 'text-purple-200' : 'text-slate-400'}`}>
                                  {lesson.duration_minutes}m • {lesson.type}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer Instructor Info */}
            <div className="p-3 border-t border-purple-100 bg-white flex items-center gap-2.5">
              <span className="text-xl">{course.instructor_avatar}</span>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-slate-800 truncate">{course.instructor_name}</span>
                <span className="text-[10px] text-slate-400 truncate">{course.instructor_title}</span>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
