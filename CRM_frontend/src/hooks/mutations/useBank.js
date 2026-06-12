import { BankApi } from '@/api/bankApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from "sonner"
export const useBankMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: BankApi.createBank,
    onSuccess: () => {
      toast.success("Successfully created new bank!");
      queryClient.invalidateQueries(['banks']);
    },
    onError: (error) => {
      const message = error.response?.data?.detail || error.message || "Failed to create new bank";
      toast.error(message);
    },
  });
};

export const useDeleteBankMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: BankApi.deleteBank,
    onSuccess: () => {
      toast.success("Successfully deleted bank!");
      queryClient.invalidateQueries(['banks']);
    },
    onError: (error) => {
      const message = error.response?.data?.detail || error.message || "Failed to delete bank";
      toast.error(message);
    },
  });
};
