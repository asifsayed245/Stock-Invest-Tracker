// src/react-app/pages/Landing.tsx
import { supabase } from '../lib/supabaseClient'

export default function Landing() {
  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/#/dashboard' }
    })
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <section className="text-center space-y-4">
        <h1 className="text-5xl font-extrabold text-indigo-600">HoldWise</h1>
        <p className="text-lg text-gray-600">
          Your personal stock portfolio & transaction tracker. Centralize trades,
          analyze performance, and make smarter investment decisions.
        </p>
        <button
          onClick={signIn}
          className="mt-2 inline-flex items-center rounded-md bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-500"
        >
          ⚡ Get Started Free
        </button>
      </section>

      <section className="mt-12 grid gap-6 md:grid-cols-4">
        {[
          { title: 'Portfolio Tracking', desc: 'Real-time valuation & metrics.' },
          { title: 'P&L Analytics', desc: 'Realized & unrealized gains tracking.' },
          { title: 'Allocation Insights', desc: 'Sectors and asset classes.' },
          { title: 'Secure & Private', desc: 'Modern auth & encryption.' }
        ].map((c) => (
          <div key={c.title} className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="text-lg font-semibold">{c.title}</div>
            <div className="mt-2 text-sm text-gray-600">{c.desc}</div>
          </div>
        ))}
      </section>

      <section className="mt-14 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 p-10 text-center text-white">
        <h2 className="text-3xl font-bold">Start tracking your investments today</h2>
        <p className="mt-2 opacity-90">Join thousands who trust HoldWise.</p>
        <button
          onClick={signIn}
          className="mt-4 inline-flex items-center rounded-md bg-white/90 px-4 py-2 font-medium text-indigo-700 hover:bg-white"
        >
          Sign Up with Google
        </button>
      </section>
      <p className="mt-10 text-center text-xs text-gray-400">© 2025 HoldWise</p>
    </main>
  )
}
