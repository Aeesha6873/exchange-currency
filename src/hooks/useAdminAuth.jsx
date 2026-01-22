// hooks/useAdminAuth.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useAdminAuth() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user) {
      navigate("/login");
      return;
    }

    if (!user.isAdmin) {
      navigate("/dashboard");
      return;
    }
  }, [navigate]);

  const user = JSON.parse(localStorage.getItem("currentUser"));

  return {
    isAdmin: user?.isAdmin || false,
    userRole: user?.role || "user",
    userPermissions: user?.permissions || [],
    user: user || null,
  };
}
