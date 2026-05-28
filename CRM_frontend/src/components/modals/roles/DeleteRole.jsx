import { XIcon, ExclamationTriangleIcon } from '../../../icons';
import { useState } from 'react';

const DeleteRoleModal = ({
  isOpen,
  onClose,
  onConfirm,
  role = null,
  isDeleting = false
}) => {
  const [serverError, setServerError] = useState('');

  // Handle modal close
  const handleClose = () => {
    setServerError('');
    onClose();
  };

  // Handle delete confirmation
  const handleConfirm = async () => {
    setServerError('');

    try {
      await onConfirm(role.id);
      handleClose();
    } catch (error) {
      console.error('Error deleting role:', error);

      if (error.response?.data?.detail) {
        setServerError(error.response.data.detail);
      } else {
        setServerError('Cannot delete role that is assigned to users.');
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

      <div className="relative w-full max-w-sm sm:max-w-md rounded-3xl bg-white dark:bg-gray-900 shadow-theme-xl mx-2 sm:mx-4">
        <button
          onClick={handleClose}
          className="absolute right-3 top-3 z-999 flex h-9.5 w-9.5 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white sm:right-6 sm:top-6 sm:h-11 sm:w-11"
        >
          <XIcon className="w-5 h-5" />
        </button>

        <div className="p-4 sm:p-6 md:p-8">
          <div className="flex items-center mb-4 sm:mb-6">
            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mr-3 sm:mr-4">
              <ExclamationTriangleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Delete Role
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                This action cannot be undone.
              </p>
            </div>
          </div>

          {/* Server Error Display */}
          {serverError && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{serverError}</p>
            </div>
          )}

          <div className="mb-6">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Are you sure you want to delete the role{' '}
              <span className="font-semibold text-gray-900 dark:text-white">
                "{role.name}"
              </span>
              ?
            </p>
            {role.description && (
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Description: {role.description}
              </p>
            )}
            <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                <strong>Warning:</strong> This will permanently delete the role and cannot be undone.
                Make sure no users are currently assigned to this role.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={handleClose}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 sm:py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 sm:py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Deleting...
                </>
              ) : (
                'Delete Role'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteRoleModal;