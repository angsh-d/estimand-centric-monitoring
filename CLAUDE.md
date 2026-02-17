# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Estimand-Centric Monitoring is a clinical trial monitoring intelligence platform (Saama Clinical Trial Intelligence). It centers all monitoring activities on **estimands** (per ICH E9(R1)) — the formal statistical constructs defining what a trial measures. Every signal, investigation, site dossier, and monitoring visit report is anchored to estimand health.

The app is currently a **frontend-heavy demo** with static/mock data. The Express backend is a stub with no active API routes.

## Commands

```bash
npm run dev          # Full-stack dev: Express + Vite middleware on port 5000
npm run dev:client   # Client-only Vite dev server on port 5000
npm run build        # Production build (Vite client + esbuild server)
npm run start        # Run production build
npm run check        # TypeScript type checking
npm run db:push      # Push Drizzle schema to PostgreSQL
```

No test framework is configured.

## Architecture

### Three-Layer Structure

- **`client/`** — React 19 SPA (Vite 7, TypeScript)
- **`server/`** — Express 5 (TypeScript via tsx, Drizzle ORM + PostgreSQL)
- **`shared/`** — Shared types/schema (Drizzle + Zod, currently just a `users` table)

### Frontend Stack

- **Wouter** for routing (not React Router)
- **TanStack Query v5** for server state (configured but minimally used)
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin (NOT postcss-based)
- **shadcn/ui** (New York style, neutral base color) over Radix UI primitives
- **Framer Motion** for page transitions (`AnimatePresence` with `mode="wait"`)
- **Recharts** for data visualization

### Layout Architecture

Two-level layout: `GlobalNavbar` (top bar, always visible) wraps everything. The landing page (`/`) renders without sidebar. All `/study/*` and `/sites/*` routes are wrapped in `AppShell` which provides a collapsible sidebar with role-based navigation (Lead Central Monitor vs Clinical Research Associate).

### Routing (Wouter)

```
/                                  → Landing (study selection)
/study/dashboard                   → Signal Dashboard
/study/critical-data/protocol      → Protocol Analysis
/study/critical-data/sap           → SAP Analysis
/study/critical-data/criticality   → Criticality Analysis
/study/site-dossier/:siteId        → Site Dossier
/study/investigations              → Root Cause Investigation
/study/mvr                         → MVR CoPilot
/study/data-status                 → Data Status
/study/config                      → Configuration
/sites/my-sites                    → CRA My Sites
/sites/schedule                    → CRA Schedule
```

### Data Pattern

All page data is either hardcoded as constants at the top of page files or imported from static JSON in `client/src/data/`. Key data files:
- `lineage_graph.json` — Estimand-to-CRF derivation chain (nodes/edges)
- `crf_criticality.json` — CRF field to estimand mappings with sensitivity scores
- `soa.json` — Schedule of Assessments (171KB)
- `acrf.json` — Annotated CRF data (116KB)

### Path Aliases

```
@/*       → ./client/src/*
@shared/* → ./shared/*
@assets/* → ./attached_assets/*   (Vite only)
```

### Design System

Apple-inspired greyscale aesthetic. Primary colors: `#1d1d1f`, `#6e6e73`, `#f5f5f7`. Theme tokens defined as HSL CSS custom properties in `client/src/index.css` under `@layer base :root`. Fonts: Inter (UI), JetBrains Mono (code), Source Serif 4 (editorial).

### shadcn/ui Component Addition

```bash
npx shadcn@latest add <component-name>
```

Components live in `client/src/components/ui/`. Use the `cn()` utility from `@/lib/utils` for conditional class merging (clsx + tailwind-merge).

## Domain Concepts

- **Estimand** — Central organizing concept (treatment, population, endpoint, intercurrent event strategy, summary measure)
- **Criticality Model** — Derivation chain: Estimand → Analysis Method → ADaM Variables → SDTM Domains → CRF Fields
- **Signal** — Detected data quality issue threatening estimand integrity
- **Site Dossier** — Pre-visit report aggregating signals and recommended actions per site
- **MVR (Monitoring Visit Report)** — AI-assisted post-visit documentation

## Environment

The `.env` file should contain at minimum:
```
DATABASE_URL=       # PostgreSQL connection string (for DB features)
```

Server defaults to port 5000 (configurable via `PORT` env var).

## Key Files

- `client/src/App.tsx` — Router and provider setup
- `client/src/components/layout/app-shell.tsx` — Sidebar + role context
- `client/src/components/layout/global-navbar.tsx` — Top navigation bar
- `server/index.ts` — Express entry point + middleware
- `server/routes.ts` — API route registration (stub, prefix routes with `/api`)
- `shared/schema.ts` — Drizzle schema + Zod validation types
- `attached_assets/architecture-data-platform-v4.2_*.md` — Full architecture specification