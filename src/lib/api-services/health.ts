import api from "../api";
import { snakeCaseSchema } from "../utils";
import { z } from "zod";

export const healthService = {
	/**
	 * Basic health check - returns app status
	 */
	getHealth: async (): Promise<{
		status: string;
		app: string;
	}> => {
		const res = await api.get<any>("/health");

		return snakeCaseSchema(
			z.object({
				status: z.string(),
				app: z.string(),
			}),
		).parse(res.data);
	},

	/**
	 * Readiness check - verifies database connectivity and system health
	 */
	getReady: async (): Promise<{
		status: string;
	}> => {
		const res = await api.get<any>("/ready");

		return snakeCaseSchema(
			z.object({
				status: z.string(),
			}),
		).parse(res.data);
	},
};
