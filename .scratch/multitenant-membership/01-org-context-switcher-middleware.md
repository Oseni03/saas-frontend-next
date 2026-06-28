# 01 — Foundation: Org context + switcher + middleware

**Labels:** `enhancement`, `ready-for-agent`

## Parent

PRD: `.scratch/multitenant-membership/PRD.md`

## What to build

Establish the organization context infrastructure that all subsequent slices depend on.

**End-to-end behavior:**

- When a signed-in user lands on `/dashboard`, the app fetches their organizations from the API and selects the first one as active (or restores from localStorage).
- The sidebar shows the active organization's name and plan. Clicking the switcher dropdown lists all organizations the user belongs to; selecting one switches the active context.
- All settings nav items in the sidebar link to real routes (`/dashboard/settings/general`, `/settings/members`, `/settings/billing`, `/settings/notifications`).
- Unauthenticated users accessing any `/dashboard/*` route are redirected to `/login`. Authenticated users visiting `/login` or `/signup` are redirected to `/dashboard`.
- The word "Teams" is replaced with "Organizations" throughout the sidebar.

**Schema change — `OrgCreateRequestSchema` gains `plan`:**

```typescript
export const OrgCreateRequestSchema = z.object({
  name: z.string().min(1),
  plan: z.enum(PlanTier),
});
```

This is done here because it's the smallest schema change and logically belongs to the org foundation.

## Acceptance criteria

- [ ] `OrganizationProvider` exists in `src/contexts/` and provides `organizations`, `activeOrg`, `setActiveOrg`, `isLoading` via `useOrganization()` hook
- [ ] `dashboard/layout.tsx` wraps children in `OrganizationProvider`
- [ ] Active org ID is persisted to localStorage and restored on mount; on first visit the first org is auto-selected
- [ ] `TeamSwitcher` component is renamed to `OrgSwitcher`, prop interface changed from `teams` mock prop to reading `useOrganization()` internally
- [ ] "Teams" label → "Organizations", "Add team" → "Add organization"
- [ ] `AppSidebar` mock `data.teams` is removed; `OrgSwitcher` gets its data from the provider
- [ ] Sidebar settings nav items point to `/dashboard/settings/general`, `/settings/members`, `/settings/billing`, `/settings/notifications`
- [ ] Middleware `PROTECTED_PREFIXES` includes `/dashboard` (currently only in matcher, not in the redirect check)
- [ ] Authenticated user redirect goes to `/dashboard` instead of `/projects`
- [ ] `OrgCreateRequestSchema` includes `plan: z.enum(PlanTier)`
- [ ] No regressions on auth routes, public pages, or the landing page
- [ ] `npm run lint` passes

## Blocked by

None — can start immediately.
