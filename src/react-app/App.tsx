import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/shared/AuthContext'
import Home from '@/react-app/pages/Home'
import Dashboard from '@/react-app/pages/Dashboard'
import Transactions from '@/react-app/pages/Transactions'
import PLExplorer from '@/react-app/pages/PLExplorer'
import AuthCallback from '@/react-app/pages/AuthCallback'

function Protected({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="p-6 text-slate-500">Loading…</div>
  if (!user) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
      <Route path="/transactions" element={<Protected><Transactions /></Protected>} />
      <Route path="/pl" element={<Protected><PLExplorer /></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
