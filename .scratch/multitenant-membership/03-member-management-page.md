# 03 — Member management page

**Labels:** `enhancement`, `ready-for-agent`

## Parent

PRD: `.scratch/multitenant-membership/PRD.md`

## What to build

A full member management page at `/dashboard/settings/members` where organization OWNERs and ADMINs can view, invite, and manage members.

**End-to-end behavior:**

- **Member list:** Table showing all members of the active organization. Columns: user info (avatar, name, email), role (badge with color per role), joined date. OWNER sees all members; ADMIN sees all members but cannot promote to OWNER; MEMBER sees only the list with no action buttons.
- **Invite form:** Email input + role dropdown (ADMIN, MEMBER). On submit, calls `organizationService.inviteMember(orgId, { email, role })`. Validates email format. Shows success/error feedback. Only visible to OWNER and ADMIN.
- **Change role:** Action on each member row (OWNER/ADMIN only). Dropdown to switch between ADMIN and MEMBER. Promotions to OWNER are OWNER-only. Confirmation dialog for role changes.
- **Remove member:** Action on each member row (OWNER/ADMIN only). Confirmation dialog. Cannot remove self (user must leave org instead — out of scope for now).
- **Pending invitations section:** Below the member list, show pending invitations with email, role, status, expiry, and a revoke button (OWNER/ADMIN only).
- **Role visibility matrix:**

| Action | OWNER | ADMIN | MEMBER |
|--------|-------|-------|--------|
| View member list | ✓ | ✓ | ✓ |
| Invite new member | ✓ | ✓ | ✗ |
| Change role (→ADMIN/MEMBER) | ✓ | ✓ | ✗ |
| Promote to OWNER | ✓ | ✗ | ✗ |
| Remove member | ✓ | ✓ | ✗ |
| Revoke pending invitation | ✓ | ✓ | ✗ |

## Acceptance criteria

- [ ] `/dashboard/settings/members` route renders a page scoped to the active org
- [ ] Member list fetches and displays all members with avatar, name, email, role, joined date
- [ ] Invite form validates email, sends invite, shows success/error feedback
- [ ] Role change dropdown is available on member rows per the visibility matrix
- [ ] Confirmation dialog before role changes and removals
- [ ] Remove member calls API and refreshes list
- [ ] Pending invitations section shows list with revoke action
- [ ] MEMBER role sees the page as read-only (no action buttons)
- [ ] `npm run lint` passes

## Blocked by

- \#01 — Foundation: Org context + switcher + middleware
