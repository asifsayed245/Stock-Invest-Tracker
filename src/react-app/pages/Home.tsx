import { useCallback, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Home() {
  const [busy, setBusy] = useState(false);

  const signInWithGoogle = useCallback(async () => {
    try {
      setBusy(true);
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback`
          : undefined;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });
      if (error) throw error;
      // Supabase will redirect; no further action here.
    } catch (e) {
      console.error("OAuth error", e);
      setBusy(false);
      alert("Sign-in failed. Please try again.");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#ECF2FF]">
      <header className="max-w-5xl mx-auto px-6 pt-16 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-[#6B4BFF]">
          HoldWise
        </h1>
        <p className="mt-4 text-slate-600 text-lg max-w-2xl mx-auto">
          Your personal stock portfolio &amp; transaction tracker. Centralize
          trades, analyze performance, and make smarter investment decisions.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            className="rounded-md bg-[#6B4BFF] px-5 py-2 text-white font-medium shadow hover:opacity-95 disabled:opacity-60"
            onClick={signInWithGoogle}
            disabled={busy}
          >
            {busy ? "Redirecting..." : "Get Started Free"}
          </button>

          <button
            className="rounded-md bg-white px-4 py-2 text-[#6B4BFF] ring-1 ring-[#6B4BFF]/30 hover:bg-[#6B4BFF]/5 disabled:opacity-60"
            onClick={signInWithGoogle}
            disabled={busy}
          >
            Sign up with Google
          </button>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Portfolio Tracking",
            desc:
              "Monitor your investments with real-time portfolio valuation and performance metrics.",
          },
          {
            title: "P&L Analytics",
            desc:
              "Comprehensive profit & loss analysis with realized and unrealized gains tracking.",
          },
          {
            title: "Allocation Insights",
            desc:
              "Visualize your portfolio allocation across sectors and asset classes.",
          },
          {
            title: "Secure & Private",
            desc: "Bank-level security with encrypted data and privacy-first design.",
          },
        ].map((c) => (
          <article
            key={c.title}
            className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
          >
            <h3 className="font-semibold">{c.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{c.desc}</p>
          </article>
        ))}
      </section>

      <footer className="mt-16 py-12 bg-gradient-to-r from-[#5A8BFF] to-[#6B4BFF] text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold">
            Start tracking your investments today
          </h2>
          <p className="mt-2 opacity-90">
            Join thousands of investors who trust HoldWise to manage their
            portfolios.
          </p>
          <button
            className="mt-6 rounded-md bg-white/95 text-[#6B4BFF] px-5 py-2 font-medium hover:bg-white"
            onClick={signInWithGoogle}
            disabled={busy}
          >
            {busy ? "Redirecting..." : "Sign Up with Google"}
          </button>
          <p className="mt-10 text-sm opacity-80">© 2025 HoldWise</p>
        </div>
      </footer>
    </div>
  );
}
