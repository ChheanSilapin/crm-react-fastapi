import { useMemo } from "react";
import { useGenericForm } from "../../../hooks/useGenericForm";
import { useBanks } from "../../../hooks/useBanks";
import { formatWithCommasWhileTyping } from "../../../utils/currencyFormatter";

export const useCustomerForm = (initialData = null) => {
  const {
    banks,
    loading: banksLoading,
    getBankOptions,
    getBankById,
  } = useBanks();

  const formConfig = useMemo(
    () => ({
      schema: {
        customer_id: {
          defaultValue: "",
          required: true,
          label: "Customer ID",
          requiredMessage: "Customer ID is required",
          validation: {
            minLength: 3,

            pattern: /^[a-zA-Z0-9-]* ?[a-zA-Z0-9-]*$/,
            patternMessage:
              "CustomerID must be at least 3 characters and contain only letters, numbers, hyphens, and at most one space.",
          },
        },
        type: {
          defaultValue: "Deposit",
          required: true,
          label: "Type",
          requiredMessage: "Type is required",
        },
        currency: {
          defaultValue: "USD",
          required: true,
          label: "Currency",
          requiredMessage: "Currency is required",
        },
        credit: {
          defaultValue: "",
          required: true,
          label: "Credit",
          requiredMessage: "Credit is required",
        },
        amount: {
          defaultValue: "",
          required: true,
          label: "Amount",
          requiredMessage: "Amount is required",
        },
        bank_id: {
          defaultValue: "",
          required: true,
          label: "Bank",
          requiredMessage: "Bank is required",
        },
        note: { defaultValue: "", required: false, label: "Note" },
      },
      formatters: {
        credit: (value) => formatWithCommasWhileTyping(value),
        amount: (value) => formatWithCommasWhileTyping(value),
      },
      customValidator: (formData) => {
        const errors = {};
        const numericAmount = parseFloat(
          formData.amount?.replace(/[^0-9.-]/g, "")
        );
        if (formData.amount && (isNaN(numericAmount) || numericAmount <= 0)) {
          errors.amount = "Amount must be a positive number";
        }
        const numericCredit = parseFloat(
          formData.credit?.replace(/[^0-9.-]/g, "")
        );
        if (formData.credit && (isNaN(numericCredit) || numericCredit < 0)) {
          errors.credit = "Credit must be a non-negative number";
        }
        return errors;
      },
      dropdownFields: ["type", "currency", "bank"],
      initialData: initialData
        ? {
            ...initialData,
            customer_id: initialData.customer_id || "",
            type: initialData.type || "Deposit",
            currency: initialData.currency || "USD",
            credit: initialData.credit?.toString() || "",
            amount: initialData.amount?.toString() || "",
            bank_id: initialData.bank_id || initialData.bank?.bank_id || "",
            note: initialData.note || "",
          }
        : null,
    }),
    [initialData]
  );

  // Use the single configuration object with the generic form hook
  const {
    formData,
    displayValues,
    errors,
    dropdowns,
    handleInputChange,
    handleDropdownSelect,
    toggleDropdown,
    closeAllDropdowns,
    validateForm,
    resetForm,
    setServerValidationErrors,
    hasChanges,
  } = useGenericForm(formConfig);

  // Custom number input handler that cleans up non-numeric characters
  const handleNumberInput = (e, fieldName) => {
    const numericValue = e.target.value.replace(/[^\d.]/g, "");
    const parts = numericValue.split(".");
    const cleanValue =
      parts.length > 2
        ? parts[0] + "." + parts.slice(1).join("")
        : numericValue;
    handleInputChange({ target: { name: fieldName, value: cleanValue } });
  };

  // Custom handler for currency dropdown selections
  const handleCurrencyChange = (currency) =>
    handleDropdownSelect("currency", currency);

  // Custom handler for server-side validation errors
  const handleServerError = (error) => {
    if (error.response?.status === 409) {
      setServerValidationErrors({
        customer_id: "This customer ID already exists",
      });
    } else {
      console.error("Server error:", error);
    }
  };

  return {
    formData,
    displayValues,
    errors,
    dropdowns,
    banks,
    banksLoading,
    getBankOptions,
    getBankById,
    handleInputChange,
    handleNumberInput,
    handleCurrencyChange,
    toggleDropdown,
    closeAllDropdowns,
    validateForm,
    resetForm,
    setServerValidationErrors,
    handleServerError,
    hasChanges,
  };
};
