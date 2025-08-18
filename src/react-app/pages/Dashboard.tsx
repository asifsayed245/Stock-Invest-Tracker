import { useEffect, useState } from "react";
import { supabase } from "@/react-app/lib/supabaseClient";

export default function Dashboard() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      setEmail(data.user?.email ?? null);
    };
    init();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      {email && (
        <div className="mb-6 rounded-md border p-4">
          <span className="text-sm text-gray-600">Signed in as:</span>
          <div className="font-medium">{email}</div>
        </div>
      )}
      {/* Replace everything below with the Mocha UI you want to replicate */}
      {/* Positions, P/L Explorer, etc. */}
      <button
        onClick={signOut}
        className="rounded-md border px-4 py-2 hover:bg-gray-50"
      >
        Sign out
      </button>
    </div>
  );
}
