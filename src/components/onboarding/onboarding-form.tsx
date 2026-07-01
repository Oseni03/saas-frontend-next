"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { organizationService } from "@/lib/api-services";
import { billingService } from "@/lib/api-services";
import { PRICING_PLANS } from "@/lib/pricing-plans";
import { type OrgResponse, PlanTier } from "@/schemas";
import { ORGANIZATIONS_KEY, useOrganization } from "@/contexts/organization";

export function OnboardingForm() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { setActiveOrg } = useOrganization();

	const [name, setName] = useState("");
	const [selectedPlan, setSelectedPlan] = useState<PlanTier>(PlanTier.FREE);

	const mutation = useMutation({
		mutationFn: async () => {
			const org = await organizationService.create({ name });

			if (selectedPlan !== "free") {
				const callbackUrl = `${window.location.origin}/onboarding?verified=true`;
				const billing = await billingService.initialize(org.id, {
					plan: selectedPlan,
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

			queryClient.setQueryData<OrgResponse[]>(
				ORGANIZATIONS_KEY,
				(old = []) => [...old, org],
			);
			setActiveOrg(org);
			router.push("/dashboard");
		},
		onError: (err: unknown) => {
			const apiError =
				(err as { response?: { data?: { error?: string } } })?.response
					?.data?.error ||
				(err as { message?: string })?.message ||
				"Failed to create organization";
			// toast.error(apiError);
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		mutation.mutate();
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-10">
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

			<div className="space-y-4">
				<Label className="text-xs font-mono uppercase tracking-widest text-foreground/70">
					Choose your plan
				</Label>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					{PRICING_PLANS.map((plan) => {
						const isSelected = selectedPlan === plan.id;
						const isPending = mutation.isPending;

						return (
							<button
								key={plan.id}
								type="button"
								onClick={() =>
									!isPending &&
									setSelectedPlan(plan.id as PlanTier)
								}
								disabled={isPending}
								className={`relative flex flex-col text-left p-5 border transition-all ${
									isSelected
										? "border-primary bg-primary/5"
										: "border-border bg-card hover:border-foreground/30"
								} ${isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
							>
								{isSelected && (
									<div className="absolute top-3 right-3 w-5 h-5 bg-primary flex items-center justify-center">
										<Check className="w-3 h-3 text-primary-foreground" />
									</div>
								)}

								<span className="text-[10px] font-mono uppercase tracking-widest text-foreground/45 font-semibold mb-2">
									{plan.name}
								</span>

								<div className="flex items-baseline gap-1 mb-2">
									<span className="text-foreground text-2xl font-display font-bold tracking-tight">
										{plan.priceMonthly === 0
											? "Free"
											: `$${plan.priceMonthly}`}
									</span>
									{plan.priceMonthly > 0 && (
										<span className="text-[10px] text-foreground/50 font-mono">
											/mo
										</span>
									)}
								</div>

								<p className="text-foreground/60 text-xs leading-relaxed mb-4 min-h-[32px]">
									{plan.description}
								</p>

								<ul className="space-y-1.5 mt-auto">
									{plan.features.slice(0, 3).map((feat) => (
										<li
											key={feat}
											className="text-[10px] font-mono text-foreground/55 flex items-center gap-1.5"
										>
											<span className="w-1 h-1 bg-foreground/30 rounded-full shrink-0" />
											{feat}
										</li>
									))}
									{plan.features.length > 3 && (
										<li className="text-[10px] font-mono text-foreground/35">
											+{plan.features.length - 3} more
											features
										</li>
									)}
								</ul>
							</button>
						);
					})}
				</div>
			</div>

			<Button
				type="submit"
				disabled={mutation.isPending || !name.trim()}
				className="w-full h-12 font-mono text-xs uppercase tracking-widest rounded-none"
			>
				{mutation.isPending ? (
					<Loader2 className="size-4 animate-spin" />
				) : (
					<>
						{selectedPlan === "free"
							? "Create workspace"
							: "Continue to payment"}
						<ArrowRight className="w-3.5 h-3.5 ml-2" />
					</>
				)}
			</Button>
		</form>
	);
}
