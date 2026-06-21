import api from "./api";
import {
  UserCreateSchema,
  UserListSchema,
  UserSchema,
  UserUpdateSchema,
} from "@/types/user";

export const UserApi = {
  getUsers: async ({ limit = 50, offset = 0 } = {}) => {
    const response = await api.get(
      `/api/v1/users?limit=${limit}&offset=${offset}`,
    );
    return UserListSchema.parse(response.data);
  },
  getUser: async (id) => {
    const response = await api.get(`/api/v1/users/${id}`);
    return UserSchema.parse(response.data);
  },
  createUser: async (data) => {
    const validatedData = UserCreateSchema.parse(data);
    const response = await api.post(`/api/v1/users`, validatedData);
    return UserSchema.parse(response.data);
  },
  updateUser: async (id, data) => {
    const validatedData = UserUpdateSchema.parse(data);
    const response = await api.put(`/api/v1/users/${id}`, validatedData);
    return UserSchema.parse(response.data);
  },
  deleteUser: async (id) => {
    const response = await api.delete(`/api/v1/users/${id}`);
    return response;
  },
  uploadAvatar: async (userId, file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.put(`/api/v1/users/${userId}/avatar`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};
