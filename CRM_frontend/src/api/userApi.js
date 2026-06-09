import api from "./api";
import { UserListSchema } from "@/types/user";

export const UserApi = {
    getUsers: async () => {
        const response = await api.get(`/api/v1/users`);
        return UserListSchema.parse(response.data);
    }
};