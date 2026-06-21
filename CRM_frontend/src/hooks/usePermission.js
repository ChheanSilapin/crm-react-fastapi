import { useAuth } from "./queries/useAuth";

export const usePermissions = (requiredPermission) => {
    const { data: user, isLoading } = useAuth();

    if (isLoading) {
        return null; // Return null to indicate it's still fetching
    }

    if (!user?.permissions) {
        return false;
    }
    
    // Admin override (optional, but good practice if admin has all access)
    if (user.permissions.includes("system:admin")) {
        return true;
    }

    return user.permissions.includes(requiredPermission);
};