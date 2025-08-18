import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/shared/AuthContext'
import { Shield, PieChart, TrendingUp, BarChart3 } from 'lucide-react'

function Landing() {
  const { signInWithGoogle, user } = useAuth()
  const navigate = useNavigate()

  // Redirect to dashboard right after Google returns and the session exists
  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true })
  }, [user, navigate])

  const Feature = ({
    icon,
    title,
    desc,
    color
  }: {
    icon: React.ReactNode
    title: string
    desc: string
    color: string
  }) => (
    <div className="rounded-2xl bg-white shadow-sm border border-slate-100 p-6 text-left hover:shadow-md transition">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} text-white`}>
        {icon}
      </div>
      <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{desc}</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* HERO */}
      <header className="max-w-5xl mx-auto px-6 pt-20 pb-10 text-center">
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-indigo-600">
          HoldWise
        </h1>
        <p className="mt-5 text-lg sm:text-xl text-slate-700 max-w-3xl mx-auto">
          Your personal stock portfolio &amp; transaction tracker. Centralize trades,
          analyze performance, and make smarter investment decisions.
        </p>
        <div className="mt-8">
          <button
            onClick={signInWithGoogle}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg hover:bg-indigo-500 active:scale-[.99] transition"
          >
            <span>⚡</span>
            <span>Get Started Free</span>
          </button>
        </div>
      </header>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Feature
            icon={<BarChart3 className="w-5 h-5" />}
            title="Portfolio Tracking"
            desc="Monitor your investments with real-time valuation and performance metrics."
            color="bg-indigo-500"
          />
          <Feature
            icon={<TrendingUp className="w-5 h-5" />}
            title="P&L Analytics"
            desc="Comprehensive profit & loss analysis for realized and unrealized gains."
            color="bg-emerald-500"
          />
          <Feature
            icon={<PieChart className="w-5 h-5" />}
            title="Allocation Insights"
            desc="Visualize allocation across sectors and asset classes."
            color="bg-fuchsia-500"
          />
          <Feature
            icon={<Shield className="w-5 h-5" />}
            title="Secure & Private"
            desc="Encrypted data with a privacy-first design."
            color="bg-orange-500"
          />
        </div>
      </section>

      {/* BLUE BAND CTA */}
      <section className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
        <div className="max-w-5xl mx-auto px-6 py-14 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold">
            Start tracking your investments today
          </h2>
        <p className="mt-3 text-indigo-100">
            Join thousands of investors who trust HoldWise to manage their portfolios
          </p>
          <button
            onClick={signInWithGoogle}
            className="mt-8 inline-flex items-center px-6 py-3 rounded-xl bg-white/95 text-indigo-700 font-semibold shadow hover:bg-white"
          >
            Sign Up with Google
          </button>
        </div>
      </section>

      <footer className="text-center text-sm text-slate-500 py-8">
        © {new Date().getFullYear()} HoldWise
      </footer>
    </div>
  )
}

function Protected({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="p-8">Loading…</div>
  if (!user) return <Navigate to="/" replace />
  return children
}

function Dashboard() {
  const { signOut } = useAuth()
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={signOut}
          className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300"
        >
          Sign out
        </button>
      </div>
      <p className="mt-4 text-slate-600">You’re signed in. Your app features go here.</p>
    </div>
  )
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
