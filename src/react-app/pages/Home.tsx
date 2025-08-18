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

  const Feature = ({
    icon: Icon,
    title,
    children
  }: { icon: any; title: string; children: React.ReactNode }) => (
    <div className="rounded-2xl p-6 bg-white shadow-sm ring-1 ring-slate-200">
      <div className="w-10 h-10 rounded-xl bg-indigo-50 grid place-items-center">
        <Icon className="w-5 h-5 text-indigo-600" />
      </div>
      <div className="mt-3 font-semibold">{title}</div>
      <div className="mt-1 text-sm text-slate-600">{children}</div>
    </div>
  )

  return (
    <main>
      <header className="pt-16 pb-10 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900">HoldWise</h1>
        <p className="mt-5 max-w-3xl mx-auto text-slate-600">
          Your personal stock portfolio & transaction tracker. Centralize trades,
          analyze performance, and make smarter investment decisions.
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
        <Feature icon={TrendingUp} title="Portfolio Tracking">
          Monitor valuation & performance metrics in one place.
        </Feature>
        <Feature icon={BarChart3} title="P&L Analytics">
          Realized & unrealized P/L with presets and custom ranges.
        </Feature>
        <Feature icon={PieChart} title="Allocation Insights">
          View sector and asset allocation trends.
        </Feature>
        <Feature icon={Shield} title="Secure & Private">
          Modern auth, encrypted data, privacy-first design.
        </Feature>
      </section>

      <section className="mt-14 py-12 bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold">Start tracking your investments today</h2>
          <p className="mt-3 opacity-90">Join investors who trust HoldWise</p>
          <button
            disabled={loading}
            onClick={signInWithGoogle}
            className="mt-8 inline-flex items-center px-6 py-3 rounded-xl bg-white/95 text-indigo-700 font-semibold shadow hover:bg-white disabled:opacity-60"
          >
            Sign Up with Google
          </button>
        </div>
      </section>

      <footer className="text-center text-sm text-slate-500 py-8">
        © {new Date().getFullYear()} HoldWise
      </footer>
    </main>
  )
}
