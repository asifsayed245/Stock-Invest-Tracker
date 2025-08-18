import Layout from '@/react-app/components/Layout'
import { useAuth } from '@/shared/AuthContext'
import { supabase } from '@/shared/supabaseClient'
import { useEffect, useState } from 'react'

type Tx = {
  id: string
  trade_date: string
  side: 'BUY' | 'SELL'
  qty: number
  price: number
  fees: number | null
  instrument_id: string | null
}

export default function Transactions() {
  const { user } = useAuth()
  const [rows, setRows] = useState<(Tx & { symbol: string })[]>([])

  useEffect(() => {
    if (!user) return
    const load = async () => {
      const { data: t } = await supabase
        .from('transactions')
        .select('id,trade_date,side,qty,price,fees,instrument_id')
        .eq('user_id', user.id)
        .order('trade_date', { ascending: false })

      const { data: instruments } = await supabase.from('instruments').select('id,symbol')
      const symbolOf = new Map((instruments ?? []).map(i => [i.id, i.symbol]))

      setRows(
        (t ?? []).map(x => ({
          ...x,
          symbol: x.instrument_id ? (symbolOf.get(x.instrument_id) ?? 'TICKER') : 'TICKER',
        }))
      )
    }
    load()
  }, [user])

  return (
    <Layout>
      <h1 className="mb-4 text-2xl font-semibold">Transactions</h1>
      <div className="overflow-hidden rounded-xl border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Symbol</th>
              <th className="px-4 py-2">Side</th>
              <th className="px-4 py-2">Qty</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Fees</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="border-t">
                <td className="px-4 py-2">{r.trade_date}</td>
                <td className="px-4 py-2 font-medium">{r.symbol}</td>
                <td className={`px-4 py-2 ${r.side === 'BUY' ? 'text-indigo-600' : 'text-rose-600'}`}>{r.side}</td>
                <td className="px-4 py-2">{r.qty}</td>
                <td className="px-4 py-2">₹ {r.price.toLocaleString()}</td>
                <td className="px-4 py-2">{r.fees ? `₹ ${r.fees}` : '—'}</td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td className="px-4 py-6 text-center text-slate-500" colSpan={6}>
                  No transactions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}
