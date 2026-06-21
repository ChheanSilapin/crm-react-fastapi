import * as React from "react";
import {
  GalleryVerticalEnd,
  Home,
  Users as UsersIcon,
  Landmark,
  Settings2,
  Lock,
  ShieldUser,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "Admin User",
    email: "admin@crm.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: <Home className="size-4" />,
      permission: "dashboard:view",
    },
    {
      title: "Customers",
      url: "/customers",
      icon: <UsersIcon className="size-4" />,
      permission: "customers:list",
    },
    {
      title: "Banks",
      url: "/banks",
      icon: <Landmark className="size-4" />,
      permission: "banks:list",
    },
    {
      title: "Settings",
      url: "#",
      icon: <Settings2 className="size-4" />,
      items: [
        {
          title: "Roles",
          url: "/roles",
          icon: <ShieldUser className="size-4" />,
          permission: "roles:list",
        },
        {
          title: "Role Permissions",
          url: "/role-permissions",
          icon: <Lock className="size-4" />,
          permission: "permissions:list",
        },
        {
          title: "Users",
          url: "/users",
          icon: <UsersIcon className="size-4" />,
          permission: "users:list",
        },
      ],
    },
  ],
};

import { useAuth } from "@/hooks/queries/useAuth";
import { getImageUrl } from "@/lib/utils";

export function AppSidebar({ ...props }) {
  const { data: userData, isLoading } = useAuth();

  // Format the backend data to match what NavUser expects
  const currentUser = userData
    ? {
        name: userData.username,
        role: userData.role?.name || "User",
        roleDescription: userData.role?.description || "",
        avatar: getImageUrl(userData.avatar),
      }
    : data.user;

  const hasAccess = (permission) => {
    if (!permission) return true;
    if (!userData?.permissions) return false;
    if (userData.permissions.includes("system:admin")) return true;
    return userData.permissions.includes(permission);
  };

  const filteredNavMain = data.navMain
    .filter((item) => hasAccess(item.permission))
    .map((item) => ({
      ...item,
      items: item.items
        ? item.items.filter((subItem) => hasAccess(subItem.permission))
        : undefined,
    }))
    .filter((item) => !item.items || item.items.length > 0);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">CRM System</span>
                <span className="truncate text-xs">Enterprise</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={currentUser} isLoading={isLoading} />
      </SidebarFooter>
    </Sidebar>
  );
}
