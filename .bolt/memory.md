# Project memory

## Product intent & audience

- Inventory/stock management application (Brazilian Portuguese UI): products, stock movements (entries/exits), alerts, authentication, settings.
- Backend: Supabase (auth, database, RLS policies, RPC functions, SQL migrations).
- Audience: users managing product stock with low-stock and inactivity alerts.

## Brand personality & voice

- Practical, functional tone. No marketing copy. UI labels and instructions in Portuguese.

## Visual design & UX direction

- Mobile-first layout; primary container `max-w-md`. Must work at 360px, 768px, 1366px.
- Bottom navigation bar; sticky screen headers.
- Tailwind color tokens (do not replace): Primary `#176B5B`, Accent `#1F2933`, Surface `#FFFFFF`, Canvas `#F7F9F8`, Ink `#111827`, Line `#E2E8E5`.
- Icons: `lucide-react` only. No new UI/icon/component libraries.
- Shared UI patterns: Modal, ConfirmDialog, FormError, ScreenHeader, LoadingState, EmptyState, ErrorMessage.
- Stock status uses visual identification (color/state) via `lib/stockStatus.tsx`.

## Decisions, constraints & rationale

- Feature-based architecture: `src/features/{auth,products,movements,alerts,settings}/` each with `components/`, `hooks/`, `pages/` (or `screens/`, `context/`).
- `src/components/{ui,shared}` for generic and cross-feature components.
- Services layer (`src/services/`) is the sole Supabase access point — screens/components never query Supabase directly. Do not duplicate services or alter DB field names.
- `lib/supabase.ts`, existing services, AuthContext, table structure, column names, RPC functions, RLS policies, and migrations are preserved unchanged.
- Product saldo (balance) is never edited via product form; only changed through movements (entries/exits).
- Movements: validate positive quantities, prevent negative balance, update saldo, use existing RPC function.
- Alert rules preserved: low stock (available ≤ minimum); no movement for >60 days (use registration date if never moved).
- TypeScript explicit typing; avoid `any` and unnecessary casts; `@/` path alias for `src/` imports; functional components + hooks; avoid circular deps and multi-responsibility components.
- Validation gates: `npm run lint`, `npm run typecheck`, `npm run build` must all pass.
- Known lint warning: `react-refresh/only-export-components` on AuthContext (exports Provider + `useAuth` hook) — acceptable, mirrors original pattern.

## Open questions & assumptions

- Manual UI flow validation (login, CRUD, movements, alerts) not yet confirmed in-browser; only lint/typecheck/build verified.
- Assumption: existing Supabase schema, RLS, and RPC behavior are correct and unchanged.