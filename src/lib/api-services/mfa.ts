import { TokenPair, TokenPairSchema } from "@/schemas";
import api from "../api";
import { snakeCaseSchema } from "../utils";
import { z } from "zod";

export const mfaService = {
  /**
   * Setup MFA - Returns QR code data for authenticator app
   */
  setup: async (): Promise<{
    secret: string;
    otpauth_url: string;
    message?: string;
  }> => {
    const res = await api.post<any>("/mfa/setup");

    return snakeCaseSchema(
      z.object({
        secret: z.string(),
        otpauth_url: z.string(),
        message: z.string().optional(),
      }),
    ).parse(res.data);
  },

  /**
   * Verify and enable MFA
   */
  verify: async (code: string): Promise<void> => {
    await api.post<any>("/mfa/verify", { code });
  },

  /**
   * Disable MFA
   */
  disable: async (code: string): Promise<void> => {
    await api.post<any>("/mfa/disable", { code });
  },

  /**
   * Validate MFA code (usually during login with 2FA)
   */
  validate: async (code: string): Promise<TokenPair> => {
    const res = await api.post<any>("/mfa/validate", { code });

    return snakeCaseSchema(TokenPairSchema).parse(res.data);
  },
};
