import { z } from "zod";
import api from "../api";
import { snakeCaseSchema } from "../utils";
import {
	type NotificationResponse,
	type NotificationListResponse,
	NotificationResponseSchema,
} from "@/schemas";

export const notificationService = {
	/**
	 * Get paginated notifications for the current user
	 */
	list: async (
		params: {
			limit?: number;
			offset?: number;
			page?: number;
			page_size?: number;
		} = {},
	): Promise<NotificationListResponse> => {
		const res = await api.get<any>("/notifications/", { params });

		return snakeCaseSchema(
			z.object({
				items: z.array(NotificationResponseSchema),
				unread_count: z.number(),
				limit: z.number().optional(),
				offset: z.number().optional(),
			}),
		).parse(res.data);
	},

	/**
	 * Mark a single notification as read
	 */
	markRead: async (id: string): Promise<void> => {
		await api.post(`/notifications/${id}/read`);
	},

	/**
	 * Mark all notifications as read
	 */
	markAllRead: async (): Promise<void> => {
		await api.post("/notifications/mark-all-read");
	},
};
