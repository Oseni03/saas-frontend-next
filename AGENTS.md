# AGENTS.md — Opticast frontend

Single Next.js app at root (no monorepo). Source lives in `src/`, not `frontend/`.

## Stack (verified from config)

| Layer               | Choice                               | Notes                                                                                          |
| ------------------- | ------------------------------------ | ---------------------------------------------------------------------------------------------- |
| Framework           | Next.js 16 App Router                | `next.config.ts`: `output: 'standalone'`                                                       |
| Styling             | Tailwind CSS v4 + `tw-animate-css`   | Uses `@import "tailwindcss"` and `@tailwindcss/postcss`, NOT v3 `@tailwind` directives         |
| Lint/Format         | Biome 2                              | `npm run lint` = `biome check`, `npm run format` = `biome format --write`                      |
| Data fetching       | TanStack React Query + Axios         | Hooks use `useQuery`/`useMutation`; Axios instance at `src/lib/api.ts` with token interceptors |
| Validation          | Zod 4                                | Schemas in `src/schemas/`; `snakeCaseSchema` helper transforms camelCase→snake_case for API    |
| UI library          | shadcn/ui (New York style)           | Components in `src/components/ui/`, icon library is lucide-react                               |
| Auth                | Better Auth (JWT)                    | `src/hooks/useAuth.ts`, `src/lib/api-services/auth.ts`. Tokens in localStorage + cookie.       |
| Component animation | framer-motion                        |                                                                                                |
| Themes              | next-themes + custom `ThemeProvider` | `src/contexts/theme-control.tsx`                                                               |
| Path alias          | `@/*` → `./src/*`                    | In tsconfig.json                                                                               |

## Commands (root, no `cd frontend`)

```bash
npm run dev      # next dev, http://localhost:3000
npm run build    # next build
npm run lint     # biome check (linter with organize-imports on save)
npm run format   # biome format --write
```

No test framework is installed. No typecheck script is configured (use `npx tsc --noEmit` if needed).

## Architecture

- **Pages**: `src/app/` — route groups: `(auth)/` (login, signup, forgot/reset-password), `about/`, `privacy/`
- **Components**: `src/components/ui/` (shadcn), `src/components/providers/` (QueryProvider), feature-specific dirs
- **API layer**: Axios instance → `src/lib/api-services/` (auth, mfa, oauth, organization, billing, admin, notification, user, health)
- **Hooks**: `src/hooks/useAuth.ts` (login, signup, refresh, verify-email, forgot/reset-password, me, update-me, logout, deactivate), `use-mobile.ts`
- **Schemas**: Zod validation objects in `src/schemas/`
- **Types**: shared TS types in `src/types/`

## Directory structure rules

- **Feature components mirror routes**: `src/app/about/` → `src/components/about/`, `src/app/(auth)/` → `src/components/auth/`, etc. Feature components go in `src/components/<name>/`, never colocated inside route groups.
- **API service ↔ schema pair per domain**: Adding a new API domain requires a file in `src/lib/api-services/` (API calls) and a matching schema in `src/schemas/` (Zod validation). Both barrel-exported from their `index.ts`.
- **Route group convention**: Auth pages wrap in `(auth)/` parens route group (no URL prefix). `/projects` and `/onboarding` are flat routes (not wrapped) because middleware matches exact path prefixes.
- **Types vs schemas**: `src/types/` holds plain TS interfaces (compile-time only, e.g. `FeatureItem`, `PricingPlan`). `src/schemas/` holds Zod objects (runtime validation). Request/response shapes for API go in schemas; domain model interfaces go in types.

## Auth (critical)

- `src/middleware.ts` protects `/projects` and `/onboarding`; redirects authenticated users away from `/login`, `/signup`, `/forgot-password`, `/reset-password`
- `access_token` stored in both localStorage AND cookie (for middleware to read). `refresh_token` in localStorage only.
- On 401, Axios response interceptor clears tokens and redirects to `/login`.
- API base: `NEXT_PUBLIC_API_URL` env var (default `http://localhost:8000/api/v1`)

## Conventions

- **No explicit borders** — prefer background-tone separation (surface-container levels in globals.css)
- **No global state library** — use TanStack Query cache + component-local state
- Fonts: Manrope (`--font-display`) for headings, Inter (`--font-sans`) for body, via next/font
- Color system uses CSS custom properties with light/dark `:root` / `.dark` classes
- shadcn/ui components use `cn()` from `src/lib/utils.ts` (clsx + tailwind-merge)

## Build / Deploy

- `Dockerfile` uses `node:20-alpine`, multi-stage, copies from `.next/standalone` (requires `output: 'standalone'`)
- `.env.local` has example OAuth client ID — do not commit real secrets
