
import api from "./api";
import { RoleListSchema, RoleCreate, RoleSchema, RoleUpdate } from "@/types/role";

export const RoleApi = {
    getRoles: async ({ limit = 50, offset = 0 } = {}) => {
        const response = await api.get(`/api/v1/roles?limit=${limit}&offset=${offset}`);
        return RoleListSchema.parse(response.data);
    },
    getRole: async (id) => {
        const response = await api.get(`/api/v1/roles/${id}`);
        return RoleSchema.parse(response.data);
    },
    createRole: async (data) => {
        const validData = RoleCreate.parse(data);
        const response = await api.post('/api/v1/roles', validData);
        return RoleSchema.parse(response.data);
    },
    updateRole: async (id, data) => {
        const validData = RoleUpdate.parse(data);
        const response = await api.put(`/api/v1/roles/${id}`, validData);
        return RoleSchema.parse(response.data);
    },
    deleteRole: async (id) => {
        const response = await api.delete(`/api/v1/roles/${id}`);
        return response.data;
    }
};