# Industry Research Pod — Thoucentric FMCG Intelligence Platform

## Overview

Full-stack consulting intelligence platform for FMCG research using the SHEI framework (Signal → Hypothesis → Evidence → Implication). Built for Thoucentric consultants.

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (port 3000, previewPath `/`)
- **API framework**: Express 5 (port 8080)
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec → React Query hooks)
- **Build**: esbuild (CJS bundle)

## Artifacts

- `artifacts/research-pod` — React+Vite frontend (port 3000, `previewPath /`)
- `artifacts/api-server` — Express API server (port 8080)
- `artifacts/mockup-sandbox` — Design mockup sandbox (port 8081)

## Packages

- `lib/db` — Drizzle ORM schema and database client
- `lib/api-spec` — OpenAPI spec (`openapi.yaml` source of truth)
- `lib/api-zod` — Generated Zod schemas (Orval output, only exports `./generated/api`)
- `lib/api-client-react` — Generated React Query hooks (Orval output)

## Database Schema

Five tables: `companies`, `shei_cards`, `signals`, `benchmarks`, `playbooks`

Seed data: 8 FMCG companies (HUL, Unilever, P&G, Nestlé, ITC, Dabur, Marico, Godrej CP), 3 SHEI cards, 10 signals, 11 benchmarks, 5 playbook sections.

## Pages

- `/` — Dashboard with real-time stats, recent signals, active hypotheses
- `/companies` — Company grid with search/filter; `/companies/:id` detail
- `/shei-cards` — SHEI hypothesis cards with status/urgency filters; `/shei-cards/:id` detail
- `/signals` — Signal tracker with strength/source filters
- `/benchmarks` — KPI benchmarks grouped by category with min/median/max
- `/playbooks` — Accordion playbook sections with questions, data points, red flags

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Important Notes

- `lib/api-zod/src/index.ts` must ONLY export `./generated/api` (NOT `./generated/types`) — Orval generates both inline Zod schemas and TS types with the same names, causing duplicate export errors
- API routes mounted at `/api` prefix in `app.ts`
- Seed runs automatically on startup (idempotent — checks for existing data)
- Port 24993 was originally assigned to research-pod but is not a supported workflow port; changed to port 3000
