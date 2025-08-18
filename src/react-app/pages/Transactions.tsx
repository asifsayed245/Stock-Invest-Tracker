// src/react-app/pages/Transactions.tsx
export default function Transactions() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4">Transactions</h2>
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-600">
          Your transaction ledger will show here (filter by date, broker, ticker, side).
        </p>
      </div>
    </main>
  )
}
