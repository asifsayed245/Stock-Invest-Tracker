import { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSupabaseAuth } from "../lib/SupabaseProvider";

export function ProtectedRoute({ children }: PropsWithChildren) {
  const { session, loading } = useSupabaseAuth();
  const loc = useLocation();

  if (loading) return null; // or a spinner
  if (!session) return <Navigate to="/" replace state={{ from: loc }} />;

  return <>{children}</>;
}
