import { NavLink } from 'react-router-dom'
import UserMenu from '@/react-app/components/UserMenu'

function Tab({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        'px-3 py-2 rounded-lg text-sm font-medium ' +
        (isActive ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-100')
      }
    >
      {children}
    </NavLink>
  )
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="font-bold text-indigo-600">HoldWise</div>
            <nav className="flex items-center gap-1">
              <Tab to="/dashboard">Dashboard</Tab>
              <Tab to="/transactions">Transactions</Tab>
              <Tab to="/pl-explorer">P/L Explorer</Tab>
              <Tab to="/uploads">Uploads</Tab>
              <Tab to="/settings">Settings</Tab>
            </nav>
          </div>
          <UserMenu />
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">{children}</main>
    </div>
  )
}
