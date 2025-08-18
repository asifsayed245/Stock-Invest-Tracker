import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/shared/AuthContext'

export default function AuthCallback() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (loading) return
    if (user) navigate('/dashboard', { replace: true })
    else navigate('/', { replace: true })
  }, [user, loading, navigate])

  return <div className="p-6 text-slate-500">Signing you in…</div>
}
