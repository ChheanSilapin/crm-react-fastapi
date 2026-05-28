import { useCRUD } from './useCRUD';
import { bankAPI } from '../api/api';
import { showToast } from '../utils/toast';


export const useBanks = () => {
  // Use generic CRUD hook with banks-specific configuration
  const {
    banks,
    data,
    loading,
    error,
    create,
    update,
    delete: deleteBank,
    isCreating,
    isUpdating,
    isDeleting,
    getById,
    isUnique,
    refresh,
    refetch
  } = useCRUD({
    resource: 'banks',
    api: bankAPI,
    options: {
      dataExtractor: (response) => {
        const bankData = response.data || response;
        return Array.isArray(bankData) ? bankData : [];
      },
      customErrorHandlers: {
        create: (error) => {
          const msg = error?.response?.data?.detail || 'Bank with this name already exists.';
          showToast.error(msg);
        },
        delete: (error) => {
          // Check if it's a 409 Conflict error (bank has associated customers)
          if (error.response?.status === 409) {
            showToast.error('Cannot delete bank - it has associated customers.');
          } else if (error.response?.status === 404) {
            showToast.error('Bank not found. It may have already been deleted.');
          } else {
            // For other errors, use the original error message or a generic one
            const errorMessage = error.response?.data?.detail || error.message || 'Failed to delete bank. Please try again.';
            showToast.error(errorMessage);
          }
        }
      }
    }
  });

  const getBankById = (bankId) => {
    return banks.find(bank => bank.bankId === bankId || bank.bank_id === bankId) || null;
  };


  const getBankOptions = () => {
    return banks.map(bank => ({
      value: bank.bank_id,
      label: bank.bank_name,
      logo: bank.logo
    }));
  };

  const isValidBankId = (bankId) => {
    return banks.some(bank => bank.bank_id === bankId);
  };

  const deleteBankWithValidation = async (bankId) => {
    // Error handling is now done in the useCRUD hook with custom error handler
    return await deleteBank(bankId);
  };

  return {
    // Data
    banks,
    data,
    loading,
    error,

    // Enhanced CRUD operations
    create,
    update,
    delete: deleteBank,
    deleteBankWithValidation, // Enhanced delete with validation

    // Loading states
    isCreating,
    isUpdating,
    isDeleting,

    // Utilities
    getById,
    isUnique,
    refresh,
    refetch,

    // Bank-specific utilities
    getBankById,
    getBankOptions,
    isValidBankId
  };
};

export default useBanks;
