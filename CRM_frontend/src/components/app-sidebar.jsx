import * as React from "react"
import {
  GalleryVerticalEnd,
  Home,
  Users as UsersIcon,
  Landmark,
  Settings2,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

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
      isActive: true,
    },
    {
      title: "Customers",
      url: "/customers",
      icon: <UsersIcon className="size-4" />,
    },
    {
      title: "Banks",
      url: "/banks",
      icon: <Landmark className="size-4" />,
    },
    {
      title: "Settings",
      url: "#",
      icon: <Settings2 className="size-4" />,
      items: [
        {
          title: "Roles",
          url: "/roles",
        },
        {
          title: "Role Permissions",
          url: "/role-permissions",
        },
        {
          title: "Users",
          url: "/users",
        },
      ],
    },
  ],
}

import { useAuth } from "@/hooks/queries/useAuth"

export function AppSidebar({ ...props }) {
  const { data: userData, isLoading } = useAuth();

  // Format the backend data to match what NavUser expects
  const currentUser = userData ? {
    name: userData.username,
    role: userData.role?.name || "User", 
    roleDescription: userData.role?.description || "",
    avatar: "/avatars/shadcn.jpg", 
  } : data.user;

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
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={currentUser} isLoading={isLoading} />
      </SidebarFooter>
    </Sidebar>
  )
}
