# Profile Privacy Setup

Run this SQL in the Supabase SQL Editor before deploying the profile privacy controls.

```sql
alter table public.profiles
  add column if not exists profile_visibility text not null default 'private'
    check (profile_visibility in ('private', 'employers', 'public')),
  add column if not exists show_public_email boolean not null default false,
  add column if not exists show_phone boolean not null default false,
  add column if not exists show_location boolean not null default true,
  add column if not exists show_resume boolean not null default false;
```

Visibility meanings:

- `private`: visible only to the account owner.
- `employers`: available to approved employer workflows when those are added.
- `public`: available through a future public profile page.

The individual field switches control which contact and resume details may be displayed outside the private editor.
