# Repository Findings

Last updated: 2026-06-26

This file is the living review document for the repository. It captures the current stack, confirmed issues, prioritized improvements, and notable follow-up items. It should be updated as work continues.

## Current Stack

- Framework: Next.js 16 App Router with React 19.2
- Language: JavaScript and JSX
- Backend layer: Next.js route handlers under `app/api`
- Auth and data access: Supabase via `@supabase/ssr` and `@supabase/supabase-js`
- Database: Postgres through Supabase
- CMS: Sanity Studio embedded in the app, queried with `next-sanity`, `@sanity/client`, and `groq`
- Client data fetching: `@tanstack/react-query` and `axios`
- Local client state: `zustand`
- Styling: SCSS/Sass, with Tailwind configured but used lightly
- Motion/UI libraries: `framer-motion`, `gsap`, `lenis`, Heroicons, `react-icons`
- Hosting/observability: Vercel Speed Insights

## Key Observations

- The repo is a combined frontend and backend app using the Next.js `app/` directory for pages, layouts, API routes, and admin flows.
- Public content is split between Sanity-managed marketing/editorial content and Supabase-backed league data.
- The admin area mixes server components, client-side Supabase calls, internal API calls, and a few legacy patterns that are still being cleaned up.
- A focused Vitest suite now protects the highest-risk admin and route-handler seams, but there is still no E2E coverage or CI enforcement.
- The app now builds, lints, and tests on Next.js 16 with React 19 and the upgraded Sanity stack.
- The next framework follow-up is baseline hardening: CI enforcement, explicit typechecking, and a vulnerability pass.

## Prioritized Improvements

### High Priority

1. Standardize API contracts and database field naming.
   - Current code mixes shapes such as `id` vs `player_id` and `firstname` vs `player_firstname`.
   - Route responses are inconsistent: some return raw arrays, others return `{ data }`, others return `{ data, error }`.

2. Harden authorization around mutations.
   - Mutating handlers rely on the Supabase client but do not consistently enforce explicit session or role checks in route code.
   - This is acceptable only if Supabase RLS is complete and verified.

3. Expand automated tests and add CI.
   - Unit, component, and route-handler coverage now exists for the main player/team/match/event/league/challenger admin seams.
   - The next gap is breadth: public data flows, remaining mixed-contract routes, and CI enforcement are still missing.

4. Consolidate data-access patterns.
   - The codebase currently mixes:
     - server component data fetching
     - client-side Supabase queries
     - internal API fetches
     - `@tanstack/react-query`
   - That increases maintenance cost and makes behavior harder to reason about.

5. Normalize environment variable usage.
   - Runtime code cleanup is mostly done, but there is still no checked-in `.env.example` to define required runtime variables.

### Medium Priority

1. Stabilize the upgraded framework baseline.
   - The coordinated React 19 / Next 16 / Sanity 6 lane is now complete.
   - The remaining work is CI/typecheck hardening and a dedicated dependency-audit pass.

2. Continue the TypeScript adoption path.
   - The repo still relies on JavaScript/JSX everywhere.
   - `tsconfig.json` is now active in the Next.js build path, which makes shared API/domain types a good next incremental step.

3. Add a CI workflow for tests and production builds.
   - The local regression net is materially better now.
   - It still depends on manual execution rather than merge-time enforcement.

### Low Priority

1. Continue removing stale commented legacy code outside the touched upgrade seams.
   - The large dead block in `sanity.config.js` has been removed.
   - There are still smaller commented legacy fragments in admin UI files that can be cleaned opportunistically.

2. Audit the remaining npm vulnerabilities after the framework upgrade stabilizes.
   - `npm install` currently reports transitive vulnerabilities.
   - This should be handled as a dedicated dependency-hardening pass rather than mixed into feature work.

3. Audit dormant or unused dependencies after the framework upgrade.
   - The migration already removed the unused `@studio-freight/hamo` dependency because its published peer range still targets React 18.
   - A follow-up pass should confirm whether any other historical packages can be dropped.

## API Contract Normalization Analysis

The current API layer works, but it is inconsistent in three important ways: request body shapes, response body shapes, and domain field naming.

### Current Contract Drift

1. Response envelope inconsistency
   - Some routes return `{ data }`
   - Some routes return `{ data, error }`
   - Some routes return `{ success: true }`
   - Some routes return `{ error }` even on success paths such as delete handlers
   - `app/api/teams/route.js` returns a raw array for GET, while most other GET routes return `{ data }`

2. Request body inconsistency
   - `POST /api/players` expects the player object directly
   - `POST /api/teams` expects `{ player1_id, player2_id }`
   - `POST /api/leagues` now expects the league object directly
   - `PUT /api/leagues/[id]` now expects the league object directly
   - `POST /api/leagues/[id]/events` now expects the event object directly
   - `PUT /api/events/[id]` now expects the event object directly
   - `POST /api/leagues/[id]/challengers` now expects the challenger object directly
   - `POST /api/events/[id]/teams` now expects `{ team_id }`
   - `POST /api/matches` expects `{ matches }`
   - `PUT /api/matches/[id]` now expects the match object directly
   - `PUT /api/challengers/[id]` now expects the challenger object directly

3. Field naming drift
   - Active player code uses `id`, `firstname`, `lastname`
   - The legacy player server-action path previously used `player_id`, `player_firstname`
   - Some route outputs flatten nested data into UI-specific names like `player1_firstname`, while others return nested objects

### Recommended Target Contract

Use one consistent response shape for all JSON routes:

- Success:
  - `{ data: ... }`
- Failure:
  - `{ error: { message: string, code?: string } }`

Use HTTP status codes consistently:

- `200` for successful reads/updates/deletes
- `201` for successful creates
- `400` for invalid input
- `404` only if the route explicitly models not-found cases
- `500` for unexpected server failures

Use one consistent request-body rule:

- For single-entity create/update routes, accept the entity payload directly.
  - Example: `{ firstname, lastname }`
  - Example: `{ event_name, midway_matches }`
- For special-purpose actions, accept one explicit top-level object with descriptive keys.
  - Example: `{ player1_id, player2_id }`
  - Example: `{ matches: [...] }`

### Practical Rollout

1. Normalize delete responses first.
   - Lowest-risk API cleanup.
   - Replace `{ error: null }` success responses with `{ data: { success: true } }` or `{ success: true }`, then standardize across all delete handlers.

2. Normalize GET response envelopes next.
   - `app/api/teams/route.js` is the most obvious outlier because it returns a raw array.
   - This will require coordinated UI updates where callers currently expect `data.data` or a raw array.

3. Remove legacy player field names.
   - The legacy `app/(admin)/admin/players/actions.js` path has now been removed because it was unused by the active UI.

4. Introduce shared route helpers only after 2-3 routes have been normalized.
   - For example:
     - `ok(data, status?)`
     - `fail(message, status, code?)`
   - Do not add this abstraction before the intended contract is settled.

### Current Progress

- Delete responses are now normalized in the tested player, team, event, and league handlers.
- `GET /api/teams` now returns `{ data: [...] }`, matching the broader target envelope.
- Player create/update routes now use the normalized `{ data }` / `{ error: { message } }` envelope.
- Team create and event-team registration now use the normalized `{ data }` / `{ error: { message } }` envelope.
- League-team listing, event-match listing, event withdrawal, and match batch creation now use the normalized `{ data }` / `{ error: { message } }` envelope.
- Single-entity request bodies have been normalized on:
  - `POST /api/leagues`
  - `PUT /api/leagues/[id]`
  - `POST /api/leagues/[id]/events`
  - `POST /api/leagues/[id]/challengers`
  - `PUT /api/events/[id]`
  - `PUT /api/matches/[id]`
  - `PUT /api/challengers/[id]`
- The first route-contract normalization wave is effectively complete for the currently active admin/event flows.
- Remaining API cleanup is now mostly secondary:
  - add shared route helpers only if they reduce repetition without obscuring behavior
  - revisit field-name consistency (`id` vs `player_id`) as a separate, more explicit schema-alignment task

## Environment Variable Cleanup Analysis

### Current State

- There are no active `NEXT_PUBLIC_API_BASE_URL` or `REACT_APP_SERVERURL` usages left in runtime app code.
- There is no `.env.example` in the repository.
- The remaining environment cleanup task is documentation, not code usage.

### Main Issue

For client-side calls to the same app, `NEXT_PUBLIC_API_BASE_URL` is unnecessary. Relative URLs like `/api/players` or `/api/teams` are simpler, safer, and avoid environment drift between local/dev/prod.

### Recommended Cleanup

1. Remove `NEXT_PUBLIC_API_BASE_URL` from internal client fetches.
   - Replace:
     - ``${baseUrl}/api/players``
   - With:
     - `/api/players`

2. Remove stale `REACT_APP_SERVERURL` references.
   - These are leftovers from a pre-Next setup and should not remain in the codebase, even inside comments.

3. Add `.env.example` only for variables that are actually required.
   - If Supabase auth helpers depend on standard Next environment variables in deployment, document them there.
   - If Sanity configuration is intended to be environment-driven later, include that only when the code is updated to use env access consistently.

4. Add one small environment access module when real env usage grows.
   - Only worth doing if the app introduces multiple required runtime variables.

### Current Progress

- Internal same-app client fetches have been migrated away from `NEXT_PUBLIC_API_BASE_URL` in the main tested player/team paths.
- Active `NEXT_PUBLIC_API_BASE_URL` usage has been removed from runtime app code.
- The stale `REACT_APP_SERVERURL` reference has been removed from the match reporting flow.
- The stale `REACT_APP_SERVERURL` reference has now also been removed from the challenger edit flow.
- The unused player server-action path has been retired rather than normalized.

### Affected Files First

- `app/(admin)/admin/players/CreatePlayer.jsx`
- `app/(admin)/admin/players/EditPlayerModal.jsx`
- `app/(admin)/admin/players/DeleteButton.jsx`
- `app/(admin)/admin/teams/SearchComponent.jsx`
- `app/(admin)/admin/teams/DeleteButton.jsx`

## TypeScript Adoption Analysis

TypeScript is a good addition here, but it should be phased rather than flipped on globally in one pass.

### Current State

- The repo already has `tsconfig.json`
- `allowJs` is enabled
- `strict` is currently `false`
- Next.js now also relies on `tsconfig.json` during build and has added `target: ES2017`
- `tsconfig.json` and `jsconfig.json` now both expose the `@/*` path alias
- The codebase is still entirely JavaScript/JSX
- The inactive legacy player server-action files have been removed, which reduces one source of schema drift before TypeScript adoption begins.

### Immediate TypeScript Issues To Address

1. No typecheck script
   - There is no `tsc --noEmit` script in `package.json`

2. No shared domain types
   - API routes and UI components currently rely on implicit shapes
   - That makes contract drift easier

3. Duplicate config files still exist
   - The alias config is now aligned, which unblocked the shared `@/supabase/*` utilities
   - The remaining cleanup is to consolidate onto `tsconfig.json` and eventually remove `jsconfig.json`

### Recommended Migration Strategy

1. Unify config first.
   - Keep `tsconfig.json` as the long-term source of truth
   - Remove `jsconfig.json` once the repo no longer needs dual config files

2. Add a typecheck script.
   - `typecheck`: `tsc --noEmit`

3. Start with type definitions before mass file conversion.
   - Add types for:
     - `Player`
     - `Team`
     - `League`
     - `Event`
     - `Match`
     - API response envelopes

4. Convert the most protected seams first.
   - Best first candidates:
     - route handler tests
     - component tests
     - route handlers behind existing tests
     - player/team/match admin components already covered by tests

5. Keep `strict` off initially, then tighten later.
   - First objective is adoption and shape visibility
   - Second objective is stricter safety

6. Avoid converting the whole app in one pass.
   - Convert feature-by-feature so tests stay useful and review scope stays manageable

### Best First Conversion Targets

- `app/api/players/route.js`
- `app/api/players/[id]/route.js`
- `app/api/teams/route.js`
- `app/api/teams/[id]/route.js`
- `app/api/matches/[id]/route.js`
- The tests around these routes and the player/team admin components

## Package Upgrade Investigation

The repository should not do a single all-at-once `latest` upgrade. The current dependency graph has a few normal patch/minor updates, but the biggest packages are tied together and require staged migrations.

### Current upgrade status

- The coordinated framework migration is complete on the current branch:
  - `next@16.2.9`
  - `react@19.2.7`
  - `react-dom@19.2.7`
  - `next-sanity@13.1.1`
  - `sanity@6.2.0`
  - `@sanity/client@7.23.0`
  - `@sanity/vision@6.2.0`
  - `groq@6.2.0`
  - `eslint@9.39.4`
  - `eslint-config-next@16.2.9`
- The remaining upgrade work is no longer the framework lane itself. It is:
  - CI and typecheck enforcement
  - TypeScript adoption in the highest-risk API and admin seams
  - Tailwind v4 only if there is a styling-system reason to take it
  - a separate vulnerability and dependency-pruning pass

### Installed vs latest snapshot (before the React 19 migration)

As of 2026-06-26, the upgrade map is:

| Package | Installed | Latest | Upgrade shape |
| --- | --- | --- | --- |
| `next` | `15.5.19` | `16.2.9` | major framework migration |
| `react` | `18.3.1` | `19.2.7` | major migration |
| `react-dom` | `18.3.1` | `19.2.7` | major migration |
| `next-sanity` | `9.12.3` | `13.1.1` | larger coordinated migration later |
| `sanity` | `3.99.0` | `6.2.0` | larger coordinated migration later |
| `@sanity/client` | `7.6.0` | `7.23.0` | larger coordinated migration later |
| `@sanity/vision` | `3.99.0` | `6.2.0` | larger coordinated migration later |
| `@tanstack/react-query` | `5.101.1` | `5.101.1` | current |
| `tailwindcss` | `3.4.19` | `4.3.1` | separate styling migration |
| `zustand` | `5.0.14` | `5.0.14` | current |
| `react-toastify` | `11.1.0` | `11.1.0` | current |
| `framer-motion` | `12.42.0` | `12.42.0` | current |
| `react-icons` | `5.6.0` | `5.6.0` | current |
| `lenis` | `1.3.25` | `1.3.25` | current |
| `@vercel/speed-insights` | `2.0.0` | `2.0.0` | current |
| `dotenv` | `17.4.2` | `17.4.2` | current |
| `eslint` | `8.57.1` | `10.5.0` | major tooling migration |
| `groq` | `3.99.0` | `6.2.0` | major, tied to Sanity lane |
| `@vitejs/plugin-react` | `6.0.3` | `6.0.3` | current |

### Confirmed constraints

1. The current Next 15 lane can still move further without taking React 19 yet.
   - `next-sanity@9.12.3` peers on:
     - `next ^14.2 || ^15.0.0-0`
     - `react ^18.3 || ^19.0.0-0`
     - `react-dom ^18.3 || ^19.0.0-0`
     - `sanity ^3.99.0`
     - `@sanity/client ^7.6.0`
     - `styled-components ^6.1`
   - That makes a contained Sanity-lane upgrade on top of the current Next 15 baseline possible.

2. The latest `next-sanity` line is a real Next 16 / React 19 / newer Sanity migration.
   - `next-sanity@13.1.1` peers on:
     - `next ^16`
     - `react ^19.2.3`
     - `react-dom ^19.2.3`
     - `@sanity/client ^7.23.0`
     - `sanity ^5.29.0 || ^6.0.0`
     - `styled-components ^6.1`

3. The deprecated Lenis wrapper has been removed from the current stack.
   - `@studio-freight/react-lenis` has been replaced with `lenis@1.3.25`.
   - The `lenis/react` entrypoint advertises `react >=17`.
   - This removes one former React 19 blocker from the scrolling layer.

4. `framer-motion` can be upgraded independently ahead of React 19 if desired.
   - `framer-motion@12.42.0` supports both `react ^18` and `react ^19`.
   - That makes it a preparatory upgrade, not a blocker.

5. The TanStack Query migration is complete on the current stack.
   - The provider, admin flows, public data views, and touched tests now use `@tanstack/react-query@5`.
   - Query invalidation now uses the v5 object form consistently in the migrated components.

6. The Next 15 request-API changes are already handled, but the Next 16 repo follow-up remains.
   - The dynamic route handlers now await `params`, which covers the current Next 15 async request API expectation.
   - The Next 16 upgrade path still deprecates `middleware` in favor of `proxy`.
   - `next.config.js` still uses `images.domains`, which Next 16 documents as deprecated in favor of `images.remotePatterns`.

7. Tailwind v4 is separate from the main app upgrade.
   - The repo is still configured in the Tailwind v3 style:
     - `postcss.config.js`
     - `tailwind.config.js`
     - `@tailwind base/components/utilities` in `app/globals.scss`
   - Tailwind's official v4 upgrade path uses `npx @tailwindcss/upgrade`.
   - Tailwind usage appears relatively light, so this is not the first upgrade lane to take.

8. Several remaining major updates appear isolated from the framework lane.
   - `zustand@5.0.14` supports `react >=18`
   - `react-toastify@11.1.0` supports `react ^18 || ^19`
   - `react-icons@5.6.0` supports any React peer
   - `@vercel/speed-insights@2.0.0` supports `next >=13` and `react ^18 || ^19`
   - These still need validation, but they are not the same class of blocker as the CMS and framework packages.

### Current progress

- The first cleanup wave is complete.
  - Removed unused top-level dependencies:
    - `npm`
    - `i`
    - `encoding`
    - `next-sanity-image`
    - `@portabletext/react`
    - `@sanity/image-url`

- The local build baseline was repaired in two steps.
  - Reinstalled the workspace SWC native package so `next build` could move past the prior Win32 binary load failure.
  - Added a `package.json` override for `motion-dom` to `12.42.0` because the previously installed `12.33.0` package in the Sanity Studio dependency path was missing files that it imported at runtime.

- The safe current-major refresh lane is complete.
  - Updated successfully:
    - `@supabase/supabase-js` -> `2.108.2`
    - `axios` -> `1.18.1`
    - `dotenv` -> `17.4.2`
    - `framer-motion` -> `12.42.0`
    - `sass` -> `1.101.0`
    - `gsap` -> `3.15.0`
    - `react-icons` -> `5.6.0`
    - `react-toastify` -> `11.1.0`
    - `zustand` -> `5.0.14`
    - `@vercel/speed-insights` -> `2.0.0`
    - `@vitejs/plugin-react` -> `6.0.3`
    - `autoprefixer` -> `10.5.2`
    - `vitest` -> `4.1.9`
  - Note:
    - `@vitejs/plugin-react@6.0.3` needed an `@rolldown/plugin-babel` override to `0.1.8` so npm would not pull the newer optional Babel 8-only peer path during resolution.

- The Lenis replacement path is complete.
  - Removed `@studio-freight/react-lenis`
  - Added `lenis@1.3.25`
  - Updated the shared smooth-scroll provider and the two current Lenis consumers to use `lenis/react`
  - Added focused regression coverage for the provider config and the public hero scroll interaction

- The TanStack Query migration path is complete.
  - Replaced `react-query` with `@tanstack/react-query@5.101.1`
  - Added `@tanstack/react-query-devtools@5.101.1`
  - Updated the shared provider, admin query/mutation components, public data query components, and the affected tests to the v5 package/import paths
  - Converted the migrated invalidation calls to the v5 object form and cleaned the last positional `useQuery` usage in the event registration search flow

- The Supabase SSR migration is complete on the current stack.
  - Replaced `@supabase/auth-helpers-nextjs` with `@supabase/ssr@0.12.0`
  - Added shared utilities under:
    - `supabase/client.js`
    - `supabase/server.js`
    - `supabase/middleware.js`
    - `supabase/config.js`
  - Migrated the touched call sites:
    - middleware
    - auth/admin layouts
    - server-rendered admin list components
    - client auth/logout/search components
    - all Supabase-backed route handlers
  - The admin auth layouts now use `getUser()` instead of trusting `getSession()` in server code.
  - The middleware refresh path now lives in one place and uses the SSR client instead of the deprecated auth helper package.
  - `tsconfig.json`, `jsconfig.json`, and Vitest were aligned on the `@/*` alias so the shared Supabase utilities resolve in both build and tests.

- The Next 15 framework lane is complete.
  - Upgraded:
    - `next` -> `15.5.19`
    - `react` -> `18.3.1`
    - `react-dom` -> `18.3.1`
    - `eslint-config-next` -> `15.5.19`
  - Upgraded the compatible Sanity baseline needed for this lane:
    - `next-sanity` -> `9.4.7`
    - `sanity` -> `3.37.1`
    - `@sanity/client` -> `6.21.2`
    - `@sanity/vision` -> `3.37.1`
  - Updated the dynamic route handlers to await `params` under the Next 15 async request API model.

- The Sass deprecation cleanup is complete.
  - Replaced shared-style `@import` usage with `@use ... as *`.
  - Replaced `map-get(...)` with `map.get(...)` in the shared variables module.
  - The prior Sass deprecation warnings no longer appear in `next build`.

- The contained Next 15-compatible Sanity lane is complete.
  - Upgraded:
    - `next-sanity` -> `9.12.3`
    - `sanity` -> `3.99.0`
    - `@sanity/client` -> `7.6.0`
    - `@sanity/vision` -> `3.99.0`
    - `groq` -> `3.99.0`
  - The public Sanity query layer and Studio route still build successfully on this stack.

- Validation on the current baseline:
  - `npm test` passes
  - `npm run build` passes

### Recommended upgrade order

1. Add CI and a typecheck lane before the next framework major.
   - Add a `tsc --noEmit` script.
   - Add CI for `npm test` and `npm run build`.
   - Add `.env.example` for the real runtime variables.

2. Take React 19 and Next 16 as a dedicated framework lane.
   - Upgrade together:
     - `react`
     - `react-dom`
     - `next`
     - `eslint-config-next`
   - Follow with:
     - `app/middleware.js` to `proxy` planning
     - `next.config.js` image config modernization

3. Upgrade the Sanity stack to the latest line only after the Next 16 lane is stable.
   - Latest coordinated lane:
     - `next-sanity 13.1.1`
     - `sanity 5.x or 6.x`
     - `@sanity/client 7.23.0`
     - newer `groq`

4. Leave Tailwind v4 and TypeScript adoption as separate follow-up lanes.
   - Both are worthwhile.
   - Neither should be bundled into the framework/auth/CMS upgrade work.

### Practical command strategy

Use reporting commands first, not blind upgrades:

1. `npm outdated`
2. `npm update`
   - only for the safe current-major lane
3. targeted installs for deliberate migrations
   - example:
     - `npm install next@15 react@18 react-dom@18`
     - then later `npm install next@16 react@19 react-dom@19`
4. targeted removals for confirmed unused packages
   - example:
     - `npm uninstall npm i encoding`

The key point is to treat this as 4-5 controlled changesets, not one lockfile explosion.

## Recommended Test Stack

For this repository, the recommended approach is:

- `Vitest` for unit and component tests
- `React Testing Library` for rendering and interaction assertions
- `Playwright` for end-to-end coverage of critical user flows

### Why this stack

- The repository is a Next.js App Router project using plain JavaScript, client components, route handlers, and some server-rendered paths.
- Next.js currently documents both Vitest and Jest for unit testing, and Playwright for end-to-end testing.
- Vitest is a good fit here because it is lightweight, fast to run locally, and straightforward to adopt in a JavaScript-first codebase.
- Playwright is the right complement because Next.js documents end-to-end testing for browser flows separately, and async server component behavior is better validated through E2E coverage than unit tests alone.

### Why not start with Jest

- Jest is still supported by Next.js, but for this repo it does not provide a strong advantage over Vitest.
- Vitest should be simpler and faster for adding the first wave of regression coverage.
- Both Jest and Vitest have limitations around `async` Server Components, so either way we still need E2E coverage for important flows.

### Suggested rollout

1. Start with Vitest plus React Testing Library.
   - Focus on pure UI logic, helper logic, and isolated client components.

2. Add Playwright for a small number of high-value flows.
   - Public homepage load
   - Admin login
   - Player CRUD
   - Team creation
   - Match reporting

3. Add API-focused tests after the initial harness is stable.
   - Route handlers can be covered with targeted tests once the contract cleanup starts.

### Medium Priority

1. Reduce unnecessary dynamic rendering and client fetch waterfalls.
   - `app/layout.jsx` forces the root layout dynamic.
   - Some public pages fetch content on the client that could be rendered on the server or cached.

2. Introduce request validation and consistent error formatting.
   - Route handlers currently accept raw request bodies with little or no validation.
   - Error response shapes vary across endpoints.

3. Remove unfinished or dead feature paths.
   - The dead ticket stub has now been removed.
   - There are still several legacy/commented paths that should either be completed or removed.

4. Clean up runtime logging and debug noise.
   - The repo currently has a high volume of `console.log` usage across API routes and UI components.

5. Make lint/build/test execution part of regular validation.
   - The existing `lint` script depends on installed dependencies, and the workspace currently has no `node_modules`.

### Low Priority

1. Prune and modernize dependencies.
   - Some packages are deprecated or appear unused.
   - Dependency cleanup should follow the contract/auth/testing work.

2. Consider a gradual move toward TypeScript for high-risk areas.
   - This is useful, but not the first step.
   - Better value comes first from contract cleanup and test coverage.

3. Reassess styling strategy.
   - Tailwind is configured, but the repo is predominantly SCSS-based.
   - The project should either commit to mixed usage intentionally or simplify toward one primary styling approach.

## Confirmed Defects

- `app/api/players/[id]/route.js`
  - Uses `id`-based row targeting, while other code paths still reference `player_id`.

## Validation Notes

- `node_modules` is now installed locally.
- The full Vitest suite passes after the dependency cleanup, baseline repair, safe package refresh, and Supabase SSR migration.
- The production Next.js build passes after repairing the local SWC package, pinning the transitive `motion-dom` dependency, fixing the lint-reported component issues, and aligning the `@/*` alias in the active config files.
- The new targeted auth callback route test passes locally.

## Test Setup Status

- Vitest is now configured as the unit and component test runner.
- React Testing Library and `@testing-library/jest-dom` are installed and configured.
- Current test command:
  - `npm test` runs the suite once
  - `npm run test:watch` starts watch mode

### Baseline Tests Added

- `app/store/createStore.test.js`
  - Covers add, duplicate prevention, remove, and reset behavior for the Zustand store.

- `app/components/SubmitButton.test.jsx`
  - Covers default and pending render states.

- `app/components/public/Footer.test.jsx`
  - Covers the contact prompt and mailto link rendering.

- `app/(admin)/admin/players/CreatePlayer.test.jsx`
  - Covers successful create submission, payload shape, router refresh/navigation, and failed-request recovery.

- `app/(admin)/admin/players/EditPlayerModal.test.jsx`
  - Covers successful update submission, payload shape, modal close behavior, and failed-request recovery.

- `app/(admin)/admin/players/DeleteButton.test.jsx`
  - Covers delete success and error behavior, including toast and router refresh behavior.

- `app/(admin)/admin/teams/SearchComponent.test.jsx`
  - Covers player filtering from Supabase data, clearing search results, duplicate prevention, create-team payload shape, and success/error submission behavior.

- `app/(admin)/admin/events/draw/MatchReportModal.test.jsx`
  - Covers winner selector visibility, `byMidpoint` recalculation from the match date, successful mutation submission, query invalidation, modal close behavior, and failed-request recovery.

- `app/(admin)/admin/leagues/LeagueModal.test.jsx`
  - Covers create-league submission plus edit-mode update/delete flows with the direct payload contract and query invalidation on success.

- `app/(admin)/admin/events/EventModal.test.jsx`
  - Covers create-event submission plus edit-mode update/delete flows with the direct payload contract and query invalidation on success.

- `app/(admin)/admin/events/EventEntry.test.jsx`
  - Covers edit-modal opening without accidental expansion, keyboard-driven expand/collapse, registration rendering for empty draws, and shared loading/error handling across team and match queries.

- `app/(admin)/admin/events/draw/StandingsTable.test.jsx`
  - Covers core standings ordering and points calculation across match sets, midpoint bonus, all-played bonus, and challenger bonus inputs.

- `app/(admin)/admin/events/draw/MatchSingleEntry.test.jsx`
  - Covers opening the match-report modal and disabling match-report actions for withdrawn matches.

- `app/(admin)/admin/challengers/NewChallengerModal.test.jsx`
  - Covers direct-payload challenger creation, query invalidation, modal close behavior, and the unfinished-match `winner_id: null` submit path.

- `app/(admin)/admin/challengers/event_entries/ChallengerEditModal.test.jsx`
  - Covers direct-payload challenger updates, numeric field handling, query invalidation, and modal close behavior.

- `app/(admin)/admin/events/registration/PlayerSearch.test.jsx`
  - Covers event-team registration with the normalized `team_id` payload and verifies that clearing search results does not resubmit the form.

- `app/(admin)/admin/events/registration/EventRegistration.test.jsx`
  - Covers round-robin draw payload creation, draw-query invalidation, the empty registration state when no participants exist, and in-flight/failure recovery behavior for draw creation.

- `app/(admin)/admin/events/registration/ParticipantList.test.jsx`
  - Covers removing an event participant using the normalized participant payload shape, invalidating the participant list query, and disabling/recovering remove actions around failed requests.

- `app/(admin)/admin/events/draw/WithdrawalForm.test.jsx`
  - Covers withdrawing an active team, invalidating draw and participant queries, filtering out already-withdrawn teams, safely handling an empty team list, and preserving selection while recovering from failed requests.

- `app/(admin)/admin/challengers/AddChallengerModal.test.jsx`
  - Covers same-division validation, duplicate prevention, clear-search behavior, and opening the next-step challenger modal with the selected teams.

- `app/components/PublicData/LatestResults.test.jsx`
  - Covers active-league filtering, start-date sorting, empty-state behavior, and explicit error rendering.

- `app/components/PublicData/EventsPublic.test.jsx`
  - Covers alphabetical event sorting and explicit error rendering.

- `app/components/PublicData/EventEntryPublic.test.jsx`
  - Covers event expansion, standings rendering only when matches exist, and shared loading/error handling across team and match queries.

- `app/components/PublicData/LeagueCardPublic.test.jsx`
  - Covers challenger-data handoff to public events plus explicit loading and error handling for the challenger query.

- `app/components/PublicData/StandingsTablePublic.test.jsx`
  - Covers public standings ordering and totals plus toggling the individual match-results section.

- `app/components/PublicData/MatchesReportsPublic.test.jsx`
  - Covers filtering out undated matches and sorting finished, unfinished, and withdrawn results into the public display order.

- `app/components/PublicData/MatchSingleEntryPublic.test.jsx`
  - Covers midpoint-marker rendering, unfinished scheduled match markers, score hiding for placeholder values, and winner emphasis.

- `app/components/PublicData/ChallengerMatchesPublic.test.jsx`
  - Covers filtering challenger results to event teams only and rendering nothing when no related challenger matches exist.

- `app/api/players/route.test.js`
  - Covers player creation payloads, create error handling, successful GET responses, and GET error responses.

- `app/api/players/[id]/route.test.js`
  - Covers successful delete behavior, foreign-key delete error mapping, generic delete error mapping, update payloads, and update error handling.

- `app/api/teams/route.test.js`
  - Covers team GET formatting, GET error responses, team creation payloads, and normalized create error responses.

- `app/api/teams/[id]/route.test.js`
  - Covers delete behavior using `team_id`.

- `app/api/matches/route.test.js`
  - Covers match batch creation success and normalized insert failure handling.

- `app/api/matches/[id]/route.test.js`
  - Covers match update payload mapping and update error handling.

- `app/api/events/[id]/route.test.js`
  - Covers event delete behavior, event update payloads, and update error handling.

- `app/api/events/[id]/matches/route.test.js`
  - Covers missing-id validation, successful event match fetches, and fetch error handling.

- `app/api/events/[id]/teams/route.test.js`
  - Covers missing-id validation, event team formatting, normalized `team_id` registration payloads, and registration error handling.

- `app/api/events/[id]/teams/[teamID]/route.test.js`
  - Covers event team removal, withdrawal updates, and both event-team and match-update error paths.

- `app/api/leagues/[id]/events/route.test.js`
  - Covers missing-id validation, event listing by league, event creation payloads, and event creation error handling.

- `app/api/leagues/route.test.js`
  - Covers league listing, league creation payloads, and league create/fetch error handling.

- `app/api/leagues/[id]/route.test.js`
  - Covers league delete success/error behavior and direct-payload league updates.

- `app/api/challengers/[id]/route.test.js`
  - Covers challenger update payload mapping and update error handling.

- `app/api/leagues/[id]/challengers/route.test.js`
  - Covers missing-id validation, same-division validation, challenger listing, direct-payload creation, and creation error handling.

- `app/api/auth/callback/route.test.js`
  - Covers auth-code exchange plus redirect behavior, and the redirect-only path when no code is present.

- `app/api/leagues/[id]/teams/route.test.js`
  - Covers missing-id validation, league participant formatting/deduplication, and participant-query error handling.

### Current Result

- Current full validation baseline passes:
  - `npm test`: 48 test files, 129 tests
  - `npm run build`: passes
- Latest targeted runs pass:
  - TanStack Query migration slice across admin/public query consumers
  - 14 files, 37 tests

### Test Dependency Notes

- Required for the current setup:
  - `vitest`
  - `jsdom`
  - `@vitejs/plugin-react`
  - `@testing-library/react`
  - `@testing-library/jest-dom`

- Optional right now:
  - `@testing-library/user-event`
    - Useful for realistic click/type interaction tests, but not required by the current baseline suite.
  - `@testing-library/dom`
    - Not imported directly in the current tests.
    - It is commonly included explicitly in Next.js testing guidance, but it is not strictly needed for the current passing suite.

## Next Coverage Roadmap

The next goal should not be broad percentage coverage. It should be regression coverage around the most fragile behavior in the current codebase.

### First Wave: High-Value Component Tests

1. Ticket flow validation
   - Completed by removing the dead `app/(admin)/admin/ticket` stub, which had no backing API route or valid destination page.

2. CI enforcement
   - Run the Vitest suite in CI so the new regression coverage actually gates changes.

3. Focused route additions only where behavior is still untested
   - Prefer filling concrete gaps revealed by the now-expanded UI coverage rather than broad handler-by-handler expansion.

### Second Wave: Integration and Route Edges

1. Remaining route consumers of the normalized contracts
   - Focus:
     - ensure remaining admin and public views exercise the normalized route envelopes from the UI side
     - verify update/delete flows now covered only at handler level are also covered from their callers

2. TypeScript groundwork
   - Start from the highest-risk API consumers and shared data-shape utilities after the test/CI baseline is locked down.

### Third Wave: Tooling and Migration Prep

1. TypeScript groundwork
   - Consolidate config around a real `tsconfig.json`
   - Start with high-risk API consumers and shared data-shape utilities

2. Optional interaction-test ergonomics
   - Add `@testing-library/user-event` only if upcoming modal and keyboard flows become awkward with plain DOM events

### Practical Testing Principle

- Prioritize tests around business behavior and request/response contracts.
- Avoid snapshot-heavy coverage.
- Prefer a few strong tests per feature over many shallow rendering tests.
- Add shared mocks only when repetition appears; do not over-abstract the test harness too early.

## Update Log

### 2026-06-09

- Created the living findings document.
- Recorded the current stack.
- Captured the first pass of prioritized improvements.
- Logged the most obvious confirmed defects and validation limits.
- Added the recommended testing stack: Vitest plus React Testing Library for unit/component coverage, and Playwright for end-to-end coverage.
- Installed the Vitest unit/component test stack.
- Added baseline tests for the Zustand store, `SubmitButton`, and `Footer`.
- Verified the initial suite passes with 6 tests.
- Reviewed the installed test dependencies and identified which ones are required versus optional for the current setup.
- Restored the standard JetBrains ignore entries in `.idea/.gitignore` after its contents were accidentally removed.
- Updated the root `.gitignore` to ignore the entire `.idea/` folder so Rider/JetBrains local files are not tracked.
- Added player admin component tests for create, edit, and delete flows.
- Fixed the `CreatePlayer` error path so failed requests no longer reference an undefined variable and loading is reset correctly.
- Added explicit label/input associations in `CreatePlayer` to improve form accessibility and testability.
- Added regression tests for the team creation flow in `SearchComponent`.
- Fixed the clear-search control in `SearchComponent` by making it a non-submit button and clearing the filtered results explicitly.
- Added regression tests for the match reporting flow in `MatchReportModal`.
- Added route handler tests for players and teams APIs to lock down current request/response contracts and error mapping behavior.
- Added route handler tests for matches, events, event-team registration, event withdrawals, and league event creation/listing.
- Fixed the withdrawn-team route so a failure in the related match update now returns the correct `matchesError` payload instead of the prior event-team error value.
- Removed `NEXT_PUBLIC_API_BASE_URL` from same-app client fetches in the main tested admin flows and switched those calls to relative `/api/...` URLs.
- Normalized the tested player/team/event delete success responses to a consistent `{ data: { success: true } }` shape.
- Normalized `GET /api/teams` to return `{ data: [...] }` instead of a raw array and updated its current UI caller accordingly.
- Removed the unused legacy player server-action path (`actions.js` and `NewPlayer.jsx`) and cleaned the stale references around it.

### 2026-06-16

- Normalized league, event, and match single-entity update/create contracts to accept direct JSON payloads instead of wrapped `{ league }`, `{ event }`, and `{ match }` bodies.
- Normalized the tested league route error/delete responses to the standard `{ data }` / `{ error: { message } }` envelope.
- Updated the admin league, event, and match-report modals to use the direct internal API contract.
- Fixed an evident submit-handling bug in `LeagueModal` by preventing the browser form submission before running the mutation.
- Removed the stale commented `REACT_APP_SERVERURL` path from `MatchReportModal`.
- Added focused regression tests for:
  - `app/api/leagues/route.js`
  - `app/api/leagues/[id]/route.js`
  - `app/(admin)/admin/leagues/LeagueModal.jsx`
  - `app/(admin)/admin/events/EventModal.jsx`
- Updated the existing event/match route and match-report tests to assert the new direct payload contract.
- Verified the targeted contract slice passes and then reran the full Vitest suite successfully.

### 2026-06-26

- Started the package-upgrade path with a verified baseline:
  - `npm test` passes
  - `npm run build` passes
- Removed confirmed unused top-level dependencies:
  - `npm`
  - `i`
  - `encoding`
  - `next-sanity-image`
  - `@portabletext/react`
  - `@sanity/image-url`
- Fixed the local Next.js build baseline by reinstalling the workspace SWC native package after the initial `next build` failed to load the Win32 binary.
- Added a `package.json` override for `motion-dom` to `12.42.0` after the Sanity Studio build path failed on missing files inside the previously installed `motion-dom@12.33.0` package.
- Fixed the hook-order lint/build error in `app/(admin)/admin/events/draw/WithdrawalForm.jsx` by moving the mutation hook out of the conditional render path and passing the selected team id directly into the mutation.
- Fixed the current effect dependency warning in `app/(admin)/admin/teams/SearchComponent.jsx` by creating the Supabase client inside the data-loading effect and removing leftover debug logging.
- Applied the first safe same-major dependency refresh successfully for:
  - `@supabase/supabase-js`
  - `axios`
  - `sass`
  - `gsap`
  - `autoprefixer`
  - `vitest`
- Deferred `@vitejs/plugin-react` after the attempted `6.0.3` update surfaced a peer-resolution conflict in the current toolchain.
- Completed the Supabase auth migration from `@supabase/auth-helpers-nextjs` to `@supabase/ssr`.
- Added shared Supabase utilities under the new top-level `supabase/` folder for browser, server, middleware, and env/config access.
- Migrated middleware, auth/admin layouts, server-rendered admin list components, client auth/logout/search components, and all Supabase-backed route handlers onto the new SSR/browser client utilities.
- Switched the protected admin/auth layouts to validated server-side auth via `getUser()`.
- Aligned the `@/*` alias in `tsconfig.json` and `jsconfig.json`, and added the same alias to the Vitest config so the shared utilities resolve consistently in build and tests.
- Verified focused regression coverage for:
  - `app/(admin)/admin/events/draw/WithdrawalForm.test.jsx`
  - `app/(admin)/admin/teams/SearchComponent.test.jsx`
- Fixed `app/api/auth/callback/route.js` so the auth callback now returns its redirect response instead of dropping it.
- Added focused regression coverage for `app/api/auth/callback/route.js`.
- Investigated the package-upgrade path and recorded the staged dependency migration plan, current-vs-latest version snapshot, and confirmed peer/deprecation constraints.
- Normalized challenger create/update contracts to accept direct JSON payloads in:
  - `app/api/leagues/[id]/challengers/route.js`
  - `app/api/challengers/[id]/route.js`
- Normalized challenger route error responses to the standard `{ error: { message } }` envelope and removed the remaining `{ data, error }` success response from challenger creation.
- Updated `NewChallengerModal` and `ChallengerEditModal` to use the direct internal API contract.
- Fixed an evident challenger-create bug where the form attempted to convert `winner_id` to `null` via async state just before submit, causing stale data to be posted on unfinished matches.
- Fixed challenger numeric-field handling so `0` bonus values are treated as valid input rather than empty required fields.
- Removed the stale commented `REACT_APP_SERVERURL` path from the challenger edit flow.
- Corrected the challenger edit modal's initial `team2_id` state to use `match.team2_id`.
- Added focused regression tests for:
  - `app/api/challengers/[id]/route.js`
  - `app/api/leagues/[id]/challengers/route.js`
  - `app/(admin)/admin/challengers/NewChallengerModal.jsx`
  - `app/(admin)/admin/challengers/event_entries/ChallengerEditModal.jsx`
- Verified the targeted challenger suite passes and then reran the full Vitest suite successfully.
- Normalized the remaining mixed-response player/team/event-registration routes:
  - `app/api/players/route.js`
  - `app/api/players/[id]/route.js`
  - `app/api/teams/route.js`
  - `app/api/events/[id]/teams/route.js`
- Switched event-team registration to the clearer `team_id` request key and updated the admin caller accordingly.
- Fixed the clear-search control in `app/(admin)/admin/events/registration/PlayerSearch.jsx` by making it a non-submit button.
- Added focused regression coverage for `PlayerSearch` and expanded the existing player/team/event-team route tests to lock the normalized envelopes.
- Verified the targeted player/team/event-registration slice passes and then reran the full Vitest suite successfully.
- Normalized the remaining route outliers:
  - `app/api/leagues/[id]/teams/route.js`
  - `app/api/events/[id]/matches/route.js`
  - `app/api/events/[id]/teams/[teamID]/route.js`
  - `app/api/matches/route.js`
- Standardized the last raw error responses to the `{ error: { message } }` envelope and wrapped the withdrawal success response under a single `data` object.
- Added route coverage for `app/api/leagues/[id]/teams/route.js` and updated the remaining route tests to assert the normalized contracts.
- Verified the final route-normalization slice passes and then reran the full Vitest suite successfully.
- Added focused regression coverage for:
  - `app/(admin)/admin/challengers/AddChallengerModal.jsx`
  - `app/components/PublicData/LatestResults.jsx`
  - `app/components/PublicData/EventsPublic.jsx`
  - `app/components/PublicData/EventEntryPublic.jsx`
- Fixed the clear-search control in `app/(admin)/admin/challengers/AddChallengerModal.jsx` by making it a non-submit button.
- Fixed challenger duplicate-selection handling so duplicate picks are reported before same-division validation.
- Added explicit loading and error states to `app/components/PublicData/LatestResults.jsx`.
- Made `app/components/PublicData/EventEntryPublic.jsx` keyboard-accessible for expand/collapse interactions.
- Verified the targeted challenger/public component slice passes and then reran the full Vitest suite successfully.
- Expanded modal regression coverage for:
  - `app/(admin)/admin/leagues/LeagueModal.jsx`
  - `app/(admin)/admin/events/EventModal.jsx`
  - to include edit-mode update and delete flows in addition to create flows
- Added focused admin event interaction coverage for:
  - `app/(admin)/admin/events/EventEntry.jsx`
  - `app/(admin)/admin/events/draw/StandingsTable.jsx`
  - `app/(admin)/admin/events/draw/MatchSingleEntry.jsx`
- Fixed an admin event-entry bug where clicking `Edit event` also expanded the event details due to click bubbling from the header.
- Made `app/(admin)/admin/events/EventEntry.jsx` keyboard-accessible for expand/collapse interactions.
- Fixed `app/(admin)/admin/events/EventEntry.jsx` to wait for both team and match queries before rendering and to surface team-query failures with the shared error state.
- Verified the targeted admin modal/event slice passes and then reran the full Vitest suite successfully.
- Added focused public-data regression coverage for:
  - `app/components/PublicData/LeagueCardPublic.jsx`
  - `app/components/PublicData/StandingsTablePublic.jsx`
  - `app/components/PublicData/MatchesReportsPublic.jsx`
  - `app/components/PublicData/ChallengerMatchesPublic.jsx`
- Removed the unused league-participants query from `app/components/PublicData/LeagueCardPublic.jsx`.
- Fixed `app/components/PublicData/LeagueCardPublic.jsx` to wait for challenger data before rendering the nested public event tree and to surface challenger-query failures with an explicit error state.
- Made the individual-results toggle in `app/components/PublicData/StandingsTablePublic.jsx` an accessible button and removed the leftover standings debug log.
- Verified the targeted remaining public-data slice passes and then reran the full Vitest suite successfully.
- Added focused admin registration/withdrawal regression coverage for:
  - `app/(admin)/admin/events/registration/EventRegistration.jsx`
  - `app/(admin)/admin/events/registration/ParticipantList.jsx`
  - `app/(admin)/admin/events/draw/WithdrawalForm.jsx`
- Fixed `app/(admin)/admin/events/registration/ParticipantList.jsx` so the remove-team button label uses the normalized participant payload fields instead of stale lastname fields.
- Fixed `app/(admin)/admin/events/draw/WithdrawalForm.jsx` to handle an empty team list safely instead of crashing on `registeredTeams[0]`.
- Removed stale store/debug code and unused imports from the event registration seam after locking the current request/response behavior with tests.
- Verified the targeted admin draw/withdrawal slice passes and then reran the full Vitest suite successfully.
- Added focused public row-level regression coverage for:
  - `app/components/PublicData/EventEntryPublic.jsx`
  - `app/components/PublicData/MatchSingleEntryPublic.jsx`
- Fixed `app/components/PublicData/EventEntryPublic.jsx` to wait for both team and match queries before rendering and to surface team-query failures with the shared error state.
- Removed stale unused query-client, mutation, tooltip, and modal state from `app/components/PublicData/EventEntryPublic.jsx` while keeping the public interaction pattern aligned with the admin event entry.
- Verified the targeted public row-level slice passes and then reran the full Vitest suite successfully.
- Expanded the admin registration/withdrawal tests to cover in-flight and failed-request behavior for:
  - `app/(admin)/admin/events/registration/EventRegistration.jsx`
  - `app/(admin)/admin/events/registration/ParticipantList.jsx`
  - `app/(admin)/admin/events/draw/WithdrawalForm.jsx`
- Fixed `app/(admin)/admin/events/registration/EventRegistration.jsx` to disable draw creation while the batch-create request is in flight and expose a loading label.
- Fixed `app/(admin)/admin/events/draw/WithdrawalForm.jsx` to disable the withdrawal submit button while the request is in flight, preventing duplicate submissions.
- Verified the targeted admin mutation edge-case slice passes and then reran the full Vitest suite successfully.
- Removed the dead admin ticket stub under `app/(admin)/admin/ticket` because it posted to a missing `/api/tickets` route and redirected to a non-existent `/tickets` page.
- Upgraded the framework baseline to:
  - `next@15.5.19`
  - `react@18.3.1`
  - `react-dom@18.3.1`
  - `eslint-config-next@15.5.19`
- Upgraded the Sanity compatibility slice needed for Next 15 to:
  - `next-sanity@9.4.7`
  - `sanity@3.37.1`
  - `@sanity/client@6.21.2`
  - `@sanity/vision@3.37.1`
- Updated all dynamic route handlers that read `[id]` params to the Next 15 async request API style by awaiting `params` before accessing route values.
- Verified the full Vitest suite still passes on the upgraded stack:
  - `46` files
  - `126` tests
- Verified `next build` succeeds on Next 15.
- Completed the Sass deprecation cleanup by moving shared styles from `@import` to `@use` and replacing `map-get(...)` with `map.get(...)`.
- Verified the Sass warnings no longer appear in `next build`.
- Refreshed the upgrade map for the remaining lanes:
  - the contained Next 15-compatible Sanity lane
  - the later React 19 / Next 16 lane
  - the deprecated Lenis replacement path
  - separate Tailwind and `react-query` migration projects
- Completed the contained Next 15-compatible Sanity lane:
  - `next-sanity@9.12.3`
  - `sanity@3.99.0`
  - `@sanity/client@7.6.0`
  - `@sanity/vision@3.99.0`
  - `groq@3.99.0`
- Verified the full Vitest suite still passes after the Sanity upgrade:
  - `46` files
  - `126` tests
- Verified `next build` still succeeds after the Sanity upgrade.
- Removed the temporary `package.json` `engines.node` pin so local installs are not blocked while the upgrade lane continues on machines still running Node 22.
- Completed the isolated direct-package upgrade lane for:
  - `framer-motion@12.42.0`
  - `react-icons@5.6.0`
  - `react-toastify@11.1.0`
  - `zustand@5.0.14`
  - `@vercel/speed-insights@2.0.0`
  - `dotenv@17.4.2`
- Verified the full Vitest suite still passes after the isolated package lane:
  - `46` files
  - `126` tests
- Verified `next build` still succeeds after the isolated package lane.
- Replaced the deprecated scrolling wrapper `@studio-freight/react-lenis` with `lenis@1.3.25`.
- Updated the shared smooth-scroll provider, `CourtHero`, and `RotatingText` to use `lenis/react`.
- Imported the recommended Lenis stylesheet at the root layout level.
- Removed touched-file debug/comment-only Lenis code while keeping behavior aligned with the prior provider pattern.
- Added focused regression tests for:
  - `app/components/providers/SmoothScroll.test.jsx`
  - `app/components/public/CourtHero.test.jsx`
- Verified the targeted Lenis migration slice passes:
  - `2` files
  - `3` tests
- Verified the full Vitest suite still passes after the Lenis migration:
  - `48` files
  - `129` tests
- Verified `next build` still succeeds after the Lenis migration.
- Completed the `@vitejs/plugin-react` tooling bump to `6.0.3`.
- Added a `package.json` override for `@rolldown/plugin-babel@0.1.8` so npm resolves the optional rolldown/Babel peer path without pulling the conflicting Babel 8-only branch.
- Migrated the app from `react-query@3` to `@tanstack/react-query@5.101.1` and added `@tanstack/react-query-devtools@5.101.1`.
- Updated the shared query provider, the admin event/league/challenger query-mutation consumers, the public data query consumers, and the affected tests to the TanStack Query v5 imports and invalidation API.
- Converted the last positional `useQuery` call in `app/(admin)/admin/events/registration/PlayerSearch.jsx` to the v5 object form and removed touched-file commented/debug leftovers in that migration seam.
- Verified the targeted TanStack Query migration slice passes:
  - `14` files
  - `37` tests
- Verified the full Vitest suite still passes after the TanStack Query migration:
  - `48` files
  - `129` tests
- Verified `next build` still succeeds after the TanStack Query migration.
- Completed the coordinated React 19 / Next 16 / Sanity 6 migration:
  - `next@16.2.9`
  - `react@19.2.7`
  - `react-dom@19.2.7`
  - `next-sanity@13.1.1`
  - `sanity@6.2.0`
  - `@sanity/client@7.23.0`
  - `@sanity/vision@6.2.0`
  - `groq@6.2.0`
  - `eslint@9.39.4`
  - `eslint-config-next@16.2.9`
  - `styled-components@6.4.3`
- Replaced the legacy ESLint setup with the Next 16 flat-config format in `eslint.config.mjs` and updated the lint script from `next lint` to `eslint .`.
- Removed the unused `@studio-freight/hamo` dependency because its published peer range still targets React 18 and the repo does not import it.
- Moved the request interception entrypoint from `app/middleware.js` to root `proxy.js` for the Next 16 file-convention change.
- Removed deprecated `images.domains` usage from `next.config.js`.
- Updated `SubmitButton` and its test to use the stable `react-dom` `useFormStatus` API instead of `experimental_useFormStatus`.
- Fixed the new React Hooks lint error in `app/(admin)/admin/challengers/NewChallengerModal.jsx` by removing duplicated derived state and replacing the effect-driven validation with direct derived values.
- Renamed the local Sanity desk-structure helper from `sanity/structure.js` to `sanity/desk-structure.js` so Turbopack no longer confuses it with the `sanity/structure` package export.
- Removed the stale commented legacy Sanity config block while touching the Studio config.
- Verified the upgraded baseline passes:
  - `npm run lint`
  - `npm test` -> `48` files / `129` tests passed
  - `npm run build`
- Observed that `next build` now actively uses `tsconfig.json` and updated it for modern bundler resolution:
  - `moduleResolution: bundler`
  - `jsx: react-jsx`
  - added `.next/dev/types/**/*.ts` to `include`
