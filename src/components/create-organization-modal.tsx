"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { organizationService } from "@/lib/api-services";
import { billingService } from "@/lib/api-services";
import type { PlanTier } from "@/schemas";
import { ORGANIZATIONS_KEY, useOrganization } from "@/contexts/organization";

interface CreateOrganizationModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function CreateOrganizationModal({
	open,
	onOpenChange,
}: CreateOrganizationModalProps) {
	const queryClient = useQueryClient();
	const { setActiveOrg } = useOrganization();

	const [name, setName] = React.useState("");
	const [plan, setPlan] = React.useState<PlanTier>("FREE" as PlanTier);
	const [error, setError] = React.useState<string | null>(null);

	const mutation = useMutation({
		mutationFn: async () => {
			const org = await organizationService.create({ name });

			if (plan !== "FREE") {
				const callbackUrl = `${window.location.origin}/dashboard/settings/billing?verified=true`;
				const billing = await billingService.initialize(org.id, {
					plan,
					callback_url: callbackUrl,
				});

				if (billing.authorization_url) {
					window.location.href = billing.authorization_url;
					return null;
				}
			}

			return org;
		},
		onSuccess: (org) => {
			if (!org) return;

			queryClient.invalidateQueries({ queryKey: ORGANIZATIONS_KEY });
			setActiveOrg(org);
			onOpenChange(false);
			resetForm();
		},
		onError: (err: unknown) => {
			const apiError =
				(err as { response?: { data?: { error?: string } } })?.response
					?.data?.error ||
				(err as { message?: string })?.message ||
				"Failed to create organization";
			setError(apiError);
		},
	});

	const resetForm = () => {
		setName("");
		setPlan("FREE" as PlanTier);
		setError(null);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		mutation.mutate();
	};

	const isPaidPlan = plan !== "FREE";

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Create organization</DialogTitle>
					<DialogDescription>
						Set up a new organization and choose your plan.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-2">
						<Label
							htmlFor="org-name"
							className="text-xs font-mono uppercase tracking-widest text-foreground/70"
						>
							Organization name
						</Label>
						<Input
							id="org-name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="e.g. Acme Corp"
							required
							disabled={mutation.isPending}
							className="bg-muted"
						/>
					</div>

					<div className="space-y-3">
						<Label className="text-xs font-mono uppercase tracking-widest text-foreground/70">
							Plan
						</Label>
						<RadioGroup
							value={plan}
							onValueChange={(v) => setPlan(v as PlanTier)}
							className="gap-2"
							disabled={mutation.isPending}
						>
							{[
								{
									value: "FREE" as PlanTier,
									label: "Free",
									desc: "Get started with basic features",
								},
								{
									value: "PRO" as PlanTier,
									label: "Pro",
									desc: "Advanced features for growing teams",
								},
								{
									value: "BUSINESS" as PlanTier,
									label: "Business",
									desc: "Full suite for organizations",
								},
								{
									value: "ENTERPRISE" as PlanTier,
									label: "Enterprise",
									desc: "Custom solutions and support",
								},
							].map((option) => (
								<Label
									key={option.value}
									htmlFor={`plan-${option.value}`}
									className="flex items-center gap-3 rounded-lg border border-border/40 bg-muted p-3 cursor-pointer has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
								>
									<RadioGroupItem
										value={option.value}
										id={`plan-${option.value}`}
									/>
									<div className="grid gap-0.5">
										<span className="text-xs font-mono uppercase tracking-widest text-foreground/80 font-bold">
											{option.label}
										</span>
										<span className="text-[10px] font-mono text-foreground/50">
											{option.desc}
										</span>
									</div>
								</Label>
							))}
						</RadioGroup>
					</div>

					{error && (
						<p className="text-[10px] font-mono uppercase tracking-widest text-destructive">
							{error}
						</p>
					)}

					<DialogFooter className="gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => {
								resetForm();
								onOpenChange(false);
							}}
							disabled={mutation.isPending}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={mutation.isPending || !name.trim()}
						>
							{mutation.isPending && (
								<Loader2 className="size-3.5 animate-spin mr-1.5" />
							)}
							{isPaidPlan
								? "Create & Continue to Payment"
								: "Create organization"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
