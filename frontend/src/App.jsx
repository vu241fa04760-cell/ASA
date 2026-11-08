import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { SubjectProvider } from './context/SubjectContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import ChatAssistantPage from './pages/ChatAssistantPage';
import NotesGeneratorPage from './pages/NotesGeneratorPage';
import QuizGeneratorPage from './pages/QuizGeneratorPage';
import StudyPlannerPage from './pages/StudyPlannerPage';
import DocumentSummarizerPage from './pages/DocumentSummarizerPage';
import ProgressTrackingPage from './pages/ProgressTrackingPage';
import UserProfilePage from './pages/UserProfilePage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <SubjectProvider>
            <Router>
              <Routes>
                {/* Public Landing Page */}
                <Route path="/" element={<LandingPage />} />

                {/* Auth Layout for Sign In / Sign Up */}
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                </Route>

                {/* Protected Student Portal Layout */}
                <Route
                  element={
                    <ProtectedRoute>
                      <MainLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/chat" element={<ChatAssistantPage />} />
                  <Route path="/notes" element={<NotesGeneratorPage />} />
                  <Route path="/quiz" element={<QuizGeneratorPage />} />
                  <Route path="/planner" element={<StudyPlannerPage />} />
                  <Route path="/documents" element={<DocumentSummarizerPage />} />
                  <Route path="/progress" element={<ProgressTrackingPage />} />
                  <Route path="/profile" element={<UserProfilePage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>

                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </SubjectProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
