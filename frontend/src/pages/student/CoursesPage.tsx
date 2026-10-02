import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Course, CourseEnrollment } from '../../types';
import {
  GraduationCap,
  BookOpen,
  Search,
  Sparkles,
  Clock,
  Users,
  Star,
  Layers,
  ChevronRight,
  CheckCircle2,
  PlayCircle,
  Filter,
  Flame,
  Award
} from 'lucide-react';

export const CoursesPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledMap, setEnrolledMap] = useState<Record<string, CourseEnrollment>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'enrolled'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [coursesData, enrolledData] = await Promise.all([
        api.courses.list(),
        user?.id ? api.courses.getEnrolled(user.id).catch(() => []) : Promise.resolve([])
      ]);

      setCourses(coursesData);

      const map: Record<string, CourseEnrollment> = {};
      enrolledData.forEach(item => {
        map[item.course.id] = item.enrollment;
      });
      setEnrolledMap(map);
    } catch (err) {
      console.error('Failed to load courses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const handleEnroll = async (courseId: string) => {
    if (!user?.id) {
      navigate(`/login?redirect=/student/courses`);
      return;
    }
    setEnrollingId(courseId);
    try {
      const res = await api.courses.enroll(courseId, user.id);
      setEnrolledMap(prev => ({
        ...prev,
        [courseId]: res.enrollment
      }));
      // Navigate straight to the learning player
      navigate(`/student/courses/${courseId}/learn`);
    } catch (err: any) {
      alert(err.message || 'Failed to enroll');
    } finally {
      setEnrollingId(null);
    }
  };

  // Filter courses
  const filteredCourses = courses.filter(c => {
    if (categoryFilter !== 'all' && c.category !== categoryFilter) return false;
    if (levelFilter !== 'all' && c.level !== levelFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchDesc = c.description.toLowerCase().includes(q);
      const matchTags = c.tags.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTags) return false;
    }
    return true;
  });

  const enrolledCoursesList = courses.filter(c => Boolean(enrolledMap[c.id]));

  const displayedCourses = activeTab === 'enrolled' ? enrolledCoursesList : filteredCourses;

  const categories = [
    { id: 'all', label: 'All Domains' },
    { id: 'python', label: 'Python & Backend' },
    { id: 'dsa', label: 'DSA & Algorithms' },
    { id: 'system_design', label: 'System Design' },
    { id: 'core_cs', label: 'Core CS Fundamentals' },
    { id: 'fullstack', label: 'Full Stack Web' }
  ];

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 rounded-3xl p-8 text-white shadow-soft-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-purple-200 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            Curated Placement Curriculum
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Engineering Courses & Placement Prep
          </h1>
          <p className="text-sm text-purple-200 leading-relaxed">
            Master high-yield technical disciplines screened by top tier tech companies: Python internals, algorithmic patterns, distributed system design, and operating systems.
          </p>
        </div>
      </div>

      {/* Tabs & Search Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-purple-100 pb-4">
        {/* Navigation Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'all'
                ? 'bg-purple-700 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-purple-50 border border-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Browse Catalog ({courses.length})
          </button>
          <button
            onClick={() => setActiveTab('enrolled')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'enrolled'
                ? 'bg-purple-700 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-purple-50 border border-slate-200'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-500" />
            My Enrolled Courses ({enrolledCoursesList.length})
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by skill, topic, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-purple-600 bg-white"
          />
        </div>
      </div>

      {/* Filter Chips (Only in Catalog View) */}
      {activeTab === 'all' && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Domain:
          </span>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                categoryFilter === cat.id
                  ? 'bg-purple-100 text-purple-800 border border-purple-300 font-bold'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}

          <div className="h-4 w-px bg-slate-300 mx-2 hidden sm:block" />

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-600 focus:outline-none focus:border-purple-600"
          >
            <option value="all">All Difficulty Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      )}

      {/* Courses Grid */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
          <p className="text-xs text-slate-500 font-medium">Loading placement courses...</p>
        </div>
      ) : displayedCourses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-purple-100 p-12 text-center space-y-4 shadow-soft">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {activeTab === 'enrolled' ? "You haven't enrolled in any courses yet" : 'No courses match your criteria'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {activeTab === 'enrolled'
              ? 'Browse the catalog above and enroll in comprehensive Python, DSA, System Design, and CS tracks to begin.'
              : 'Try clearing your search query or switching domains to view available curriculums.'}
          </p>
          {activeTab === 'enrolled' && (
            <button
              onClick={() => setActiveTab('all')}
              className="px-4 py-2 bg-purple-700 text-white rounded-xl text-xs font-bold hover:bg-purple-800 transition-colors"
            >
              Explore Course Catalog
            </button>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedCourses.map(course => {
            const enrollment = enrolledMap[course.id];
            const isEnrolled = Boolean(enrollment);
            const totalLessons = course.modules.reduce((sum, m) => sum + (m.lessons?.length || 0), 0);
            const isCompleted = enrollment && enrollment.progress_percentage >= 100;

            return (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-purple-100/80 shadow-soft hover:shadow-soft-lg transition-all flex flex-col overflow-hidden group"
              >
                {/* Course Thumbnail Image */}
                <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                  <img
                    src={course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80'}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  {/* Level Badge */}
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase shadow-sm ${
                      course.level === 'beginner' ? 'bg-emerald-500 text-white' :
                      course.level === 'intermediate' ? 'bg-blue-600 text-white' : 'bg-purple-700 text-white'
                    }`}>
                      {course.level}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-black/60 text-white backdrop-blur-xs">
                      {course.category.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Rating / Enrolled overlay */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{course.rating.toFixed(1)}</span>
                      <span className="text-slate-300 text-[11px]">({course.enrolled_count} learners)</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-purple-200">
                      <Clock className="w-3 h-3" />
                      <span>{course.duration_hours}h total</span>
                    </div>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-purple-700 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {course.short_description || course.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {course.tags.slice(0, 4).map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-semibold">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Modules count & instructor */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{course.instructor_avatar}</span>
                      <span className="font-medium text-slate-700 truncate max-w-[120px]">
                        {course.instructor_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600">
                      <Layers className="w-3.5 h-3.5 text-purple-600" />
                      <span>{course.modules.length} modules • {totalLessons} lessons</span>
                    </div>
                  </div>

                  {/* Progress bar if enrolled */}
                  {isEnrolled && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-slate-600">Progress</span>
                        <span className="text-purple-700">{enrollment.progress_percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-purple-600 to-indigo-600 h-full rounded-full transition-all"
                          style={{ width: `${enrollment.progress_percentage}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-1">
                    {isEnrolled ? (
                      <Link
                        to={`/student/courses/${course.id}/learn`}
                        className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${
                          isCompleted
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-purple-700 hover:bg-purple-800 text-white'
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <Award className="w-4 h-4" />
                            Completed • Review Course
                          </>
                        ) : (
                          <>
                            <PlayCircle className="w-4 h-4" />
                            Continue Learning
                          </>
                        )}
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleEnroll(course.id)}
                        disabled={enrollingId === course.id}
                        className="w-full py-2.5 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
                      >
                        {enrollingId === course.id ? (
                          'Enrolling...'
                        ) : (
                          <>
                            <GraduationCap className="w-4 h-4" />
                            Enroll Free • Start Learning
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
