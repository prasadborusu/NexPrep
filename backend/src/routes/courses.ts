import { Router, Request, Response } from 'express';
import { memoryStore, persistStore } from '../services/db';
import { Course, CourseEnrollment, CourseModule, Lesson } from '../types';

const router = Router();

// ─── GET ALL COURSES ─────────────────────────────────
router.get('/', (req: Request, res: Response) => {
  const { category, level, search, include_drafts } = req.query;

  let courses = memoryStore.courses || [];

  // Unless admin explicitly asks for drafts, only return published courses
  if (include_drafts !== 'true') {
    courses = courses.filter(c => c.is_published);
  }

  if (category && category !== 'all') {
    courses = courses.filter(c => c.category === category);
  }

  if (level && level !== 'all') {
    courses = courses.filter(c => c.level === level);
  }

  if (search) {
    const q = String(search).toLowerCase();
    courses = courses.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  return res.json(courses);
});

// ─── GET STUDENT ENROLLED COURSES ────────────────────
router.get('/student/:studentId/enrolled', (req: Request, res: Response) => {
  const studentId = req.params.studentId as string;
  const enrollments = (memoryStore.course_enrollments || []).filter(e => e.student_id === studentId);

  const enrolledCourses = enrollments.map(e => {
    const course = (memoryStore.courses || []).find(c => c.id === e.course_id);
    return {
      enrollment: e,
      course
    };
  }).filter(item => Boolean(item.course));

  return res.json(enrolledCourses);
});

// ─── GET SINGLE COURSE BY ID OR SLUG ────────────────
router.get('/:courseId', (req: Request, res: Response) => {
  const courseId = req.params.courseId as string;
  const course = (memoryStore.courses || []).find(c => c.id === courseId || c.slug === courseId);

  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }

  return res.json(course);
});

// ─── ENROLL IN A COURSE ──────────────────────────────
router.post('/:courseId/enroll', (req: Request, res: Response) => {
  const courseId = req.params.courseId as string;
  const { student_id } = req.body;

  if (!student_id) {
    return res.status(400).json({ error: 'student_id is required' });
  }

  const course = (memoryStore.courses || []).find(c => c.id === courseId || c.slug === courseId);
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }

  if (!memoryStore.course_enrollments) {
    memoryStore.course_enrollments = [];
  }

  let enrollment = memoryStore.course_enrollments.find(
    e => (e.course_id === course.id || e.course_id === courseId) && e.student_id === student_id
  );

  if (!enrollment) {
    enrollment = {
      id: `enr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      course_id: course.id,
      student_id,
      enrolled_at: new Date().toISOString(),
      completed_lessons: [],
      progress_percentage: 0
    };
    memoryStore.course_enrollments.push(enrollment);
    course.enrolled_count = (course.enrolled_count || 0) + 1;
    persistStore();
  }

  return res.json({
    message: 'Enrolled successfully',
    enrollment,
    course
  });
});

// ─── GET COURSE PROGRESS FOR STUDENT ─────────────────
router.get('/:courseId/progress/:studentId', (req: Request, res: Response) => {
  const courseId = req.params.courseId as string;
  const studentId = req.params.studentId as string;

  const course = (memoryStore.courses || []).find(c => c.id === courseId || c.slug === courseId);
  const enrollment = (memoryStore.course_enrollments || []).find(
    e => (e.course_id === course?.id || e.course_id === courseId) && e.student_id === studentId
  );

  if (!enrollment) {
    return res.json({
      enrolled: false,
      progress_percentage: 0,
      completed_lessons: []
    });
  }

  return res.json({
    enrolled: true,
    ...enrollment
  });
});

// ─── MARK LESSON COMPLETE ────────────────────────────
router.post('/:courseId/lessons/:lessonId/complete', (req: Request, res: Response) => {
  const courseId = req.params.courseId as string;
  const lessonId = req.params.lessonId as string;
  const { student_id } = req.body;

  if (!student_id) {
    return res.status(400).json({ error: 'student_id is required' });
  }

  const course = (memoryStore.courses || []).find(c => c.id === courseId || c.slug === courseId);
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }

  if (!memoryStore.course_enrollments) {
    memoryStore.course_enrollments = [];
  }

  let enrollment = memoryStore.course_enrollments.find(
    e => (e.course_id === course.id || e.course_id === courseId) && e.student_id === student_id
  );

  if (!enrollment) {
    // Automatically enroll if not enrolled
    enrollment = {
      id: `enr-${Date.now()}`,
      course_id: course.id,
      student_id,
      enrolled_at: new Date().toISOString(),
      completed_lessons: [],
      progress_percentage: 0
    };
    memoryStore.course_enrollments.push(enrollment);
  }

  if (!enrollment.completed_lessons.includes(lessonId)) {
    enrollment.completed_lessons.push(lessonId);
  }

  // Calculate total lessons in course
  const totalLessons = course.modules.reduce((sum, m) => sum + (m.lessons?.length || 0), 0);
  enrollment.progress_percentage = totalLessons > 0
    ? Math.round((enrollment.completed_lessons.length / totalLessons) * 100)
    : 0;

  if (enrollment.progress_percentage >= 100 && !enrollment.completed_at) {
    enrollment.completed_at = new Date().toISOString();
  }

  persistStore();

  return res.json({
    message: 'Lesson completed',
    enrollment
  });
});

// ═════════════════════════════════════════════════════
// ADMIN ENDPOINTS
// ═════════════════════════════════════════════════════

// ─── ADMIN: CREATE COURSE ────────────────────────────
router.post('/', (req: Request, res: Response) => {
  const {
    title,
    description,
    short_description,
    category,
    level,
    duration_hours,
    instructor_name,
    instructor_title,
    instructor_avatar,
    thumbnail_url,
    tags,
    prerequisites,
    learning_outcomes,
    modules,
    is_published
  } = req.body;

  if (!title?.trim() || !category) {
    return res.status(400).json({ error: 'Title and Category are required' });
  }

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') + `-${Math.random().toString(36).substring(2, 6)}`;

  const newCourse: Course = {
    id: `course-${Date.now()}`,
    title: title.trim(),
    slug,
    description: description?.trim() || title,
    short_description: short_description?.trim() || description?.slice(0, 140),
    category: category || 'fullstack',
    level: level || 'beginner',
    duration_hours: Number(duration_hours) || 8,
    instructor_name: instructor_name?.trim() || 'Placement Lead Instructor',
    instructor_title: instructor_title?.trim() || 'Senior Software Engineer',
    instructor_avatar: instructor_avatar || '🎓',
    thumbnail_url: thumbnail_url?.trim() || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    tags: Array.isArray(tags) ? tags : (tags ? String(tags).split(',').map(t => t.trim()) : []),
    prerequisites: Array.isArray(prerequisites) ? prerequisites : (prerequisites ? String(prerequisites).split(',').map(p => p.trim()) : []),
    learning_outcomes: Array.isArray(learning_outcomes) ? learning_outcomes : (learning_outcomes ? String(learning_outcomes).split('\n').filter(Boolean) : []),
    modules: Array.isArray(modules) && modules.length > 0 ? modules : [
      {
        id: `mod-${Date.now()}-1`,
        title: 'Module 1: Introduction & Fundamentals',
        description: 'Core concepts and environment setup',
        order: 1,
        lessons: [
          {
            id: `les-${Date.now()}-1`,
            title: 'Welcome & Overview',
            slug: 'welcome-overview',
            type: 'article',
            duration_minutes: 15,
            order: 1,
            content: `### Welcome to ${title}!\n\nIn this comprehensive course, you will learn practical, production-level engineering concepts.\n\nReview the syllabus and proceed through each lesson.`
          }
        ]
      }
    ],
    is_published: is_published !== false,
    enrolled_count: 0,
    rating: 5.0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  if (!memoryStore.courses) {
    memoryStore.courses = [];
  }
  memoryStore.courses.unshift(newCourse);
  persistStore();

  return res.status(201).json(newCourse);
});

// ─── ADMIN: UPDATE COURSE ────────────────────────────
router.put('/:courseId', (req: Request, res: Response) => {
  const courseId = req.params.courseId as string;
  const courseIndex = (memoryStore.courses || []).findIndex(c => c.id === courseId);

  if (courseIndex === -1) {
    return res.status(404).json({ error: 'Course not found' });
  }

  const existing = memoryStore.courses[courseIndex];
  const updated: Course = {
    ...existing,
    ...req.body,
    id: existing.id,
    updated_at: new Date().toISOString()
  };

  memoryStore.courses[courseIndex] = updated;
  persistStore();

  return res.json(updated);
});

// ─── ADMIN: TOGGLE PUBLISHED STATUS ─────────────────
router.patch('/:courseId/publish', (req: Request, res: Response) => {
  const courseId = req.params.courseId as string;
  const course = (memoryStore.courses || []).find(c => c.id === courseId);

  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }

  course.is_published = !course.is_published;
  course.updated_at = new Date().toISOString();
  persistStore();

  return res.json({ is_published: course.is_published, course });
});

// ─── ADMIN: DELETE COURSE ────────────────────────────
router.delete('/:courseId', (req: Request, res: Response) => {
  const courseId = req.params.courseId as string;
  const initialLength = memoryStore.courses.length;
  memoryStore.courses = memoryStore.courses.filter(c => c.id !== courseId);

  if (memoryStore.courses.length === initialLength) {
    return res.status(404).json({ error: 'Course not found' });
  }

  persistStore();
  return res.json({ message: 'Course deleted successfully' });
});

// ─── ADMIN: GET COURSE STATS ─────────────────────────
router.get('/admin/stats', (req: Request, res: Response) => {
  const courses = memoryStore.courses || [];
  const enrollments = memoryStore.course_enrollments || [];

  const totalCourses = courses.length;
  const publishedCourses = courses.filter(c => c.is_published).length;
  const totalEnrollments = enrollments.length;
  const totalCompleted = enrollments.filter(e => e.progress_percentage >= 100).length;

  return res.json({
    total_courses: totalCourses,
    published_courses: publishedCourses,
    draft_courses: totalCourses - publishedCourses,
    total_enrollments: totalEnrollments,
    total_completed: totalCompleted,
    completion_rate: totalEnrollments > 0 ? Math.round((totalCompleted / totalEnrollments) * 100) : 0
  });
});

export default router;
