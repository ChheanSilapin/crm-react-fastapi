
import { apiRequest } from './axios';

export const usersAPI = {
  getAll: () => apiRequest('/v1/users'),

  getById: (id) => apiRequest(`/v1/users/${id}`),

  create: (userData) =>
    apiRequest('/v1/users', {
      method: 'POST',
      data: userData,
    }),

  update: (id, userData) =>
    apiRequest(`/v1/users/${id}`, {
      method: 'PUT',
      data: userData,
    }),

  delete: (id) =>
    apiRequest(`/v1/users/${id}`, {
      method: 'DELETE',
    }),

  updateStatus: (id, status) =>
    apiRequest(`/v1/users/${id}/status`, {
      method: 'PATCH',
      data: { status },
    }),
    
  getWithRole: (id) => apiRequest(`/v1/users/${id}/with-role`),
};

export const getAllUsers = usersAPI.getAll;
export const getUserById = usersAPI.getById;
export const createUser = usersAPI.create;
export const updateUser = usersAPI.update;
export const deleteUser = usersAPI.delete;
export const updateUserStatus = usersAPI.updateStatus;
export const getUserWithRole = usersAPI.getWithRole;
