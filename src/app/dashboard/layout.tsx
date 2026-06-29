import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { OrganizationGuard } from "@/components/organization-guard";
import { OrganizationProvider } from "@/contexts/organization";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<OrganizationProvider>
			<OrganizationGuard>
				<SidebarProvider>
					<AppSidebar />
					<SidebarInset>
						<header className="flex h-16 shrink-0 items-center border-b border-border bg-background">
							<div className="flex items-center gap-2 px-6 w-full">
								<SidebarTrigger className="-ml-1" />
								<span className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary font-bold select-none">
									DASHBOARD
								</span>
								<ThemeToggle />
							</div>
						</header>
						<div className="flex flex-1 flex-col bg-background">
							{children}
						</div>
					</SidebarInset>
				</SidebarProvider>
			</OrganizationGuard>
		</OrganizationProvider>
	);
}
