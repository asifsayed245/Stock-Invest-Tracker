export default function Dashboard(){
  return (
    <section className="grid md:grid-cols-3 gap-4">
      <div className="hw-card">
        <div className="text-slate-500 text-sm">Market Value</div>
        <div className="text-2xl font-semibold mt-1">₹ —</div>
      </div>
      <div className="hw-card">
        <div className="text-slate-500 text-sm">Unrealized P/L</div>
        <div className="text-2xl font-semibold mt-1">₹ —</div>
      </div>
      <div className="hw-card">
        <div className="text-slate-500 text-sm">Dividends (YTD)</div>
        <div className="text-2xl font-semibold mt-1">₹ —</div>
      </div>

      <div className="hw-card md:col-span-2">
        <div className="font-semibold mb-3">Positions</div>
        <div className="text-slate-500">Your holdings will appear here once connected.</div>
      </div>

      <div className="hw-card">
        <div className="font-semibold mb-3">Alerts</div>
        <ul className="list-disc list-inside text-slate-600 text-sm">
          <li>No alerts</li>
        </ul>
      </div>
    </section>
  )
}
