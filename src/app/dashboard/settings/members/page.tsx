"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
	Loader2,
	Mail,
	MoreHorizontal,
	UserMinus,
	UserPlus,
	X,
} from "lucide-react";
import { toast } from "sonner";

import { useOrganization } from "@/contexts/organization";
import { useMe } from "@/hooks/useAuth";
import { organizationService } from "@/lib/api-services";
import { MemberRole } from "@/schemas";
import type { InvitationResponse, MembershipResponse } from "@/schemas";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

const MEMBERS_KEY = ["organization-members"] as const;
const INVITATIONS_KEY = ["organization-invitations"] as const;

const roleBadgeVariant = {
	[MemberRole.OWNER]: "default" as const,
	[MemberRole.ADMIN]: "secondary" as const,
	[MemberRole.MEMBER]: "outline" as const,
};

function getInitials(name?: string, email?: string) {
	if (name) {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	}
	if (email) return email[0].toUpperCase();
	return "?";
}

function RoleBadge({ role }: { role: MemberRole }) {
	return <Badge variant={roleBadgeVariant[role]}>{role}</Badge>;
}

function ConfirmRemoveDialog({
	member,
	open,
	onOpenChange,
	onConfirm,
	isLoading,
}: {
	member: MembershipResponse;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
	isLoading: boolean;
}) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Remove member</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to remove{" "}
						<span className="font-medium text-foreground">
							{member.name || member.email || member.user_id}
						</span>{" "}
						from the organization? This action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isLoading}>
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction
						variant="destructive"
						disabled={isLoading}
						onClick={onConfirm}
					>
						{isLoading && (
							<Loader2 className="mr-1 size-4 animate-spin" />
						)}
						Remove
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export default function MembersPage() {
	const { activeOrg } = useOrganization();
	const { data: me } = useMe();
	const queryClient = useQueryClient();
	const orgId = activeOrg?.id;

	const [inviteEmail, setInviteEmail] = useState("");
	const [inviteRole, setInviteRole] = useState<MemberRole>(MemberRole.MEMBER);
	const [inviteError, setInviteError] = useState<string | null>(null);

	const [removeTarget, setRemoveTarget] = useState<MembershipResponse | null>(
		null,
	);

	const membersQuery = useQuery({
		queryKey: [...MEMBERS_KEY, orgId],
		queryFn: () => organizationService.listMembers(orgId!),
		enabled: !!orgId,
	});

	const invitationsQuery = useQuery({
		queryKey: [...INVITATIONS_KEY, orgId],
		queryFn: () => organizationService.listInvitations(orgId!),
		enabled: !!orgId,
	});

	const inviteMutation = useMutation({
		mutationFn: () =>
			organizationService.inviteMember(orgId!, {
				email: inviteEmail,
				role: inviteRole,
			}),
		onSuccess: () => {
			toast.success("Invitation sent");
			setInviteEmail("");
			setInviteRole(MemberRole.MEMBER);
			setInviteError(null);
			queryClient.invalidateQueries({
				queryKey: [...INVITATIONS_KEY, orgId],
			});
		},
		onError: (err: any) => {
			setInviteError(
				err?.response?.data?.error || "Failed to send invitation",
			);
		},
	});

	const removeMutation = useMutation({
		mutationFn: (userId: string) =>
			organizationService.removeMember(orgId!, userId),
		onSuccess: () => {
			toast.success("Member removed");
			setRemoveTarget(null);
			queryClient.invalidateQueries({
				queryKey: [...MEMBERS_KEY, orgId],
			});
		},
		onError: (err: any) => {
			toast.error(
				err?.response?.data?.error || "Failed to remove member",
			);
		},
	});

	const roleMutation = useMutation({
		mutationFn: ({ userId, role }: { userId: string; role: MemberRole }) =>
			organizationService.updateMemberRole(orgId!, userId, { role }),
		onSuccess: () => {
			toast.success("Role updated");
			queryClient.invalidateQueries({
				queryKey: [...MEMBERS_KEY, orgId],
			});
		},
		onError: (err: any) => {
			toast.error(err?.response?.data?.error || "Failed to update role");
		},
	});

	const revokeMutation = useMutation({
		mutationFn: (invitationId: string) =>
			organizationService.revokeInvitation(orgId!, invitationId),
		onSuccess: () => {
			toast.success("Invitation revoked");
			queryClient.invalidateQueries({
				queryKey: [...INVITATIONS_KEY, orgId],
			});
		},
		onError: (err: any) => {
			toast.error(
				err?.response?.data?.error || "Failed to revoke invitation",
			);
		},
	});

	if (!orgId) {
		return (
			<div className="flex flex-1 items-center justify-center">
				<p className="text-muted-foreground text-sm">
					Select an organization to manage members.
				</p>
			</div>
		);
	}

	const members = membersQuery.data ?? [];
	const invitations = invitationsQuery.data ?? [];
	const currentUserMembership = members.find((m) => m.user_id === me?.id);
	const currentUserRole = currentUserMembership?.role ?? MemberRole.MEMBER;
	const canManage =
		currentUserRole === MemberRole.OWNER ||
		currentUserRole === MemberRole.ADMIN;
	const canPromoteToOwner = currentUserRole === MemberRole.OWNER;

	function handleInvite(e: React.FormEvent) {
		e.preventDefault();
		setInviteError(null);

		if (!inviteEmail.trim()) {
			setInviteError("Email is required");
			return;
		}

		inviteMutation.mutate();
	}

	function handleRemove() {
		if (!removeTarget) return;
		removeMutation.mutate(removeTarget.user_id);
	}

	function handleRoleChange(userId: string, role: MemberRole) {
		if (role === MemberRole.OWNER && !canPromoteToOwner) {
			toast.error("Only OWNERs can promote to OWNER");
			return;
		}
		roleMutation.mutate({ userId, role });
	}

	return (
		<div className="flex flex-1 flex-col gap-8 p-6">
			{/* Page header */}
			<div>
				<h1 className="text-2xl font-semibold tracking-tight">
					Members
				</h1>
				<p className="text-muted-foreground mt-1 text-sm">
					Manage who has access to{" "}
					<span className="font-medium text-foreground">
						{activeOrg?.name}
					</span>
					.
				</p>
			</div>

			{/* Invite form */}
			{canManage && (
				<form
					onSubmit={handleInvite}
					className="flex flex-col gap-4 rounded-lg border p-4"
				>
					<div className="flex items-center gap-2">
						<UserPlus className="text-muted-foreground size-4" />
						<span className="text-sm font-medium">
							Invite member
						</span>
					</div>
					<div className="flex flex-wrap items-end gap-3">
						<div className="flex-1 min-w-[200px]">
							<Label htmlFor="email" className="sr-only">
								Email
							</Label>
							<Input
								id="email"
								type="email"
								placeholder="colleague@example.com"
								value={inviteEmail}
								onChange={(e) => setInviteEmail(e.target.value)}
							/>
						</div>
						<div className="w-[140px]">
							<Label htmlFor="role" className="sr-only">
								Role
							</Label>
							<Select
								value={inviteRole}
								onValueChange={(v) =>
									setInviteRole(v as MemberRole)
								}
							>
								<SelectTrigger id="role" className="w-full">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value={MemberRole.ADMIN}>
										ADMIN
									</SelectItem>
									<SelectItem value={MemberRole.MEMBER}>
										MEMBER
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<Button
							type="submit"
							disabled={inviteMutation.isPending}
						>
							{inviteMutation.isPending && (
								<Loader2 className="mr-1 size-4 animate-spin" />
							)}
							Send invite
						</Button>
					</div>
					{inviteError && (
						<p className="text-destructive text-xs">
							{inviteError}
						</p>
					)}
				</form>
			)}

			{/* Loading state */}
			{membersQuery.isLoading && (
				<div className="flex items-center justify-center py-12">
					<Loader2 className="text-muted-foreground size-6 animate-spin" />
				</div>
			)}

			{/* Error state */}
			{membersQuery.isError && (
				<div className="flex items-center justify-center py-12">
					<p className="text-destructive text-sm">
						Failed to load members.
					</p>
				</div>
			)}

			{/* Members table */}
			{!membersQuery.isLoading && !membersQuery.isError && (
				<div>
					<h2 className="mb-3 text-sm font-medium">
						{members.length}{" "}
						{members.length === 1 ? "member" : "members"}
					</h2>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>User</TableHead>
								<TableHead>Role</TableHead>
								<TableHead>Joined</TableHead>
								{canManage && (
									<TableHead className="w-[60px]" />
								)}
							</TableRow>
						</TableHeader>
						<TableBody>
							{members.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={canManage ? 4 : 3}
										className="text-muted-foreground h-24 text-center text-sm"
									>
										No members found.
									</TableCell>
								</TableRow>
							) : (
								members.map((member) => (
									<MemberRow
										key={member.user_id}
										member={member}
										canManage={canManage}
										canPromoteToOwner={canPromoteToOwner}
										onRemove={setRemoveTarget}
										onRoleChange={handleRoleChange}
										isCurrentUser={
											member.user_id === me?.id
										}
									/>
								))
							)}
						</TableBody>
					</Table>
				</div>
			)}

			{/* Pending invitations */}
			{!invitationsQuery.isLoading && !invitationsQuery.isError && (
				<div>
					<h2 className="mb-3 text-sm font-medium">
						Pending invitations
						{invitations.length > 0 && (
							<span className="text-muted-foreground ml-1 font-normal">
								({invitations.length})
							</span>
						)}
					</h2>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Email</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Expires</TableHead>
								{canManage && (
									<TableHead className="w-[60px]" />
								)}
							</TableRow>
						</TableHeader>
						<TableBody>
							{invitations.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={canManage ? 4 : 3}
										className="text-muted-foreground h-24 text-center text-sm"
									>
										No pending invitations.
									</TableCell>
								</TableRow>
							) : (
								invitations.map((invitation) => (
									<TableRow key={invitation.id}>
										<TableCell>
											<div className="flex items-center gap-3">
												<Avatar className="size-8">
													<AvatarFallback>
														<Mail className="size-4" />
													</AvatarFallback>
												</Avatar>
												<span className="text-sm">
													{invitation.email}
												</span>
											</div>
										</TableCell>
										<TableCell>
											<Badge
												variant={
													invitation.status ===
													"pending"
														? "outline"
														: "secondary"
												}
											>
												{invitation.status}
											</Badge>
										</TableCell>
										<TableCell className="text-muted-foreground text-sm">
											{format(
												new Date(invitation.expires_at),
												"MMM d, yyyy",
											)}
										</TableCell>
										{canManage && (
											<TableCell>
												<Button
													variant="ghost"
													size="sm"
													onClick={() =>
														revokeMutation.mutate(
															invitation.id,
														)
													}
													disabled={
														revokeMutation.isPending
													}
												>
													{revokeMutation.isPending ? (
														<Loader2 className="size-4 animate-spin" />
													) : (
														<X className="size-4" />
													)}
													<span className="sr-only">
														Revoke invitation
													</span>
												</Button>
											</TableCell>
										)}
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
			)}

			{/* Confirm remove dialog */}
			<ConfirmRemoveDialog
				member={removeTarget!}
				open={!!removeTarget}
				onOpenChange={(open) => {
					if (!open) setRemoveTarget(null);
				}}
				onConfirm={handleRemove}
				isLoading={removeMutation.isPending}
			/>
		</div>
	);
}

function MemberRow({
	member,
	canManage,
	canPromoteToOwner,
	isCurrentUser,
	onRemove,
	onRoleChange,
}: {
	member: MembershipResponse;
	canManage: boolean;
	canPromoteToOwner: boolean;
	isCurrentUser: boolean;
	onRemove: (member: MembershipResponse) => void;
	onRoleChange: (userId: string, role: MemberRole) => void;
}) {
	const [confirmRole, setConfirmRole] = useState<MemberRole | null>(null);

	return (
		<>
			<TableRow>
				<TableCell>
					<div className="flex items-center gap-3">
						<Avatar className="size-8">
							<AvatarFallback>
								{getInitials(member.name, member.email)}
							</AvatarFallback>
						</Avatar>
						<div>
							<p className="text-sm font-medium">
								{member.name || "Unknown"}
							</p>
							<p className="text-muted-foreground text-xs">
								{member.email || member.user_id}
							</p>
						</div>
					</div>
				</TableCell>
				<TableCell>
					<RoleBadge role={member.role} />
				</TableCell>
				<TableCell className="text-muted-foreground text-sm">
					{member.created_at
						? format(new Date(member.created_at), "MMM d, yyyy")
						: "-"}
				</TableCell>
				{canManage && (
					<TableCell>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
									className="size-8 p-0"
								>
									<MoreHorizontal className="size-4" />
									<span className="sr-only">Actions</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-40">
								{member.role !== MemberRole.OWNER && (
									<>
										<DropdownMenuItem
											onClick={() => {
												if (
													member.role ===
													MemberRole.MEMBER
												) {
													onRoleChange(
														member.user_id,
														MemberRole.ADMIN,
													);
												} else {
													setConfirmRole(
														MemberRole.MEMBER,
													);
												}
											}}
										>
											{member.role === MemberRole.MEMBER
												? "Make ADMIN"
												: "Make MEMBER"}
										</DropdownMenuItem>
										{canPromoteToOwner && (
											<DropdownMenuItem
												onClick={() =>
													setConfirmRole(
														MemberRole.OWNER,
													)
												}
											>
												Make OWNER
											</DropdownMenuItem>
										)}
										<DropdownMenuSeparator />
									</>
								)}
								{member.role !== MemberRole.OWNER &&
									!isCurrentUser && (
										<DropdownMenuItem
											className="text-destructive"
											onClick={() => onRemove(member)}
										>
											<UserMinus className="mr-2 size-4" />
											Remove
										</DropdownMenuItem>
									)}
							</DropdownMenuContent>
						</DropdownMenu>
					</TableCell>
				)}
			</TableRow>

			{/* Confirm role change dialog */}
			<AlertDialog
				open={!!confirmRole}
				onOpenChange={(open) => {
					if (!open) setConfirmRole(null);
				}}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Change role</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to change{" "}
							<span className="font-medium text-foreground">
								{member.name || member.email || member.user_id}
							</span>
							&apos;s role to{" "}
							<span className="font-medium text-foreground">
								{confirmRole}
							</span>
							?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => {
								if (confirmRole) {
									onRoleChange(member.user_id, confirmRole);
								}
								setConfirmRole(null);
							}}
						>
							Confirm
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
