import api from "../api";
import { snakeCaseSchema } from "../utils";
import {
	type StatsResponse,
	OrgResponse,
	OrgResponseSchema,
	StatResponseSchema,
	UserResponse,
	UserResponseSchema,
} from "@/schemas";
import { z } from "zod";

export const adminService = {
	/**
	 * Get admin dashboard statistics
	 */
	getStats: async (): Promise<StatsResponse> => {
		const res = await api.get<any>("/admin/stats");

		return snakeCaseSchema(StatResponseSchema).parse(res.data); // Replace `any` with proper Stats type when available
	},

	/**
	 * List users (admin only)
	 */
	listUsers: async (
		params: {
			page?: number;
			page_size?: number;
			search?: string;
			is_active?: boolean;
		} = {},
	): Promise<UserResponse[]> => {
		const res = await api.get<any>("/admin/users", { params });

		return snakeCaseSchema(z.array(UserResponseSchema)).parse(res.data); // Use proper PaginatedUser type when defined
	},

	/**
	 * List organizations (admin only)
	 */
	listOrganizations: async (
		params: {
			page?: number;
			page_size?: number;
			search?: string;
		} = {},
	): Promise<OrgResponse[]> => {
		const res = await api.get<any>("/admin/organizations", { params });

		return snakeCaseSchema(z.array(OrgResponseSchema)).parse(res.data);
	},

	/**
	 * Deactivate a user
	 */
	deactivateUser: async (userId: string): Promise<UserResponse> => {
		const res = await api.patch<any>(`/admin/users/${userId}/deactivate`);

		return snakeCaseSchema(UserResponseSchema).parse(res.data);
	},

	/**
	 * Activate a user
	 */
	activateUser: async (userId: string): Promise<UserResponse> => {
		const res = await api.patch<any>(`/admin/users/${userId}/activate`);

		return snakeCaseSchema(UserResponseSchema).parse(res.data);
	},
};
