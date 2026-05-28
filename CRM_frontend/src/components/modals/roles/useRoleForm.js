import { useMemo } from 'react';
import { useGenericForm } from '../../../hooks/useGenericForm';
import { useRoles } from '../../../hooks/useRoles';

export const useRoleForm = (initialData = null) => {
  const { roles: existingRoles, loading: rolesLoading } = useRoles();

  // Define form schema for roles - memoized to prevent re-renders
  const schema = useMemo(() => ({
    name: {
      defaultValue: '',
      required: true,
      label: 'Role Name',
      requiredMessage: 'Role name is required',
      validation: {
        minLength: 2,
        pattern: /^[a-zA-Z0-9]{2,}$/,
        patternMessage: 'Role must be at least 2 characters and contain only letters and numbers'
      }
    },
    description: {
      defaultValue: '',
      required: false,
      label: 'Description',
      validation: {
        maxLength: 255,
        maxLengthMessage: 'Description must be less than 255 characters'
      }
    }
  }), []);

  // Memoize existing roles to prevent unnecessary re-renders
  const memoizedExistingRoles = useMemo(() => existingRoles || [], [existingRoles]);

  // Custom validator for role name uniqueness - memoized to prevent re-renders
  const customValidator = useMemo(() => (formData) => {
    const errors = {};

    if (formData.name && memoizedExistingRoles.length > 0) {
      const roleNameExists = memoizedExistingRoles.some(role =>
        role.name && role.name.toLowerCase() === formData.name.toLowerCase() &&
        (!initialData || role.id !== initialData.id)
      );
      if (roleNameExists) {
        errors.name = 'This role name already exists';
      }
    }

    return errors;
  }, [memoizedExistingRoles, initialData]);

  // Process initial data - memoized to prevent re-renders
  const processedInitialData = useMemo(() => {
    return initialData ? {
      name: initialData.name || '',
      description: initialData.description || ''
    } : null;
  }, [initialData]);

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
    initialData: processedInitialData,
    schema,
    customValidator,
    dropdownFields,
    formatters
  });

  return {
    // Form data and state
    formData,
    errors,

    // Form handlers
    handleInputChange,
    validateForm,
    resetForm,
    setServerValidationErrors,
    hasChanges,

    // Additional data
    existingRoles,
    rolesLoading
  };
};