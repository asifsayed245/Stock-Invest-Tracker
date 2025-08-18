import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/shared/AuthContext'
import LoadingSpinner from '@/react-app/components/LoadingSpinner'

export default function AuthCallback() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Supabase already parsed the OAuth result (if any).
    // Once we know loading state, decide where to go.
    if (loading) return
    if (user) navigate('/dashboard', { replace: true })
    else navigate('/', { replace: true })
  }, [user, loading, navigate])

  return <LoadingSpinner />
}
