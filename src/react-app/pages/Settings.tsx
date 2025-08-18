// src/react-app/pages/Settings.tsx
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Settings() {
  const [email, setEmail] = useState<string>('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? ''))
  }, [])

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 space-y-4">
      <h2 className="text-2xl font-semibold">Settings</h2>
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="text-sm text-gray-600">Signed in as</div>
        <div className="mt-1 font-medium">{email || '—'}</div>
      </div>
    </main>
  )
}
