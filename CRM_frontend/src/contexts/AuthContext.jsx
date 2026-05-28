/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { authAPI } from '../api/api';
import { setAuthToken, initializeAuthToken } from '../api/axios';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  

  const setAuthWithUser = useCallback((userResponse) => {
    setAuth({
      user: userResponse,
      accessToken: 'set_in_headers',
      permissions: userResponse.permissions || [],
      roles: userResponse.role ? [userResponse.role.name] : [],
    });
  }, []);

  const login = async (username, password) => {
    setIsLoading(true);
    try {
      const userResponse = await authAPI.login(username, password);
      if (!userResponse) {
        throw new Error('Login failed - no user data received');
      }
      setAuthWithUser(userResponse);
      return { success: true, user: userResponse };
    } catch (error) {
      console.error('Login failed:', error);
      const apiErrorDetail = error.response?.data?.detail;
      const msg = apiErrorDetail || 'Login failed. Incorrect username or password.';
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } finally {
      setAuth({});
      setAuthToken(null);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const hasToken = initializeAuthToken();
        if (hasToken) {
          const userResponse = await authAPI.getUser();
          if (userResponse) {
            setAuthWithUser(userResponse);
          } else {
            setAuthToken(null);
          }
        }
      } catch (error) {
        console.log('Token validation failed during initialization:', error.message);
        setAuthToken(null);
        setAuth({});
      } finally {
        setIsLoading(false);
      }
    };
    initializeAuth();
  }, [setAuthWithUser]);

  const user = auth.user;
  const isAuthenticated = !!auth.user;
  const userPermissions = useMemo(() => auth.permissions || [], [auth.permissions]);

  const hasPermission = useCallback((permission) => userPermissions.includes(permission), [userPermissions]);
  const hasAnyPermission = useCallback((permissions) => permissions.some(p => userPermissions.includes(p)), [userPermissions]);
  const hasAllPermissions = useCallback((permissions) => permissions.every(p => userPermissions.includes(p)), [userPermissions]);
  const isAdmin = useCallback(() => user?.role?.name === 'admin', [user]);
  const hasRole = useCallback((role) => user?.role?.name === role, [user]);

  const getPermissionsByEntity = useCallback((entity) => userPermissions.filter(p => p.startsWith(entity)), [userPermissions]);

  const value = {
    auth,
    setAuth,
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,

    // EXPOSED PERMISSION CHECKING FUNCTIONS
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin,
    hasRole,
    getPermissionsByEntity
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;