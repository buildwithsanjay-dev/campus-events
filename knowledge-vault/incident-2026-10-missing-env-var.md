# Incident, 7 October 2026 — every request unauthorised after a rename

**Severity:** high (site unusable) · **Duration:** 41 minutes · **Author:** Platform team

## Summary

A commit renamed the Supabase key variable in `src/lib/events.ts` from `VITE_SUPABASE_ANON_KEY` to
`VITE_SUPABASE_KEY`. The Cloudflare Pages project still defined the old name, so the renamed variable
was `undefined` at build time. The bundle shipped with no key, Supabase rejected every request, and
the events list showed an authentication error for all visitors.

## Timeline

| Time (IST) | Event |
|---|---|
| 14:02 | Commit `b7c1e04` "chore: shorten env var names" pushed to `main` |
| 14:05 | Cloudflare Pages deployment `a41f` succeeded — **the build did not fail** |
| 14:11 | First student report: "the events page says something about an API key" |
| 14:19 | On call confirmed the live URL showed `Invalid API key` |
| 14:28 | Cloudflare deployment history pointed at `b7c1e04`; the diff showed the rename |
| 14:36 | Variable `VITE_SUPABASE_KEY` added in Pages settings and the site redeployed |
| 14:43 | Events list healthy again |

## Root cause

Vite replaces `import.meta.env.VITE_*` at **build** time. A variable that does not exist becomes
`undefined` silently — there is no build error and no runtime warning until Supabase rejects the
request. Renaming the variable in code without renaming it in Cloudflare Pages broke that contract.

## What made it slow to find

- The build was green, so the deployment looked healthy.
- Nobody checked the deployment history first; the first twenty minutes went on the database.
- The error message mentioned the API key, but the cause was a commit, not Supabase.

## Lessons

1. **A green build does not mean a correct deployment.** Environment variables are a separate system
   from the code that reads them.
2. **Start at the most recent deployment.** The commit that shipped just before the first report is
   the prime suspect, whatever the error message says.
3. **Keep variable names fixed.** `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are a contract
   between the repository and the Pages project. Renaming either needs both changed in the same hour.

## Actions taken

- Both variable names documented in `deploy.md` as a contract.
- `on-call.md` step 3 added, describing exactly this failure.
