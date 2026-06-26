# Scenario Result Database Setup

Run the following SQL in the Supabase SQL Editor after creating the `profiles` table.

```sql
create table public.scenario_attempts (
  id bigint primary key generated always as identity,
  user_id uuid not null references auth.users(id) on delete cascade,
  scenario_slug text not null,
  scenario_version integer not null default 1,
  overall_score integer not null check (overall_score between 0 and 100),
  communication_score integer not null check (communication_score between 0 and 100),
  professionalism_score integer not null check (professionalism_score between 0 and 100),
  empathy_score integer not null check (empathy_score between 0 and 100),
  conflict_resolution_score integer not null check (conflict_resolution_score between 0 and 100),
  policy_awareness_score integer not null check (policy_awareness_score between 0 and 100),
  passed boolean not null,
  automatic_fail boolean not null default false,
  completed_at timestamptz not null default now()
);

create table public.user_badges (
  id bigint primary key generated always as identity,
  user_id uuid not null references auth.users(id) on delete cascade,
  badge_slug text not null,
  badge_name text not null,
  source_scenario text not null,
  badge_version integer not null default 1,
  earned_at timestamptz not null default now(),
  unique (user_id, badge_slug, badge_version)
);

alter table public.scenario_attempts enable row level security;
alter table public.user_badges enable row level security;

create policy "Users can read their scenario attempts"
on public.scenario_attempts for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can save their scenario attempts"
on public.scenario_attempts for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Badges can be viewed"
on public.user_badges for select
to anon, authenticated
using (true);

create policy "Users can earn their own badges"
on public.user_badges for insert
to authenticated
with check (auth.uid() = user_id);
```

The application records every completed attempt for the signed-in user. A passing result also inserts the Customer Service Foundations badge. The unique badge constraint prevents duplicate copies of the same badge version.
