import { CustomerApi } from '@/api/customerApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from "sonner"
export const useCustomerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: CustomerApi.createCustomer,
    onSuccess: () => {
      toast.success("Successfully created new customer!");
      queryClient.invalidateQueries(['customers']);
    },
    onError: (error) => {
      const message = error.response?.data?.detail || error.message || "Failed to create new customer";
      toast.error(message);
    },
  });
};
