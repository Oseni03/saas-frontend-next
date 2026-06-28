# 02 — Create organization modal

**Labels:** `enhancement`, `ready-for-agent`

## Parent

PRD: `.scratch/multitenant-membership/PRD.md`

## What to build

Allow users to create a new organization from the sidebar without navigating away.

**End-to-end behavior:**

- Clicking "Add organization" in the `OrgSwitcher` dropdown opens a modal dialog.
- The modal has a text input for organization name and a radio/select control for plan tier (FREE, PRO, BUSINESS, ENTERPRISE).
- On submit:
  1. Calls `organizationService.create({ name, plan })`
  2. Calls `billingService.initialize(orgId, { plan, callback_url })` — the callback URL points to `/dashboard/settings/billing?verified=true`
  3. Refetches the organizations list (invalidates `["organizations"]` query)
  4. Sets the new org as active via `setActiveOrg()`
  5. Closes the modal
- If the billing init returns an `authorization_url`, redirect the user there to complete payment before landing in the org.
- On error, show inline validation errors in the modal.
- Cancel button closes the modal without action.

## Acceptance criteria

- [ ] `CreateOrganizationModal` component renders with name input and plan selector
- [ ] All 4 plan tiers (FREE, PRO, BUSINESS, ENTERPRISE) are selectable
- [ ] Submitting a FREE plan skips billing redirect (no payment needed)
- [ ] Submitting a paid plan redirects to the authorization URL from billing init
- [ ] On success, org list is refetched, new org is active, modal closes
- [ ] Validation errors from the API display inline
- [ ] "Add organization" menu item in `OrgSwitcher` triggers the modal
- [ ] `npm run lint` passes

## Blocked by

- \#01 — Foundation: Org context + switcher + middleware
