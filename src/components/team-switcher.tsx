"use client";

import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string;
    logo: React.ElementType;
    plan: string;
  }[];
}) {
  const { isMobile } = useSidebar();
  const [activeTeam, setActiveTeam] = React.useState(teams[0]);

  if (!activeTeam) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-card">
              <div className="flex aspect-square size-8 items-center justify-center bg-muted">
                <activeTeam.logo className="size-4 text-foreground/70" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate text-xs font-mono uppercase tracking-widest text-foreground/70">
                  {activeTeam.name}
                </span>
                <span className="truncate text-[10px] font-mono text-foreground/40">
                  {activeTeam.plan}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-3 text-foreground/30" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 bg-card"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-[10px] font-mono uppercase tracking-widest text-foreground/40 font-bold">
              Teams
            </DropdownMenuLabel>
            {teams.map((team, index) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() => setActiveTeam(team)}
                className="gap-2 p-2 text-xs font-mono uppercase tracking-widest text-foreground/70 data-[highlighted]:bg-muted data-[highlighted]:text-foreground"
              >
                <div className="flex size-6 items-center justify-center bg-muted">
                  <team.logo className="size-3 shrink-0 text-foreground/50" />
                </div>
                {team.name}
                <DropdownMenuShortcut className="text-[10px] font-mono text-foreground/30">
                  ⌘{index + 1}
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className="bg-muted" />
            <DropdownMenuItem className="gap-2 p-2 text-xs font-mono uppercase tracking-widest text-foreground/50 data-[highlighted]:bg-muted data-[highlighted]:text-foreground">
              <div className="flex size-6 items-center justify-center bg-muted">
                <Plus className="size-3" />
              </div>
              Add team
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
