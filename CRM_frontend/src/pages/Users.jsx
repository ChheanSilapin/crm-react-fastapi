import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserCircleIcon, PlusIcon, PencilIcon, TrashIcon, ShieldIcon, CheckIcon, XMarkIcon } from '../icons';
import { useUsers } from '../hooks/useUsers';
import { useRoles } from '../hooks/useRoles';
import { formatFullDateTime } from '../utils/currencyFormatter';
import { AddUserModal, EditUserModal, DeleteUserModal } from '../components/modals/users';

const Users = () => {
  const {
    users,
    loading,
    error,
    create,
    update,
    delete: deleteUser,
    updateUserStatus,
    isCreating: _isCreating,
    isUpdating: _isUpdating,
    isDeleting: _isDeleting,
    isUpdatingStatus
  } = useUsers();

  // Fetch roles to map role_id to role names
  const { roles, loading: rolesLoading } = useRoles();

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleAddUser = async (userData) => {
    try {
      await create(userData);

    } catch {
      // Error is handled in the hook
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (userId, userData) => {
    try {
      await update({ id: userId, data: userData });
    } catch {
      // Error is handled in the hook
    }
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (userId) => {
    try {
      await deleteUser(userId);
    } catch {
      // Error is handled in the hook
    }
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await updateUserStatus(userId, newStatus);
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };



  

  // Helper function to get status color and icon
  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return {
          color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
          icon: CheckIcon,
          label: 'Active'
        };
      case 'inactive':
        return {
          color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
          icon: XMarkIcon,
          label: 'Inactive'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
          icon: XMarkIcon,
          label: 'Unknown'
        };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage system users and authentication</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-theme-xs"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add User
        </button>
      </div>



      {/* Loading State */}
      {(loading || rolesLoading) && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-green-200 dark:border-blue-400 p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">
              {loading ? 'Loading users...' : 'Loading roles...'}
            </span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && !rolesLoading && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Users Section Header */}
      {!loading && !rolesLoading && !error && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-green-200 dark:border-blue-400 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">System Users</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage user accounts and permissions ({users.length} users)
          </p>
        </div>
      )}

      {/* Users Table */}
      {!loading && !rolesLoading && !error && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-green-200 dark:border-blue-400 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-green-50 dark:bg-blue-500/10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-600 dark:text-blue-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-600 dark:text-blue-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-600 dark:text-blue-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-600 dark:text-blue-400 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-600 dark:text-blue-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-green-600 dark:text-blue-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-green-200 dark:divide-blue-400">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => {
                    
                    return (
                      <tr key={`user-${user.id}`} className="hover:bg-green-50 dark:hover:bg-blue-500/10">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <UserCircleIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {user.user_name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                ID: {user.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white">
                            <ShieldIcon className="w-3 h-3 mr-1" />
                            {user.role.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {(() => {
                            const statusInfo = getStatusInfo(user.status);
                            const StatusIcon = statusInfo.icon;
                            return (
                              <button
                                onClick={() => handleStatusToggle(user.id, user.status)}
                                disabled={isUpdatingStatus}
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-200 hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed ${statusInfo.color}`}
                                title={`Click to ${user.status === 'active' ? 'deactivate' : 'activate'} user`}
                              >
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusInfo.label}
                              </button>
                            );
                          })()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {formatFullDateTime(user.last_login)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {formatFullDateTime(user.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="text-green-600 hover:text-green-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                              title="Edit User"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                              title="Delete User"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddUser}
      />

      {/* Edit User Modal */}
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={handleUpdateUser}
        user={selectedUser}
      />

      {/* Delete User Modal */}
      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleConfirmDelete}
        user={selectedUser}
      />
    </div>
  );
};

export default Users;
