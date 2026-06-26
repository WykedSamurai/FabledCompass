# Supabase Authentication Setup

## Authentication settings

In Supabase Authentication settings:

1. Enable Email authentication.
2. Set the Site URL to the production Fabled Compass URL.
3. Add the Vercel preview URL pattern to the allowed redirect URLs when testing previews.
4. Keep email confirmation enabled for production.

## Profile table

Run this in the Supabase SQL Editor:

```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  account_type text not null default 'job_seeker',
  display_name text,
  headline text,
  location text,
  about text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles can be viewed"
on public.profiles for select
to anon, authenticated
using (true);

create policy "Users can create their profile"
on public.profiles for insert
to authenticated
with check (auth.uid() = id);

create policy "Users can update their profile"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);
```

The application creates or updates a profile row only for the signed-in user. Row Level Security prevents users from changing another account's profile.
