# Scenario Badge Setup

Run in the Supabase SQL Editor:

```sql
create table if not exists public.scenario_badges (
  id bigint primary key generated always as identity,
  scenario_slug text not null,
  badge_slug text not null,
  badge_name text not null,
  badge_description text not null,
  badge_icon text not null,
  badge_color text not null,
  skills_demonstrated text[] not null default '{}',
  version integer not null default 1,
  created_at timestamptz not null default now(),
  unique (badge_slug, version),
  unique (scenario_slug, version)
);

alter table public.scenario_badges enable row level security;

drop policy if exists "Badge definitions are publicly readable" on public.scenario_badges;
create policy "Badge definitions are publicly readable"
on public.scenario_badges for select
to anon, authenticated
using (true);

insert into public.scenario_badges (
  scenario_slug, badge_slug, badge_name, badge_description,
  badge_icon, badge_color, skills_demonstrated, version
)
values (
  'difficult-customer',
  'customer-recovery',
  'Customer Recovery',
  'Earned by successfully resolving an escalated customer complaint while demonstrating empathy, professionalism, communication, conflict resolution, and policy awareness.',
  'speech-shield',
  'bronze-navy',
  array['Communication','Professionalism','Empathy','Conflict Resolution','Policy Awareness'],
  1
)
on conflict (badge_slug, version) do update set
  badge_name = excluded.badge_name,
  badge_description = excluded.badge_description,
  badge_icon = excluded.badge_icon,
  badge_color = excluded.badge_color,
  skills_demonstrated = excluded.skills_demonstrated;

alter table public.user_badges
  add column if not exists badge_definition_id bigint references public.scenario_badges(id),
  add column if not exists attempt_id bigint references public.scenario_attempts(id) on delete set null,
  add column if not exists overall_score integer check (overall_score between 0 and 100);

update public.user_badges ub
set badge_definition_id = sb.id,
    badge_slug = sb.badge_slug,
    badge_name = sb.badge_name,
    source_scenario = 'The Difficult Customer'
from public.scenario_badges sb
where sb.scenario_slug = 'difficult-customer'
  and sb.version = 1
  and ub.source_scenario = 'The Difficult Customer';
```
