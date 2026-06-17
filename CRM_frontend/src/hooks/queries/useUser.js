import { useQuery } from "@tanstack/react-query";
import { UserApi } from "@/api/userApi";
import { keepPreviousData } from "@tanstack/react-query";

export const useUsersQuery = ({ limit = 50, offset = 0 } = {}) => {
  return useQuery({
    queryKey: ["users", { limit, offset }],
    queryFn: () => UserApi.getUsers({ limit, offset }),
    placeholderData: keepPreviousData,
  });
};

export const useUserById = (id) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => UserApi.getUser(id),
  });
};