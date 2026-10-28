# Deploy runbook — Cloudflare Pages

**Owner:** Platform team · **Last reviewed:** September 2026

CampusEvents is a static Vite build hosted on Cloudflare Pages. There is no manual deploy step; every push to GitHub produces a deployment.

## How a change reaches production

1. A commit is pushed to `main` on the public GitHub repository.
2. Cloudflare Pages receives the webhook and starts a build.
3. The build runs `npm run build` (which is `tsc -b && vite build`) and publishes the `dist` directory.
4. The new deployment becomes the production URL within about a minute.
5. Pushes to other branches create preview deployments with their own URLs.

## Settings

- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Environment variables:** `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, set in the Pages project settings under Variables and Secrets.

Vite inlines `VITE_*` variables at build time. After changing a variable you must trigger a new build; the existing deployment keeps the old value.

## Rolling back

In the Cloudflare dashboard open the Pages project, go to Deployments, pick the last healthy deployment and choose Rollback. Then revert the offending commit in GitHub so the next push does not redeploy the problem.

## Reading a failure

A green build does not mean a healthy site. TypeScript cannot see database column names, so a bad `.select(...)` string builds fine and fails only at runtime in the browser. Always compare the deployment time with the time the errors began.
