import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from '@/react-app/pages/Home'
import Dashboard from '@/react-app/pages/Dashboard'
import Transactions from '@/react-app/pages/Transactions'
import PLExplorer from '@/react-app/pages/PLExplorer'
import { AuthProvider } from '@/shared/AuthContext'
import ProtectedRoute from '@/react-app/components/ProtectedRoute'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pl-explorer"
            element={
              <ProtectedRoute>
                <PLExplorer />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
