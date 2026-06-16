import api from "./api";
import { UserCreateSchema, UserListSchema, UserSchema } from "@/types/user";

export const UserApi = {
    getUsers: async ({ limit = 50, offset = 0 } = {}) => {
        const response = await api.get(`/api/v1/users?limit=${limit}&offset=${offset}`);
        return UserListSchema.parse(response.data);
    },
    createUser: async (data) => {
        const validatedData = UserCreateSchema.parse(data);
        const response = await api.post(`/api/v1/users`, validatedData);
        return UserSchema.parse(response.data);
    }
};