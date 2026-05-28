import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCRUD } from './useCRUD';
import { usersAPI } from '../api/api';


export const useUsers = () => {
  const queryClient = useQueryClient();

  // Use generic CRUD hook with users-specific configuration
  const {
    users,
    data,
    loading,
    error,
    create,
    update,
    delete: deleteUser,
    isCreating,
    isUpdating,
    isDeleting,
    getById,
    isUnique,
    refresh,
    refetch
  } = useCRUD({
    resource: 'users',
    api: usersAPI
  });

  // Update user status mutation (specific to users)
  const updateUserStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      await usersAPI.updateStatus(id, status);
      return { id, status };
    },
    onSuccess: () => {
      // Invalidate users query to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      console.error('Failed to update user status:', error);
    }
  });

  // User-specific function for status updates
  const updateUserStatus = async (id, status) => {
    return updateUserStatusMutation.mutateAsync({ id, status });
  };

  return {
    // Data
    users,
    data,
    loading,
    error,

    // Enhanced CRUD operations
    create,
    update,
    delete: deleteUser,

    // Loading states
    isCreating,
    isUpdating,
    isDeleting,

    // Utilities
    getById,
    isUnique,
    refresh,
    refetch,

    // User-specific operations
    updateUserStatus,
    isUpdatingStatus: updateUserStatusMutation.isPending
  };
};
