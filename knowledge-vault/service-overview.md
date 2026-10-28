# CampusEvents — service overview

**Owner:** Platform team · **On call:** rotating weekly · **Last reviewed:** October 2026

## What it is

CampusEvents is the public events board for the college. It shows the next few events — title, venue,
start time and seats remaining — on one page, with no sign-in. Students open it from a QR code on
noticeboards, so most traffic is mobile and arrives in bursts around announcements.

## How it is built

| Part | Technology | Notes |
|---|---|---|
| Frontend | Vite + React + TypeScript | A single page; no router, no state library |
| Data | Supabase (PostgreSQL + PostgREST) | One table, `public.events`, read through the anon key |
| Hosting | Cloudflare Pages | Deploys automatically on every push to `main` |
| Source | GitHub, `campus-events` | Small history; every change is one commit |

## The request path

```
browser → Cloudflare Pages (static assets)
        → supabase-js in the browser
        → Supabase PostgREST  → public.events  (row-level security: is_published = true)
```

There is **no backend of our own**. The browser talks to Supabase directly with the anonymous key,
which is why a schema change can break the site without any server being involved.

## Where failures come from

In order of how often they have actually happened:

1. **A frontend change that no longer matches the database schema.** The most common cause by far.
   The browser asks PostgREST for a column that does not exist and the whole list fails.
2. **A missing or renamed environment variable in Cloudflare Pages.** The build succeeds, the key is
   `undefined`, and every request comes back unauthorised.
3. **A row-level security policy change** that stops the anonymous role reading published rows.
4. **A failed or stale deployment**, where the live site is an older build than `main`.

## What the site does when it fails

The page shows the real error message from Supabase inside an alert box, for example:

```
Unable to load events
Could not load events: column events.<name> does not exist
```

This is deliberate. The message names the column or the permission that failed, which is usually
enough to identify the commit that caused it. Do not replace it with a generic apology.

## Related documents

- `schema.md` — the `events` table, column by column, and the naming convention
- `deploy.md` — how a commit reaches the live URL, and the environment variables Pages needs
- `on-call.md` — what to check first when the list does not load
- `incident-2026-09-site-blank.md` — a past outage with the same shape
