import { usePermissions } from "@/hooks/usePermission";
import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute({ requiredPermission }) {
  const token = localStorage.getItem("token");
  const hasPermission = usePermissions(requiredPermission);

  // If there's no token in localStorage, redirect to the login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !hasPermission) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If there is a token, allow access to the child routes (e.g., Dashboard)
  return <Outlet />;
}
