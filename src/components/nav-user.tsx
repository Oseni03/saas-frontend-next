"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-card">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-card text-foreground text-[10px] font-mono uppercase">
                  AR
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate text-xs font-mono uppercase tracking-widest text-foreground/70">
                  {user.name}
                </span>
                <span className="truncate text-[10px] font-mono text-foreground/40">
                  {user.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-3 text-foreground/30" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 bg-card"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-card text-foreground text-[10px] font-mono uppercase">
                    AR
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-xs font-mono uppercase tracking-widest text-foreground/70">
                    {user.name}
                  </span>
                  <span className="truncate text-[10px] font-mono text-foreground/40">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-muted" />
            <DropdownMenuGroup>
              <DropdownMenuItem className="text-xs font-mono uppercase tracking-widest text-foreground/70 data-[highlighted]:bg-muted data-[highlighted]:text-foreground">
                <Sparkles className="size-3.5" />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-muted" />
            <DropdownMenuGroup>
              <DropdownMenuItem className="text-xs font-mono uppercase tracking-widest text-foreground/70 data-[highlighted]:bg-muted data-[highlighted]:text-foreground">
                <BadgeCheck className="size-3.5" />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs font-mono uppercase tracking-widest text-foreground/70 data-[highlighted]:bg-muted data-[highlighted]:text-foreground">
                <CreditCard className="size-3.5" />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs font-mono uppercase tracking-widest text-foreground/70 data-[highlighted]:bg-muted data-[highlighted]:text-foreground">
                <Bell className="size-3.5" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-muted" />
            <DropdownMenuItem className="text-xs font-mono uppercase tracking-widest text-foreground/70 data-[highlighted]:bg-muted data-[highlighted]:text-foreground">
              <LogOut className="size-3.5" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
