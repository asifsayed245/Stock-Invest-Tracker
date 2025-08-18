import Layout from '@/react-app/components/Layout'
import { supabase } from '@/shared/supabaseClient'
import { useAuth } from '@/shared/AuthContext'
import { useEffect, useMemo, useState } from 'react'

type Tx = { side: 'BUY'|'SELL'; qty: number; price: number; trade_date: string; fees: number|null }

function addDays(d: Date, n: number) { const x = new Date(d); x.setDate(x.getDate()+n); return x }
function fmt(d: Date) { return d.toISOString().slice(0,10) }

const presets = [
  { k: '1m', label: '1M', days: 30 },
  { k: '3m', label: '3M', days: 90 },
  { k: '6m', label: '6M', days: 180 },
  { k: '1y', label: '1Y', days: 365 },
  { k: '3y', label: '3Y', days: 365*3 },
  { k: '5y', label: '5Y', days: 365*5 },
]

export default function PLExplorer() {
  const { user } = useAuth()
  const [start, setStart] = useState<string>(fmt(addDays(new Date(), -30)))
  const [end, setEnd] = useState<string>(fmt(new Date()))
  const [txs, setTxs] = useState<Tx[]>([])

  useEffect(() => {
    if (!user) return
    const load = async () => {
      const { data } = await supabase
        .from('transactions')
        .select('side,qty,price,trade_date,fees')
        .eq('user_id', user.id)
        .gte('trade_date', start)
        .lte('trade_date', end)
        .order('trade_date', { ascending: true })
      setTxs((data ?? []) as Tx[])
    }
    load()
  }, [user, start, end])

  const realizedPL = useMemo(() => {
    // Simple placeholder calc: SELL proceeds - BUY cost in range (not FIFO)
    const buys = txs.filter(t => t.side==='BUY').reduce((s,t)=>s + t.qty*t.price + (t.fees||0),0)
    const sells = txs.filter(t => t.side==='SELL').reduce((s,t)=>s + t.qty*t.price - (t.fees||0),0)
    return sells - buys
  }, [txs])

  return (
    <Layout>
      <h1 className="mb-4 text-2xl font-semibold">P/L Explorer</h1>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {presets.map(p => (
          <button
            key={p.k}
            className="rounded-md border bg-white px-3 py-1.5 text-sm hover:bg-slate-50"
            onClick={() => {
              setStart(fmt(addDays(new Date(), -p.days)))
              setEnd(fmt(new Date()))
            }}
          >
            {p.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <input type="date" value={start} onChange={e=>setStart(e.target.value)} className="rounded-md border px-2 py-1.5 text-sm"/>
          <span className="text-slate-400">→</span>
          <input type="date" value={end} onChange={e=>setEnd(e.target.value)} className="rounded-md border px-2 py-1.5 text-sm"/>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-5">
          <div className="text-sm text-slate-500">Realized P/L</div>
          <div className={`mt-2 text-2xl font-semibold ${realizedPL>=0?'text-green-600':'text-rose-600'}`}>
            {realizedPL>=0?'+':'-'}₹ {Math.abs(realizedPL).toLocaleString()}
          </div>
        </div>
        {/* Add Dividends, Unrealized, XIRR when data available */}
        <div className="rounded-xl border bg-white p-5">
          <div className="text-sm text-slate-500">Dividends (in range)</div>
          <div className="mt-2 text-2xl font-semibold">—</div>
        </div>
        <div className="rounded-xl border bg-white p-5">
          <div className="text-sm text-slate-500">Unrealized P/L (snapshot)</div>
          <div className="mt-2 text-2xl font-semibold">—</div>
        </div>
      </div>
    </Layout>
  )
}
