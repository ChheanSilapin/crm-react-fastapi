import { useMemo } from "react";
import { useGenericForm } from "../../../hooks/useGenericForm";
import { useCRUD } from "../../../hooks/useCRUD";
import { bankAPI } from "../../../api/api";

export const useBankForm = (initialData = null) => {
  const schema = useMemo(
    () => ({
      bank_name: {
        defaultValue: "",
        required: true,
        label: "Bank name",
        requiredMessage: "Bank name is required",
        validation: {
          minLength: 3,
          pattern: /^[a-zA-Z][a-zA-Z\s.&-]{2,}$/,
          patternMessage:
            "Bank name must be at least 3 characters and can include letters, spaces, '&', '-', and dots",
        },
      },
      description: {
        defaultValue: "",
        required: false,
        label: "Description",
      },
      logo: {
        defaultValue: null,
        type: "file",
        required: false,
        label: "Logo",
      },
    }),
    []
  );

  const customValidator = useMemo(
    () => (formData) => {
      const errors = {};
      if (formData.logo && formData.logo instanceof File) {
        if (formData.logo.size > 2 * 1024 * 1024) {
          errors.logo = "File size must be less than 2MB";
        }
        const allowedTypes = ["image/png", "image/jpeg"];
        if (!allowedTypes.includes(formData.logo.type)) {
          errors.logo = "Please select a valid image file (PNG, JPG, or JPEG)";
        }
      }
      return errors;
    },
    []
  );

  let setServerValidationErrors;

  const handleServerError = (error) => {
    const status = error.response?.status;
    const detail = error.response?.data?.detail || error.message;
    if (status === 400 || status === 409 || status === 422) {
      if (typeof detail === "string" && /already exists/i.test(detail)) {
        setServerValidationErrors({ bank_name: detail });
        return;
      }
      setServerValidationErrors({
        bank_name: "Bank with this name already exists.",
      });
      return;
    }
    console.error("Server error:", error);
  };

  const dropdownFields = useMemo(() => [], []);
  const formatters = useMemo(() => ({}), []);

  const formHook = useGenericForm({
    initialData,
    schema,
    customValidator,
    dropdownFields,
    formatters,
  });

  setServerValidationErrors = formHook.setServerValidationErrors;
  const {
    create: createBank,
    update: updateBank,
    delete: deleteBank,
  } = useCRUD({
    resource: "banks",
    api: bankAPI,
    options: {
      customErrorHandlers: {
        create: handleServerError,
      },
    },
  });

  const logoPreview = useMemo(() => {
    if (formHook.filePreviews.logo) {
      return formHook.filePreviews.logo;
    } else if (formHook.formData.logo) {
      // This value is correct. It's the relative path from the server.

      return formHook.formData.logo;
    }
    return null;
  }, [formHook.filePreviews.logo, formHook.formData.logo]);

  const { removeFile } = formHook;

  const removeLogo = () => removeFile("logo");

  return {
    ...formHook,
    createBank,
    updateBank,
    deleteBank,

    formData: formHook.formData,
    handleServerError,
    logoPreview,
    removeLogo,
  };
};
