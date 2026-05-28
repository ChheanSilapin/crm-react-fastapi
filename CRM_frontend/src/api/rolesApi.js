

import { apiRequest } from './axios';


export const rolesAPI = {
  getAll: () => apiRequest('/v1/roles'),

  getById: (id) => apiRequest(`/v1/roles/${id}`),

  create: (roleData) =>
    apiRequest('/v1/roles', {
      method: 'POST',
      data: roleData,
    }),

  update: (id, roleData) =>
    apiRequest(`/v1/roles/${id}`, {
      method: 'PUT',
      data: roleData,
    }),

  delete: (id) =>
    apiRequest(`/v1/roles/${id}`, {
      method: 'DELETE',
    }),

  assignPermissions: (roleId, permissionIds) =>
    apiRequest(`/v1/roles/${roleId}/permissions`, {
      method: 'POST',
      data: { permission_ids: permissionIds },
    }),

  getPermissions: (roleId) => apiRequest(`/v1/roles/${roleId}/permissions`),

  getUsers: (roleId) => apiRequest(`/v1/roles/${roleId}/users`),


};

export const getAllRoles = rolesAPI.getAll;
export const getRoleById = rolesAPI.getById;
export const createRole = rolesAPI.create;
export const updateRole = rolesAPI.update;
export const deleteRole = rolesAPI.delete;
export const assignPermissions = rolesAPI.assignPermissions;
export const getRoleUsers = rolesAPI.getUsers;

export const getRolePermissions = rolesAPI.getPermissions;

