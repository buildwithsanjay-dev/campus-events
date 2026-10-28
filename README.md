# CampusEvents

A public events board for the college: one page, the next five events, read live from Supabase and
served from Cloudflare Pages.

## Architecture in one picture

```
  GitHub (campus-events)
        │  push to main
        ▼
  Cloudflare Pages ──── runs `npm run build` → serves /dist
        │
        ▼
  browser ──── supabase-js ────► Supabase PostgREST ────► public.events
                                  (row-level security: is_published = true)
```

There is no server of our own. The browser talks to Supabase directly with the anonymous key, so a
schema change can break the site with no backend involved.

## Repository layout

| Path | What it is |
|---|---|
| `src/lib/events.ts` | **The only place database columns are named** — the `.select(...)` call |
| `src/App.tsx` | Loading, error and list states; the error box shows the real Supabase message |
| `src/components/EventCard.tsx` | One event card |
| `supabase/schema.sql` | Table, row-level security policy and five seed rows |
| `knowledge-vault/` | Team knowledge: schema, deploy, on-call guide, past incidents |
| `docs/` | Architecture note and the Notion page content |
| `.env.example` | The two variables the app needs |

## Local setup

```bash
npm install
cp .env.example .env        # fill in the two values from your Supabase project
npm run dev                 # http://localhost:5173
```

`.env` is git-ignored and must stay that way.

## Supabase setup

1. Create a **new** Supabase project (do not reuse another project's database).
2. SQL editor → paste `supabase/schema.sql` → run. It creates `public.events`, enables row-level
   security, adds a read policy for the anonymous role, and inserts five events.
3. Project Settings → API → copy the **Project URL** and the **anon public key** into `.env`.

## Deploying to Cloudflare Pages

1. Push this repository to GitHub.
2. Cloudflare dashboard → Workers & Pages → Create → Pages → **Connect to Git** → select the repo.
3. Build command `npm run build`, output directory `dist`.
4. Settings → Environment variables → add **both**, for Production and Preview:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy, then open the live URL. Five event cards should appear.

> Vite embeds `VITE_*` variables **at build time**. Adding or renaming one requires a redeploy — see
> `knowledge-vault/incident-2026-10-missing-env-var.md`, which is exactly that mistake.

## The schema contract

The table uses **snake_case** throughout:

| Column | Type |
|---|---|
| `id` | `uuid` |
| `title` | `text` |
| `venue` | `text` |
| `starts_at` | `timestamptz` |
| `seats_left` | `integer` |
| `is_published` | `boolean` |
| `created_at` | `timestamptz` |

`src/lib/events.ts` must name these exactly. A camelCase name such as `startTime` is always a bug:
PostgREST answers `column events.startTime does not exist` and the whole list fails.

## Pushing to GitHub

This folder already has a commit history.

```bash
git remote add origin https://github.com/<you>/campus-events.git
git branch -M main
git push -u origin main
```

## Health check

The site is healthy when the live URL lists five events with venues and seat counts, the browser
console is clean, and the newest Cloudflare deployment matches the newest commit on `main`.

## Related

This site is also the test subject for [ForgeOps](https://github.com/sanjaypc-github/Forgeops), a
multi-agent root-cause analysis platform. ForgeOps connects to this repository, its Supabase project,
its Cloudflare Pages project and the `knowledge-vault/` folder, and is measured on whether it can
diagnose faults here from evidence alone.
