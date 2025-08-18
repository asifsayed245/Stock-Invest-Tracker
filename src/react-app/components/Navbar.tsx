// src/react-app/components/Navbar.tsx
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function Navbar({ isAuthed }: { isAuthed: boolean }) {
  const { pathname } = useLocation()
  const nav = useNavigate()

  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/#/dashboard' }
    })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    nav('/')
  }

  const linkCls = (active: boolean) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      active ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-200'
    }`

  return (
    <header className="bg-white border-b">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-indigo-600">HoldWise</Link>

        {isAuthed ? (
          <nav className="flex items-center gap-2">
            <NavLink to="/dashboard" className={({isActive})=>linkCls(isActive || pathname==='/')}>Dashboard</NavLink>
            <NavLink to="/transactions" className={({isActive})=>linkCls(isActive)}>Transactions</NavLink>
            <NavLink to="/pl" className={({isActive})=>linkCls(isActive)}>P/L Explorer</NavLink>
            <NavLink to="/settings" className={({isActive})=>linkCls(isActive)}>Settings</NavLink>
            <button onClick={signOut} className="ml-4 px-3 py-2 text-sm rounded-md bg-gray-100 hover:bg-gray-200">
              Sign out
            </button>
          </nav>
        ) : (
          <button
            onClick={signIn}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-500"
          >
            Sign in with Google
          </button>
        )}
      </div>
    </header>
  )
}
