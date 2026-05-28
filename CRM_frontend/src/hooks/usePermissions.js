import { useAuth } from '../contexts/AuthContext';
import { useMemo } from 'react';

// Use a simple component for PermissionGate children
const EmptyComponent = ({ children }) => children;

/**
 * Custom hook for managing and checking user permissions and roles.
 * Provides components and hooks for role-based access control (RBAC).
 */
export const usePermissions = () => {
  const auth = useAuth();

  /**
   * Component for conditional rendering based on a user's permissions.
   */
  const PermissionGate = ({ permission, requireAll = false, children, fallback = null }) => {
    const hasAccess = Array.isArray(permission)
      ? requireAll
        ? auth.hasAllPermissions(permission)
        : auth.hasAnyPermission(permission)
      : auth.hasPermission(permission);
    return hasAccess ? children : fallback;
  };

  /**
   * Component for conditional rendering based on a user's role.
   */
  const RoleGate = ({ roles, children, fallback = null }) => {
    // ESLint fix: The `auth` object is not a valid dependency for useMemo
    // because it will not cause the component to re-render when its properties change.
    const hasRole = useMemo(() => 
      Array.isArray(roles) ? roles.some(role => auth.hasRole(role)) : auth.hasRole(roles),
      [roles, auth.hasRole]
    );
    return hasRole ? children : fallback;
  };

  /**
   * Provides a concise object of booleans for CRUD permissions on a specific entity.
   */
  const useCRUDPermissions = entity => {
    const entityLower = entity.toLowerCase();
    const perms = auth.getPermissionsByEntity(entityLower);
    
    // ESLint fix: The `auth` object is not a valid dependency for useMemo.
    return useMemo(() => ({
      canView: perms.includes(`${entityLower}:read`),
      canCreate: perms.includes(`${entityLower}:create`),
      canUpdate: perms.includes(`${entityLower}:update`),
      canDelete: perms.includes(`${entityLower}:delete`),
      canEdit: perms.includes(`${entityLower}:update`) || perms.includes(`${entityLower}:delete`),
      hasAnyAccess: auth.hasAnyPermission(perms),
    }), [perms, entityLower, auth.hasAnyPermission]);
  };

  /**
   * Provides booleans for navigation access based on permissions.
   */
  const useNavigationPermissions = () => useMemo(() => ({
    // ESLint fix: The `auth` object is not a valid dependency.
    canViewDashboard: auth.hasPermission('dashboard:view'),
    canViewCustomers: auth.hasPermission('customers:read'),
    canViewBanks: auth.hasPermission('banks:read'),
    canAccessAdministration: auth.isAdmin() || auth.hasAnyPermission(['roles:read', 'users:read', 'permissions:read']),
    canViewRoles: auth.hasPermission('roles:read'),
    canViewPermissions: auth.hasPermission('permissions:read'),
    canViewRolePermissions: auth.hasPermission('permissions:assign'),
    canViewUsers: auth.hasPermission('users:read'),
  }), [auth.hasPermission, auth.isAdmin, auth.hasAnyPermission]);

  const useDisabledState = permission => !auth.hasPermission(permission);
  const usePermissionClasses = (permission, enabledClasses = '', disabledClasses = 'opacity-50 cursor-not-allowed') => {
    const hasAccess = auth.hasPermission(permission);
    return hasAccess ? enabledClasses : disabledClasses;
  };

  return {
    PermissionGate,
    RoleGate,
    useCRUDPermissions,
    useNavigationPermissions,
    useDisabledState,
    usePermissionClasses,
  };
};

export default usePermissions;