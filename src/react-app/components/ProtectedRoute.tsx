import { Navigate } from 'react-router-dom'
import { useAuth } from '@/shared/AuthContext'

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="p-8">Loading…</div>
  if (!user) return <Navigate to="/" replace />
  return children
}
