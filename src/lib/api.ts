import axios from "axios";

export const tokenStore = {
	getAccess: (): string | null => {
		if (typeof window === "undefined") return null;
		return localStorage.getItem("access_token");
	},

	getRefresh: (): string | null => {
		if (typeof window === "undefined") return null;
		return localStorage.getItem("refresh_token");
	},

	set: (access: string, refresh: string): void => {
		if (typeof window === "undefined") return;
		localStorage.setItem("access_token", access);
		localStorage.setItem("refresh_token", refresh);
		document.cookie = `access_token=${access}; path=/; SameSite=Strict; max-age=604800`;
	},

	clear: (): void => {
		if (typeof window === "undefined") return;
		localStorage.removeItem("access_token");
		localStorage.removeItem("refresh_token");
		document.cookie =
			"access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict";
	},
};

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.request.use(
	(config) => {
		const token = tokenStore.getAccess();
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		if (error.response?.status === 401) {
			tokenStore.clear();

			if (typeof window !== "undefined") {
				const publicPaths = ["/", "/login", "/signup"];
				if (!publicPaths.includes(window.location.pathname)) {
					window.location.href = "/login";
				}
			}
		}
		return Promise.reject(error);
	},
);

export default api;
