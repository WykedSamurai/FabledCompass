# Unified Profile Workspace Setup

Run this SQL in the Supabase SQL Editor before testing the expanded profile workspace.

```sql
alter table public.profiles
  add column if not exists email_public text,
  add column if not exists phone text,
  add column if not exists website text,
  add column if not exists linkedin_url text,
  add column if not exists portfolio_url text,
  add column if not exists skills text,
  add column if not exists experience text,
  add column if not exists education text,
  add column if not exists resume_text text,
  add column if not exists resume_file_path text;

insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false)
on conflict (id) do nothing;

create policy "Users can upload their own resumes"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'resumes'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can read their own resumes"
on storage.objects for select
to authenticated
using (
  bucket_id = 'resumes'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can update their own resumes"
on storage.objects for update
to authenticated
using (
  bucket_id = 'resumes'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'resumes'
  and (storage.foldername(name))[1] = auth.uid()::text
);
```

If a policy already exists, remove that policy statement before rerunning the script.
