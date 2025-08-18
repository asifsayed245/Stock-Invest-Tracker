import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Landing from '@/react-app/pages/Landing'
import Dashboard from '@/react-app/pages/Dashboard'
import { useEffect, useState } from 'react'
import { supabase } from '@/react-app/lib/supabaseClient'

export default function App() {
  const [loading, setLoading] = useState(true)
  const [isAuthed, setAuthed] = useState(false)

  useEffect(() => {
    const run = async () => {
      const { data } = await supabase.auth.getSession()
      setAuthed(!!data.session)
      setLoading(false)
    }
    run()

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setAuthed(!!session)
    })
    return () => sub?.subscription.unsubscribe()
  }, [])

  if (loading) return null

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/dashboard"
        element={isAuthed ? <Dashboard /> : <Navigate to="/" replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
