create table public.events (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  venue        text not null,
  starts_at    timestamptz not null,
  seats_left   integer not null default 0,
  is_published boolean not null default true,
  created_at   timestamptz not null default now()
);

alter table public.events enable row level security;

create policy "public read published events"
  on public.events for select
  to anon
  using (is_published = true);

insert into public.events (title, venue, starts_at, seats_left) values
  ('AI & Data Science Symposium', 'Main Auditorium',  now() + interval '3 days',  120),
  ('Hackathon Kickoff',           'Innovation Lab',   now() + interval '7 days',   60),
  ('Robotics Workshop',           'Mechanical Block', now() + interval '10 days',  35),
  ('Alumni Tech Talk',            'Seminar Hall 2',   now() + interval '14 days',  90),
  ('Open Source Day',             'Library Lawn',     now() + interval '21 days', 200);
