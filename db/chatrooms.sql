create extension if not exists pgcrypto;

create table if not exists public.chat_rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  focus text,
  cadence text default 'Open discussion',
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.chat_room_memberships (
  room_id uuid not null references public.chat_rooms(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (room_id, user_id)
);

create table if not exists public.chat_room_messages (
  id bigint generated always as identity primary key,
  room_id uuid not null references public.chat_rooms(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_chat_room_memberships_user on public.chat_room_memberships(user_id);
create index if not exists idx_chat_room_messages_room_created on public.chat_room_messages(room_id, created_at);

alter table public.chat_rooms enable row level security;
alter table public.chat_room_memberships enable row level security;
alter table public.chat_room_messages enable row level security;

drop policy if exists "chat_rooms_select_authenticated" on public.chat_rooms;
create policy "chat_rooms_select_authenticated"
  on public.chat_rooms
  for select
  to authenticated
  using (true);

drop policy if exists "chat_rooms_insert_authenticated" on public.chat_rooms;
create policy "chat_rooms_insert_authenticated"
  on public.chat_rooms
  for insert
  to authenticated
  with check (created_by = auth.uid());

drop policy if exists "chat_room_memberships_select_authenticated" on public.chat_room_memberships;
create policy "chat_room_memberships_select_authenticated"
  on public.chat_room_memberships
  for select
  to authenticated
  using (true);

drop policy if exists "chat_room_memberships_insert_self" on public.chat_room_memberships;
create policy "chat_room_memberships_insert_self"
  on public.chat_room_memberships
  for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "chat_room_messages_select_authenticated" on public.chat_room_messages;
create policy "chat_room_messages_select_authenticated"
  on public.chat_room_messages
  for select
  to authenticated
  using (true);

drop policy if exists "chat_room_messages_insert_member" on public.chat_room_messages;
create policy "chat_room_messages_insert_member"
  on public.chat_room_messages
  for insert
  to authenticated
  with check (
    sender_id = auth.uid()
    and exists (
      select 1
      from public.chat_room_memberships membership
      where membership.room_id = chat_room_messages.room_id
        and membership.user_id = auth.uid()
    )
  );
