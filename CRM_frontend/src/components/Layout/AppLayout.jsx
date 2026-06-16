import React from "react";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Outlet } from "react-router-dom";
import { Header } from "../header";
import { Search } from "../search";
import { ProfileDropdown } from "../profile-dropdown";
import { ThemeSwitch } from "../theme-toggle";

export default function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-w-0">
        <Header fixed>
          <Search className="me-auto" />
          <ThemeSwitch />
          <ProfileDropdown />
        </Header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
