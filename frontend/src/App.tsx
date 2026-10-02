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
import { CodingPlatformPage } from './pages/student/CodingPlatformPage';
import { ResumeHubPage } from './pages/student/ResumeHubPage';
import { ResumeBuilderPage } from './pages/student/ResumeBuilderPage';
import { ATSAnalyzerPage } from './pages/student/ATSAnalyzerPage';
import { SkillGapPage } from './pages/student/SkillGapPage';
import { RoadmapPage } from './pages/student/RoadmapPage';
import { InterviewPrepPage } from './pages/student/InterviewPrepPage';
import { PlacementDrivesPage } from './pages/student/PlacementDrivesPage';
import { NotificationsPage } from './pages/student/NotificationsPage';
import { SettingsPage } from './pages/student/SettingsPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminStudentsPage } from './pages/admin/AdminStudentsPage';
import { AdminAssessmentsPage } from './pages/admin/AdminAssessmentsPage';
import { AdminQuestionsPage } from './pages/admin/AdminQuestionsPage';
import { AdminCodingProblemsPage } from './pages/admin/AdminCodingProblemsPage';
import { AdminPlacementsPage } from './pages/admin/AdminPlacementsPage';
import { AdminBulkEmailPage } from './pages/admin/AdminBulkEmailPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ================================================================= */}
          {/* 1. PUBLIC MARKETING WEBSITE (PublicLayout with Navbar + Footer) */}
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
          {/* 2. AUTHENTICATION (AuthLayout) */}
          {/* ================================================================= */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          {/* ================================================================= */}
          {/* 3. STUDENT APPLICATION (StudentLayout with Student Sidebar) */}
          {/* ================================================================= */}
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="assessments" element={<AssessmentsPage />} />
            <Route path="results" element={<AssessmentResultPage />} />
            <Route path="assessments/:id/result" element={<AssessmentResultPage />} />
            <Route path="coding" element={<CodingPlatformPage />} />
            <Route path="coding/:problemId" element={<CodingPlatformPage />} />
            <Route path="resume" element={<ResumeHubPage />} />
            <Route path="resume/builder" element={<ResumeBuilderPage />} />
            <Route path="resume/analyzer" element={<ATSAnalyzerPage />} />
            <Route path="skills" element={<SkillGapPage />} />
            <Route path="roadmap" element={<RoadmapPage />} />
            <Route path="interview" element={<InterviewPrepPage />} />
            <Route path="placements" element={<PlacementDrivesPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Dedicated Fullscreen Exam Proctoring Route (No distracting sidebars during timed exam) */}
          <Route path="/student/assessments/:id" element={<TakeAssessmentPage />} />

          {/* ================================================================= */}
          {/* 4. ADMIN APPLICATION (AdminLayout with Institutional Sidebar) */}
          {/* ================================================================= */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="students" element={<AdminStudentsPage />} />
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
          {/* 5. BACKWARD-COMPATIBILITY REDIRECTS */}
          {/* ================================================================= */}
          <Route path="/auth/login" element={<Navigate to="/login" replace />} />
          <Route path="/auth/register" element={<Navigate to="/register" replace />} />
          <Route path="/dashboard" element={<Navigate to="/student/dashboard" replace />} />
          <Route path="/profile" element={<Navigate to="/student/profile" replace />} />
          <Route path="/coding" element={<Navigate to="/student/coding" replace />} />
          <Route path="/resume-builder" element={<Navigate to="/student/resume/builder" replace />} />
          <Route path="/ats-analyzer" element={<Navigate to="/student/resume/analyzer" replace />} />
          <Route path="/skill-gap" element={<Navigate to="/student/skills" replace />} />
          <Route path="/roadmap" element={<Navigate to="/student/roadmap" replace />} />
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
