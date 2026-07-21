# Project Architecture

This document defines the structural rules of the project. It must be followed by any new code. Any exception must be documented here, not improvised silently.

---

## 1. Guiding principles

1. **Feature-based architecture**: business logic lives in `features/`, organized by functional domain, not by technical type.
2. **A feature never imports another feature directly.** If `feature-a` needs code from `feature-b`, that code must be promoted to `shared/` or `server-fn/`.
3. **Strict client/server separation, visible at a glance** in the folder structure — this is the criterion that overrides all others (including navigation convenience), because it's the only structural mistake that can genuinely cause a secret leak or a broken build.
4. **Reverse YAGNI on sharing**: all code is born inside the feature that needs it. It only moves up to `shared/` or `server-fn/` at the actual moment a second feature needs it — never in anticipation.
5. **`routes/` = composition only.** No business logic inside a route file: only assembly of `queryOptions`, feature components, and guards.
6. **One file = one responsibility**, but not necessarily one function. Several tightly related functions (same domain, same consumers) can stay in a single file as long as there's no real reason to split (size, diverging lifecycle).
7. **A file's name always describes its precise role**, never just the name of its domain (avoid `auth.ts` duplicated across 3 folders; prefer `auth.server.ts`, `auth.client.ts`, `auth.functions.ts`).

---

## 2. Full folder structure

```
src/
├── routes/                          # TanStack Start file-based routing — composition only
│
├── features/
│   └── {feature}/
│       ├── components/
│       ├── hooks/
│       ├── server/                  # server logic SPECIFIC to this feature
│       ├── server-fn/               # server functions SPECIFIC to this feature (createServerFn)
│       ├── schemas/                 # zod (validation + form)
│       ├── queries.ts               # this feature's TanStack Query queryOptions()
│       ├── constants.ts             # constants local to the feature
│       └── types/
│
├── server-fn/                       # CROSS-FEATURE server functions (2+ features)
│   └── auth.functions.ts
│
├── shared/                          # CLIENT-SAFE code, cross-feature, zero side effects
│   ├── components/                  # generic/shared components
│   ├── hooks/                       # useDebounce, useMediaQuery...
│   ├── lib/                         # generic code, zero domain knowledge (cn, formatters...)
│   ├── integrations/                # CLIENT instances of third-party services
│   ├── constants/                   # truly global constants (roles, plans...)
│   └── types/                       # shared types
│
├── server/                          # SERVER-ONLY, never bundled/importable client-side
│   ├── db/
│   │   ├── schema/                  # ORM schema, split by domain
│   │   └── index.ts                 # Database instance
│   └── integrations/                # SERVER instances of third-party services
│       ├── auth.server.ts
│       └── sentry.ts
│
├── config/                          # project configuration — plain values, no logic
│   ├── env.server.ts
│   └── env.client.ts
│
└── styles/
    └── globals.css
```

---

## 3. Role and rules of each folder

### `routes/`
TanStack Start routing files. Must only contain:
- a `loader` calling `queryOptions` exported by a feature or a server function from `server-fn/`
- rendering of components imported from `features/*/components`
- guards (`beforeLoad`) via `server-fn/`

No inline business logic, no direct db access.

### `features/{feature}/`
Everything specific to one functionality, never leaving its folder.
- `server/`: server functions **specific** to this feature only (not consumed elsewhere). Follows the same isomorphic logic as `server-fn/` (createServerFn), but scoped locally. Rename to a local `server-fn/` if the word "server" causes confusion within the team.
- `queries.ts`: TanStack Query query options, colocated with the feature. Exported via `index.ts` if another feature/route needs to consume them read-only.
- `constants.ts`: local constants by default (see reverse YAGNI rule, §1.4).

### `server-fn/`
**Cross-feature** server functions, called by 2+ features or routes. Always `createServerFn` wrappers — therefore always importable client-side (Vite/Nitro automatically strip the handler from the client bundle), never subject to the `server/` protection rule.

Placement rule: *will this function be called from more than one feature/route?* Yes → `server-fn/`. No → stays in `features/x/server/`.

File convention: one file per cross-feature domain (`auth-session.ts`, future `billing-session.ts`...), not one file per function. Split a file internally only if a subgroup of functions develops a distinct lifecycle.

### `shared/`
**Client-safe** code, cross-feature, **with zero side effects** — readable/testable without knowing there's a backend. Belonging test: *can this file be understood without knowing there's a backend behind it?*
- `ui/`: shadcn/ui and generic components.
- `hooks/`: cross-feature React hooks.
- `lib/`: strict extractability test — *copyable as-is into a completely different project, with zero knowledge of this app's business domain*. No feature knowledge, no app-specific config values.
- `integrations/`: third-party SDK instantiation, **client-side only** (`createAuthClient`, `QueryClient`, Sentry client). Contains product decisions (which plugins are enabled) — so it fails the `lib/` extractability test, hence the separation.
- `constants/`, `types/`: shared business knowledge, but no side effects, no service instantiation.

Barrel files (`index.ts`) discouraged in `shared/ui` and `shared/hooks` (tree-shaking/HMR impact with Vite) — prefer direct imports.

### `server/`
**Protected, never importable client-side.** Static, permanent rule:
```ts
// vite.config.ts
importProtection: {
    behavior: 'error',
    client: {
       files: ['**/*.server.*', '**/server/**'],
    },
},
```
No exceptions to add over time — any new subfolder created under `server/` automatically inherits the protection.
- `db/`: ORM schema centralized by domain (not inside features, to avoid dependency cycles on cross-relations), connection instance.
- `integrations/`: **server-side** instantiation of third-party services (`betterAuth({...})` with the drizzle adapter and secrets, server Sentry). Contains only instantiation — no business logic (no "get session" here, see `server-fn/`).

### `config/`
Project configuration only. Plain validated values, no logic, no dependency on other internal modules. Stays a leaf in the dependency graph.

---

## 4. Decision table — where to place a new file

| Question                                                                                                | Answer → location                                           |
|---------------------------------------------------------------------------------------------------------|-------------------------------------------------------------|
| Does the code instantiate a third-party SDK with server secrets (db, private API key)?                  | `server/integrations/`                                      |
| Does the code instantiate a third-party SDK client-side (hooks, public plugins)?                        | `shared/integrations/`                                      |
| Is it a `createServerFn`, used by 2+ features/routes?                                                   | `server-fn/{domain}.ts`                                     |
| Is it a `createServerFn`, used by a single feature?                                                     | `features/{feature}/server-fn/`                             |
| Does the file know the name of a business entity (User, Plan, Organization) and is used by 2+ features? | `shared/` (types, constants, hooks, ui depending on nature) |
| Is the file 100% generic, copyable into another project without changes?                                | `shared/lib/`                                               |
| Is the file specific to a single feature?                                                               | `features/{feature}/`                                       |
| Is it a validated config value (env), with no logic?                                                    | `config/`                                                   |
| Is it Drizzle schema/migration?                                                                         | `server/db/schema/` (never inside a feature)                |

---

## 5. Naming conventions

- **kebab-case** for all file names (`get-session.ts`, `format-date.ts`, `auth-client.ts`).
- **Never name a file just after its domain** (`auth.ts`) if it exists in several folders — name it after its precise role instead: `auth.server.ts` (server instantiation), `auth.client.ts` (client instance), `auth.functions.ts` (session server functions). Goal: fast lookup (Cmd+P) without ambiguity.
- **Named exports** (no `default export`) for all application code — better traceability in autocomplete/refactoring.
- **Explicit verb prefix** for functions with side effects or a clear action (`get-`, `require-`, `update-`, `create-`).

---

## 6. Stack-specific notes

- **Drizzle**: schema centralized in `server/db/schema/`, split by business domain but never inside `features/*` — avoids dependency cycles on cross-relations (e.g. `user` ↔ `billing`).
- **better-auth**: three distinct, non-mergeable files — `server/integrations/auth.server.ts` (config + drizzle adapter, never client-side), `shared/integrations/auth.client.ts` (React client, `useSession` hooks), `server-fn/auth.functions.ts` (cross-feature server functions: `getSession`, `ensureSession` etc.).
- **TanStack Query**: `queryOptions()` colocated inside each feature (`features/x/queries.ts` or `features/x/queries/my-query.ts`), no global query-key file — keeps the feature self-contained, exportable via `index.ts` if external read access is needed.

---

## 7. Document maintenance rule

This structure should not be second-guessed before a real friction point appears across at least 3-4 actually-built features. Any rule change must be added here, with justification, to remain the project's single source of truth.
