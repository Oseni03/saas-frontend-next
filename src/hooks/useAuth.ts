import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type {
	LoginRequest,
	RegisterRequest,
	RefreshRequest,
	VerifyEmailRequest,
	PasswordResetRequest,
	PasswordResetConfirm,
	UserResponse,
	UserUpdateRequest,
} from "@/schemas";

interface TokenPair {
	access_token: string;
	refresh_token: string;
	token_type: "bearer";
}

const storeTokens = (access: string, refresh: string) => {
	if (typeof window === "undefined") return;
	localStorage.setItem("access_token", access);
	localStorage.setItem("refresh_token", refresh);
	document.cookie = `access_token=${access}; path=/; SameSite=Strict`;
};

export const clearTokens = () => {
	if (typeof window === "undefined") return;
	localStorage.removeItem("access_token");
	localStorage.removeItem("refresh_token");
	document.cookie =
		"access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict";
};

// ======================
// Auth Hooks
// ======================

export const useLogin = () => {
	return useMutation({
		mutationFn: async (credentials: LoginRequest) => {
			const response = await api.post<TokenPair>(
				"/auth/login",
				credentials,
			);
			return response.data;
		},
		onSuccess: (data: TokenPair) => {
			storeTokens(data.access_token, data.refresh_token);
		},
	});
};

interface SignupResponse {
	user: UserResponse;
	access_token: string;
	refresh_token: string;
	token_type: "bearer";
}

export const useSignup = () => {
	return useMutation({
		mutationFn: async (userData: RegisterRequest) => {
			const response = await api.post<SignupResponse>(
				"/auth/register",
				userData,
			);
			const data = response.data;
			storeTokens(data.access_token, data.refresh_token);
			return data;
		},
	});
};

export const useRefreshToken = () => {
	return useMutation({
		mutationFn: async (payload: RefreshRequest) => {
			const response = await api.post<TokenPair>(
				"/auth/refresh",
				payload,
			);
			return response.data;
		},
		onSuccess: (data: TokenPair) => {
			storeTokens(data.access_token, data.refresh_token);
		},
	});
};

export const useVerifyEmail = () => {
	return useMutation({
		mutationFn: async (payload: VerifyEmailRequest) => {
			const response = await api.post<UserResponse>(
				"/auth/verify-email",
				payload,
			);
			return response.data;
		},
	});
};

export const useForgotPassword = () => {
	return useMutation({
		mutationFn: async (payload: PasswordResetRequest) => {
			const response = await api.post<{ message: string }>(
				"/auth/forgot-password",
				payload,
			);
			return response.data;
		},
	});
};

export const useResetPassword = () => {
	return useMutation({
		mutationFn: async (payload: PasswordResetConfirm) => {
			const response = await api.post<UserResponse>(
				"/auth/reset-password",
				payload,
			);
			return response.data;
		},
	});
};

export const ME_KEY = ["auth", "me"] as const;

export const useMe = () => {
	return useQuery({
		queryKey: ME_KEY,
		queryFn: async () => {
			const response = await api.get<UserResponse>("/auth/me");
			return response.data;
		},
		retry: false,
	});
};

export const useUpdateMe = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (data: UserUpdateRequest) => {
			const response = await api.patch<UserResponse>("/users/me", data);
			return response.data;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ME_KEY });
		},
	});
};

export const useLogout = () => {
	return useMutation({
		mutationFn: async () => {
			const refresh =
				typeof window !== "undefined"
					? localStorage.getItem("refresh_token")
					: null;

			if (refresh) {
				try {
					await api.post("/auth/logout", { refresh_token: refresh });
				} catch (err) {
					// Silent fail — still clear tokens locally
					console.warn(
						"Logout request failed, clearing tokens anyway",
					);
				}
			}
			clearTokens();
		},
		onSuccess: () => {
			if (typeof window !== "undefined") {
				window.location.href = "/login";
			}
		},
	});
};

// Optional: Deactivate account
export const useDeactivateAccount = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async () => {
			await api.delete("/users/me");
			clearTokens();
		},
		onSuccess: () => {
			qc.clear(); // Clear all queries on account deletion
		},
	});
};
