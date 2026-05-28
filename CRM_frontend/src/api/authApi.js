

import { apiRequest, setAuthToken } from './axios';

export const authAPI = {
  login: async (username, password) => {
    // Clear any existing authentication data before login
    setAuthToken(null);

    const tokenResponse = await apiRequest('/v1/login', {
      method: 'POST',
      data: { username, password },
    }, false);

    // Check if we got a valid token response
    if (!tokenResponse || !tokenResponse.access_token) {
      throw new Error('Invalid login response from server');
    }

    // Set the Bearer token for subsequent requests
    setAuthToken(tokenResponse.access_token);

    // Get user data after successful login
    const userResponse = await apiRequest('/v1/me');
    if (!userResponse) {
      throw new Error('Failed to retrieve user data after login');
    }

    return userResponse;
  },

  getUser: () => apiRequest('/v1/me'),



  changePassword: async (currentPassword, newPassword) => {
    const response = await apiRequest('/v1/change-password', {
      method: 'POST',
      data: { current_password: currentPassword, new_password: newPassword }
    });
    return response;
  },

  getPasswordPolicy: () => apiRequest('/v1/password-policy', {}, false),

  logout: async () => {
    try {
      // Call logout endpoint to invalidate tokens on server and clear refresh token cookie
      await apiRequest('/v1/logout', { method: 'POST' });
    } catch (error) {
      // Log error but don't throw - we still want to clear local auth data
      console.warn('Logout endpoint failed:', error);
    } finally {
      // Always clear client-side authentication data
      setAuthToken(null);
    }
  },
};

// Export individual functions for direct import
export const login = authAPI.login;
export const getUser = authAPI.getUser;

export const changePassword = authAPI.changePassword;
export const getPasswordPolicy = authAPI.getPasswordPolicy;
export const logout = authAPI.logout;
