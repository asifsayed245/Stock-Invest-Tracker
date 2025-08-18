import { supabase } from '@/react-app/lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  const signIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` }
    })
    if (error) {
      console.error(error)
      alert('Sign-in failed')
    } else {
      // Supabase will redirect; this is a guard for popup flows
      if (data?.url) window.location.assign(data.url)
    }
  }

  return (
    <div className="hero-bg min-h-screen">
      <header className="mx-auto max-w-6xl px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-brand-600"></div>
          <span className="font-semibold text-xl text-gray-900">HoldWise</span>
        </div>
        <button
          onClick={signIn}
          className="rounded-lg bg-brand-600 px-4 py-2 text-white hover:bg-brand-700 transition"
        >
          Get Started Free
        </button>
      </header>

      <main className="mx-auto max-w-5xl px-6 pt-14">
        <h1 className="text-5xl font-extrabold tracking-tight text-center text-gray-900">
          Hold<span className="text-brand-600">Wise</span>
        </h1>
        <p className="mt-4 text-center text-lg text-gray-600">
          Your personal stock portfolio &amp; transaction tracker. Centralize trades,
          analyze performance, and make smarter investment decisions.
        </p>

        <div className="mt-8 flex justify-center">
          <button
            onClick={signIn}
            className="rounded-xl bg-brand-600 px-6 py-3 text-white font-medium shadow hover:bg-brand-700 transition"
          >
            ⚡ Get Started Free
          </button>
        </div>

        <section className="mt-12 grid gap-6 md:grid-cols-4">
          <Feature
            title="Portfolio Tracking"
            desc="Monitor your investments with real-time portfolio valuation and performance metrics."
            icon="📊"
          />
          <Feature
            title="P&L Analytics"
            desc="Comprehensive profit & loss analysis with realized and unrealized gains tracking."
            icon="📈"
          />
          <Feature
            title="Allocation Insights"
            desc="Visualize your portfolio allocation across sectors and asset classes."
            icon="🧭"
          />
          <Feature
            title="Secure & Private"
            desc="Bank-level security with encrypted data and privacy-first design."
            icon="🛡️"
          />
        </section>

        <section className="mt-16 rounded-2xl bg-gradient-to-r from-brand-600 to-blue-600 p-8 text-center text-white">
          <h2 className="text-3xl font-bold">
            Start tracking your investments today
          </h2>
          <p className="mt-2 text-white/90">
            Join thousands of investors who trust HoldWise to manage their portfolios
          </p>
          <div className="mt-6">
            <button
              onClick={signIn}
              className="rounded-xl bg-white px-6 py-3 font-medium text-brand-700 hover:bg-white/90 transition"
            >
              Sign Up with Google
            </button>
          </div>
        </section>

        <footer className="py-8 text-center text-sm text-gray-500">
          © 2025 HoldWise
        </footer>
      </main>
    </div>
  )
}

function Feature({
  title,
  desc,
  icon
}: {
  title: string
  desc: string
  icon: string
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <div className="mb-3 text-2xl">{icon}</div>
      <div className="font-semibold text-gray-900">{title}</div>
      <div className="mt-1 text-sm text-gray-600 leading-relaxed">{desc}</div>
    </div>
  )
}
