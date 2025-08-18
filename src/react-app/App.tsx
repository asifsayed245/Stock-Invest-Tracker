import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";                 // default export (see Home.tsx below)
import Dashboard from "./pages/Dashboard";
import AuthCallback from "./pages/AuthCallback";
import { ProtectedRoute } from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* Supabase OAuth will return here (or directly to "/") */}
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
