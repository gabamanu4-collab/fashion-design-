import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { PublicLayout } from './components/layout/PublicLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { AdminLayout } from './components/layout/AdminLayout';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { FeaturesPage } from './pages/public/FeaturesPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { ExplorePage } from './pages/public/ExplorePage';
import { PortfolioDetailPage } from './pages/public/PortfolioDetailPage';
import { AboutPage } from './pages/public/AboutPage';
import { ContactPage } from './pages/public/ContactPage';
import { PrivacyPage } from './pages/public/PrivacyPage';
import { TermsPage } from './pages/public/TermsPage';
import { DatabaseSetupPage } from './pages/public/DatabaseSetupPage';
import { NotFoundPage } from './pages/public/NotFoundPage';

// Auth Pages
import { RegisterPage } from './pages/auth/RegisterPage';
import { LoginPage } from './pages/auth/LoginPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { VerifyEmailPage } from './pages/auth/VerifyEmailPage';

// User Dashboard Pages
import { OverviewPage } from './pages/dashboard/OverviewPage';
import { OnboardingPage } from './pages/dashboard/OnboardingPage';
import { PortfoliosPage } from './pages/dashboard/PortfoliosPage';
import { PortfolioEditorPage } from './pages/dashboard/PortfolioEditorPage';
import { ProjectsPage } from './pages/dashboard/ProjectsPage';
import { ProjectEditorPage } from './pages/dashboard/ProjectEditorPage';
import { MediaLibraryPage } from './pages/dashboard/MediaLibraryPage';
import { ProfilePage } from './pages/dashboard/ProfilePage';
import { SettingsPage } from './pages/dashboard/SettingsPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminPortfoliosPage } from './pages/admin/AdminPortfoliosPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminAuditLogsPage } from './pages/admin/AdminAuditLogsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminSqlSetupPage } from './pages/admin/AdminSqlSetupPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Website Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/database-setup" element={<DatabaseSetupPage />} />

            {/* Auth Routes */}
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />

            {/* Catch-all 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Public Portfolio Standalone Route */}
          <Route path="/portfolio/:slug" element={<PortfolioDetailPage />} />

          {/* User Dashboard Routes (Protected) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<OverviewPage />} />
            <Route path="onboarding" element={<OnboardingPage />} />
            <Route path="portfolios" element={<PortfoliosPage />} />
            <Route path="portfolios/new" element={<PortfolioEditorPage />} />
            <Route path="portfolios/:id/edit" element={<PortfolioEditorPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/new" element={<ProjectEditorPage />} />
            <Route path="projects/:id/edit" element={<ProjectEditorPage />} />
            <Route path="media" element={<MediaLibraryPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Administrator Dashboard Routes (Protected + Admin Role) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="portfolios" element={<AdminPortfoliosPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="audit-logs" element={<AdminAuditLogsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
            <Route path="sql-setup" element={<AdminSqlSetupPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
