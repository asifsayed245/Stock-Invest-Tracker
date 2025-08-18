import { useEffect, useState } from 'react'
import { supabase } from '@/react-app/lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      const { data } = await supabase.auth.getUser()
      setEmail(data.user?.email ?? null)
    }
    run()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="mx-auto max-w-6xl px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-brand-600"></div>
          <span className="font-semibold text-xl text-gray-900">HoldWise</span>
        </div>

        <button
          onClick={signOut}
          className="rounded-lg bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300 transition"
        >
          Sign out
        </button>
      </header>

      <main className="mx-auto max-w-6xl px-6">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>

        <div className="mt-6 rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <div className="text-sm text-gray-600">Signed in as:</div>
          <div className="mt-1 font-medium text-gray-900">{email ?? '—'}</div>
        </div>

        {/* ⬇️ placeholder cards — this is where we’ll plug Mocha sections next */}
        <section className="mt-8 grid gap-6 md:grid-cols-3">
          <Card title="Market Value" value="₹ —" />
          <Card title="Unrealized P/L" value="₹ —" />
          <Card title="Dividends (YTD)" value="₹ —" />
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
            <div className="font-semibold text-gray-900">Positions</div>
            <div className="mt-2 text-sm text-gray-600">
              Your holdings will appear here once connected.
            </div>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
            <div className="font-semibold text-gray-900">Alerts</div>
            <ul className="mt-2 list-disc pl-5 text-sm text-gray-600">
              <li>No alerts</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  )
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <div className="text-sm text-gray-600">{title}</div>
      <div className="mt-1 text-2xl font-bold text-gray-900">{value}</div>
    </div>
  )
}
