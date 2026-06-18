import { z } from "zod";

export const RegisterRequestSchema = z.object({
	email: z.string().email(),
	password: z
		.string()
		.min(8)
		.max(128)
		.refine((val) => /[A-Z]/.test(val), {
			message: "Password must contain at least one uppercase letter.",
		})
		.refine((val) => /\d/.test(val), {
			message: "Password must contain at least one digit.",
		}),
	full_name: z.string().max(255).nullable().optional(),
});

export const LoginRequestSchema = z.object({
	email: z.string().email(),
	password: z.string(),
});

export const TokenPairSchema = z.object({
	access_token: z.string(),
	refresh_token: z.string(),
	token_type: z.literal("bearer").default("bearer"),
});

export const RefreshRequestSchema = z.object({
	refresh_token: z.string(),
});

export const VerifyEmailRequestSchema = z.object({
	token: z.string(),
});

export const PasswordResetRequestSchema = z.object({
	email: z.string().email(),
});

export const PasswordResetConfirmSchema = z.object({
	token: z.string(),
	new_password: z
		.string()
		.min(8)
		.max(128)
		.refine((val) => /[A-Z]/.test(val), {
			message: "Password must contain at least one uppercase letter.",
		})
		.refine((val) => /\d/.test(val), {
			message: "Password must contain at least one digit.",
		}),
});

// Types
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type TokenPair = z.infer<typeof TokenPairSchema>;
export type RefreshRequest = z.infer<typeof RefreshRequestSchema>;
export type VerifyEmailRequest = z.infer<typeof VerifyEmailRequestSchema>;
export type PasswordResetRequest = z.infer<typeof PasswordResetRequestSchema>;
export type PasswordResetConfirm = z.infer<typeof PasswordResetConfirmSchema>;
