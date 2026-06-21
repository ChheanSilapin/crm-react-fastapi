import { useQueryClient, useMutation } from "@tanstack/react-query";
import { RoleApi } from "@/api/roleApi";
import { toast } from "sonner";

export const useRoleMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: RoleApi.createRole,
        onSuccess: () => {
            toast.success("Role created successfully");
            queryClient.invalidateQueries({ queryKey: ["roles"] });
        },
        onError: (error) => {
            const message = error.response?.data?.detail || error.message || "Failed to create role";
            toast.error(message);
        },
    });
};

export const useRoleUpdate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => RoleApi.updateRole(id, data),
        onSuccess: () => {
            toast.success("Role updated successfully");
            queryClient.invalidateQueries({ queryKey: ["roles"] });
        },
        onError: (error) => {
            const message = error.response?.data?.detail || error.message || "Failed to update role";
            toast.error(message);
        },
    });
};

export const useRoleDelete = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => RoleApi.deleteRole(id),
        onSuccess: () => {
            toast.success("Role deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["roles"] });
        },
        onError: (error) => {
            const message = error.response?.data?.detail || error.message || "Failed to delete role";
            toast.error(message);
        },
    });
};
