import { useQuery } from "@tanstack/react-query";
import { RoleApi } from "@/api/roleApi";

export const useRolesQuery = () => {
    return useQuery({
        queryKey: ['roles'],
        queryFn: () => RoleApi.getRoles(),
    });
};