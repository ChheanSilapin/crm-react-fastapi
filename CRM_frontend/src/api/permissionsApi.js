import api from "./api";
import { PermissionListSchema } from "@/types/permissions";

export const PermissionsApi = {
    getPermissions: async () => {
        const response = await api.get(`/api/v1/permissions`);
        return PermissionListSchema.parse(response.data);
    },
};