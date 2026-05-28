import { toast } from 'react-toastify';

/**
 * Simple toast notification utilities
 * Provides consistent messaging across the application
 */

export const showToast = {
  // Success messages
  success: (message) => toast.success(message),
  
  // Error messages
  error: (message) => toast.error(message),
  
  // Info messages
  info: (message) => toast.info(message),
  
  // Warning messages
  warning: (message) => toast.warning(message),

  // CRUD operation messages
  created: (resource) => toast.success(`${resource} created successfully`),
  updated: (resource) => toast.success(`${resource} updated successfully`),
  deleted: (resource) => toast.success(`${resource} deleted successfully`),
  
  // Error messages for CRUD operations
  createError: (resource, error) => {
    const message = error?.response?.data?.detail || error?.response?.data?.message || error?.message || `Failed to create ${resource}`;
    toast.error(message);
  },
  
  updateError: (resource, error) => {
    const message = error?.response?.data?.detail || error?.response?.data?.message || error?.message || `Failed to update ${resource}`;
    toast.error(message);
  },
  
  deleteError: (resource, error) => {
    const message = error?.response?.data?.detail || error?.response?.data?.message || error?.message || `Failed to delete ${resource}`;
    toast.error(message);
  },

  // Generic API error handler
  apiError: (error) => {
    const message = error?.response?.data?.message || 
                   error?.response?.data?.detail || 
                   error?.message || 
                   'An unexpected error occurred';
    toast.error(message);
  }
};

// Resource name helpers for consistent naming
export const RESOURCE_NAMES = {
  bank: 'Bank',
  customer: 'Customer', 
  user: 'User',
  role: 'Role',
  permission: 'Permission',
  rolePermission: 'RolePermission'
};
