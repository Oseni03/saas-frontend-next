import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    // You can adjust how tokens are stored (localStorage, cookies, etc.)
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
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
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        document.cookie =
          "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict";

        const publicPaths = ["/", "/login", "/signup"];
        if (!publicPaths.includes(window.location.pathname)) {
          window.location.href = "/login";
        }
      }
    } else if (typeof window !== "undefined") {
      const message =
        error.response?.data?.error ||
        error.response?.data?.detail ||
        error.message ||
        "An unexpected error occurred";
      toast.error(message);
    }
    return Promise.reject(error);
  },
);

export default api;
