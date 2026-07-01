"use client";

import * as React from "react";
import { Radio, Settings2, SquareTerminal } from "lucide-react";

import { NavMain } from "./nav-main";
import { NavUser } from "@/components/nav-user";
import { OrgSwitcher } from "@/components/org-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "Alex Rivera",
    email: "alex@example.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      isActive: true,
      items: [
        { title: "General", url: "/dashboard/settings/general" },
        { title: "Members", url: "/dashboard/settings/members" },
        { title: "Billing", url: "/dashboard/settings/billing" },
        { title: "Notifications", url: "/dashboard/settings/notifications" },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" className="bg-muted border-r-0" {...props}>
      <SidebarHeader>
        <OrgSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
