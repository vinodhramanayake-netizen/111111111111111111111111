# DesignDashboard999

A polished, dark-themed, **single-page weekly analytics dashboard** for demos and UI
prototyping. Built with **Next.js + TypeScript** and exported as a **fully static site**
(deployable to Vercel with zero configuration — no backend, no secrets, no environment
variables). All data is generated in-browser from a seeded RNG so the UI is lively yet
repeatable.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

No environment variables or secrets are required to run.

### Seeded demo data

Data is generated on the client from a fixed default seed (`1337`) so refreshes are
repeatable. Pass `?seed=2024` to vary the dataset for demos — handled entirely
client-side (no server logic).

## Scripts

| Script                 | Description                            |
| ---------------------- | -------------------------------------- |
| `npm run dev`          | Start the dev server.                  |
| `npm run build`        | Build the fully static site to `out/`. |
| `npm run lint`         | Run ESLint.                            |
| `npm run format`       | Format with Prettier.                  |
| `npm run format:check` | Check formatting without writing.      |
| `npm run typecheck`    | Type-check with `tsc --noEmit`.        |
| `npm test`             | Run unit/component tests (Vitest).     |

## Tech & conventions

- **Next.js (App Router) + React + TypeScript**, static export (`output: 'export'`).
- **Design tokens** live in `src/theme/tokens.ts` (canonical) and are mirrored as CSS
  custom properties in `src/app/globals.css`.
- **Styling:** global dark theme + CSS Modules per component.
- **Charts:** custom lightweight SVG components (no charting library).
- **Testing:** Vitest + Testing Library.
- **Quality:** ESLint + Prettier.
