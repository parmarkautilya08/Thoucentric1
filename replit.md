# Industry Research Pod — Thoucentric FMCG Intelligence Platform (v3.0)

## Overview

Bloomberg × McKinsey × Consulting BD Engine. Full-stack consulting intelligence platform for FMCG research using the SHEI framework (Signal → Hypothesis → Evidence → Implication). Built for Thoucentric consultants. Upgraded to Master Prompt v3.0 with 4-agent multi-agent OS, mandatory 9-section output, trajectory memory, contradiction detection, and scope classification.

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

## Database Schema (v3.0)

Five tables: `companies`, `shei_cards`, `signals`, `benchmarks`, `playbook_sections`

### v3.0 Schema Fields

**signals**: scope (COMPANY_SPECIFIC/INDUSTRY_WIDE/MACRO), pastState (history string), trajectoryDir (IMPROVING/DETERIORATING/STABLE), action (ACT_NOW/INVESTIGATE/MONITOR)

**shei_cards**: contradictions, kpiLinkage, signalCluster, trajectoryContext (full trajectory narrative)

**benchmarks**: calculationLogic (exact formula for consulting use)

**playbook_sections**: triggerSignals (signal pattern descriptions that trigger each playbook)

### Seed Data

- 15 FMCG companies: HUL, ITC, Nestlé India, Dabur, Marico, Godrej CP, Britannia, Emami, Tata Consumer, Colgate India, Reckitt India, Mondelez India + global: Unilever, P&G, Nestlé Global
- 7 SHEI cards: all with full v3.0 fields (contradictions, kpiLinkage, signalCluster, trajectoryContext)
- 15 KPI benchmarks: all with calculationLogic, unit, companyExamples, whyItMatters, consultingAngle
- 15 signals: all with scope, pastState, trajectoryDir, action, eventType, financialImpact
- 5 playbooks: all with triggerSignals, industry landscape, failure modes, tech enablers

**Admin endpoint:** `POST /api/admin/reseed` — force re-seeds all data

## Pages

- `/` — Dashboard with real-time stats, recent signals, active hypotheses
- `/companies` — 15-company grid with search/filter; `/companies/:id` detail
- `/shei-cards` — SHEI hypothesis cards list; `/shei-cards/:id` full detail with Trajectory, Contradictions, KPI Linkage, Signal Cluster panels
- `/signals` — Signal tracker with Action/Strength/Category/Scope filters; trajectory arrows with past-state history; financial impact boxes
- `/benchmarks` — KPI benchmarks grouped by function (15 KPIs) with calculationLogic drill-down
- `/playbooks` — Playbook sections with triggerSignals, industry landscape, failure modes, tech enablers

## AI Engine (v3.0)

- `artifacts/api-server/src/routes/ask.ts` — 4-agent multi-agent OS
- Mandatory 9-section output: SIGNALS DECODED / HYPOTHESIS / EVIDENCE / CONTRADICTIONS / TRAJECTORY / CLIENT IMPLICATIONS / THOUCENTRIC ANGLES / FINANCIAL IMPACT / PROVOKING QUESTIONS
- Reasoning pipeline STEP 1-6: intelligence gathering, contradiction detection, trajectory analysis, SHEI framework, consulting BD, output generation
- Urgency values: IMMEDIATE / MEDIUM_TERM / STRUCTURAL
- Signal action values: ACT_NOW / INVESTIGATE / MONITOR
- Scope values: COMPANY_SPECIFIC / INDUSTRY_WIDE / MACRO
- Trajectory values: IMPROVING / DETERIORATING / STABLE

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
- SHEI urgency uses IMMEDIATE/MEDIUM_TERM/STRUCTURAL — do NOT change to CRITICAL/HIGH/MEDIUM
