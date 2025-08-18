import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Dashboard() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <button
            onClick={signOut}
            className="rounded-md bg-slate-800 px-4 py-2 text-white hover:opacity-95"
          >
            Sign out
          </button>
        </header>

        <div className="mt-6 rounded-lg bg-white p-5 ring-1 ring-slate-200">
          <p className="text-slate-700">
            Signed in as: <strong>{email ?? "…"}</strong>
          </p>
          <p className="mt-3 text-slate-600">
            Your app features go here. (We’ll wire this to your Supabase tables
            next.)
          </p>
        </div>
      </div>
    </div>
  );
}
