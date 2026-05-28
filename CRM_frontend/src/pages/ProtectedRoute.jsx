import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthLoadingSpinner from './AuthLoadingSpinner';

const ProtectedRoute = ({
  permission,
  children,
  redirectTo = '/login'
}) => {
  const { isAuthenticated, isLoading, hasPermission, hasAnyPermission, hasAllPermissions } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <AuthLoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }
  
  // Check 3: If authenticated but lacks permission, redirect to unauthorized page
  let hasAccess;
  if (Array.isArray(permission)) {
    hasAccess = hasAnyPermission(permission);
  } else {
    hasAccess = hasPermission(permission);
  }

  if (!hasAccess) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
