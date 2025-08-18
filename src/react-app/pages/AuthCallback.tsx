import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase will already have parsed the URL fragment if detectSessionInUrl: true
    // We just send the user to dashboard when session is ready.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/dashboard", { replace: true });
      else navigate("/", { replace: true });
    });
  }, [navigate]);

  return null;
}
