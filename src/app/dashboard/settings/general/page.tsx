"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { ORGANIZATIONS_KEY, useOrganization } from "@/contexts/organization";
import { organizationService } from "@/lib/api-services";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function GeneralPage() {
	const { activeOrg, setActiveOrg } = useOrganization();
	const queryClient = useQueryClient();
	const orgId = activeOrg?.id;

	const [name, setName] = useState("");
	const [logoUrl, setLogoUrl] = useState("");

	useEffect(() => {
		if (!activeOrg) return;
		setName(activeOrg.name);
		setLogoUrl(activeOrg.logo_url ?? "");
	}, [activeOrg]);

	const updateMutation = useMutation({
		mutationFn: () =>
			organizationService.update(orgId!, {
				name: name || undefined,
				logo_url: logoUrl || null,
			}),
		onSuccess: (updatedOrg) => {
			toast.success("Organization updated");
			setActiveOrg(updatedOrg);
			queryClient.invalidateQueries({ queryKey: ORGANIZATIONS_KEY });
		},
		onError: (err: any) => {
			toast.error(
				err?.response?.data?.error || "Failed to update organization",
			);
		},
	});

	if (!orgId) {
		return (
			<div className="flex flex-1 items-center justify-center">
				<p className="text-muted-foreground text-sm">
					Select an organization to manage settings.
				</p>
			</div>
		);
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!name.trim()) {
			toast.error("Organization name is required");
			return;
		}
		updateMutation.mutate();
	}

	return (
		<div className="flex flex-1 flex-col gap-8 p-6">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight">
					General
				</h1>
				<p className="text-muted-foreground mt-1 text-sm">
					Manage your organization&apos;s basic information.
				</p>
			</div>

			<form
				onSubmit={handleSubmit}
				className="flex flex-col gap-6 max-w-lg"
			>
				<div className="flex flex-col gap-2">
					<Label htmlFor="name">Organization name</Label>
					<Input
						id="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="My Organization"
					/>
				</div>

				<div className="flex flex-col gap-2">
					<Label htmlFor="logoUrl">Logo URL</Label>
					<Input
						id="logoUrl"
						type="url"
						value={logoUrl}
						onChange={(e) => setLogoUrl(e.target.value)}
						placeholder="https://example.com/logo.png"
					/>
					<p className="text-muted-foreground text-xs">
						Optional. Enter a URL to your organization&apos;s logo.
					</p>
				</div>

				<div className="flex items-center gap-2 pt-2">
					<Button
						type="submit"
						disabled={
							updateMutation.isPending || updateMutation.isSuccess
						}
					>
						{updateMutation.isPending ? (
							<Loader2 className="mr-1 size-4 animate-spin" />
						) : (
							<Save className="mr-1 size-4" />
						)}
						Save changes
					</Button>
				</div>
			</form>
		</div>
	);
}
