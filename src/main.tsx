import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import PL from './pages/PL'
import './styles.css'

function Shell(){
  const link = ({isActive}:{isActive:boolean}) => 'px-3 py-2 rounded-xl ' + (isActive ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200')
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-brand-600/90"></div>
          <h1 className="text-2xl font-semibold">HoldWise</h1>
        </div>
        <nav className="flex gap-2">
          <NavLink to="/" className={link} end>Dashboard</NavLink>
          <NavLink to="/transactions" className={link}>Transactions</NavLink>
          <NavLink to="/pl" className={link}>P/L Explorer</NavLink>
        </nav>
      </header>
      <main className="grid gap-4">
        <Routes>
          <Route path="/" element={<Dashboard/>}/>
          <Route path="/transactions" element={<Transactions/>}/>
          <Route path="/pl" element={<PL/>}/>
        </Routes>
      </main>
      <footer className="text-center text-slate-500 text-sm mt-8">© {new Date().getFullYear()} HoldWise</footer>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  </React.StrictMode>
)
