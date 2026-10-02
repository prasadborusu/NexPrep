import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { StudentLayout } from './layouts/StudentLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { AuthLayout } from './layouts/AuthLayout';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { AIResumePage } from './pages/AIResumePage';
import { AssessmentsOverviewPage } from './pages/AssessmentsOverviewPage';
import { AboutPage } from './pages/AboutPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';

// Student Pages
import { DashboardPage } from './pages/student/DashboardPage';
import { ProfilePage } from './pages/student/ProfilePage';
import { AssessmentsPage } from './pages/student/AssessmentsPage';
import { TakeAssessmentPage } from './pages/student/TakeAssessmentPage';
import { AssessmentResultPage } from './pages/student/AssessmentResultPage';
import { CodingTopicsPage } from './pages/student/CodingTopicsPage';
import { CodingTopicDetailPage } from './pages/student/CodingTopicDetailPage';
import { CodingIDEPage } from './pages/student/CodingIDEPage';
import { CodingSubmissionsPage } from './pages/student/CodingSubmissionsPage';
import { ResumeStudioPage } from './pages/student/ResumeStudioPage';
import { ResumeBuilderPage } from './pages/student/ResumeBuilderPage';
import { ATSAnalyzerPage } from './pages/student/ATSAnalyzerPage';
import { SkillGapPage } from './pages/student/SkillGapPage';

// Interview Pages — Company Directory & Sub-pages
import { CompanyDirectoryPage } from './pages/student/CompanyDirectoryPage';
import { CompanyDetailPage } from './pages/student/CompanyDetailPage';
import { CompanyTheoryPage } from './pages/student/CompanyTheoryPage';
import { CompanyCodingPage } from './pages/student/CompanyCodingPage';
import { CompanyAptitudePage } from './pages/student/CompanyAptitudePage';
import { CompanyHRPage } from './pages/student/CompanyHRPage';

// AI Mock Interview (original)
import { InterviewPrepPage } from './pages/student/InterviewPrepPage';

import { PlacementDrivesPage } from './pages/student/PlacementDrivesPage';
import { NotificationsPage } from './pages/student/NotificationsPage';
import { SettingsPage } from './pages/student/SettingsPage';

import { ProtectedRoute } from './components/common/ProtectedRoute';

// Course Pages
import { CoursesPage } from './pages/student/CoursesPage';
import { CourseLearnPage } from './pages/student/CourseLearnPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminStudentsPage } from './pages/admin/AdminStudentsPage';
import { AdminAssessmentsPage } from './pages/admin/AdminAssessmentsPage';
import { AdminQuestionsPage } from './pages/admin/AdminQuestionsPage';
import { AdminCodingProblemsPage } from './pages/admin/AdminCodingProblemsPage';
import { AdminPlacementsPage } from './pages/admin/AdminPlacementsPage';
import { AdminBulkEmailPage } from './pages/admin/AdminBulkEmailPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminCoursesPage } from './pages/admin/AdminCoursesPage';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ================================================================= */}
          {/* 1. PUBLIC MARKETING WEBSITE (PublicLayout with Navbar + Footer)  */}
          {/* ================================================================= */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/ai-resume" element={<AIResumePage />} />
            <Route path="/assessments" element={<AssessmentsOverviewPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Route>

          {/* ================================================================= */}
          {/* 2. AUTHENTICATION (AuthLayout)                                   */}
          {/* ================================================================= */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          {/* ================================================================= */}
          {/* 3. STUDENT APPLICATION (StudentLayout with Student Sidebar)       */}
          {/* ================================================================= */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRole="student">
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="profile" element={<ProfilePage />} />

            {/* Courses & Curriculum */}
            <Route path="courses" element={<CoursesPage />} />

            {/* Assessments */}
            <Route path="assessments" element={<AssessmentsPage />} />
            <Route path="results" element={<AssessmentResultPage />} />
            <Route path="assessments/:id/result" element={<AssessmentResultPage />} />

            {/* Coding Practice */}
            <Route path="coding" element={<CodingTopicsPage />} />
            <Route path="coding/topic/:topicId" element={<CodingTopicDetailPage />} />
            <Route path="coding/submissions" element={<CodingSubmissionsPage />} />

            {/* AI Resume Studio */}
            <Route path="resume" element={<ResumeStudioPage />} />
            <Route path="resume/builder" element={<ResumeBuilderPage />} />
            <Route path="resume/builder/:resumeId" element={<ResumeBuilderPage />} />
            <Route path="resume/analyzer" element={<ATSAnalyzerPage />} />

            {/* Skills & Roadmap */}
            <Route path="skills" element={<SkillGapPage />} />

            {/* Interview Prep — Company Directory (main interview page) */}
            <Route path="interview" element={<CompanyDirectoryPage />} />
            <Route path="interview/company/:companyId" element={<CompanyDetailPage />} />
            <Route path="interview/company/:companyId/theory" element={<CompanyTheoryPage />} />
            <Route path="interview/company/:companyId/coding" element={<CompanyCodingPage />} />
            <Route path="interview/company/:companyId/aptitude" element={<CompanyAptitudePage />} />
            <Route path="interview/company/:companyId/hr" element={<CompanyHRPage />} />

            {/* AI Mock Interview (standalone session) */}
            <Route path="interview/mock" element={<InterviewPrepPage />} />

            {/* Placements & Notifications */}
            <Route path="placements" element={<PlacementDrivesPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* ================================================================= */}
          {/* 4. FULLSCREEN ROUTES (No Sidebar — exam/IDE mode)                */}
          {/* ================================================================= */}

          {/* Full-screen Assessment (no sidebar distraction) */}
          <Route
            path="/student/assessments/:id"
            element={
              <ProtectedRoute allowedRole="student">
                <TakeAssessmentPage />
              </ProtectedRoute>
            }
          />

          {/* Full-screen Coding IDE (Monaco + Piston + Console) */}
          <Route
            path="/student/coding/problem/:problemId"
            element={
              <ProtectedRoute allowedRole="student">
                <CodingIDEPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/coding/:problemId"
            element={
              <ProtectedRoute allowedRole="student">
                <CodingIDEPage />
              </ProtectedRoute>
            }
          />

          {/* Full-screen Course Classroom & Learning Player */}
          <Route
            path="/student/courses/:courseId/learn"
            element={
              <ProtectedRoute allowedRole="student">
                <CourseLearnPage />
              </ProtectedRoute>
            }
          />

          {/* ================================================================= */}
          {/* 5. ADMIN APPLICATION (AdminLayout with Institutional Sidebar)     */}
          {/* ================================================================= */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="students" element={<AdminStudentsPage />} />
            <Route path="courses" element={<AdminCoursesPage />} />
            <Route path="assessments" element={<AdminAssessmentsPage />} />
            <Route path="assessments/create" element={<AdminAssessmentsPage />} />
            <Route path="questions" element={<AdminQuestionsPage />} />
            <Route path="coding" element={<AdminCodingProblemsPage />} />
            <Route path="placements" element={<AdminPlacementsPage />} />
            <Route path="emails" element={<AdminBulkEmailPage />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* ================================================================= */}
          {/* 6. BACKWARD-COMPATIBILITY REDIRECTS                              */}
          {/* ================================================================= */}
          <Route path="/auth/login" element={<Navigate to="/login" replace />} />
          <Route path="/auth/register" element={<Navigate to="/register" replace />} />
          <Route path="/dashboard" element={<Navigate to="/student/dashboard" replace />} />
          <Route path="/courses" element={<Navigate to="/student/courses" replace />} />
          <Route path="/profile" element={<Navigate to="/student/profile" replace />} />
          <Route path="/coding" element={<Navigate to="/student/coding" replace />} />
          <Route path="/resume-builder" element={<Navigate to="/student/resume/builder" replace />} />
          <Route path="/ats-analyzer" element={<Navigate to="/student/resume/analyzer" replace />} />
          <Route path="/skill-gap" element={<Navigate to="/student/skills" replace />} />
          <Route path="/interview-prep" element={<Navigate to="/student/interview" replace />} />
          <Route path="/placements" element={<Navigate to="/student/placements" replace />} />
          <Route path="/settings" element={<Navigate to="/student/settings" replace />} />
          <Route path="/admin/bulk-email" element={<Navigate to="/admin/emails" replace />} />

          {/* Catch-all 404 fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
