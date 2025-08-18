type Row = {
  id: string
  symbol: string
  qty: number
  avg_cost: number
  last_price?: number
}

export default function PositionsTable({ rows }: { rows: Row[] }) {
  if (!rows.length) {
    return (
      <div className="rounded-xl border bg-white p-6 text-sm text-slate-500">
        Your holdings will appear here once connected.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-left text-slate-500">
          <tr>
            <th className="px-4 py-2">Symbol</th>
            <th className="px-4 py-2">Qty</th>
            <th className="px-4 py-2">Avg Cost</th>
            <th className="px-4 py-2">Last Price</th>
            <th className="px-4 py-2">Unrealized P/L</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => {
            const mv = (r.last_price ?? 0) * r.qty
            const cost = r.avg_cost * r.qty
            const pl = mv - cost
            return (
              <tr key={r.id} className="border-t">
                <td className="px-4 py-2 font-medium">{r.symbol}</td>
                <td className="px-4 py-2">{r.qty}</td>
                <td className="px-4 py-2">₹ {r.avg_cost.toLocaleString()}</td>
                <td className="px-4 py-2">{r.last_price ? `₹ ${r.last_price.toLocaleString()}` : '—'}</td>
                <td className={`px-4 py-2 font-medium ${pl >= 0 ? 'text-green-600' : 'text-rose-600'}`}>
                  {pl >= 0 ? '+' : '-'}₹ {Math.abs(pl).toLocaleString()}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
