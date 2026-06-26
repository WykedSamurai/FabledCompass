# Document Library Setup

Run this SQL in the Supabase SQL Editor before deploying the document library.

```sql
create table if not exists public.profile_documents (
  id bigint primary key generated always as identity,
  user_id uuid not null references auth.users(id) on delete cascade,
  file_path text not null unique,
  file_name text not null,
  display_name text not null,
  mime_type text,
  size_bytes bigint,
  document_type text not null default 'resume'
    check (document_type in ('resume', 'portfolio', 'other')),
  is_active boolean not null default false,
  uploaded_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profile_documents enable row level security;

create policy "Users can view their own documents"
on public.profile_documents for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can add their own documents"
on public.profile_documents for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own documents"
on public.profile_documents for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own documents"
on public.profile_documents for delete
to authenticated
using (auth.uid() = user_id);
```

If a policy already exists, remove that policy statement before rerunning the script.
