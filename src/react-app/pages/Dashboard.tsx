import Layout from '@/react-app/components/Layout'
import StatCard from '@/react-app/components/StatCard'
import PositionsTable from '@/react-app/components/PositionsTable'
import { useAuth } from '@/shared/AuthContext'
import { supabase } from '@/shared/supabaseClient'
import { useEffect, useMemo, useState } from 'react'

type Holding = { id: string; symbol: string; qty: number; avg_cost: number; last_price: number | null }

export default function Dashboard() {
  const { user } = useAuth()
  const [rows, setRows] = useState<Holding[]>([])
  const [ytdDiv, setYtdDiv] = useState<number>(0)

  useEffect(() => {
    if (!user) return
    const load = async () => {
      // holdings table is optional; if you only have transactions, you can compute later
      const { data: h } = await supabase
        .from('holdings')
        .select('id,instrument_id,qty,avg_cost,last_price')
        .eq('user_id', user.id)

      // map to a simple demo symbol; replace with join to instruments when that table is present
      const { data: instruments } = await supabase.from('instruments').select('id,symbol')

      const symbolOf = new Map((instruments ?? []).map(i => [i.id, i.symbol]))
      const mapped = (h ?? []).map(r => ({
        id: r.id,
        symbol: symbolOf.get(r.instrument_id) ?? 'TICKER',
        qty: r.qty,
        avg_cost: r.avg_cost,
        last_price: r.last_price,
      }))
      setRows(mapped)

      const startOfYear = new Date(new Date().getFullYear(), 0, 1).toISOString().slice(0,10)
      const { data: divs } = await supabase
        .from('dividends')
        .select('amount')
        .eq('user_id', user.id)
        .gte('date', startOfYear)

      setYtdDiv((divs ?? []).reduce((s, d: any) => s + Number(d.amount || 0), 0))
    }
    load()
  }, [user])

  const marketValue = useMemo(() => rows.reduce((s, r) => s + (r.last_price ?? 0) * r.qty, 0), [rows])
  const totalCost = useMemo(() => rows.reduce((s, r) => s + r.avg_cost * r.qty, 0), [rows])
  const unrealized = marketValue - totalCost

  return (
    <Layout>
      <h1 className="mb-4 text-2xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard title="Market Value" value={`₹ ${marketValue.toLocaleString()}`} hint="All accounts" />
        <StatCard title="Unrealized P/L" value={`${unrealized >= 0 ? '+' : '-'}₹ ${Math.abs(unrealized).toLocaleString()}`} />
        <StatCard title="Dividends (YTD)" value={`₹ ${ytdDiv.toLocaleString()}`} />
      </div>

      <h2 className="mt-8 mb-3 text-lg font-semibold">Positions</h2>
      <PositionsTable rows={rows} />
    </Layout>
  )
}
