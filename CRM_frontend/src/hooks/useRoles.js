import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCRUD } from './useCRUD';
import { rolesAPI } from '../api/api';

/**
 * Custom hook for managing roles data with API calls
 * Uses the generic CRUD hook for standardized data management
 * Provides CRUD operations with loading states and error handling
 */
export const useRoles = () => {
  const queryClient = useQueryClient();
  // Use generic CRUD hook with roles-specific configuration
  const {
    roles,
    data,
    loading,
    error,
    create,
    update,
    delete: deleteRole,
    isCreating,
    isUpdating,
    isDeleting,
    getById,
    isUnique,
    refresh,
    refetch
  } = useCRUD({
    resource: 'roles',
    api: rolesAPI,
    options: {
      cacheDuration: 600000, // 10 minutes (roles rarely change)
      gcTime: 1800000, // 30 minutes
    }
  });

  /**
   * Permission assignment mutation with proper cache invalidation
   */
  const assignPermissionsMutation = useMutation({
    mutationFn: async ({ roleId, permissionIds }) => {
      const response = await rolesAPI.assignPermissions(roleId, permissionIds);
      return { roleId, permissionIds, response };
    },
    onSuccess: ({ roleId, permissionIds }) => {
      // Invalidate roles cache to refetch updated role data with new permissions
      queryClient.invalidateQueries({ queryKey: ['roles'] });

      // Also invalidate specific role cache if it exists
      queryClient.invalidateQueries({ queryKey: ['roles', roleId] });

      // Optionally update the specific role in cache optimistically
      queryClient.setQueryData(['roles'], (oldRoles) => {
        if (!oldRoles || !Array.isArray(oldRoles)) return oldRoles;

        return oldRoles.map(role => {
          if (role.id === roleId) {
            // Update the role's permissions array
            const updatedPermissions = permissionIds.map(permId => ({ id: permId }));
            return {
              ...role,
              permissions: updatedPermissions
            };
          }
          return role;
        });
      });
    },
    onError: (error) => {
      console.error('Failed to assign permissions to role:', error);
      // Optionally show user-friendly error message
    }
  });

  /**
   * Toggle a single permission for a role
   */
  const togglePermissionMutation = useMutation({
    mutationFn: async ({ roleId, permissionId, currentPermissions }) => {
      const hasPermission = currentPermissions.includes(permissionId);
      let newPermissions;

      if (hasPermission) {
        // Remove permission from role
        newPermissions = currentPermissions.filter(id => id !== permissionId);
      } else {
        // Add permission to role
        newPermissions = [...currentPermissions, permissionId];
      }

      const response = await rolesAPI.assignPermissions(roleId, newPermissions);
      return { roleId, permissionId, newPermissions, wasAdded: !hasPermission, response };
    },
    onMutate: async ({ roleId, permissionId, currentPermissions }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['roles'] });

      // Snapshot the previous value
      const previousRoles = queryClient.getQueryData(['roles']);

      // Optimistically update the cache
      const hasPermission = currentPermissions.includes(permissionId);
      const newPermissions = hasPermission
        ? currentPermissions.filter(id => id !== permissionId)
        : [...currentPermissions, permissionId];

      queryClient.setQueryData(['roles'], (oldRoles) => {
        if (!oldRoles || !Array.isArray(oldRoles)) return oldRoles;

        return oldRoles.map(role => {
          if (role.id === roleId) {
            const updatedPermissions = newPermissions.map(permId => ({ id: permId }));
            return {
              ...role,
              permissions: updatedPermissions
            };
          }
          return role;
        });
      });

      // Return a context object with the snapshotted value
      return { previousRoles };
    },
    onError: (error, _variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousRoles) {
        queryClient.setQueryData(['roles'], context.previousRoles);
      }
      console.error('Failed to toggle permission:', error);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure cache consistency
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    }
  });

  return {
    // Data
    roles,
    data,
    loading,
    error,

    // Enhanced CRUD operations
    create,
    update,
    delete: deleteRole,

    // Loading states
    isCreating,
    isUpdating,
    isDeleting,

    // Permission assignment operations
    assignPermissions: assignPermissionsMutation.mutateAsync,
    togglePermission: togglePermissionMutation.mutateAsync,
    isAssigningPermissions: assignPermissionsMutation.isPending,
    isTogglingPermission: togglePermissionMutation.isPending,

    // Utilities
    getById,
    isUnique,
    refresh,
    refetch
  };
};

export default useRoles;
