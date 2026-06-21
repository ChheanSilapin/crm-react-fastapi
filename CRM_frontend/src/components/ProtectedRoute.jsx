import { usePermissions } from "@/hooks/usePermission";
import { Navigate, Outlet } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

export function ProtectedRoute({ requiredPermission }) {
  const token = localStorage.getItem("token");
  const hasPermission = usePermissions(requiredPermission);

  // If there's no token in localStorage, redirect to the login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Wait for the permissions to finish loading before deciding
  if (hasPermission === null) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  if (requiredPermission && !hasPermission) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If there is a token, allow access to the child routes (e.g., Dashboard)
  return <Outlet />;
}
