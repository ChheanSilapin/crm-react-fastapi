import { useState, useEffect, Fragment } from 'react';
import { CheckIcon, XMarkIcon, ShieldIcon, KeyIcon } from '../icons';
import { useRoles } from '../hooks/useRoles';
import { useCRUD } from '../hooks/useCRUD';
import { permissionsAPI } from '../api/api';
import { groupPermissionsByEntity } from '../utils/permissionGrouping';
import { showToast } from '../utils/toast';

const RolePermissions = () => {
  const { roles, loading: rolesLoading, error: rolesError, togglePermission: toggleRolePermission } = useRoles();
  const { permissions, loading: permissionsLoading, error: permissionsError } = useCRUD({ resource: 'permissions', api: permissionsAPI, options: { cacheDuration: 600000, gcTime: 1800000 } });
  
  const [rolePermissions, setRolePermissions] = useState({});
  const [rolePermissionsLoading, setRolePermissionsLoading] = useState(true);
  const [rolePermissionsError, setRolePermissionsError] = useState(null);
  const [pendingToggles, setPendingToggles] = useState(new Set());

  const loading = rolesLoading || permissionsLoading || rolePermissionsLoading;
  const error = rolesError || permissionsError || rolePermissionsError;

  useEffect(() => {
    if (!roles) return;
    setRolePermissionsLoading(true);
    setRolePermissionsError(null);
    try {
      const map = {};
      if (Array.isArray(roles)) roles.forEach(role => (map[role.id] = role.permissions?.map(p => p.id) || []));
      setRolePermissions(map);
    } catch (err) {
      console.error('Error extracting role permissions:', err);
      setRolePermissionsError('Failed to process data');
    } finally {
      setRolePermissionsLoading(false);
    }
  }, [roles]);

  const togglePermission = async (roleId, permissionId) => {
    const toggleKey = `${roleId}-${permissionId}`;
    setPendingToggles(prev => new Set(prev).add(toggleKey));

    const prevPerms = rolePermissions[roleId] || [];
    const hasPerm = prevPerms.includes(permissionId);
    const newPerms = hasPerm ? prevPerms.filter(pId => pId !== permissionId) : [...prevPerms, permissionId];
    setRolePermissions(prev => ({ ...prev, [roleId]: newPerms }));

    try {
      await toggleRolePermission({ roleId, permissionId, currentPermissions: prevPerms });
      const roleName = roles.find(r => r.id === roleId)?.name || 'role';
      const permName = permissions.find(p => p.id === permissionId)?.name || 'permission';
      showToast.success(`Permission "${permName}" ${hasPerm ? 'removed from' : 'added to'} ${roleName}.`);
    } catch (err) {
      console.error('Error updating permission:', err);
      showToast.error('Failed to update permission. Please try again.');
      setRolePermissions(prev => ({ ...prev, [roleId]: prevPerms }));
    } finally {
      setPendingToggles(prev => { const next = new Set(prev); next.delete(toggleKey); return next; });
    }
  };

  const hasPermission = (roleId, permissionId) => rolePermissions[roleId]?.includes(permissionId) || false;
  const groupedPermissions = groupPermissionsByEntity(permissions || []);
  const isPending = (roleId, permissionId) => pendingToggles.has(`${roleId}-${permissionId}`);
  
  const permissionIcon = (roleId, permissionId) => isPending(roleId, permissionId)
    ? <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
    : hasPermission(roleId, permissionId) ? <CheckIcon className="w-4 h-4" /> : <XMarkIcon className="w-4 h-4" />;

  const renderLoadingOrError = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Role Permissions</h1><p className="text-gray-600 dark:text-gray-400">Manage role-based access control</p></div></div>
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        {loading && (<div className="animate-pulse"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>{[...Array(5)].map((_, i) => (<div key={i} className="h-3 bg-gray-200 dark:bg-gray-700 rounded my-3"></div>))}</div>)}
        {error && (<div className="text-center py-8"><XMarkIcon className="w-12 h-12 mx-auto text-red-500 mb-2" /><h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Error Loading Data</h3><p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p><button onClick={() => window.location.reload()} className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg">Retry</button></div>)}
      </div>
    </div>
  );

  if (loading || error) return renderLoadingOrError();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Role Permissions</h1><p className="text-gray-600 dark:text-gray-400">Manage role-based access control</p></div>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Permission Matrix</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Configure permissions for each role</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Permission</th>
                {roles.map(role => (<th key={role.id} className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"><div className="flex flex-col items-center"><ShieldIcon className="w-4 h-4 mb-1" />{role.name}</div></th>))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {groupedPermissions.map(group => (<Fragment key={group.entity}><tr className="bg-gray-25 dark:bg-gray-800/50"><td colSpan={roles.length + 1} className="px-6 py-3"><div className="flex items-center"><KeyIcon className="w-4 h-4 mr-2 text-gray-500" /><span className="font-medium text-gray-900 dark:text-white">{group.displayName}</span><span className="ml-2 text-xs text-gray-500 dark:text-gray-400">({group.originalPermissions.length} permissions)</span></div></td></tr>{group.originalPermissions.map(permission => (<tr key={permission.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50"><td className="px-6 py-4"><div><div className="text-sm font-medium text-gray-900 dark:text-white">{permission.name.charAt(0).toUpperCase() + permission.name.slice(1)}</div><div className="text-sm text-gray-500 dark:text-gray-400">{permission.description}</div></div></td>{roles.map(role => (<td key={role.id} className="px-6 py-4 text-center"><button onClick={() => togglePermission(role.id, permission.id)} disabled={isPending(role.id, permission.id)} className={`w-6 h-6 rounded-full inline-flex items-center justify-center ${isPending(role.id, permission.id) ? 'opacity-50 cursor-not-allowed' : ''} ${hasPermission(role.id, permission.id) ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-200 dark:bg-gray-700 text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>{permissionIcon(role.id, permission.id)}</button></td>))}</tr>))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RolePermissions;
