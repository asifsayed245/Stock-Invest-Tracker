import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/shared/AuthContext'
import { TrendingUp, Shield, BarChart3, PieChart } from 'lucide-react'

export default function Home() {
  const { user, signInWithGoogle, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true })
  }, [user, navigate])

  const FeatureCard = ({
    icon: Icon,
    title,
    children
  }: {
    icon: React.ComponentType<{ className?: string }>
    title: string
    children: React.ReactNode
  }) => (
    <div className="rounded-2xl p-6 bg-white shadow-sm ring-1 ring-slate-200">
      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
        <Icon className="w-5 h-5 text-indigo-600" />
      </div>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{children}</p>
    </div>
  )

  return (
    <main>
      <header className="pt-16 pb-10 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900">HoldWise</h1>
        <p className="mt-5 max-w-3xl mx-auto text-slate-600">
          Your personal stock portfolio & transaction tracker. Centralize trades, analyze performance, and make smarter investment decisions.
        </p>
        <button
          disabled={loading}
          onClick={signInWithGoogle}
          className="mt-8 inline-flex items-center px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-500 disabled:opacity-50"
        >
          ⚡ Get Started Free
        </button>
      </header>

      <section className="max-w-6xl mx-auto px-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <FeatureCard icon={TrendingUp} title="Portfolio Tracking">
          Monitor your investments with real-time portfolio valuation and performance metrics.
        </FeatureCard>
        <FeatureCard icon={BarChart3} title="P&L Analytics">
          Comprehensive profit & loss analysis with realized and unrealized gains tracking.
        </FeatureCard>
        <FeatureCard icon={PieChart} title="Allocation Insights">
          Visualize your portfolio allocation across sectors and asset classes.
        </FeatureCard>
        <FeatureCard icon={Shield} title="Secure & Private">
          Bank-level security with encrypted data and privacy-first design.
        </FeatureCard>
      </section>

      <section className="mt-14 py-12 bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold">Start tracking your investments today</h2>
          <p className="mt-3 opacity-90">
            Join thousands of investors who trust HoldWise to manage their portfolios
          </p>
          <button
            disabled={loading}
            onClick={signInWithGoogle}
            className="mt-8 inline-flex items-center px-6 py-3 rounded-xl bg-white/95 text-indigo-700 font-semibold shadow hover:bg-white disabled:opacity-60"
          >
            Sign Up with Google
          </button>
        </div>
      </section>

      <footer className="text-center text-sm text-slate-500 py-8">© {new Date().getFullYear()} HoldWise</footer>
    </main>
  )
}
