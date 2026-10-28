# CampusEvents — architecture and schema

*(Copy this into a new Notion page with exactly this title, then share it with your ForgeOps Notion integration.)*

## About

CampusEvents is a single-page, read-only public website that lists upcoming campus events. It is built with Vite, React and TypeScript, reads live from a Supabase Postgres table through the anon key, and is deployed on Cloudflare Pages from the `main` branch of a public GitHub repository.

## Table: events

| Column | Type |
|---|---|
| id | uuid (primary key) |
| title | text |
| venue | text |
| starts_at | timestamptz |
| seats_left | integer |
| is_published | boolean |
| created_at | timestamptz |

The start time column is named `starts_at` (snake_case).

## Deployment

The site is deployed on Cloudflare Pages from main.

## On call

If the events list fails to load, check the most recent commit to `src/lib/events.ts` and compare the selected columns against the schema.
