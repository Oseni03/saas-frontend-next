# 04 — Invitation accept flow

**Labels:** `enhancement`, `ready-for-agent`

## Parent

PRD: `.scratch/multitenant-membership/PRD.md`

## What to build

Handle the invitation acceptance flow when a user clicks an invite link from email.

**End-to-end behavior:**

- Route `/invitations/accept?token=xxx` is protected by middleware (must be authenticated).
- On mount, the page reads `token` from query params.
- Calls `organizationService.acceptInvitation({ token })`.
- On success:
  1. Invalidates the `["organizations"]` query cache so the sidebar reflects the new org.
  2. Sets the accepted org as active via `useOrganization().setActiveOrg()`.
  3. Redirects to `/dashboard`.
- On error (expired token, already a member, invalid token):
  1. Show a human-readable error page with appropriate messaging ("Invitation expired", "Already a member of this organization", "Invalid invitation link").
  2. Include a link to `/dashboard` as fallback.
- If the user is not authenticated when they click the link, the middleware redirects to `/login?redirect=/invitations/accept%3Ftoken%3Dxxx` so they login and are sent back.

## Acceptance criteria

- [x] `/invitations/accept` route exists and is protected by middleware
- [x] Reads `token` from URL query params
- [x] Calls `acceptInvitation` on mount
- [x] On success: invalidates org cache, sets active org, redirects to `/dashboard`
- [x] On error: shows appropriate error message with fallback link
- [x] Redirect preserves token in the login redirect URL
- [x] `npm run lint` passes

## Blocked by

- \#01 — Foundation: Org context + switcher + middleware
