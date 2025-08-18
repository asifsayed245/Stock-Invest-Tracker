// src/react-app/pages/Dashboard.tsx
export default function Dashboard() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <h2 className="text-2xl font-semibold">Dashboard - Current Holdings</h2>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Market Value', value: '₹ —' },
          { label: 'Unrealized P/L', value: '₹ —' },
          { label: 'Dividends (YTD)', value: '₹ —' }
        ].map((c) => (
          <div key={c.label} className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="text-sm text-gray-500">{c.label}</div>
            <div className="mt-1 text-2xl font-semibold">{c.value}</div>
          </div>
        ))}
      </div>

      {/* Positions + Alerts */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-5 shadow-sm md:col-span-2">
          <div className="font-semibold">Positions</div>
          <p className="mt-2 text-sm text-gray-600">
            Your holdings will appear here once connected or imported.
          </p>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="font-semibold">Alerts</div>
          <ul className="mt-2 list-disc pl-5 text-sm text-gray-600">
            <li>No alerts</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
