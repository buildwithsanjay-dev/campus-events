# Deploy runbook — Cloudflare Workers

**Owner:** Platform team · **Last reviewed:** October 2026

CampusEvents is a static Vite build served by Cloudflare Workers Static Assets. There is no manual deploy step; every push to GitHub produces a deployment.

## How a change reaches production

1. A commit is pushed to `main` on the public GitHub repository.
2. Cloudflare Workers Builds receives the webhook and starts a build.
3. The build runs `npm run build` (which is `tsc -b && vite build`) and writes the `dist` directory.
4. The deploy step runs `npx wrangler deploy`, which uploads `dist` as the Worker's static assets.
5. The new version becomes the production URL within about a minute.
6. Pushes to other branches create preview deployments with their own URLs.

## Settings

- **Build command:** `npm run build`
- **Deploy command:** `npx wrangler deploy`
- **Assets directory:** `dist`, declared in `wrangler.jsonc` at the repository root
- **Environment variables:** `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, set under **Settings - Build - Build variables and secrets**.

Vite inlines `VITE_*` variables at build time. After changing a variable you must trigger a new build; the existing deployment keeps the old value.

These must be **build** variables, not the Worker's runtime Variables and Secrets. The two sections look alike in the dashboard, but a static-assets Worker runs no code of its own, so a runtime variable is never read by anything. A variable put in the wrong section leaves `import.meta.env.VITE_SUPABASE_URL` as an empty string in the bundle, `createClient` throws `supabaseUrl is required` before React mounts, and the page renders as a styled but empty background with the error visible only in the browser console.

`VITE_SUPABASE_URL` is the project URL, `https://<project-ref>.supabase.co`. It is never the `postgresql://` connection string: `VITE_*` values are compiled into the public JavaScript bundle, so pasting the connection string there publishes the database password.

`wrangler.jsonc` must stay in the repository. Without it, `wrangler deploy` tries to detect the framework itself and fails with *"The version of Vite used in the project cannot be automatically configured"*, because that detection requires Vite 6 or newer and this project is on Vite 5. The build succeeds and only the deploy step fails, so the site keeps serving the previous version.

## Rolling back

In the Cloudflare dashboard open the Worker, go to Deployments, pick the last healthy version and roll back to it. Then revert the offending commit in GitHub so the next push does not redeploy the problem.

## Reading a failure

A green build does not mean a healthy site. TypeScript cannot see database column names, so a bad `.select(...)` string builds fine and fails only at runtime in the browser. Always compare the deployment time with the time the errors began.
