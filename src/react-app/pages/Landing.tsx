import { supabase } from "@/react-app/lib/supabaseClient";

export default function Landing() {
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  };

  return (
    <main className="min-h-screen">
      {/* your styled hero/header here */}
      <div className="flex items-center justify-center py-10">
        <button
          onClick={signInWithGoogle}
          className="rounded-md bg-indigo-600 px-5 py-3 text-white"
        >
          Get Started Free
        </button>
      </div>
      {/* …features / footer… */}
    </main>
  );
}
