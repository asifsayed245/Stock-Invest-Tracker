import { useState } from 'react'

type Tx = { date: string, side: 'BUY'|'SELL', symbol: string, qty: number, price: number }
export default function Transactions(){
  const [rows, setRows] = useState<Tx[]>([])
  const [form, setForm] = useState<Tx>({ date: new Date().toISOString().slice(0,10), side: 'BUY', symbol: 'AAPL', qty: 1, price: 100 })
  const update = (k: keyof Tx, v: any) => setForm(f => ({...f, [k]: v}))
  const add = () => setRows(r => [form, ...r])

  return (
    <section className="grid gap-4">
      <div className="hw-card">
        <div className="font-semibold mb-3">Add transaction (demo)</div>
        <div className="grid md:grid-cols-6 gap-2">
          <input className="border rounded-xl px-3 py-2" type="date" value={form.date} onChange={e=>update('date', e.target.value)} />
          <select className="border rounded-xl px-3 py-2" value={form.side} onChange={e=>update('side', e.target.value as any)}>
            <option>BUY</option><option>SELL</option>
          </select>
          <input className="border rounded-xl px-3 py-2" placeholder="Symbol" value={form.symbol} onChange={e=>update('symbol', e.target.value)} />
          <input className="border rounded-xl px-3 py-2" type="number" step="0.0001" placeholder="Qty" value={form.qty} onChange={e=>update('qty', Number(e.target.value))} />
          <input className="border rounded-xl px-3 py-2" type="number" step="0.0001" placeholder="Price" value={form.price} onChange={e=>update('price', Number(e.target.value))} />
          <button className="hw-btn" onClick={add}>Add</button>
        </div>
      </div>

      <div className="hw-card">
        <div className="font-semibold mb-3">Transactions</div>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="text-slate-500">
              <tr><th className="text-left p-2">Date</th><th className="text-left p-2">Side</th><th className="text-left p-2">Symbol</th><th className="text-left p-2">Qty</th><th className="text-left p-2">Price</th></tr>
            </thead>
            <tbody>
              {rows.length === 0 && <tr><td className="p-2 text-slate-500" colSpan={5}>No transactions yet.</td></tr>}
              {rows.map((r,i)=>(
                <tr key={i} className="odd:bg-slate-50">
                  <td className="p-2">{r.date}</td>
                  <td className="p-2">{r.side}</td>
                  <td className="p-2">{r.symbol}</td>
                  <td className="p-2">{r.qty}</td>
                  <td className="p-2">{r.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
