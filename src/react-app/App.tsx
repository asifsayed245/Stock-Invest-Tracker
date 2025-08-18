import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/shared/AuthContext'

function Landing() {
  const { signInWithGoogle } = useAuth()

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
          {[
            {
              title: 'Portfolio Tracking',
              desc:
                'Monitor your investments with real-time portfolio valuation and performance metrics.',
              icon: '📊',
            },
            {
              title: 'P&L Analytics',
              desc:
                'Comprehensive profit & loss analysis with realized and unrealized gains tracking.',
              icon: '📈',
            },
            {
              title: 'Allocation Insights',
              desc:
                'Visualize your portfolio allocation across sectors and asset classes.',
              icon: '🧭',
            },
            {
              title: 'Secure & Private',
              desc:
                'Bank-level security with encrypted data and privacy-first design.',
              icon: '🛡️',
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl bg-white shadow-sm border border-slate-100 p-6 text-left hover:shadow-md transition"
            >
              <div className="text-2xl">{f.icon}</div>
              <h3 className="mt-3 font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{f.desc}</p>
            </div>
          ))}
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
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2 text-slate-600">You’re signed in. Dashboard content goes here.</p>
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
