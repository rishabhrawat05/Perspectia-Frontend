import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import OtpVerificationPage from './pages/OtpVerificationPage'
import DashboardPage from './pages/DashboardPage'
import './App.css'
import { Analytics } from '@vercel/analytics/react';
import HomePage from './pages/HomePage'

function App() {
  return (
    
    <AuthProvider>
       <Analytics />
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-otp" element={<OtpVerificationPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
