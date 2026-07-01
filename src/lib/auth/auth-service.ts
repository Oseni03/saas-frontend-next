import type { AxiosInstance } from "axios";

import { snakeCaseSchema } from "@/lib/utils";
import {
    type LoginRequest,
    type RegisterRequest,
    type RefreshRequest,
    type VerifyEmailRequest,
    type PasswordResetRequest,
    type PasswordResetConfirm,
    type UserResponse,
    type TokenPair,
    TokenPairSchema,
    UserResponseSchema,
} from "@/schemas";
import { extractApiError, type AuthError } from "./errors";
import type { CallOptions, TokenStore } from "./types";

interface SignupResponse {
    user: UserResponse;
    access_token: string;
    refresh_token: string;
    token_type: "bearer";
}

import api, { tokenStore } from "@/lib/api";

export class AuthService {
    constructor(
        private readonly api: AxiosInstance,
        private readonly tokenStore: TokenStore,
    ) {}

    async login(data: LoginRequest, options?: CallOptions): Promise<TokenPair> {
        try {
            const res = await this.api.post<any>("/auth/login", data, {
                signal: options?.signal,
            });
            const tokens = snakeCaseSchema(TokenPairSchema).parse(res.data);
            this.tokenStore.set(tokens.access_token, tokens.refresh_token);
            return tokens;
        } catch (err) {
            throw extractApiError(err);
        }
    }

    async register(
        data: RegisterRequest,
        options?: CallOptions,
    ): Promise<SignupResponse> {
        try {
            const res = await this.api.post<any>("/auth/register", data, {
                signal: options?.signal,
            });
            const tokens = snakeCaseSchema(TokenPairSchema).parse(res.data);
            const user = snakeCaseSchema(UserResponseSchema).parse(res.data);
            this.tokenStore.set(tokens.access_token, tokens.refresh_token);
            return { ...tokens, user };
        } catch (err) {
            throw extractApiError(err);
        }
    }

    async refresh(
        data: RefreshRequest,
        options?: CallOptions,
    ): Promise<TokenPair> {
        try {
            const res = await this.api.post<any>("/auth/refresh", data, {
                signal: options?.signal,
            });
            const tokens = snakeCaseSchema(TokenPairSchema).parse(res.data);
            this.tokenStore.set(tokens.access_token, tokens.refresh_token);
            return tokens;
        } catch (err) {
            throw extractApiError(err);
        }
    }

    async logout(options?: CallOptions): Promise<void> {
        const refresh = this.tokenStore.getRefresh();
        if (refresh) {
            try {
                await this.api.post(
                    "/auth/logout",
                    { refresh_token: refresh },
                    { signal: options?.signal },
                );
            } catch {
                // Silent — clear locally regardless
            }
        }
        this.tokenStore.clear();
    }

    async verifyEmail(
        data: VerifyEmailRequest,
        options?: CallOptions,
    ): Promise<UserResponse> {
        try {
            const res = await this.api.post<any>("/auth/verify-email", data, {
                signal: options?.signal,
            });
            return snakeCaseSchema(UserResponseSchema).parse(res.data);
        } catch (err) {
            throw extractApiError(err);
        }
    }

    async forgotPassword(
        data: PasswordResetRequest,
        options?: CallOptions,
    ): Promise<{ message: string }> {
        try {
            const res = await this.api.post<any>(
                "/auth/forgot-password",
                data,
                {
                    signal: options?.signal,
                },
            );
            const { z } = await import("zod");
            return snakeCaseSchema(z.object({ message: z.string() })).parse(
                res.data,
            );
        } catch (err) {
            throw extractApiError(err);
        }
    }

    async resetPassword(
        data: PasswordResetConfirm,
        options?: CallOptions,
    ): Promise<UserResponse> {
        try {
            const res = await this.api.post<any>("/auth/reset-password", data, {
                signal: options?.signal,
            });
            return snakeCaseSchema(UserResponseSchema).parse(res.data);
        } catch (err) {
            throw extractApiError(err);
        }
    }

    async getMe(options?: CallOptions): Promise<UserResponse> {
        try {
            const res = await this.api.get<any>("/auth/me", {
                signal: options?.signal,
            });
            return snakeCaseSchema(UserResponseSchema).parse(res.data);
        } catch (err) {
            throw extractApiError(err);
        }
    }

    async refreshIfNeeded(options?: CallOptions): Promise<TokenPair | null> {
        const refresh = this.tokenStore.getRefresh();
        if (!refresh) return null;

        try {
            return await this.refresh({ refresh_token: refresh }, options);
        } catch {
            return null;
        }
    }

    isAuthenticated(): boolean {
        return this.tokenStore.getAccess() !== null;
    }
}

export const authService = new AuthService(api, tokenStore);

export type { SignupResponse };
