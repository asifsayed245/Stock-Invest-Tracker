import { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Landing from "@/react-app/pages/Landing";
import Dashboard from "@/react-app/pages/Dashboard";
import ProtectedRoute from "@/react-app/components/ProtectedRoute";
import { supabase } from "@/react-app/lib/supabaseClient";

export default function App() {
  const navigate = useNavigate();

  // Keep user on dashboard if already logged-in and lands on /
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      if (data.session && window.location.pathname === "/") {
        navigate("/dashboard", { replace: true });
      }
    };

    init();

    // keep session fresh across tabs
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session && window.location.pathname === "/") {
        navigate("/dashboard", { replace: true });
      }
    });

    return () => {
      mounted = false;
      sub?.subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
