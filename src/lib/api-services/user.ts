import api from "../api";
import { snakeCaseSchema } from "../utils";
import { z } from "zod";
import {
	type UserResponse,
	type UserUpdateRequest,
	type ChangePasswordRequest,
	UserResponseSchema,
} from "@/schemas";

export const userService = {
	/**
	 * Get current user's profile
	 */
	getProfile: async (): Promise<UserResponse> => {
		const res = await api.get<any>("/me");
		return snakeCaseSchema(UserResponseSchema).parse(res.data);
	},

	/**
	 * Update current user's profile
	 */
	updateProfile: async (data: UserUpdateRequest): Promise<UserResponse> => {
		const res = await api.patch<any>("/me", data);
		return snakeCaseSchema(UserResponseSchema).parse(res.data);
	},

	/**
	 * Change current user's password
	 */
	changePassword: async (
		data: ChangePasswordRequest,
	): Promise<{ message?: string }> => {
		const res = await api.post<any>("/me/change-password", data);

		return snakeCaseSchema(
			z.object({
				message: z.string().optional(),
			}),
		).parse(res.data);
	},

	/**
	 * Delete/Deactivate current user's account
	 */
	deleteAccount: async (): Promise<{ message?: string }> => {
		const res = await api.delete<any>("/me");

		return snakeCaseSchema(
			z.object({
				message: z.string().optional(),
			}),
		).parse(res.data);
	},
};
