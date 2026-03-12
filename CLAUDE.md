# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

USCIS Case Status Tracker — a replacement for CaseStatusExt.com (shutting down). Tracks USCIS immigration case statuses and provides processing timeline analytics for 8 form types across 11 service centers.

## Tech Stack

- **Next.js 16** (App Router) + TypeScript
- **Supabase** (Postgres) for database
- **Tailwind CSS v4 + shadcn/ui** for UI components
- **Recharts** for data visualization
- **Vercel** for deployment + cron jobs
- **USCIS Official API** (developer.uscis.gov) — OAuth-based, requires registration

## Commands

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
```

No test framework is configured yet.

## Architecture

### Path Aliases

`@/*` maps to `./src/*` (configured in `tsconfig.json`). Always use `@/` imports.

### Data Flow
1. **USCIS API** → `src/lib/uscis/api.ts` handles OAuth token management and case lookups
2. **Supabase** stores cases, history, and pre-aggregated daily snapshots for chart data
3. **Vercel Cron** (`/api/cron/scan`) runs every 10 minutes to scan receipt number ranges
4. **Mock mode**: Set `USE_MOCK_DATA=true` in `.env.local` to use `src/lib/uscis/mock-data.ts` instead of real API

### Supabase Client Pattern
Three client constructors in `src/lib/supabase/`:
- `createBrowserClient()` — client-side, uses anon key
- `createServerClient()` — server components/route handlers, uses anon key
- `createAdminClient()` — cron/admin operations, uses service role key (bypasses RLS)

### Key Files
- `src/lib/constants.ts` — Form types, service centers, status categories, and color mappings. Central source of truth.
- `src/lib/uscis/api.ts` — USCIS API client with OAuth token caching and mock data toggle
- `src/lib/uscis/mock-data.ts` — Deterministic mock data generators (seeded random) for all chart types
- `src/lib/uscis/receipt-numbers.ts` — Receipt number validation and parsing (3 letters + 10 digits)
- `src/app/forms/[formType]/page.tsx` — Main analytics dashboard, composes all chart components
- `src/app/cases/page.tsx` — Case lookup by receipt number

### API Routes
- `GET /api/case-status/[receiptNumber]` — Individual case lookup (proxies USCIS API, caches in Supabase)
- `GET /api/analytics/{backlog,approvals,recent-approvals,updates}` — Chart data, query params: `formType`, `serviceCenter`, `groupBy`
- `POST /api/cron/scan` — Batch scanner for data collection (protected by `CRON_SECRET`)

### Database Schema (Supabase)
Migrations in `supabase/migrations/`:
- `cases` — One row per receipt number with current status
- `case_history` — Status change log per case
- `daily_snapshots` — Pre-aggregated daily counts (form_type × service_center × receipt_block × status) for fast chart queries
- `scan_progress` — Tracks cron scanner position per (service_center, form_type)

### Styling
- **Tailwind v4**: Config is CSS-based in `src/app/globals.css` (no `tailwind.config.js`). Uses `@theme inline` and CSS custom properties.
- shadcn/ui components in `src/components/ui/` — do not modify directly
- Apple-inspired design: frosted glass nav (`.apple-nav`), custom animations (`.animate-fade-in-up`, `.animate-fade-in`), stagger delays (`.delay-1` through `.delay-8`)
- Chart status colors defined in `STATUS_COLORS` in `src/lib/constants.ts`, not in CSS

### Component Patterns
- Analytics chart components in `src/components/analytics/` — each wraps a Recharts chart in a shadcn Card
- All chart components accept typed data arrays and handle empty state
- Service center selection is URL-driven (`?center=IOE-LB`) not component state

## USCIS Domain Knowledge

- **Receipt numbers**: 13 chars — 3-letter prefix (service center) + 10-digit sequence (e.g., `MSC2390012345`)
- **Service center prefixes**: IOE, MSC, LIN, SRC, EAC, WAC, YSC
- **Receipt blocks**: First 7 chars of receipt number identify the block
- **Tracked forms**: I-485, I-765, I-140, I-130, I-131, I-751, I-129F, N-400
- **IOE caveat**: IOE-prefixed cases often lack `submittedDate` and `modifiedDate` in API responses — code must handle nulls

## Environment Variables

See `.env.example`. Required for production:
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY`
- `USCIS_CLIENT_ID` / `USCIS_CLIENT_SECRET` / `USCIS_API_ENV`
- `CRON_SECRET`
- `USE_MOCK_DATA=true` for development without API keys
