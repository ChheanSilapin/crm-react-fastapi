import { useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSidebar } from '../../contexts/SidebarContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  GridIcon,
  UserCircleIcon,
  UsersIcon,
  BankIcon,
  ShieldIcon,
  CogIcon,
  HorizontalDotsIcon,
} from '../../icons';
import { usePermissions } from '../../hooks/usePermissions';

const AppSidebar = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const auth = useAuth();
  const { user, isAuthenticated, isLoading } = auth;
  const location = useLocation();
  const { useNavigationPermissions } = usePermissions();
  const {
    canViewDashboard,
    canViewCustomers,
    canViewBanks,
    canAccessAdministration,
    canViewRoles,
    canViewUsers,
    canViewRolePermissions,
  } = useNavigationPermissions();

  const getNavItems = () => {
    const items = [
      { icon: <GridIcon />, name: "Dashboard", path: "/", show: canViewDashboard },
      { icon: <UsersIcon />, name: "Customer", path: "/customers", show: canViewCustomers },
      { icon: <BankIcon />, name: "Bank", path: "/banks", show: canViewBanks },
    ];
    return items.filter(item => item.show);
  };

  const getAdminItems = () => {
    const items = [
      { icon: <ShieldIcon />, name: "Roles", path: "/roles", show: canViewRoles },
      { icon: <CogIcon />, name: "Role Permissions", path: "/role-permissions", show: canViewRolePermissions },
      { icon: <UserCircleIcon />, name: "Users", path: "/users", show: canViewUsers },
    ];
    return items.filter(item => item.show);
  };

  const navItems = getNavItems();
  const adminItems = getAdminItems();
  const isActive = useCallback((path) => location.pathname === path, [location.pathname]);
  
  const renderMenuItems = (items) => {
    return (
      <ul className="flex flex-col gap-4">
        {items.map((nav) => (
          <li key={nav.name}>
            <Link
              to={nav.path}
              className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"}`}
            >
              <span className={`menu-item-icon-size ${isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text flex items-center gap-2">
                  {nav.name}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 border-r border-green-200 dark:border-blue-400 text-gray-900 dark:text-white h-screen transition-all duration-300 ease-in-out z-50
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div
        className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <div className="text-xl font-bold text-gray-800 dark:text-white">
              CRM System
            </div>
          ) : (
            <div className="w-8 h-8 bg-white dark:bg-gray-900 rounded-lg flex items-center justify-center text-gray-800 dark:text-white font-bold">
              C
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        {isLoading || !isAuthenticated ? (
          <div className="flex-grow flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          </div>
        ) : (
          <nav className="mb-6">
            <div className="flex flex-col gap-4">
              {/* Main Menu */}
              {navItems.length > 0 && (
                <div>
                  <h2
                    className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                        ? "lg:justify-center"
                        : "justify-start"
                      }`}
                  >
                    {isExpanded || isHovered || isMobileOpen ? "Menu" : <HorizontalDotsIcon className="size-6" />}
                  </h2>
                  {renderMenuItems(navItems)}
                </div>
              )}

              {/* Admin Menu - Only show if user has administration access */}
              {canAccessAdministration && adminItems.length > 0 && (
                <div>
                  <h2
                    className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                        ? "lg:justify-center"
                        : "justify-start"
                      }`}
                  >
                    {isExpanded || isHovered || isMobileOpen ? "Administration" : <HorizontalDotsIcon />}
                  </h2>
                  {renderMenuItems(adminItems)}
                </div>
              )}
            </div>
          </nav>
        )}

        {/* User Info Section */}
        {isAuthenticated && user && (
          <div className="mt-auto mb-6 px-2">
            <div className={`p-3 bg-gray-50 dark:bg-gray-800 rounded-lg ${!isExpanded && !isHovered ? "lg:px-2" : ""}`}>
              {isExpanded || isHovered || isMobileOpen ? (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {(user.user_name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {user.user_name || 'User'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {(user.user_name || 'U').charAt(0).toUpperCase()}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default AppSidebar;
