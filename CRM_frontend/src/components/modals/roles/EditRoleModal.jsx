import { XIcon } from '../../../icons';
import { useRoleForm } from './useRoleForm';
import RoleForm from './RoleForm';
import { useState } from 'react';

const EditRoleModal = ({
  isOpen,
  onClose,
  onSubmit,
  role = null
}) => {
  // Server error state
  const [serverError, setServerError] = useState('');

  // Use shared form logic (for edit mode, pass role data)
  const {
    formData,
    errors,
    handleInputChange,
    validateForm,
    resetForm,
    setServerValidationErrors,
    hasChanges
  } = useRoleForm(role);

  // Handle modal close
  const handleClose = () => {
    resetForm();
    setServerError('');
    onClose();
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous server error
    setServerError('');

    if (!validateForm()) {
      return;
    }

    // Check if there are any changes
    if (!hasChanges) {
      setServerError('No changes detected.');
      return;
    }

    try {
      await onSubmit(role.id, formData);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error updating role:', error);

      // Handle validation errors from server
      if (error.response?.data?.detail) {
        if (typeof error.response.data.detail === 'string') {
          setServerError(error.response.data.detail);
        } else if (Array.isArray(error.response.data.detail)) {
          // Handle FastAPI validation errors
          const validationErrors = {};
          error.response.data.detail.forEach(err => {
            if (err.loc && err.loc.length > 1) {
              validationErrors[err.loc[1]] = err.msg;
            }
          });
          setServerValidationErrors(validationErrors);
        }
      } else {
        setServerError('Failed to update role. Please try again.');
      }
    }
  };

  if (!isOpen || !role) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-y-auto modal z-99999">
      <div
        className="fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-[32px]"
        onClick={handleClose}
      ></div>
      {/* Mobile-optimized modal sizing */}
      <div className="relative w-full max-w-sm sm:max-w-2xl rounded-3xl bg-white dark:bg-gray-900 shadow-theme-xl max-h-[95vh] overflow-y-auto mx-2 sm:mx-4">
        <button
          onClick={handleClose}
          className="absolute right-3 top-3 z-999 flex h-9.5 w-9.5 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white sm:right-6 sm:top-6 sm:h-11 sm:w-11"
        >
          <XIcon className="w-5 h-5" />
        </button>

        <div className="p-4 sm:p-6 md:p-8">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              Edit Role
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Update role information and settings.
            </p>
          </div>

          {/* Server Error Display */}
          {serverError && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{serverError}</p>
            </div>
          )}

          <RoleForm
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
            onSubmit={handleSubmit}
            isEdit={true}
          />
        </div>
      </div>
    </div>
  );
};

export default EditRoleModal;