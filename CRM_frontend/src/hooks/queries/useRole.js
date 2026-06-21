import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { RoleApi } from "@/api/roleApi";

export const useRolesQuery = ({ limit = 50, offset = 0 } = {}) => {
    return useQuery({
        queryKey: ['roles', { limit, offset }],
        queryFn: () => RoleApi.getRoles({ limit, offset }),
        placeholderData: keepPreviousData,
    });
};

export const useRoleQueryById = (id) => {
    return useQuery({
        queryKey: ['role', id],
        queryFn: () => RoleApi.getRole(id),
        enabled: !!id,
    });
};