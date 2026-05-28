
export const ROUTE_CONFIG = {
  // Public routes (no authentication required)
  PUBLIC: {
    LOGIN: '/login',
    UNAUTHORIZED: '/unauthorized'
  },

  // Dashboard routes (all authenticated users)
  DASHBOARD: {
    HOME: '/'
  },

  // Customer management routes
  CUSTOMERS: {
    LIST: '/customers'
  },

  // Bank management routes
  BANKS: {
    LIST: '/banks'
  },

  ADMIN: {
    ROLES: {
      LIST: '/roles'
    },

    ROLE_PERMISSIONS: {
      LIST: '/role-permissions'
    },
    USERS: {
      LIST: '/users'
    },
    AUTH_SETTINGS: {
      LIST: '/auth/settings'
    }
  }
};


// Simplified route access - backend handles all authorization
export const getAccessibleRoutes = (user) => {
  const accessible = {
    dashboard: true,
    customers: true,
    banks: true,
    administration: {
      roles: true,
      rolePermissions: true,
      users: true,
      authSettings: true
    }
  };

  if (!user) {
    return {
      dashboard: false,
      customers: false,
      banks: false,
      administration: {
        roles: false,
        rolePermissions: false,
        users: false,
        authSettings: false
      }
    };
  }

  return accessible;
};

export const UI_HINTS = {
  ADMIN_ONLY: () => true, // Backend handles authorization
  ALL_AUTHENTICATED: () => true,
  SHOW_ACTION_BUTTONS: () => true
};

export default ROUTE_CONFIG;
