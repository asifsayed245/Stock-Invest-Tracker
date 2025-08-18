// src/react-app/App.tsx
import { useEffect, useState } from 'react'
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { supabase } from './lib/supabaseClient'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import PLExplorer from './pages/PLExplorer'
import Settings from './pages/Settings'
import LoadingSpinner from './components/LoadingSpinner'

function Protected() {
  const [loading, setLoading] = useState(true)
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    let mounted = true
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setIsAuthed(!!data.session)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setIsAuthed(!!session)
    })
    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  if (loading) return <LoadingSpinner />
  return isAuthed ? <Outlet /> : <Navigate to="/" replace />
}

export default function App() {
  const [session, setSession] = useState<null | object>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar isAuthed={!!session} />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<Protected />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/pl" element={<PLExplorer />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </HashRouter>
  )
}
