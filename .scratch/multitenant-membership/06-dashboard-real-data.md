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

- [ ] Dashboard stat cards show real data from the active org, not hardcoded values
- [ ] Organization Members stat reflects actual member count from API
- [ ] Stat cards update when the user switches to a different org
- [ ] Empty states still render correctly when an org has no data
- [ ] Loading states shown while fetching
- [ ] Error state shown if API calls fail
- [ ] `npm run lint` passes

## Blocked by

- \#01 — Foundation: Org context + switcher + middleware
