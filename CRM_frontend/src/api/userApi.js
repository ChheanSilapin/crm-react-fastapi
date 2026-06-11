import api from "./api";
import { UserCreateSchema, UserListSchema, UserSchema } from "@/types/user";

export const UserApi = {
    getUsers: async () => {
        const response = await api.get(`/api/v1/users`);
        return UserListSchema.parse(response.data);
    },
    createUser: async (data) => {
        const validatedData = UserCreateSchema.parse(data);
        const response = await api.post(`/api/v1/users`, validatedData);
        return UserSchema.parse(response.data);
    }
};