import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, GuestOnly, ProtectedRoute } from './auth/AuthContext'
import { ErrorBoundary } from './components/error/ErrorBoundary'
import { AppShell } from './components/layout/AppShell'
import { DashboardPage } from './pages/DashboardPage'
import { HistoryPage } from './pages/HistoryPage'
import { InspectionEvidencePage } from './pages/InspectionEvidencePage'
import { InspectionReportPage } from './pages/InspectionReportPage'
import { InspectionResultPage } from './pages/InspectionResultPage'
import { InspectionScanPage } from './pages/InspectionScanPage'
import { NewInspectionPage } from './pages/NewInspectionPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { SettingsPage } from './pages/SettingsPage'
import { WelcomePage } from './pages/WelcomePage'
import { LoginPage } from './pages/auth/LoginPage'
import { SignupPage } from './pages/auth/SignupPage'
import { VerifyEmailPage } from './pages/auth/VerifyEmailPage'

function ProtectedAppRoutes() {
  return (
    <ProtectedRoute>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/inspections/new" element={<NewInspectionPage />} />
          <Route path="/inspections/:id/scan" element={<InspectionScanPage />} />
          <Route path="/inspections/:id/result" element={<InspectionResultPage />} />
          <Route path="/inspections/:id/evidence" element={<InspectionEvidencePage />} />
          <Route path="/inspections/:id/report" element={<InspectionReportPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Routes>
          <Route element={<GuestOnly />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
          </Route>
          <Route path="/*" element={<ProtectedAppRoutes />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ErrorBoundary>
  )
}
