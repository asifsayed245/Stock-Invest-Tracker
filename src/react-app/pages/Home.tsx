import { useAuth } from '@/shared/AuthContext'
import Layout from '@/react-app/components/Layout'

export default function Home() {
  const { user, signInWithGoogle } = useAuth()

  return (
    <Layout>
      <section className="mx-auto max-w-4xl py-8 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-indigo-600">HoldWise</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
          Your personal stock portfolio & transaction tracker. Centralize trades, analyze performance, and make smarter investment decisions.
        </p>
        <div className="mt-6">
          {!user ? (
            <button onClick={signInWithGoogle} className="rounded-lg bg-indigo-600 px-5 py-3 text-white hover:bg-indigo-700">
              Get Started Free
            </button>
          ) : (
            <a href="/dashboard" className="rounded-lg bg-indigo-600 px-5 py-3 text-white hover:bg-indigo-700">Go to Dashboard</a>
          )}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-4">
        {[
          { t: 'Portfolio Tracking', d: 'Monitor valuation & metrics' },
          { t: 'P&L Analytics', d: 'Realized/unrealized gains' },
          { t: 'Allocation Insights', d: 'Sectors & asset classes' },
          { t: 'Secure & Private', d: 'Modern auth & encryption' },
        ].map((c) => (
          <div key={c.t} className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="font-semibold">{c.t}</div>
            <div className="mt-1 text-sm text-slate-500">{c.d}</div>
          </div>
        ))}
      </section>

      <section className="mt-10 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 p-10 text-center text-white">
        <h2 className="text-2xl font-bold">Start tracking your investments today</h2>
        <p className="mt-2 text-indigo-100">Join thousands of investors who trust HoldWise to manage their portfolios</p>
        {!user && (
          <button onClick={signInWithGoogle} className="mt-5 rounded-lg bg-white px-5 py-3 text-indigo-700 hover:bg-indigo-50">
            Sign Up with Google
          </button>
        )}
      </section>
    </Layout>
  )
}
