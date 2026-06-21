import { useAuth } from "./queries/useAuth";

export const usePermissions = (requiredPermission) => {
    const { data: user } = useAuth();

    if (!user?.permissions) {
        return false;
    }
    return user.permissions.includes(requiredPermission);
};