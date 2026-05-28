import { useState, useEffect, useMemo } from "react";

export const useGenericForm = ({
  initialData = null,
  schema = {},
  customValidator = null,
  dropdownFields = [],
  formatters = {},
}) => {
  // Create initial form state from schema
  const initialFormData = useMemo(() => {
    const formData = {};
    Object.keys(schema).forEach((field) => {
      formData[field] = schema[field].defaultValue || "";
    });
    return formData;
  }, [schema]);

  // Form state
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  const [displayValues, setDisplayValues] = useState({});

  const [dropdowns, setDropdowns] = useState(() => {
    const initialDropdowns = {};
    dropdownFields.forEach((field) => {
      initialDropdowns[field] = false;
    });
    return initialDropdowns;
  });

  const [filePreviews, setFilePreviews] = useState({});

  useEffect(() => {
    if (initialData) {
      const newFormData = {};
      const newDisplayValues = {};
      const newFilePreviews = {};

      Object.keys(schema).forEach((field) => {
        const fieldConfig = schema[field];
        const value =
          initialData[field] ||
          initialData[fieldConfig.sourceField] ||
          fieldConfig.defaultValue ||
          "";

        newFormData[field] = value;

        if (formatters[field] && value) {
          newDisplayValues[field] = formatters[field](value);
        }
        if (fieldConfig.type === "file" && value) {
          newFilePreviews[field] = value;
        }
      });

      setFormData(newFormData);
      setDisplayValues(newDisplayValues);
      setFilePreviews(newFilePreviews);
    } else {
      // Reset to initial form data
      const resetFormData = {};
      Object.keys(schema).forEach((field) => {
        resetFormData[field] = schema[field].defaultValue || "";
      });
      setFormData(resetFormData);
      setDisplayValues({});
      setFilePreviews({});
    }
  }, [initialData, schema, formatters]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Handle display values for formatted fields
    if (formatters[name]) {
      setDisplayValues((prev) => ({
        ...prev,
        [name]: formatters[name](value),
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (file) {
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setFilePreviews((prev) => ({
        ...prev,
        [name]: previewUrl,
      }));
    }
  };

  const removeFile = (fieldName) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: null,
    }));
    setFilePreviews((prev) => ({
      ...prev,
      [fieldName]: initialData?.[fieldName] || null,
    }));
  };

  const handleDropdownSelect = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    // Close dropdown
    setDropdowns((prev) => ({
      ...prev,
      [fieldName]: false,
    }));

    // Clear error
    if (errors[fieldName]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "",
      }));
    }
  };

  const toggleDropdown = (fieldName) => {
    setDropdowns((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  const closeAllDropdowns = () => {
    const closedDropdowns = {};
    dropdownFields.forEach((field) => {
      closedDropdowns[field] = false;
    });
    setDropdowns(closedDropdowns);
  };

  const validateForm = (additionalValidation = null) => {
    const newErrors = {};

    // Schema-based validation
    Object.keys(schema).forEach((field) => {
      const fieldConfig = schema[field];
      const value = formData[field];

      // Required field validation
      if (
        fieldConfig.required &&
        (!value || (typeof value === "string" && !value.trim()))
      ) {
        newErrors[field] =
          fieldConfig.requiredMessage ||
          `${fieldConfig.label || field} is required`;
        return;
      }

      // Type-specific validation
      if (value && fieldConfig.validation) {
        const validationRules = fieldConfig.validation;

        // Min length
        if (
          validationRules.minLength &&
          value.length < validationRules.minLength
        ) {
          newErrors[field] =
            validationRules.minLengthMessage ||
            `${fieldConfig.label || field} must be at least ${
              validationRules.minLength
            } characters`;
        }

        // Max length
        if (
          validationRules.maxLength &&
          value.length > validationRules.maxLength
        ) {
          newErrors[field] =
            validationRules.maxLengthMessage ||
            `${fieldConfig.label || field} must be less than ${
              validationRules.maxLength
            } characters`;
        }

        // Email validation
        if (
          validationRules.email &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ) {
          newErrors[field] =
            validationRules.emailMessage ||
            "Please enter a valid email address";
        }

        // Custom pattern
        if (validationRules.pattern && !validationRules.pattern.test(value)) {
          newErrors[field] =
            validationRules.patternMessage ||
            `${fieldConfig.label || field} format is invalid`;
        }
      }
    });

    // Custom validation
    if (customValidator) {
      const customErrors = customValidator(formData);
      Object.assign(newErrors, customErrors);
    }

    // Additional validation (for specific use cases)
    if (additionalValidation) {
      const additionalErrors = additionalValidation(formData);
      Object.assign(newErrors, additionalErrors);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const setServerValidationErrors = (serverErrors) => {
    setErrors(serverErrors);
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setDisplayValues({});
    setFilePreviews({});
    setErrors({});
    closeAllDropdowns();
  };

  const getFieldValue = (fieldName) => {
    return displayValues[fieldName] || formData[fieldName] || "";
  };

  const hasChanges = () => {
    if (!initialData)
      return Object.values(formData).some((value) => value !== "");

    return Object.keys(formData).some((field) => {
      const currentValue = formData[field];
      const initialValue =
        initialData[field] || schema[field]?.defaultValue || "";
      return currentValue !== initialValue;
    });
  };

  return {
    // State
    formData,
    displayValues,
    errors,
    dropdowns,
    filePreviews,

    // Handlers
    handleInputChange,
    handleFileChange,
    removeFile,
    handleDropdownSelect,
    toggleDropdown,
    closeAllDropdowns,

    // Validation
    validateForm,
    setServerValidationErrors,

    // Utilities
    resetForm,
    getFieldValue,
    hasChanges,
  };
};

export default useGenericForm;
