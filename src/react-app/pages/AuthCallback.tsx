import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    // Supabase sets session on redirect; just check and move on.
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      if (data.session) navigate("/dashboard", { replace: true });
      else navigate("/", { replace: true });
    });

    return () => {
      mounted = false;
    };
  }, [navigate]);

  return null;
}
