import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { DashboardPage } from './pages/student/DashboardPage';
import { ProfilePage } from './pages/student/ProfilePage';
import { AssessmentsPage } from './pages/student/AssessmentsPage';
import { TakeAssessmentPage } from './pages/student/TakeAssessmentPage';
import { AssessmentResultPage } from './pages/student/AssessmentResultPage';
import { CodingPlatformPage } from './pages/student/CodingPlatformPage';
import { ResumeBuilderPage } from './pages/student/ResumeBuilderPage';
import { ATSAnalyzerPage } from './pages/student/ATSAnalyzerPage';
import { SkillGapPage } from './pages/student/SkillGapPage';
import { RoadmapPage } from './pages/student/RoadmapPage';
import { InterviewPrepPage } from './pages/student/InterviewPrepPage';
import { PlacementDrivesPage } from './pages/student/PlacementDrivesPage';
import { SettingsPage } from './pages/student/SettingsPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminStudentsPage } from './pages/admin/AdminStudentsPage';
import { AdminAssessmentsPage } from './pages/admin/AdminAssessmentsPage';
import { AdminQuestionsPage } from './pages/admin/AdminQuestionsPage';
import { AdminCodingProblemsPage } from './pages/admin/AdminCodingProblemsPage';
import { AdminPlacementsPage } from './pages/admin/AdminPlacementsPage';
import { AdminBulkEmailPage } from './pages/admin/AdminBulkEmailPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';

// Main Application Layout (Navbar + Sidebar)
const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FBFAFF] flex flex-col text-slate-800">
      <Navbar />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Fullscreen Exam Layout (Navbar only, no sidebar distraction)
const ExamLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FBFAFF] flex flex-col text-slate-800">
      <Outlet />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page */}
          <Route
            path="/"
            element={
              <div>
                <Navbar />
                <LandingPage />
              </div>
            }
          />

          {/* Authentication Routes */}
          <Route
            path="/auth/login"
            element={
              <div>
                <Navbar />
                <LoginPage />
              </div>
            }
          />
          <Route
            path="/auth/register"
            element={
              <div>
                <Navbar />
                <RegisterPage />
              </div>
            }
          />

          {/* Dedicated Fullscreen Take Assessment Route */}
          <Route path="/assessments/:id" element={<TakeAssessmentPage />} />

          {/* Authenticated Student & Admin App Layout */}
          <Route element={<AppLayout />}>
            {/* Student Pages */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/assessments" element={<AssessmentsPage />} />
            <Route path="/assessments/:id/result" element={<AssessmentResultPage />} />
            <Route path="/coding" element={<CodingPlatformPage />} />
            <Route path="/resume-builder" element={<ResumeBuilderPage />} />
            <Route path="/ats-analyzer" element={<ATSAnalyzerPage />} />
            <Route path="/skill-gap" element={<SkillGapPage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/interview-prep" element={<InterviewPrepPage />} />
            <Route path="/placements" element={<PlacementDrivesPage />} />
            <Route path="/settings" element={<SettingsPage />} />

            {/* Admin Pages */}
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/students" element={<AdminStudentsPage />} />
            <Route path="/admin/assessments" element={<AdminAssessmentsPage />} />
            <Route path="/admin/questions" element={<AdminQuestionsPage />} />
            <Route path="/admin/coding" element={<AdminCodingProblemsPage />} />
            <Route path="/admin/placements" element={<AdminPlacementsPage />} />
            <Route path="/admin/bulk-email" element={<AdminBulkEmailPage />} />
            <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
            <Route path="/admin/settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
