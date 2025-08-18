import { useState } from 'react'
import { useAuth } from '@/shared/AuthContext'

function initials(email?: string | null) {
  if (!email) return 'U'
  const name = email.split('@')[0]?.replace(/[^a-zA-Z0-9]/g, ' ') || 'U'
  const parts = name.trim().split(/\s+/)
  const letters = (parts[0]?.[0] || 'U') + (parts[1]?.[0] || '')
  return letters.toUpperCase()
}

export default function UserMenu() {
  const { user, signOut } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-slate-100"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white grid place-items-center text-sm">
          {initials(user?.email ?? null)}
        </div>
        <span className="hidden sm:block text-sm text-slate-700">{user?.email}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-lg p-2 z-20"
        >
          <div className="px-3 py-2 text-xs text-slate-500">Signed in</div>
          <div className="px-3 pb-2 text-sm font-medium truncate">{user?.email}</div>
          <button
            onClick={async () => { await signOut() }}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-sm"
            role="menuitem"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
