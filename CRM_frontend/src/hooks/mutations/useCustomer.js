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
export const useCustomerUpdateMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => CustomerApi.updateCustomer(id, data),
    onSuccess: () => {
      toast.success("Successfully updated customer!");
      queryClient.invalidateQueries(['customers']);
    },
    onError: (error) => {
      const message = error.response?.data?.detail || error.message || "Failed to update customer";
      toast.error(message);
    },
  });
};