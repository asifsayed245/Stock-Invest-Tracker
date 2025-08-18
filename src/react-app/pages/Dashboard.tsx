import { useAuth } from '@/shared/AuthContext'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  return (
    <div className="min-h-screen px-6 py-10 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={signOut}
          className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300"
        >
          Sign out
        </button>
      </div>

      <div className="mt-6 rounded-xl border p-6 bg-white shadow-sm">
        <p className="text-sm text-slate-600">Signed in as:</p>
        <p className="font-medium">{user?.email}</p>
      </div>
    </div>
  )
}
