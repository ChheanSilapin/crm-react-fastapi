import { useMemo } from 'react';
import { useGenericForm } from '../../../hooks/useGenericForm';
import { useUsers } from '../../../hooks/useUsers';
import { useRoles } from '../../../hooks/useRoles';

export const useUserForm = (initialData = null) => {
  // Use cached data from hooks
  const { users: existingUsers, loading: usersLoading } = useUsers();
  const { roles, loading: rolesLoading } = useRoles();

  // Determine if this is edit mode
  const isEditMode = !!initialData;

  // Define form schema for users - simplified to match API requirements
  const schema = useMemo(() => ({
    username: {
      defaultValue: '',
      required: true,
      label: 'Username',
      requiredMessage: 'Username is required',
      validation: {
        minLength: 3,
        pattern: /^[a-zA-Z0-9]{3,}$/,
        patternMessage: 'Username must be at least 3 characters and contain only letters and numbers'
      }
    },
    password: {
      defaultValue: '',
      required: !isEditMode, // Only required for create, optional for edit
      label: 'Password',
      requiredMessage: 'Password is required',
      validation: {
        minLength: 8,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/,
        patternMessage: 'Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, and one special character.'
      }
    },
    role_id: {
      defaultValue: '',
      required: false,
      label: 'Role',
      requiredMessage: 'Please select a role'
    },
    status: {
      defaultValue: 'active',
      required: true,
      label: 'Status',
      requiredMessage: 'Please select a status'
    }
  }), [isEditMode]);

  // Custom validation for user-specific rules - simplified
  const customValidator = useMemo(() => (formData) => {
    const errors = {};

    // Username uniqueness check
    if (formData.username) {
      const usernameExists = existingUsers.some(user =>
        user.user_name && user.user_name.toLowerCase() === formData.username.toLowerCase() &&
        (!initialData || user.id !== initialData.id)
      );
      if (usernameExists) {
        errors.username = 'This username is already taken';
      }
    }

    // Password validation for edit mode - only validate if password is provided
    if (isEditMode && formData.password && formData.password.trim()) {
      if (formData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters long';
      }
    }

    return errors;
  }, [existingUsers, initialData, isEditMode]);

  // Helper function to extract role ID from initial data - memoized to prevent re-renders
  const extractRoleId = useMemo(() => (userData, availableRoles) => {
    if (!userData?.roles || !Array.isArray(userData.roles) || userData.roles.length === 0) {
      return '';
    }

    const role = userData.roles[0];
    if (typeof role === 'object' && role.id) {
      return role.id;
    } else if (typeof role === 'string') {
      const foundRole = availableRoles.find(r => r.name === role);
      return foundRole ? foundRole.id : '';
    }

    return '';
  }, []);

  // Process initial data to extract role ID - memoized to prevent re-renders
  const processedInitialData = useMemo(() => {
    return initialData ? {
      username: initialData.user_name || initialData.username || '',
      password: '', // Don't populate password for edit
      role_id: extractRoleId(initialData, roles),
      status: initialData.status || 'active'
    } : null;
  }, [initialData, roles, extractRoleId]);

  // Memoized dropdown fields and formatters to prevent re-renders
  const dropdownFields = useMemo(() => ['role', 'status'], []);
  const formatters = useMemo(() => ({}), []);

  // Use generic form hook
  const {
    formData,
    errors,
    dropdowns,
    handleInputChange,
    handleDropdownSelect,
    toggleDropdown,
    closeAllDropdowns,
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

  // Get role name by ID
  const getRoleName = (roleId) => {
    const role = roles.find(r => r.id === parseInt(roleId));
    return role ? role.name : '';
  };

  // Simple validation
  const validateFormWithMode = () => {
    return validateForm();
  };

  return {
    // State
    formData,
    errors,
    roles,
    rolesLoading,
    existingUsers,
    usersLoading,
    dropdowns,

    // Handlers
    handleInputChange,
    handleDropdownSelect,
    toggleDropdown,
    closeAllDropdowns,

    // Validation
    validateForm: validateFormWithMode,
    resetForm,
    setServerValidationErrors,
    hasChanges,

    // Utilities
    getRoleName
  };
};