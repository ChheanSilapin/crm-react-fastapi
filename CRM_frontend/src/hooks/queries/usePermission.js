import { useQuery } from "@tanstack/react-query";
import { PermissionsApi } from "@/api/permissionsApi";

export const usePermissionQuery = () => {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: PermissionsApi.getPermissions,
  });
};