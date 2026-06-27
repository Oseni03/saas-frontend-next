import api from "../api";
import { snakeCaseSchema } from "../utils";
import { z } from "zod";
import {
  type RegisterRequest,
  type LoginRequest,
  type RefreshRequest,
  type VerifyEmailRequest,
  type PasswordResetRequest,
  type PasswordResetConfirm,
  type UserResponse,
  type TokenPair,
  UserResponseSchema,
  TokenPairSchema,
} from "@/schemas";

export const authService = {
  register: async (data: RegisterRequest): Promise<UserResponse> => {
    const res = await api.post<any>("/auth/register", data);
    return snakeCaseSchema(UserResponseSchema).parse(res.data);
  },

  login: async (data: LoginRequest): Promise<TokenPair> => {
    const res = await api.post<any>("/auth/login", data);
    return snakeCaseSchema(TokenPairSchema).parse(res.data);
  },

  refresh: async (data: RefreshRequest): Promise<TokenPair> => {
    const res = await api.post<any>("/auth/refresh", data);
    return snakeCaseSchema(TokenPairSchema).parse(res.data);
  },

  verifyEmail: async (data: VerifyEmailRequest): Promise<UserResponse> => {
    const res = await api.post<any>("/auth/verify-email", data);
    return snakeCaseSchema(UserResponseSchema).parse(res.data);
  },

  forgotPassword: async (
    data: PasswordResetRequest,
  ): Promise<{ message: string }> => {
    const res = await api.post<any>("/auth/forgot-password", data);

    return snakeCaseSchema(
      z.object({
        message: z.string(),
      }),
    ).parse(res.data);
  },

  resetPassword: async (data: PasswordResetConfirm): Promise<UserResponse> => {
    const res = await api.post<any>("/auth/reset-password", data);
    return snakeCaseSchema(UserResponseSchema).parse(res.data);
  },

  getMe: async (): Promise<UserResponse> => {
    const res = await api.get<any>("/auth/me");
    return snakeCaseSchema(UserResponseSchema).parse(res.data);
  },

  logout: async (refresh_token: string): Promise<void> => {
    await api.post("/auth/logout", { refresh_token });
  },
};
