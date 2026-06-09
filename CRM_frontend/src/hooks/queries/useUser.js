import { useQuery } from "@tanstack/react-query";
import { UserApi } from "@/api/userApi";

export const useUsersQuery = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: () => UserApi.getUsers(),
    });
};