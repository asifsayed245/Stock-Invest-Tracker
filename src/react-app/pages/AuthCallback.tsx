import { useEffect } from "react";
import { useAuth } from "@getmocha/users-service/react";
import { useNavigate } from "react-router";
import LoadingSpinner from "@/react-app/components/LoadingSpinner";

export default function AuthCallback() {
  const { exchangeCodeForSessionToken, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        await exchangeCodeForSessionToken();
      } catch (error) {
        console.error("Auth callback error:", error);
        navigate("/");
      }
    };

    handleAuthCallback();
  }, [exchangeCodeForSessionToken, navigate]);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return <LoadingSpinner />;
}
