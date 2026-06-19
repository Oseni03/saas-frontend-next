import api from "../api";
import { snakeCaseSchema } from "../utils";
import { z } from "zod";
import {
	type OrgCreateRequest,
	type OrgUpdateRequest,
	type OrgResponse,
	type InviteMemberRequest,
	type UpdateMemberRoleRequest,
	type AcceptInvitationRequest,
	type MembershipResponse,
	MembershipResponseSchema,
	OrgResponseSchema,
	InvitationResponse,
	InvitationSchema,
} from "@/schemas";

export const organizationService = {
	// ── Organizations ─────────────────────────────────────────────────────

	/**
	 * Create a new organization
	 */
	create: async (data: OrgCreateRequest): Promise<OrgResponse> => {
		const res = await api.post<any>("/organizations/", data);
		return snakeCaseSchema(OrgResponseSchema).parse(res.data);
	},

	/**
	 * List organizations the current user belongs to
	 */
	list: async (): Promise<OrgResponse[]> => {
		const res = await api.get<any>("/organizations/");
		return snakeCaseSchema(z.array(OrgResponseSchema)).parse(res.data);
	},

	/**
	 * Get a specific organization by ID
	 */
	getOne: async (orgId: string): Promise<OrgResponse> => {
		const res = await api.get<any>(`/organizations/${orgId}`);
		return snakeCaseSchema(OrgResponseSchema).parse(res.data);
	},

	/**
	 * Update an organization
	 */
	update: async (
		orgId: string,
		data: OrgUpdateRequest,
	): Promise<OrgResponse> => {
		const res = await api.patch<any>(`/organizations/${orgId}`, data);
		return snakeCaseSchema(OrgResponseSchema).parse(res.data);
	},

	/**
	 * Delete an organization
	 */
	remove: async (orgId: string): Promise<void> => {
		await api.delete<any>(`/organizations/${orgId}`);
	},

	// ── Members ───────────────────────────────────────────────────────────

	/**
	 * List members of an organization
	 */
	listMembers: async (orgId: string): Promise<MembershipResponse[]> => {
		const res = await api.get<any>(`/organizations/${orgId}/members`);
		return snakeCaseSchema(z.array(MembershipResponseSchema)).parse(
			res.data,
		);
	},

	/**
	 * Remove a member from organization
	 */
	removeMember: async (
		orgId: string,
		userId: string,
	): Promise<{ message: string }> => {
		const res = await api.delete<any>(
			`/organizations/${orgId}/members/${userId}`,
		);

		return snakeCaseSchema(
			z.object({
				message: z.string(),
			}),
		).parse(res.data);
	},

	/**
	 * Update a member's role
	 */
	updateMemberRole: async (
		orgId: string,
		userId: string,
		data: UpdateMemberRoleRequest,
	): Promise<MembershipResponse> => {
		const res = await api.patch<any>(
			`/organizations/${orgId}/members/${userId}`,
			data,
		);
		return snakeCaseSchema(MembershipResponseSchema).parse(res.data);
	},

	// ── Invitations ───────────────────────────────────────────────────────

	/**
	 * List pending invitations for an organization
	 */
	listInvitations: async (orgId: string): Promise<InvitationResponse[]> => {
		const res = await api.get<any>(`/organizations/${orgId}/invitations`);
		return snakeCaseSchema(z.array(InvitationSchema)).parse(res.data);
	},

	/**
	 * Invite a member to the organization
	 */
	inviteMember: async (
		orgId: string,
		data: InviteMemberRequest,
	): Promise<{ message: string }> => {
		const res = await api.post<any>(
			`/organizations/${orgId}/invitations`,
			data,
		);

		return snakeCaseSchema(
			z.object({
				message: z.string(),
			}),
		).parse(res.data);
	},

	/**
	 * Accept an invitation (public endpoint)
	 */
	acceptInvitation: async (
		data: AcceptInvitationRequest,
	): Promise<OrgResponse> => {
		const res = await api.post<any>(
			"/organizations/invitations/accept",
			data,
		);

		return snakeCaseSchema(OrgResponseSchema).parse(res.data);
	},
};
