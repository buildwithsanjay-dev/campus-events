# Schema runbook — `public.events`

**Owner:** Platform team · **Last reviewed:** September 2026

This runbook documents the only table the CampusEvents frontend reads. If the events list fails to load, start here before touching the database.

## Table: `public.events`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | Primary key, defaults to `gen_random_uuid()` |
| `title` | `text` | Required. Event name shown on the card |
| `venue` | `text` | Required. Location on campus |
| `starts_at` | `timestamptz` | Required. Event start time, stored in UTC |
| `seats_left` | `integer` | Defaults to 0 |
| `is_published` | `boolean` | Defaults to true. Drives the public read policy |
| `created_at` | `timestamptz` | Defaults to `now()` |

## Naming convention

The start time column is named `starts_at` (snake_case). The frontend selects it by that exact name in `src/lib/events.ts`. Postgres folds unquoted identifiers to lowercase, so a camelCase name such as `startTime` will not match and PostgREST returns `column events.startTime does not exist`.

## Row level security

RLS is enabled. The `anon` role may `select` only rows where `is_published = true`. There are no insert, update or delete policies; the site is read-only.

## Quick checks

1. In the Supabase SQL editor run `select column_name from information_schema.columns where table_name = 'events';`
2. Compare the list with the `.select(...)` call in `src/lib/events.ts`.
3. If they differ, the frontend is wrong, not the database. Do not rename columns to match a bad commit.
