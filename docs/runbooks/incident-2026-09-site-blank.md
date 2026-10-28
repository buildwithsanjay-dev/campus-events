# Incident 2026-09 — events page rendered blank

**Severity:** Minor · **Duration:** about 25 minutes · **Status:** Resolved

## Summary

On a Tuesday afternoon the public events page loaded but showed an empty area under the heading. Students reported it in the campus channel. No error was visible on the page.

## Timeline

- 14:05 — A refactor of `App.tsx` was merged and deployed to Cloudflare Pages.
- 14:12 — First report of a blank page.
- 14:20 — On-call opened the browser console and found an uncaught promise rejection from `fetchEvents`.
- 14:30 — Fix deployed: the component was rendering the list before data arrived and the error was being swallowed.

## Root cause

The refactor removed the `catch` handler, so a failed request left the component in its loading state forever with nothing displayed.

## What we changed

- The page now always shows an explicit "Unable to load events" state with the real error message from Supabase.
- The full error object is written with `console.error`.
- We agreed never to fall back to sample data, because it hides real failures.

## Lessons

- Start from the most recent commit and the most recent deployment; they were within seven minutes of the first report.
- Check the browser console before the database. The database was healthy the whole time.
- Keep the runbooks current. The schema runbook would have shortened triage had it been linked from the on-call page.
