# CampusEvents — architecture

CampusEvents is a single-page, read-only website that lists upcoming campus events. It exists as a small, realistic target system for ForgeOps root-cause analysis demos.

## Components

| Layer | Technology | Role |
|---|---|---|
| Frontend | Vite + React + TypeScript | Renders loading, error and list states |
| Data | Supabase (Postgres + PostgREST) | Stores the `events` table, anon read-only via RLS |
| Hosting | Cloudflare Pages | Builds from GitHub `main` and serves `dist` |
| Source | GitHub (public) | Commit history and diffs |
| Docs | Notion page + `docs/runbooks/` | Schema and on-call guidance |

## Data flow

Browser → `src/lib/events.ts` (`fetchEvents`) → Supabase REST API → `public.events` → JSON back to `App.tsx`, which renders `EventCard` components.

The Supabase call lives in exactly one file, `src/lib/events.ts`.

## Failure behaviour

If `fetchEvents` throws, the page shows "Unable to load events" followed by the real Supabase error message, and the full error is logged with `console.error`. There is no sample-data fallback.

## Environment variables

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Both are set in Cloudflare Pages and inlined at build time.
