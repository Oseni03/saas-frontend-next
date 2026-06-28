# 05 — Settings pages: General, Billing, Notifications

**Labels:** `enhancement`, `ready-for-agent`

## Parent

PRD: `.scratch/multitenant-membership/PRD.md`

## What to build

Three settings pages for the active organization.

**End-to-end behavior:**

**General (`/dashboard/settings/general`):**
- Form with organization name (text input) and logo URL (text input, optional).
- Pre-filled with current org data from `activeOrg`.
- On submit, calls `organizationService.update(orgId, { name, logo_url })`.
- Updates the active org in context on success.
- Shows success/error feedback.

**Billing (`/dashboard/settings/billing`):**
- Displays the active org's current plan from `activeOrg.plan`.
- "Manage subscription" button calls `billingService.getManageUrl(orgId)` and redirects to the returned URL (customer portal).
- "Upgrade" section showing available plans above the current one (if FREE, show PRO/BUSINESS/ENTERPRISE options).
- Payment verification: if `?verified=true` is present in query params, calls `billingService.verify()` and shows a success toast.

**Notifications (`/dashboard/settings/notifications`):**
- User-level notification preferences (checkboxes or toggles).
- This page is scoped to the user, not the org. It uses the existing notification API (`src/lib/api-services/notification.ts`).
- Prefs stored and loaded per the existing notification schema.

## Acceptance criteria

- [ ] `/dashboard/settings/general` loads org name/logo, save updates via API, refreshes context
- [ ] `/dashboard/settings/billing` shows current plan, manage portal link, upgrade options
- [ ] `/dashboard/settings/billing` handles `?verified=true` callback with success feedback
- [ ] `/dashboard/settings/notifications` loads/saves user notification preferences
- [ ] All pages show loading state while data fetches
- [ ] All pages show error state on API failure
- [ ] Nav items in sidebar link to correct routes
- [ ] `npm run lint` passes

## Blocked by

- \#01 — Foundation: Org context + switcher + middleware
