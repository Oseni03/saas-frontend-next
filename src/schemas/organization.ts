import { z } from "zod";
import { InvitationStatus, MemberRole, PlanTier } from "./index"; // or directly define enums here if preferred

export const OrgCreateRequestSchema = z.object({
  name: z.string().min(1),
});

export const OrgUpdateRequestSchema = z.object({
  name: z.string().min(1).optional().nullable(),
  logo_url: z.url().optional().nullable(),
});

export const InvitationSchema = z.object({
  id: z.string(),
  organization_id: z.string(),
  email: z.string(),
  status: z.enum(InvitationStatus),
  expires_at: z.iso.datetime(),
});

export const InviteMemberRequestSchema = z.object({
  email: z.email(),
  role: z.enum(MemberRole).default(MemberRole.MEMBER),
});

export const UpdateMemberRoleRequestSchema = z.object({
  role: z.enum(MemberRole),
});

export const AcceptInvitationRequestSchema = z.object({
  token: z.string(),
});

export const BillingInitSchemaSchema = z.object({
  plan: z.enum(PlanTier),
  callback_url: z.string().url(),
});

export const OrgResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  logo_url: z.string().nullable(),
  plan: z.enum(PlanTier),
  created_at: z.iso.datetime(), // ISO string from datetime
});

export const MembershipResponseSchema = z.object({
  user_id: z.string(),
  organization_id: z.string(),
  role: z.enum(MemberRole),
  created_at: z.string().datetime(),
});

export const BillingVerifyResponseSchema = z.object({
  plan: z.enum(PlanTier),
  organization_id: z.string(),
});

export type OrgCreateRequest = z.infer<typeof OrgCreateRequestSchema>;
export type OrgUpdateRequest = z.infer<typeof OrgUpdateRequestSchema>;
export type InviteMemberRequest = z.infer<typeof InviteMemberRequestSchema>;
export type UpdateMemberRoleRequest = z.infer<
  typeof UpdateMemberRoleRequestSchema
>;
export type AcceptInvitationRequest = z.infer<
  typeof AcceptInvitationRequestSchema
>;
export type BillingInitSchema = z.infer<typeof BillingInitSchemaSchema>;

export type OrgResponse = z.infer<typeof OrgResponseSchema>;
export type InvitationResponse = z.infer<typeof InvitationSchema>;
export type MembershipResponse = z.infer<typeof MembershipResponseSchema>;
export type BillingVerifyResponse = z.infer<typeof BillingVerifyResponseSchema>;
