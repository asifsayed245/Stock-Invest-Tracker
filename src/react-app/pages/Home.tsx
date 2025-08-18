import { supabase } from "../lib/supabaseClient";

function HeroCta() {
  const handleClick = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <button onClick={handleClick} className="btn-primary">
      Get Started Free
    </button>
  );
}
