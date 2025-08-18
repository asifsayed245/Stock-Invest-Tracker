import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/shared/AuthContext'
import Dashboard from '@/react-app/pages/Dashboard'

function Landing() {
  const { signInWithGoogle } = useAuth()
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-5xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-extrabold text-indigo-600">HoldWise</h1>
        <p className="mt-4 text-slate-600">
          Your personal stock portfolio & transaction tracker.
        </p>

        <button
          onClick={signInWithGoogle}
          className="inline-flex mt-8 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-500"
        >
          Get Started Free
        </button>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            ['Portfolio Tracking', 'Monitor valuation & metrics'],
            ['P&L Analytics', 'Realized/unrealized gains'],
            ['Allocation Insights', 'Sectors & asset classes'],
            ['Secure & Private', 'Modern auth & encryption']
          ].map(([t, s]) => (
            <div key={t} className="rounded-2xl bg-white shadow p-6 text-left">
              <h3 className="font-semibold">{t}</h3>
              <p className="text-sm text-slate-600 mt-2">{s}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Protected({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="p-8">Loading…</div>
  if (!user) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/dashboard"
            element={
              <Protected>
                <Dashboard />
              </Protected>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
