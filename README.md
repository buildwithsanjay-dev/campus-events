# CampusEvents

A tiny read-only campus events website. It is the demo target for ForgeOps (multi-agent root-cause analysis): it connects to GitHub, Supabase, Cloudflare Pages and Notion so a deliberate bug leaves evidence in all four.

Stack: Vite + React + TypeScript, Supabase, Cloudflare Pages.

## Run locally

```bash
npm install
cp .env.example .env        # fill in your Supabase URL and anon key
npm run dev
```

## Setup checklist

1. **Supabase** — create a NEW project (not the ForgeOps one). Run `supabase/schema.sql` in the SQL editor. Copy the Project URL and anon public key from Project Settings → API.
2. **GitHub** — create a public repo `campus-events` and push this folder (see below).
3. **Cloudflare** — Workers & Pages → Create → Pages → Connect to Git → pick the repo. Build command `npm run build`, output `dist`. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under Variables. Deploy.
4. **Notion** — create a page titled "CampusEvents — architecture and schema" from `docs/notion-page.md` and share it with your ForgeOps integration.
5. **Runbooks** — point the ForgeOps knowledge vault at `docs/runbooks/`.
6. Confirm the live URL shows five events, then connect all connectors in ForgeOps and run a baseline investigation.

## Push to GitHub

This folder already contains a git history with several commits.

```bash
git remote add origin https://github.com/<you>/campus-events.git
git branch -M main
git push -u origin main
```

Make a couple of small pushes afterwards so Cloudflare has at least three successful deployments.

## Fault injection (only after the baseline investigation)

Edit `src/lib/events.ts` and change the `.select(...)` line:

```diff
-    .select("id, title, venue, starts_at, seats_left")
+    .select("id, title, venue, startTime, seats_left")
```

Commit with the message `refactor: align event field naming with the new API style guide` and push to `main`. The live site will show `Could not load events: column events.startTime does not exist`.

Reserve fault: rename `VITE_SUPABASE_ANON_KEY` to `VITE_SUPABASE_KEY` in `src/lib/events.ts`.

## Layout

```
src/lib/events.ts        the single data call
src/components/EventCard.tsx
src/App.tsx              loading / error / list states
docs/runbooks/           schema, deploy, past incident
docs/architecture.md
docs/notion-page.md      content for the Notion page
supabase/schema.sql
```
