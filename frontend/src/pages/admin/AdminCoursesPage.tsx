import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Course, CourseModule, Lesson } from '../../types';
import {
  GraduationCap,
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  Clock,
  Layers,
  Users,
  Award,
  X,
  PlusCircle,
  FileText,
  PlayCircle,
  Code2,
  AlertCircle
} from 'lucide-react';

export const AdminCoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Course['category']>('python');
  const [level, setLevel] = useState<Course['level']>('intermediate');
  const [durationHours, setDurationHours] = useState(10);
  const [instructorName, setInstructorName] = useState('');
  const [instructorTitle, setInstructorTitle] = useState('');
  const [instructorAvatar, setInstructorAvatar] = useState('🎓');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [tags, setTags] = useState('');
  const [prerequisites, setPrerequisites] = useState('');
  const [learningOutcomes, setLearningOutcomes] = useState('');
  const [modules, setModules] = useState<CourseModule[]>([
    {
      id: `mod-init-1`,
      title: 'Module 1: Introduction & Fundamentals',
      description: 'Core concepts and environment setup',
      order: 1,
      lessons: [
        {
          id: `les-init-1`,
          title: 'Lesson 1: Welcome & Overview',
          slug: 'welcome-overview',
          type: 'article',
          duration_minutes: 20,
          order: 1,
          content: '### Overview\n\nWelcome to this comprehensive technical module. Master the foundational requirements before proceeding.'
        }
      ]
    }
  ]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [coursesData, statsData] = await Promise.all([
        api.courses.list({ include_drafts: true }),
        api.courses.getStats().catch(() => null)
      ]);
      setCourses(coursesData);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load admin courses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingCourse(null);
    setTitle('');
    setShortDescription('');
    setDescription('');
    setCategory('python');
    setLevel('intermediate');
    setDurationHours(12);
    setInstructorName('Senior Staff Placement Lead');
    setInstructorTitle('Principal Software Architect');
    setInstructorAvatar('💻');
    setThumbnailUrl('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80');
    setTags('Python, Algorithms, System Design');
    setPrerequisites('Basic programming fundamentals');
    setLearningOutcomes('Master core architecture patterns\nImplement production APIs\nExcel in technical interviews');
    setModules([
      {
        id: `mod-${Date.now()}-1`,
        title: 'Module 1: Core Fundamentals',
        description: 'Key principles and foundational architecture',
        order: 1,
        lessons: [
          {
            id: `les-${Date.now()}-1`,
            title: 'Lesson 1: Technical Concepts & Walkthrough',
            slug: 'technical-walkthrough',
            type: 'article',
            duration_minutes: 25,
            order: 1,
            content: '### Technical Blueprint\n\nReview this in-depth guide to master key engineering principles.'
          }
        ]
      }
    ]);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    setTitle(course.title);
    setShortDescription(course.short_description || '');
    setDescription(course.description);
    setCategory(course.category);
    setLevel(course.level);
    setDurationHours(course.duration_hours);
    setInstructorName(course.instructor_name);
    setInstructorTitle(course.instructor_title || '');
    setInstructorAvatar(course.instructor_avatar || '🎓');
    setThumbnailUrl(course.thumbnail_url || '');
    setTags(course.tags.join(', '));
    setPrerequisites(course.prerequisites.join(', '));
    setLearningOutcomes(course.learning_outcomes.join('\n'));
    setModules(course.modules && course.modules.length > 0 ? course.modules : []);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleTogglePublish = async (courseId: string) => {
    try {
      const res = await api.courses.togglePublish(courseId);
      setCourses(prev => prev.map(c => c.id === courseId ? { ...c, is_published: res.is_published } : c));
    } catch (err: any) {
      alert(err.message || 'Failed to toggle status');
    }
  };

  const handleDelete = async (courseId: string) => {
    if (!window.confirm('Are you sure you want to delete this course? Enrolled students will lose access.')) {
      return;
    }
    try {
      await api.courses.delete(courseId);
      setCourses(prev => prev.filter(c => c.id !== courseId));
    } catch (err: any) {
      alert(err.message || 'Failed to delete course');
    }
  };

  // Add / Edit Module Helpers
  const addModule = () => {
    const newMod: CourseModule = {
      id: `mod-${Date.now()}`,
      title: `Module ${modules.length + 1}: New Topic`,
      description: 'Module objectives and curriculum',
      order: modules.length + 1,
      lessons: [
        {
          id: `les-${Date.now()}`,
          title: 'Lesson 1: Introduction',
          slug: 'intro',
          type: 'article',
          duration_minutes: 20,
          order: 1,
          content: '### Welcome\n\nStudy this material carefully.'
        }
      ]
    };
    setModules([...modules, newMod]);
  };

  const addLesson = (modIndex: number) => {
    const updated = [...modules];
    const targetMod = updated[modIndex];
    const lessonOrder = (targetMod.lessons?.length || 0) + 1;
    const newLesson: Lesson = {
      id: `les-${Date.now()}`,
      title: `Lesson ${lessonOrder}: Practical Application`,
      slug: `lesson-${lessonOrder}`,
      type: 'article',
      duration_minutes: 20,
      order: lessonOrder,
      content: '### Lesson Content\n\nAdd your code examples or video tutorial here.'
    };
    targetMod.lessons = [...(targetMod.lessons || []), newLesson];
    setModules(updated);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Course Title is required');
      return;
    }

    setIsSaving(true);
    setFormError(null);

    const payload: Partial<Course> = {
      title: title.trim(),
      short_description: shortDescription.trim(),
      description: description.trim() || title.trim(),
      category,
      level,
      duration_hours: Number(durationHours) || 8,
      instructor_name: instructorName.trim() || 'Placement Instructor',
      instructor_title: instructorTitle.trim(),
      instructor_avatar: instructorAvatar.trim() || '🎓',
      thumbnail_url: thumbnailUrl.trim(),
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      prerequisites: prerequisites.split(',').map(p => p.trim()).filter(Boolean),
      learning_outcomes: learningOutcomes.split('\n').map(o => o.trim()).filter(Boolean),
      modules
    };

    try {
      if (editingCourse) {
        const updated = await api.courses.update(editingCourse.id, payload);
        setCourses(prev => prev.map(c => c.id === updated.id ? updated : c));
      } else {
        const created = await api.courses.create(payload);
        setCourses(prev => [created, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save course');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredCourses = courses.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q);
  });

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-100">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Courses & Curriculum Management</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200">
              Admin Portal
            </span>
          </div>
          <p className="text-xs text-slate-500">Create, curate, and manage technical courses, modules, and video lessons for candidate placement prep</p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create New Course
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-soft space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Courses</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-slate-900">{stats?.total_courses ?? courses.length}</span>
            <BookOpen className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-[11px] text-slate-500">{stats?.published_courses ?? courses.filter(c=>c.is_published).length} Published</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-soft space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Enrollments</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-slate-900">{stats?.total_enrollments ?? 0}</span>
            <Users className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-[11px] text-slate-500">Candidate learner accounts</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-soft space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Course Completions</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-slate-900">{stats?.total_completed ?? 0}</span>
            <Award className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-[11px] text-emerald-600 font-bold">{stats?.completion_rate ?? 0}% Completion Rate</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-soft space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Published Status</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-purple-700">
              {courses.filter(c => c.is_published).length} / {courses.length}
            </span>
            <CheckCircle2 className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-[11px] text-slate-500">Live in Student Catalog</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search courses by title or domain..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-purple-600 bg-white"
          />
        </div>
      </div>

      {/* Courses Management Table */}
      <div className="bg-white rounded-2xl border border-purple-100 shadow-soft overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700 mx-auto"></div>
            <p className="text-xs text-slate-500">Loading courses...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No courses found</h3>
            <p className="text-xs text-slate-400">Click "Create New Course" above to add your first course curriculum.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4">Domain</th>
                  <th className="py-3 px-4">Level</th>
                  <th className="py-3 px-4">Instructor</th>
                  <th className="py-3 px-4">Curriculum</th>
                  <th className="py-3 px-4">Enrolled</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCourses.map(course => {
                  const totalLessons = course.modules.reduce((sum, m) => sum + (m.lessons?.length || 0), 0);

                  return (
                    <tr key={course.id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900 max-w-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80'}
                            alt=""
                            className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200"
                          />
                          <div className="truncate">
                            <p className="truncate font-extrabold text-slate-900">{course.title}</p>
                            <p className="text-[10px] text-slate-400 font-normal truncate">{course.short_description || course.description}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-50 text-purple-700 border border-purple-100">
                          {course.category.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                          course.level === 'beginner' ? 'bg-emerald-50 text-emerald-700' :
                          course.level === 'intermediate' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                        }`}>
                          {course.level}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        <div className="flex items-center gap-1.5">
                          <span>{course.instructor_avatar}</span>
                          <span className="truncate max-w-[110px]">{course.instructor_name}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">
                        <span className="font-semibold">{course.modules.length} mods</span> • <span>{totalLessons} lessons</span>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-slate-700">
                        {course.enrolled_count}
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleTogglePublish(course.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all flex items-center gap-1 ${
                            course.is_published
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                          }`}
                          title="Click to toggle publish status"
                        >
                          {course.is_published ? (
                            <>
                              <Eye className="w-3 h-3" /> Published
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" /> Draft
                            </>
                          )}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(course)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-purple-700 hover:bg-purple-50 transition-colors"
                            title="Edit Course"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(course.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Course"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Course Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full border border-purple-100 shadow-soft-2xl my-8 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-purple-100 flex items-center justify-between shrink-0 bg-[#FBFAFF]">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {editingCourse ? 'Edit Course Curriculum' : 'Create New Technical Course'}
                </h3>
                <p className="text-xs text-slate-500">Provide course parameters, instructor details, and structured syllabus modules</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveCourse} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {formError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Title & Domain */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Course Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Python Backend & Microservices Mastery"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-purple-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Category / Domain *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-purple-600 focus:outline-none"
                  >
                    <option value="python">Python & Backend</option>
                    <option value="dsa">DSA & Algorithms</option>
                    <option value="system_design">System Design</option>
                    <option value="core_cs">Core CS (OS, DBMS, Networks)</option>
                    <option value="fullstack">Full Stack Web</option>
                    <option value="devops">Cloud & DevOps</option>
                  </select>
                </div>
              </div>

              {/* Level & Hours */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Difficulty Level</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-purple-600 focus:outline-none"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Estimated Duration (Hours)</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={durationHours}
                    onChange={(e) => setDurationHours(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-purple-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Short Description */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Short Description (Catalog Preview)</label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="One sentence summary for catalog cards..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-purple-600 focus:outline-none"
                />
              </div>

              {/* Full Description */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Full Course Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed overview of syllabus and technical skills covered..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-purple-600 focus:outline-none"
                />
              </div>

              {/* Instructor Details & Thumbnail */}
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Instructor Name</label>
                  <input
                    type="text"
                    value={instructorName}
                    onChange={(e) => setInstructorName(e.target.value)}
                    placeholder="Enter instructor or department name"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-purple-600 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Instructor Title</label>
                  <input
                    type="text"
                    value={instructorTitle}
                    onChange={(e) => setInstructorTitle(e.target.value)}
                    placeholder="e.g. Senior Staff Engineer"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-purple-600 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Instructor Avatar (Emoji)</label>
                  <input
                    type="text"
                    value={instructorAvatar}
                    onChange={(e) => setInstructorAvatar(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-purple-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Thumbnail URL */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Thumbnail Image URL</label>
                <input
                  type="text"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-purple-600 focus:outline-none"
                />
              </div>

              {/* Tags & Prerequisites */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Python, FastAPI, SQL, Docker"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-purple-600 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Prerequisites (comma-separated)</label>
                  <input
                    type="text"
                    value={prerequisites}
                    onChange={(e) => setPrerequisites(e.target.value)}
                    placeholder="Basic Python, SQL basics"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-purple-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Modules & Lessons Curriculum Builder */}
              <div className="pt-4 border-t border-purple-100 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-purple-700" />
                    Curriculum Modules & Lessons ({modules.length} Modules)
                  </span>
                  <button
                    type="button"
                    onClick={addModule}
                    className="px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Module
                  </button>
                </div>

                <div className="space-y-4">
                  {modules.map((mod, modIdx) => (
                    <div key={mod.id} className="p-4 rounded-2xl border border-purple-100 bg-[#FBFAFF] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-purple-900">Module #{modIdx + 1}</span>
                        <button
                          type="button"
                          onClick={() => setModules(modules.filter((_, idx) => idx !== modIdx))}
                          className="text-rose-500 hover:text-rose-700 font-bold"
                        >
                          Remove Module
                        </button>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={mod.title}
                          onChange={(e) => {
                            const updated = [...modules];
                            updated[modIdx].title = e.target.value;
                            setModules(updated);
                          }}
                          placeholder="Module Title (e.g. Asynchronous APIs)"
                          className="p-2 rounded-lg border border-slate-200 bg-white"
                        />
                        <input
                          type="text"
                          value={mod.description}
                          onChange={(e) => {
                            const updated = [...modules];
                            updated[modIdx].description = e.target.value;
                            setModules(updated);
                          }}
                          placeholder="Module Description"
                          className="p-2 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>

                      {/* Lessons in Module */}
                      <div className="space-y-2 pt-2 border-t border-purple-50">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-500">Lessons ({mod.lessons?.length || 0})</span>
                          <button
                            type="button"
                            onClick={() => addLesson(modIdx)}
                            className="text-[11px] font-bold text-purple-700 hover:underline flex items-center gap-1"
                          >
                            <PlusCircle className="w-3.5 h-3.5" /> Add Lesson
                          </button>
                        </div>

                        {mod.lessons.map((lesson, lesIdx) => (
                          <div key={lesson.id} className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                            <div className="grid sm:grid-cols-3 gap-2">
                              <input
                                type="text"
                                value={lesson.title}
                                onChange={(e) => {
                                  const updated = [...modules];
                                  updated[modIdx].lessons[lesIdx].title = e.target.value;
                                  setModules(updated);
                                }}
                                placeholder="Lesson Title"
                                className="sm:col-span-2 p-1.5 rounded-lg border border-slate-200 text-xs font-semibold"
                              />
                              <select
                                value={lesson.type}
                                onChange={(e) => {
                                  const updated = [...modules];
                                  updated[modIdx].lessons[lesIdx].type = e.target.value as any;
                                  setModules(updated);
                                }}
                                className="p-1.5 rounded-lg border border-slate-200 text-xs"
                              >
                                <option value="article">Article / Reading</option>
                                <option value="video">Video Tutorial</option>
                                <option value="code">Code Lab</option>
                                <option value="quiz">Assessment Quiz</option>
                              </select>
                            </div>

                            {lesson.type === 'video' && (
                              <input
                                type="text"
                                value={lesson.video_url || ''}
                                onChange={(e) => {
                                  const updated = [...modules];
                                  updated[modIdx].lessons[lesIdx].video_url = e.target.value;
                                  setModules(updated);
                                }}
                                placeholder="Video URL (e.g. YouTube Embed Link https://www.youtube.com/embed/...)"
                                className="w-full p-1.5 rounded-lg border border-slate-200 text-[11px]"
                              />
                            )}

                            <textarea
                              rows={2}
                              value={lesson.content}
                              onChange={(e) => {
                                const updated = [...modules];
                                updated[modIdx].lessons[lesIdx].content = e.target.value;
                                setModules(updated);
                              }}
                              placeholder="Lesson content notes, code snippets, or markdown..."
                              className="w-full p-2 rounded-lg border border-slate-200 text-xs font-mono"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-purple-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold transition-all shadow-sm"
                >
                  {isSaving ? 'Saving Course...' : (editingCourse ? 'Save Changes' : 'Create & Publish Course')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
