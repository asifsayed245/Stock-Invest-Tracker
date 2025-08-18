import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
iimport { Home } from "./pages/Home";               // your landing page component
import Dashboard from "./pages/Dashboard";     // your dashboard page
import { ProtectedRoute } from "./components/ProtectedRoute";
import AuthCallback from "./pages/AuthCallback"; // optional; see below

export default function App() {
  // No Router here. Only define routes.
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      {/* catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
