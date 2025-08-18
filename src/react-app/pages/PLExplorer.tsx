// src/react-app/pages/PLExplorer.tsx
import { useState } from 'react'

const presets = [
  { label: '1m', days: 30 },
  { label: '3m', days: 90 },
  { label: '6m', days: 180 },
  { label: '1y', days: 365 },
  { label: '3y', days: 365*3 },
  { label: '5y', days: 365*5 }
]

export default function PLExplorer() {
  const [range, setRange] = useState(presets[2].days) // default 6m

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">P/L Explorer</h2>
        <div className="flex gap-2">
          {presets.map(p => (
            <button
              key={p.label}
              onClick={() => setRange(p.days)}
              className={`px-3 py-1 rounded-md text-sm border ${
                range===p.days ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="font-medium">Equity Curve</div>
        <p className="mt-2 text-sm text-gray-600">
          (Chart placeholder for range: {range} days) — wire to Supabase timeseries later.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="font-medium">Realized / Unrealized P/L</div>
          <p className="mt-2 text-sm text-gray-600">Coming next.</p>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="font-medium">Dividends</div>
          <p className="mt-2 text-sm text-gray-600">Coming next.</p>
        </div>
      </div>
    </main>
  )
}
