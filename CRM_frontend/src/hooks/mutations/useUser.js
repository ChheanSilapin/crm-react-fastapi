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
