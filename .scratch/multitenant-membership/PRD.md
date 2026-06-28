# PRD: Multitenant Flow with Membership Management

## Problem Statement

The application supports organizations as a core tenant model (each user can belong to multiple organizations with roles), and the backend API already provides full CRUD for organizations, memberships, and invitations. However, the frontend has no wiring to this API — all org/member data is hardcoded mock data. Users cannot:

- See their real organizations or switch between them
- Create new organizations
- Manage members or roles
- Accept invitations
- See org-scoped billing or settings

This blocks any multi-user collaboration feature.

## Solution

Wire the frontend to the existing organization API, providing a full multitenant experience:

- A sidebar **OrgSwitcher** (replacing TeamSwitcher) that lists the user's organizations and allows switching the active context
- A **Create Organization** modal triggered from the switcher, with name and plan selection
- **Org-scoped settings pages** under `/dashboard/settings/` for General (name/logo), Members (list, invite, remove, change roles), Billing (plan/subscription), and Notifications
- An **invitation accept flow** at `/invitations/accept?token=xxx` that handles incoming invites
- An **OrganizationProvider** React context that manages active org state, persists it to localStorage, and exposes it to all dashboard children
- Correct middleware protection for `/dashboard` routes

## User Stories

1. As a user, I want to see my organizations listed in the sidebar, so that I know which orgs I belong to.
2. As a user, I want to switch between organizations from the sidebar dropdown, so that I can work in different contexts.
3. As a user, I want to create a new organization from the sidebar, so that I can start a new team.
4. As a user, I want to select a plan when creating an organization (FREE/PRO/BUSINESS/ENTERPRISE), so that I can choose the right tier from the start.
5. As an organization OWNER, I want to view all members of my org, so that I know who has access.
6. As an organization OWNER or ADMIN, I want to invite new members by email, so that I can grow my team.
7. As an organization OWNER or ADMIN, I want to change a member's role between ADMIN and MEMBER, so that I can manage permissions.
8. As an organization OWNER, I want to promote a member to OWNER, so that I can transfer ownership.
9. As an organization OWNER or ADMIN, I want to remove a member, so that I can revoke access.
10. As an organization OWNER or ADMIN, I want to see pending invitations and revoke them, so that I can manage who hasn't joined yet.
11. As a user, I want to accept an invitation via a link, so that I can join an organization.
12. As a user, I want to see the org's billing plan and manage it via a portal link, so that I can handle subscriptions.
13. As a user, I want the dashboard stats to reflect the active org's data, so that I see relevant information.
14. As a user, I want my active org selection persisted across page reloads, so that I don't have to re-select.
15. As an unauthenticated user accessing a protected route, I want to be redirected to login, so that my data stays secure.

## Implementation Decisions

### Architecture

- **Client-side org context** — a React context (`OrganizationProvider`) stores and exposes the active organization. The org ID is passed explicitly to API service calls. URLs remain flat (no `/orgs/[slug]/` prefix).
- **Active org persistence** — active org ID is stored in localStorage and restored on mount. On first visit after login/signup, the first org from the list is auto-selected.
- **Org list fetching** — `OrganizationProvider` calls `organizationService.list()` on mount. The list is cached via TanStack Query with key `["organizations"]`.
- **No Axios interceptor for org ID** — org-scoped API calls already take `orgId` as a path parameter; components pass it explicitly.

### Routes

| Route | Purpose | Middleware |
|-------|---------|-----------|
| `/dashboard` | Post-login landing — org overview stats | Protected |
| `/dashboard/settings/general` | Update org name/logo | Protected |
| `/dashboard/settings/members` | Member list, invite, remove, change roles | Protected |
| `/dashboard/settings/billing` | View plan, manage subscription | Protected |
| `/dashboard/settings/notifications` | User notification preferences | Protected |
| `/invitations/accept?token=xxx` | Accept invitation (auth required) | Protected |

### Schema Changes

**`src/schemas/organization.ts`** — `OrgCreateRequestSchema` gains a `plan` field:

```typescript
export const OrgCreateRequestSchema = z.object({
  name: z.string().min(1),
  plan: z.enum(PlanTier),
});
```

### Module Map

| Module | Type | Responsibility | Depth Assessment |
|--------|------|---------------|-----------------|
| `OrganizationProvider` | Context + Hook | Fetches orgs, selects/manages active org, persists to localStorage, exposes `useOrganization()` | **Deep** — encapsulates async fetch, selection logic, persistence, and caching behind a simple hook |
| `OrgSwitcher` | Component | Sidebar dropdown showing org list, switching active org, triggering create org modal | **Shallow** — reads from `useOrganization()`, renders UI |
| `CreateOrganizationModal` | Component | Modal with name input + plan selector, calls `createOrg` then `billingService.initialize` | **Shallow** — form with two fields, single submit handler |
| `MemberList` | Component | Table of members with role badges, actions (remove, change role) | **Medium** — renders list, conditionally shows actions based on role |
| `InviteMemberForm` | Component | Email input + role dropdown, calls `inviteMember` | **Shallow** — form, validates, submits |
| `PendingInvitations` | Component | List of pending invites with revoke action | **Shallow** — list + revoke button |
| `MemberManagementPage` | Page | Composes MemberList, InviteMemberForm, PendingInvitations at `/dashboard/settings/members` | **Shallow** — composes sub-components, reads `useOrganization()` |
| `InvitationAcceptPage` | Page | Reads `?token=`, calls `acceptInvitation`, ref`1etches orgs, redirects to `/dashboard` | **Shallow** — single action + redirect |
| `SettingsGeneralPage` | Page | Org name/logo form at `/dashboard/settings/general` | **Shallow** — form, uses `organizationService.update` |
| `SettingsBillingPage` | Page | Plan display + manage/upgrade links at `/dashboard/settings/billing` | **Shallow** — display + redirect to portal |
| `SettingsNotificationsPage` | Page | User notification preferences | **Shallow** — existing user-level page |
| `DashboardPage` | Page | Org-scoped stats (replace mock data) | **Shallow** — reads active org, displays stats |

### OrganizationProvider Interface

```typescript
interface OrganizationContextValue {
  organizations: OrgResponse[];
  activeOrg: OrgResponse | null;
  setActiveOrg: (org: OrgResponse) => void;
  isLoading: boolean;
  error: Error | null;
}
```

Registered in `dashboard/layout.tsx`, scoped to dashboard subtree.

### Middleware Changes

- Add `/dashboard` to `PROTECTED_PREFIXES` (the matcher already includes it, but the protection logic doesn't check for it)
- Change authenticated user redirect from `/projects` to `/dashboard`

### Terminology Changes

| File | Current | New |
|------|---------|-----|
| `team-switcher.tsx` (renamed) | Component name `TeamSwitcher`, props `teams`, labels "Teams" / "Add team" | `OrgSwitcher`, props `organizations`, labels "Organizations" / "Add organization" |
| `app-sidebar.tsx` | `data.teams` mock data, `TeamSwitcher` import | `data.organizations` mock data, `OrgSwitcher` import |
| `dashboard/page.tsx` | "Team Members" stat | "Organization Members" |

### Invitation Accept Flow

1. User clicks email link → `/invitations/accept?token=xxx`
2. Middleware checks auth — if not authenticated, redirect to `/login?redirect=/invitations/accept?token=xxx`
3. Page calls `organizationService.acceptInvitation({ token })`
4. On success, invalidates `["organizations"]` query cache
5. Sets the accepted org as active via `setActiveOrg()`
6. Redirects to `/dashboard`

## System Design

### Context Boundary

The system covers the signed-in, dashboard-protected area of the application. It is called by:
- The sidebar (OrgSwitcher) — user-initiated org switching and creation
- `/dashboard/settings/*` pages — member management, billing, general settings
- `/invitations/accept` — triggered by email link

It calls:
- `organizationService.*` — org CRUD, member CRUD, invitation CRUD
- `billingService.initialize` — plan subscription on org creation
- `localStorage` — active org persistence

### Module Map (detailed)

```
dashboard/layout.tsx
  └── OrganizationProvider (context, fetches orgs, manages active)
       ├── AppSidebar
       │   ├── OrgSwitcher (reads: organizations, activeOrg; writes: setActiveOrg)
       │   │   └── CreateOrganizationModal
       │   ├── NavMain (static nav items → /dashboard/settings/*)
       │   └── NavUser (unchanged)
       └── <children>
           ├── DashboardPage (org stats)
           └── /dashboard/settings/*
               ├── GeneralPage
               ├── MemberManagementPage
               │   ├── MemberList
               │   ├── InviteMemberForm
               │   └── PendingInvitations
               ├── BillingPage
               └── NotificationsPage

/invitations/accept/page.tsx
  └── (reads token, calls acceptInvitation, redirects)
```

### Key Seams

| Seam | What sits behind | Test strategy |
|------|-----------------|---------------|
| `organizationService` | Axios → backend API | Mock with MSW or Jest spy |
| `localStorage` | Browser storage | Mock `Storage` API |
| `useOrganization` | React context | Wrap in provider in tests |
| Router (redirect) | `next/navigation` | Mock `useRouter` |

### Tradeoffs

**What this design makes easy:**
- Simple URL scheme (flat routes, no org prefix)
- Fast org switching (client-side state, no full page reload)
- Clear separation of concerns (context provides org, components consume it)
- Easy to add new org-scoped pages (just wrap in dashboard layout)

**What it closes off:**
- Deep linking to a specific org's page (org context is ephemeral — restored from localStorage, not from URL)
- Server-side rendering with org context (org is client-only state)
- Sharable org-specific URLs (no `/orgs/acme/projects` route)

This tradeoff is acceptable: the app is a dashboard-first SPA experience where org switching is done via the sidebar, not via URL navigation.

## Testing Decisions

No test framework is currently installed in this project. Testing decisions are deferred — this PRD does not prescribe tests.

What would make good future tests:
- Unit tests for `OrganizationProvider` — verify org list fetch on mount, active org selection, localStorage persistence, and switching behavior
- Component tests for `OrgSwitcher` — verify correct org list rendering, active state highlighting, and modal trigger
- Component tests for `CreateOrganizationModal` — verify form validation, submission, and error states
- Integration test for invitation accept flow — verify token read, API call, cache invalidation, and redirect
- All tests should mock the API layer (Axios/`organizationService`) and test external behavior only

## Out of Scope

- Team management (sub-groups within an organization) — not supported by the current API
- Organization deletion UI — API supports it (`organizationService.remove`) but no UI is built in this PRD scope (only OWNER can do it from a settings action)
- Bulk invite (CSV upload, multiple emails at once) — single email invite only
- SSO/SAML org-level auth — not part of current auth architecture
- Audit log for member actions — not in current API
- `/onboarding` page implementation — already exists as a separate concern; this PRD only covers what happens after onboarding creates the first org
- Dark mode adjustments — handled by existing theme system, not org-specific
- Mobile optimization of member management table — deferred

## Further Notes

- The existing `TeamSwitcher` component currently uses hardcoded mock data and `React.useState` for active team. It will be renamed to `OrgSwitcher` and wired to `OrganizationProvider`.
- The default authenticated-user redirect in middleware currently goes to `/projects` (which has no route handler). This must change to `/dashboard`.
- The middleware matcher already includes `/dashboard/:path*` but the `PROTECTED_PREFIXES` array does not — this is a bug that must be fixed as part of this PRD.
- The sidebar's Settings nav items currently have `url: "#"` — they must be updated to real routes (`/dashboard/settings/general`, `/dashboard/settings/members`, `/dashboard/settings/billing`, `/dashboard/settings/notifications`).
