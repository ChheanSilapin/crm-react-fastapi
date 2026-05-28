import { useMemo } from 'react';
import { useGenericForm } from '../../../hooks/useGenericForm';

/**
 * Custom hook for permission form logic
 * Uses the generic form hook with permission-specific configuration
 */
export const usePermissionForm = (permission = null) => {
  // Define form schema for permissions - memoized to prevent re-renders
  const schema = useMemo(() => ({
    name: {
      defaultValue: '',
      required: true,
      label: 'Permission name',
      requiredMessage: 'Permission name is required',
      validation: {
        minLength: 3,
        maxLength: 100,
        minLengthMessage: 'Permission name must be at least 3 characters long',
        maxLengthMessage: 'Permission name must be less than 100 characters'
      }
    }
  }), []);

  // Memoized dropdown fields and formatters to prevent re-renders
  const dropdownFields = useMemo(() => [], []);
  const formatters = useMemo(() => ({}), []);

  // Use generic form hook
  const {
    formData,
    errors,
    handleInputChange,
    validateForm,
    resetForm,
    setServerValidationErrors,
    hasChanges
  } = useGenericForm({
    initialData: permission,
    schema,
    dropdownFields,
    formatters
  });

  return {
    formData,
    errors,
    handleInputChange,
    validateForm,
    resetForm,
    setServerValidationErrors,
    hasChanges
  };
};