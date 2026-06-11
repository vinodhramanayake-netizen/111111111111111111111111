# CLAUDE.md

Guidance for working in this repository.

## Project

**DesignDashboard999** — a single-page, dark-themed **weekly analytics dashboard** for
demos. Front-end only: no backend, no auth, no API calls, no secrets/env vars. All data is
generated in-browser from a **seeded RNG** so the UI is lively but repeatable. Ships as a
**fully static Next.js export** deployable to Vercel.

## Tech stack

- **Next.js 15 (App Router) + React 18 + TypeScript** — static export (`output: 'export'`).
- **Vitest 4** + Testing Library + jsdom for tests.
- **ESLint** (`next/core-web-vitals` + TS + prettier) + **Prettier**.
- **Charts:** custom lightweight **SVG** components — no charting library (bundle budget).

## Commands

```bash
npm run dev          # dev server (http://localhost:3000)
npm run build        # static export -> out/
npm run lint         # ESLint
npm run format       # Prettier write   (format:check to verify only)
npm run typecheck    # tsc --noEmit
npm test             # Vitest (test:watch for watch mode)
```

Before committing, ensure all pass: `typecheck`, `lint`, `format:check`, `test`, `build`.

## Layout

```
src/app/layout.tsx       Root layout: <html dark>, Inter font, globals import
src/app/page.tsx         Single dashboard route (no nav/sidebar)
src/app/globals.css      Dark theme + design tokens as CSS custom properties
src/theme/tokens.ts      CANONICAL design tokens (colors/spacing/typography/radii/motion)
next.config.mjs          output:'export', images.unoptimized, trailingSlash
```

Path alias: `@/*` -> `src/*`.

## Conventions & constraints

- **Design tokens are centralized.** `src/theme/tokens.ts` is the single source of truth
  (raw values for SVG/chart math). `globals.css` mirrors them as CSS variables for CSS
  Modules. Change a value in `tokens.ts` first, then sync the CSS var. **No hardcoded
  colors/spacing scattered in components.**
- **Styling:** global dark theme + **CSS Modules** per component (`*.module.css`).
- **Seeded data:** one module is the single source of truth for all widgets; generated
  once per load, shared across widgets. Default seed `1337`; optional `?seed=` override.
- **Static export limits:** no server runtime. Seed/query-param handling and data
  generation must run **client-side after mount** to avoid hydration mismatch (no
  hydration warnings allowed). No `process.env` usage required to run.
- **Accessibility:** semantic HTML, keyboard operability, visible focus
  (`:focus-visible` is styled globally), ARIA labels on non-text chart/gauge elements,
  WCAG 2.1 AA contrast on the dark surfaces.
- **Performance:** keep First Load JS well under 300 KB; memoize expensive computations;
  subtle animations (respect `prefers-reduced-motion`).
- **Tests:** unit-test data generation + formatting helpers (dates, deltas, relative
  time); component-test critical widgets (render/empty/responsive states).

## Theme palette (see tokens.ts)

Deep background `#0b1120`, navy surfaces `#111a2e`/`#16213a`. Accents: blue `#3b82f6`
(primary / "Received"), cyan `#22d3ee` (tag bars), amber `#f59e0b` (warn / "Solved"),
green `#22c55e` (positive / healthy), red `#ef4444` (alert / high-risk).

## Notes

- Pinned Next 15 / React 18 (not 16/19) for static-export + testing stability.
- Vitest 4 prints cosmetic rolldown deprecation warnings during tests — harmless.
- Remaining `npm audit` items are dev/build-chain moderates (esbuild/vite/postcss), not in
  the shipped bundle; 0 critical / 0 high.
