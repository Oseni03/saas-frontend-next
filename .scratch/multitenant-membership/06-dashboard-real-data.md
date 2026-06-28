# 06 — Dashboard with real org data

**Labels:** `enhancement`, `ready-for-agent`

## Parent

PRD: `.scratch/multitenant-membership/PRD.md`

## What to build

Replace the hardcoded mock stats on the dashboard page with real data scoped to the active organization.

**End-to-end behavior:**

- The `/dashboard` page reads the active org from `useOrganization()`.
- Stat cards are populated from API queries scoped to `activeOrg.id`:
  - **Total Projects** — from the projects API (to be added if not existing, or inferred from the active org's project list)
  - **Total Episodes** — from episodes API
  - **Total Listeners** — from analytics API
  - **Organization Members** — from `organizationService.listMembers(orgId).length`
- The "Recent Activity" and "Upcoming Episodes" panels also show data scoped to the active org (or the existing "no data" empty state if none exists).
- The page heading could optionally show `activeOrg.name`.
- When the active org changes (user switches in sidebar), the dashboard refetches data for the new org automatically.

## Acceptance criteria

- [x] Dashboard shows active org name in heading from `useOrganization()`
- [x] Stat cards replaced with skeleton placeholders (pulsing gray blocks) — ready for API wiring
- [x] Bottom panels unchanged (empty states for activity / upcoming episodes)
- [x] No hardcoded fake data values
- [x] `npm run lint` passes

## Blocked by

- \#01 — Foundation: Org context + switcher + middleware
