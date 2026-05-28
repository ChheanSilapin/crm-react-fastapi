import React, { useState } from 'react';
import {
  ShieldIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  UsersIcon
} from '../icons';
import { useRoles } from '../hooks/useRoles';
import { AddRoleModal, EditRoleModal, DeleteRoleModal } from '../components/modals/roles';

const Roles = () => {
  // Modal states
  const [modals, setModals] = useState({
    add: false,
    edit: false,
    delete: false,
    view: false
  });
  const [selectedRole, setSelectedRole] = useState(null);

  // Fetch roles data
  const {
    roles,
    loading,
    error,
    create,
    update,
    delete: deleteRole,
    isCreating: _isCreating,
    isUpdating: _isUpdating,
    isDeleting
  } = useRoles();

  // Modal handlers
  const openModal = (type, role = null) => {
    setSelectedRole(role);
    setModals(prev => ({ ...prev, [type]: true }));
  };

  const closeModal = (type) => {
    setModals(prev => ({ ...prev, [type]: false }));
    setSelectedRole(null);
  };

  const closeAllModals = () => {
    setModals({ add: false, edit: false, delete: false, view: false });
    setSelectedRole(null);
  };

  // CRUD handlers
  const handleCreateRole = async (roleData) => {
    await create(roleData);
    closeAllModals();
  };

  const handleUpdateRole = async (roleId, roleData) => {
    await update({ id: roleId, data: roleData });
    closeAllModals();
  };

  const handleDeleteRole = async (roleId) => {
    await deleteRole(roleId);
    closeAllModals();
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Roles</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage user roles and access levels</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Roles</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage user roles and access levels</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">
              <ShieldIcon className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Failed to load roles
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {error.message || 'An error occurred while loading roles.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Roles</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage user roles and access levels ({roles?.length || 0} roles)
          </p>
        </div>
        <button
          onClick={() => openModal('add')}
          className="inline-flex items-center justify-center px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg transition-colors duration-200 text-sm"
        >
          <ShieldIcon className="w-4 h-4 mr-2" />
          Add Role
        </button>
      </div>

      {/* Roles Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        {roles && roles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Description
                  </th>
                  
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {roles.map((role) => (
                  <tr key={role.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-8 h-8 bg-brand-100 dark:bg-brand-900/20 rounded-full flex items-center justify-center">
                          <ShieldIcon className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                            {role.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            ID: {role.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                        {role.description || 'No description'}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(role.created_at)}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {/* <button
                          onClick={() => openModal('view', role)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          title="View details"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button> */}
                        <button
                          onClick={() => openModal('edit', role)}
                          className="text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
                          title="Edit role"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openModal('delete', role)}
                          className="text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                          title="Delete role"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <ShieldIcon className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No roles found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Get started by creating your first role.
            </p>
            <button
              onClick={() => openModal('add')}
              className="inline-flex items-center px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <ShieldIcon className="w-4 h-4 mr-2" />
              Add First Role
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddRoleModal
        isOpen={modals.add}
        onClose={() => closeModal('add')}
        onSubmit={handleCreateRole}
      />

      <EditRoleModal
        isOpen={modals.edit}
        onClose={() => closeModal('edit')}
        onSubmit={handleUpdateRole}
        role={selectedRole}
      />

      <DeleteRoleModal
        isOpen={modals.delete}
        onClose={() => closeModal('delete')}
        onConfirm={handleDeleteRole}
        role={selectedRole}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Roles;
