import { apiRequest } from './axios';

export const permissionsAPI = {
  getAll: () => apiRequest('/v1/permissions'),
  getAllRoles: () => apiRequest('/v1/roles'),
};

export const getAllPermissions = permissionsAPI.getAll;
export const getAllRoles = permissionsAPI.getAllRoles;
