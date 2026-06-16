
import api from "./api";
import { RoleListSchema } from "@/types/role";

export const RoleApi = {
    getRoles: async () => {
        const response = await api.get(`/api/v1/roles`);
        return RoleListSchema.parse(response.data);
    }
};