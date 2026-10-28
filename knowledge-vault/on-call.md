# On-call guide — the events list does not load

**Owner:** Platform team · **Last reviewed:** October 2026

Work through this in order. Most incidents on this service are resolved at step 2.

## 0. Confirm the symptom

Open the live URL. A healthy page shows five or more event cards. A broken page shows the alert box:

```
Unable to load events
Could not load events: <message from Supabase>
```

**Write down the exact message.** It decides which branch of this guide you follow. Also open the
browser console — the full error object is logged there.

## 1. Was anything deployed recently?

Check Cloudflare Pages → the project → Deployments. If a deployment finished shortly before the
first report, treat that deployment's commit as the prime suspect and go to step 2.

If the newest deployment failed, the live site is still serving the previous build; read the build
log for the failing step.

## 2. Does the frontend still match the schema?

This is the most common cause.

- The message `column events.<something> does not exist` means the frontend asked PostgREST for a
  column that is not in the table.
- The only place the frontend names columns is **`src/lib/events.ts`**, in the `.select(...)` call.
- Compare those names against `schema.md`. The table uses **snake_case**: `starts_at`, `seats_left`,
  `is_published`. A camelCase name such as `startTime` or `seatsLeft` is always a bug.
- Find the commit that changed that line (`git log -p src/lib/events.ts`) and revert it.

## 3. Is it an authentication failure?

A message mentioning `JWT`, `apikey`, `401` or `Invalid API key` usually means the anonymous key did
not reach the browser.

- Cloudflare Pages → Settings → Environment variables must contain **`VITE_SUPABASE_URL`** and
  **`VITE_SUPABASE_ANON_KEY`**, spelled exactly like that.
- Vite only embeds variables whose names begin with `VITE_`, and only at build time. Adding a
  variable is not enough — the site must be **redeployed** afterwards.

## 4. Is it a permission failure?

An empty list with no error, or a message about row-level security, points at the read policy. The
anonymous role may select rows from `public.events` only where `is_published = true`. Check that the
policy still exists and that the rows you expect have `is_published = true`.

## 5. Is Supabase itself healthy?

Check the Supabase dashboard for the project. A paused project — free projects pause after about a
week of inactivity — makes every request fail. Restoring it takes a few minutes.

## Escalation

If none of the above explains it, collect: the exact error text, the current deployment id and
commit, the output of `select * from public.events limit 1;`, and the last three deployments. Post
them in the team channel before changing anything else.
