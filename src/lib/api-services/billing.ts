import api from "../api";
import type {
    BillingInitSchema,
    BillingVerifyResponse,
    OrgResponse, // if needed for responses
} from "@/schemas";
import { BillingVerifyResponseSchema } from "@/schemas";
import { snakeCaseSchema } from "../utils";
import z from "zod";

export const billingService = {
    // ── Webhook (usually not called from frontend) ───────────────────────
    // Note: This is typically handled by your backend only.
    // You generally won't call this from the frontend.

    // ── Verify Payment Callback ───────────────────────────────────────────

    /**
     * Verify a payment using reference from Paystack redirect callback
     */
    verify: async (reference?: string): Promise<BillingVerifyResponse> => {
        const params = reference ? { reference } : {};
        const res = await api.get<any>("/billing/verify", {
            params,
        });
        return snakeCaseSchema(BillingVerifyResponseSchema).parse(res.data);
    },

    // ── Organization Billing Actions ──────────────────────────────────────

    /**
     * Initialize payment for an organization (subscribe / upgrade plan)
     */
    initialize: async (
        orgId: string,
        data: BillingInitSchema,
    ): Promise<{ authorization_url: string }> => {
        const res = await api.post<any>(
            `/billing/organizations/${orgId}/initialize`,
            data,
        );
        return snakeCaseSchema(
            z.object({
                authorization_url: z.string(),
            }),
        ).parse(res.data);
    },

    /**
     * Get billing management URL (customer portal / update subscription)
     */
    getManageUrl: async (orgId: string): Promise<{ manage_url: string }> => {
        const res = await api.get<any>(
            `/billing/organizations/${orgId}/manage`,
        );
        return snakeCaseSchema(
            z.object({
                manage_url: z.string(),
            }),
        ).parse(res.data);
    },

    /**
     * Cancel subscription for an organization
     */
    cancel: async (orgId: string): Promise<void> => {
        await api.post(`/billing/organizations/${orgId}/cancel`);
    },
};
