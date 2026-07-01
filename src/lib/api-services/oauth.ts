import api from "../api";
import { snakeCaseSchema } from "../utils";
import { TokenPairSchema, type TokenPair } from "@/schemas";

/**
 * OAuth Service - Google & GitHub
 */
export const oauthService = {
	/**
	 * Redirect user to Google OAuth consent screen
	 */
	googleLogin: () => {
		// This will trigger a full page redirect
		window.location.href = "/api/v1/auth/oauth/google";
	},

	/**
	 * Redirect user to GitHub OAuth consent screen
	 */
	githubLogin: () => {
		window.location.href = "/api/v1/auth/oauth/github";
	},

	/**
	 * (Optional) If your backend ever exposes a direct callback handler via POST
	 * or if you want to manually handle the code exchange (rare).
	 * Most of the time, you won't need this — the backend handles the callback.
	 */
	googleCallback: async (code: string): Promise<TokenPair> => {
		const res = await api.get<any>(
			`/auth/oauth/google/callback?code=${code}`,
		);

		return snakeCaseSchema(TokenPairSchema).parse(res.data);
	},

	/**
	 * GitHub OAuth callback (if needed)
	 */
	githubCallback: async (code: string): Promise<TokenPair> => {
		const res = await api.get<any>(
			`/auth/oauth/github/callback?code=${code}`,
		);

		return snakeCaseSchema(TokenPairSchema).parse(res.data);
	},
};
