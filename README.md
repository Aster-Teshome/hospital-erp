# Hospital ERP Frontend

Admin/staff dashboard for the Hospital Management System - talks to
[hospital-erp-backend](https://github.com/Smart-Tech-Solution92/hospital-erp-backend). An
independent project/repo from the backend, deployed separately.

Implements the 2-month MVP covering authentication & roles, patient
registration/EMR, appointments & doctor scheduling, outpatient & clinical
management, emergency & basic inpatient management, laboratory,
pharmacy & prescriptions, and billing/dashboard/reporting.

## Stack

React 19 + TypeScript + Vite, React Router (routing), TanStack Query
(server state/caching), Zustand (client auth state), Ant Design (UI kit),
React Hook Form + Zod (forms/validation, same validation library as the
backend), Axios (HTTP), Vitest + Testing Library (tests), oxlint + Prettier
(lint/format).

## Getting started

```bash
cp .env.example .env      # points at the backend; edit VITE_API_BASE_URL if needed
npm install
npm run dev                # http://localhost:5173
```

Requires the backend running (see hospital-erp-backend's README) with its
dev seed applied so you can log in immediately:

```
email: admin@smartech-demo.test
password: ChangeMe123!
```

## Project structure

```
src/
  main.tsx / App.tsx        Entry point; wires QueryClientProvider, AntD ConfigProvider, router
  app/
    router.tsx                Route tree: public (AuthLayout) vs protected (ProtectedRoute + AppLayout)
    queryClient.ts             TanStack Query client config
  components/
    layout/
      AuthLayout.tsx            Centered shell for login/register
      AppLayout.tsx             Sidebar + header + routed content, the authenticated shell
    ProtectedRoute.tsx         Redirects to /login when there's no session
    RoleGuard.tsx               Shows/hides UI by role (client-side only - the API enforces the real RBAC)
  config/
    env.ts                     Validated import.meta.env (Zod), mirrors the backend's config/env.ts
  lib/
    apiClient.ts                Shared axios instance: attaches the access token, refreshes on 401
  modules/
    auth/                      ★ reference module - fully implemented, see below
    dashboard/                  Minimal landing page after login (not a template - real modules don't copy this)
    patients/                   Registration, MRN, search, profile, clinical notes (FR-PAT-*)
    appointments/                Booking, doctor schedules, calendar, status (FR-APT-*)
    outpatient/                  Check-in, consultation, vitals, clinical orders (FR-OPD-*)
    emergency/                   Registration, triage, treatment record, status (FR-EMG-*)
    inpatient/                   Admission, wards & beds, bed assignment, discharge (FR-IPD-*)
    laboratory/                  Orders, test catalog, sample tracking, results (FR-LAB-*)
    pharmacy/                    Prescription queue, dispensing, inventory (FR-PHA-*)
    billing/                     Service billing, payments, invoices, receipts (FR-BIL-*)
    users/                       Staff account management by admins (FR-AUTH-03)
                                (scaffolded folders only - not yet implemented)
  types/                      Cross-module shared types (e.g. API error body shape)
  utils/                      roles.ts (mirrors the backend's Role enum), extractErrorMessage.ts
tests/
  unit/                       Isolated logic (e.g. the auth store)
  integration/                 Renders real pages/hooks, mocks only the network boundary (apiClient)
  e2e/
```

## The module pattern (read this before building a new module)

`src/modules/auth/` is the reference implementation every other module
should copy the shape of - it mirrors the backend's
routes → controller → service → repository split:

| File | Responsibility | Backend equivalent |
|---|---|---|
| `pages/*.tsx` | Route-level components: wire hooks to UI, navigate on success | controller |
| `hooks/*.hooks.ts` | TanStack Query hooks - the only thing components call; own loading/error state, push results into the store | service |
| `api/*.api.ts` | One function per endpoint, calls `apiClient`, no state | repository |
| `*.validation.ts` | Zod schemas, fed into `react-hook-form` via `@hookform/resolvers/zod` | validation |
| `*.types.ts` | API-facing shapes | types |
| `store/*.store.ts` | Only when a module needs state outside React Query (e.g. auth's session) - most modules won't need one | - |
| `components/*.tsx` | Presentational pieces specific to the module (forms, cards) | - |

Conventions demonstrated in `auth`:
- **Session persistence**: `auth.store.ts` uses Zustand's `persist` middleware
  so a page refresh doesn't drop the login. `apiClient.ts` reads tokens via
  `useAuthStore.getState()` (not a hook) since it runs outside React.
- **Token refresh**: `apiClient.ts`'s response interceptor catches a 401,
  calls `/auth/refresh` once, retries the original request, and only clears
  the session if the refresh itself fails.
- **Route protection**: `ProtectedRoute.tsx` (any-authenticated-user gate,
  wraps the whole app shell) + `RoleGuard.tsx` (role-specific UI, used
  inside a page - see `DashboardPage.tsx`'s "Admin tools" card).
- **Validation parity with the backend**: `auth.validation.ts`'s Zod schemas
  mirror the backend's `auth.validation.ts` constraints, so invalid input is
  caught in the form before a request is even sent.
- **Error messages**: `extractErrorMessage.ts` unwraps the backend's
  `{ error: { message } }` shape (see the backend's `error.middleware.ts`)
  for display in a form `Alert`.

To add a new module: copy the file shape above, add its routes as children
of `ProtectedRoute` in `src/app/router.tsx`, and add a nav entry in
`AppLayout.tsx`.

## Roles

Mirrors the backend's Role enum (`src/utils/roles.ts`), per FR-AUTH-02:
`admin`, `receptionist`, `doctor`, `nurse`, `lab_staff`, `pharmacist`,
`cashier`.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start with hot reload |
| `npm run build` | Typecheck + production build to `dist/` |
| `npm test` | Run all tests once (`test:watch` for watch mode) |
| `npm run lint` | oxlint |
| `npm run format` | Prettier |
