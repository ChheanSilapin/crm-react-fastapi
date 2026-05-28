
export const parsePermissionName = (permissionName) => {
  if (!permissionName || typeof permissionName !== 'string') {
    return { entity: 'unknown', action: 'unknown', originalName: permissionName };
  }
  const trimmedName = permissionName.trim().toLowerCase();

  if (trimmedName.includes(':')) {
    const parts = trimmedName.split(':');
    if (parts.length >= 2) {
      const entity = parts[0];
      const action = parts[1];

      const actionMap = {
        'view': 'read',
        'read': 'read',
        'list': 'read',
        'create': 'create',
        'add': 'create',
        'update': 'update',
        'edit': 'update',
        'delete': 'delete',
        'remove': 'delete',
        'assign': 'update',
        'manage': 'update',
        'validate': 'read',
        'export': 'read',
        'status': 'update',
        'admin': 'create',
        'audit': 'read',
        'backup': 'create',
        'maintenance': 'update'
      };

      return {
        entity: normalizeEntityName(entity),
        action: actionMap[action] || action,
        originalName: permissionName
      };
    }
  }
  if (trimmedName.includes('_')) {
    const parts = trimmedName.split('_');
    if (parts.length >= 2) {
      const entity = parts[0];
      const action = parts[1];

      const actionMap = {
        'view': 'read',
        'read': 'read',
        'create': 'create',
        'add': 'create',
        'update': 'update',
        'edit': 'update',
        'delete': 'delete',
        'remove': 'delete'
      };

      return {
        entity: normalizeEntityName(entity),
        action: actionMap[action] || action,
        originalName: permissionName
      };
    }
  }

  if (trimmedName.includes(' ')) {
    const parts = trimmedName.split(' ');
    if (parts.length >= 2) {
      const action = parts[0];
      const entity = parts.slice(1).join('_');
      
      const actionMap = {
        'view': 'read',
        'read': 'read',
        'create': 'create',
        'add': 'create',
        'update': 'update',
        'edit': 'update',
        'delete': 'delete',
        'remove': 'delete',
        'manage': 'read' 
      };

      return {
        entity: normalizeEntityName(entity),
        action: actionMap[action] || action,
        originalName: permissionName
      };
    }
  }
  
  if (trimmedName === 'dashboard_view' || trimmedName === 'dashboard view') {
    return { entity: 'dashboard', action: 'read', originalName: permissionName };
  }
  
  if (!trimmedName.includes('_') && !trimmedName.includes(' ')) {
    
    if (trimmedName.includes('view') || trimmedName.includes('read')) {
      return { entity: 'other', action: 'read', originalName: permissionName };
    }
    if (trimmedName.includes('create') || trimmedName.includes('add')) {
      return { entity: 'other', action: 'create', originalName: permissionName };
    }
    if (trimmedName.includes('update') || trimmedName.includes('edit')) {
      return { entity: 'other', action: 'update', originalName: permissionName };
    }
    if (trimmedName.includes('delete') || trimmedName.includes('remove')) {
      return { entity: 'other', action: 'delete', originalName: permissionName };
    }
  }
 
  return { entity: 'other', action: 'unknown', originalName: permissionName };
};

export const normalizeEntityName = (entity) => {
  if (!entity) return 'unknown';
  
  const entityMap = {
    'customer': 'customers',
    'customers': 'customers',
    'user': 'users',
    'users': 'users',
    'bank': 'banks',
    'banks': 'banks',
    'role': 'roles',
    'roles': 'roles',
    'permission': 'permissions',
    'permissions': 'permissions',
    'post': 'posts',
    'posts': 'posts',
    'dashboard': 'dashboard',
    'hierarchy': 'hierarchy',
    'system': 'system',
    'reports': 'reports',
    'analytics': 'analytics',
    'role_permission': 'role_permissions',
    'role_permissions': 'role_permissions',
    'assign_permissions': 'role_permissions'
  };

  return entityMap[entity.toLowerCase()] || entity.toLowerCase();
};

export const getEntityDisplayName = (entity) => {
  const displayMap = {
    'customers': 'Customers',
    'users': 'Users',
    'banks': 'Banks',
    'roles': 'Roles',
    'permissions': 'Permissions',
    'posts': 'Posts',
    'dashboard': 'Dashboard',
    'hierarchy': 'Hierarchy',
    'system': 'System',
    'reports': 'Reports',
    'analytics': 'Analytics',
    'role_permissions': 'Role Permissions',
    'other': 'Other'
  };

  return displayMap[entity] || entity.charAt(0).toUpperCase() + entity.slice(1);
};

export const groupPermissionsByEntity = (permissions) => {
  if (!Array.isArray(permissions)) {
    return [];
  }

  const groupedMap = {};
  
  permissions.forEach(permission => {
    const parsed = parsePermissionName(permission.name);
    const { entity, action } = parsed;
    
    if (!groupedMap[entity]) {
      groupedMap[entity] = {
        entity,
        displayName: getEntityDisplayName(entity),
        permissions: {},
        originalPermissions: [],
        createdAt: null
      };
    }
    
    groupedMap[entity].permissions[action] = permission;
    groupedMap[entity].originalPermissions.push(permission);
    
    
    if (permission.created_at) {
      if (!groupedMap[entity].createdAt || 
          new Date(permission.created_at) < new Date(groupedMap[entity].createdAt)) {
        groupedMap[entity].createdAt = permission.created_at;
      }
    }
  });

  const groupedArray = Object.values(groupedMap);

  groupedArray.sort((a, b) => {
    if (a.entity === 'dashboard') return -1;
    if (b.entity === 'dashboard') return 1;
    if (a.entity === 'other') return 1;
    if (b.entity === 'other') return -1;
    return a.displayName.localeCompare(b.displayName);
  });

  return groupedArray;
};


export const getCRUDOperations = () => [
  { key: 'create', label: 'Create' },
  { key: 'read', label: 'View' },
  { key: 'update', label: 'Update' },
  { key: 'delete', label: 'Delete' }
];


export const hasAnyCRUDOperations = (group) => {
  if (!group || !group.permissions) return false;
  
  const crudOps = getCRUDOperations();
  return crudOps.some(op => group.permissions[op.key]);
};


export const getGroupStatistics = (group) => {
  if (!group || !group.permissions) {
    return { total: 0, active: 0, percentage: 0 };
  }

  const crudOps = getCRUDOperations();
  const total = crudOps.length;
  const active = crudOps.filter(op => group.permissions[op.key]).length;
  const percentage = total > 0 ? Math.round((active / total) * 100) : 0;

  return { total, active, percentage };
};


export const validateGroupedPermissions = (groupedPermissions) => {
  const errors = [];

  if (!Array.isArray(groupedPermissions)) {
    errors.push('Grouped permissions must be an array');
    return { isValid: false, errors };
  }

  groupedPermissions.forEach((group, index) => {
    if (!group.entity) {
      errors.push(`Group at index ${index} is missing entity property`);
    }

    if (!group.displayName) {
      errors.push(`Group at index ${index} is missing displayName property`);
    }

    if (!group.permissions || typeof group.permissions !== 'object') {
      errors.push(`Group at index ${index} has invalid permissions property`);
    }

    if (!Array.isArray(group.originalPermissions)) {
      errors.push(`Group at index ${index} has invalid originalPermissions property`);
    }
  });

  return { isValid: errors.length === 0, errors };
};


export const getPermissionsSummary = (permissions, groupedPermissions) => {
  const totalPermissions = Array.isArray(permissions) ? permissions.length : 0;
  const totalGroups = Array.isArray(groupedPermissions) ? groupedPermissions.length : 0;

  let totalCRUDOperations = 0;
  let activeCRUDOperations = 0;

  if (Array.isArray(groupedPermissions)) {
    groupedPermissions.forEach(group => {
      const stats = getGroupStatistics(group);
      totalCRUDOperations += stats.total;
      activeCRUDOperations += stats.active;
    });
  }

  const crudCompleteness = totalCRUDOperations > 0
    ? Math.round((activeCRUDOperations / totalCRUDOperations) * 100)
    : 0;

  return {
    totalPermissions,
    totalGroups,
    totalCRUDOperations,
    activeCRUDOperations,
    crudCompleteness
  };
};
