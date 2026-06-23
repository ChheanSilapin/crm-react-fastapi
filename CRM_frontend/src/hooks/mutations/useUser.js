import { UserApi } from '@/api/userApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from "sonner"
export const useUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: UserApi.createUser,
    onSuccess: () => {
      toast.success("Successfully created new user!");
      queryClient.invalidateQueries(['users']);
    },
    onError: (error) => {
      const message = error.response?.data?.detail || error.message || "Failed to create new user";
      toast.error(message);
    },
  });
};

export const useUserUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({id, data}) => UserApi.updateUser(id, data),
    onSuccess: () => {
      toast.success("Successfully updated user!");
      queryClient.invalidateQueries(['users']);
    },
    onError: (error) => {
      const message = error.response?.data?.detail || error.message || "Failed to update user";
      toast.error(message);
    },
  });
};

export const useUserDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => UserApi.deleteUser(id),
    onSuccess: () => {
      toast.success("Successfully deleted user!");
      queryClient.invalidateQueries(['users']);
    },
    onError: (error) => {
      const message = error.response?.data?.detail || error.message || "Failed to delete user";
      toast.error(message);
    },
  });
};

export const useUploadAvatarMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, file }) => UserApi.uploadAvatar(userId, file),
    onSuccess: () => {
      toast.success("Avatar updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update avatar");
    },
  });
};