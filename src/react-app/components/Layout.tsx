import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '@/shared/AuthContext'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-xl font-semibold text-indigo-600">HoldWise</Link>
          <nav className="flex items-center gap-4 text-sm">
            <NavLink to="/dashboard" className={({isActive}) => isActive ? 'text-indigo-600 font-medium' : 'text-slate-600 hover:text-slate-900'}>Dashboard</NavLink>
            <NavLink to="/transactions" className={({isActive}) => isActive ? 'text-indigo-600 font-medium' : 'text-slate-600 hover:text-slate-900'}>Transactions</NavLink>
            <NavLink to="/pl" className={({isActive}) => isActive ? 'text-indigo-600 font-medium' : 'text-slate-600 hover:text-slate-900'}>P/L Explorer</NavLink>
            {user && (
              <button onClick={signOut} className="rounded-md bg-slate-100 px-3 py-1.5 text-slate-700 hover:bg-slate-200">
                Sign out
              </button>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      <footer className="py-10 text-center text-xs text-slate-400">© {new Date().getFullYear()} HoldWise</footer>
    </div>
  )
}
