import { useQuery } from "@tanstack/react-query";
import { LoginApi } from "@/api/loginApi";

export const useAuth = () => {
    return useQuery({
        queryKey: ['auth'],
        queryFn: () => LoginApi.getMe()
    });
};