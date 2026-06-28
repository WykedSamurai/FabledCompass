create extension if not exists pgcrypto;

alter table public.chat_rooms
  alter column created_by drop not null;

alter table public.chat_rooms
  add column if not exists slug text,
  add column if not exists room_kind text not null default 'groups',
  add column if not exists room_capacity integer not null default 20,
  add column if not exists is_lobby boolean not null default false,
  add column if not exists is_active boolean not null default true;

update public.chat_rooms
set slug = lower(regexp_replace(name, '[^a-z0-9]+', '-', 'g'))
where slug is null;

alter table public.chat_rooms
  alter column slug set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'chat_rooms_kind_check'
  ) then
    alter table public.chat_rooms
      add constraint chat_rooms_kind_check check (room_kind in ('groups', 'commons'));
  end if;
end $$;

create unique index if not exists idx_chat_rooms_slug_unique on public.chat_rooms(slug);

create or replace function public.current_user_human_verified()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() -> 'user_metadata' ->> 'human_verification_status', 'unverified') = 'human_verified';
$$;

create or replace function public.enforce_chat_room_create_rules()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.created_by is not null then
    if auth.uid() is null or auth.uid() <> new.created_by then
      raise exception 'Room creator must match authenticated user.';
    end if;

    if not public.current_user_human_verified() then
      raise exception 'Only verified people can create rooms.';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_enforce_chat_room_create_rules on public.chat_rooms;
create trigger trg_enforce_chat_room_create_rules
before insert on public.chat_rooms
for each row
execute function public.enforce_chat_room_create_rules();

create or replace function public.enforce_chat_membership_rules()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  room_record public.chat_rooms%rowtype;
  existing_count integer;
begin
  select *
  into room_record
  from public.chat_rooms
  where id = new.room_id and is_active = true;

  if not found then
    raise exception 'Room is unavailable.';
  end if;

  if auth.uid() is null or auth.uid() <> new.user_id then
    raise exception 'Membership insert must match the authenticated user.';
  end if;

  if not public.current_user_human_verified() then
    raise exception 'Only verified people can join rooms.';
  end if;

  if room_record.is_lobby then
    return new;
  end if;

  select count(*)
  into existing_count
  from public.chat_room_memberships
  where room_id = new.room_id;

  if existing_count >= room_record.room_capacity then
    raise exception 'Room is full.';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_enforce_chat_membership_rules on public.chat_room_memberships;
create trigger trg_enforce_chat_membership_rules
before insert on public.chat_room_memberships
for each row
execute function public.enforce_chat_membership_rules();

create or replace function public.enforce_chat_message_rules()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null or auth.uid() <> new.sender_id then
    raise exception 'Message sender must match authenticated user.';
  end if;

  if not public.current_user_human_verified() then
    raise exception 'Only verified people can send messages.';
  end if;

  if not exists (
    select 1
    from public.chat_room_memberships membership
    where membership.room_id = new.room_id
      and membership.user_id = auth.uid()
  ) then
    raise exception 'Join the room before sending messages.';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_enforce_chat_message_rules on public.chat_room_messages;
create trigger trg_enforce_chat_message_rules
before insert on public.chat_room_messages
for each row
execute function public.enforce_chat_message_rules();

drop policy if exists "chat_room_messages_select_authenticated" on public.chat_room_messages;
create policy "chat_room_messages_select_member"
  on public.chat_room_messages
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.chat_room_memberships membership
      where membership.room_id = chat_room_messages.room_id
        and membership.user_id = auth.uid()
    )
  );

create table if not exists public.direct_message_threads (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.direct_message_participants (
  thread_id uuid not null references public.direct_message_threads(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (thread_id, user_id)
);

create table if not exists public.direct_message_messages (
  id bigint generated always as identity primary key,
  thread_id uuid not null references public.direct_message_threads(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_dm_participants_user on public.direct_message_participants(user_id);
create index if not exists idx_dm_messages_thread_created on public.direct_message_messages(thread_id, created_at desc);

alter table public.direct_message_threads enable row level security;
alter table public.direct_message_participants enable row level security;
alter table public.direct_message_messages enable row level security;

drop policy if exists "dm_threads_select_participant" on public.direct_message_threads;
create policy "dm_threads_select_participant"
  on public.direct_message_threads
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.direct_message_participants participant
      where participant.thread_id = direct_message_threads.id
        and participant.user_id = auth.uid()
    )
  );

drop policy if exists "dm_threads_insert_creator" on public.direct_message_threads;
create policy "dm_threads_insert_creator"
  on public.direct_message_threads
  for insert
  to authenticated
  with check (created_by = auth.uid() and public.current_user_human_verified());

drop policy if exists "dm_participants_select_participant" on public.direct_message_participants;
create policy "dm_participants_select_participant"
  on public.direct_message_participants
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.direct_message_participants self_participant
      where self_participant.thread_id = direct_message_participants.thread_id
        and self_participant.user_id = auth.uid()
    )
  );

drop policy if exists "dm_participants_insert_creator" on public.direct_message_participants;
create policy "dm_participants_insert_creator"
  on public.direct_message_participants
  for insert
  to authenticated
  with check (
    public.current_user_human_verified()
    and (
      user_id = auth.uid()
      or exists (
        select 1
        from public.direct_message_threads thread
        where thread.id = direct_message_participants.thread_id
          and thread.created_by = auth.uid()
      )
    )
  );

drop policy if exists "dm_messages_select_participant" on public.direct_message_messages;
create policy "dm_messages_select_participant"
  on public.direct_message_messages
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.direct_message_participants participant
      where participant.thread_id = direct_message_messages.thread_id
        and participant.user_id = auth.uid()
    )
  );

drop policy if exists "dm_messages_insert_sender" on public.direct_message_messages;
create policy "dm_messages_insert_sender"
  on public.direct_message_messages
  for insert
  to authenticated
  with check (
    sender_id = auth.uid()
    and public.current_user_human_verified()
    and exists (
      select 1
      from public.direct_message_participants participant
      where participant.thread_id = direct_message_messages.thread_id
        and participant.user_id = auth.uid()
    )
  );

create or replace function public.create_or_get_direct_thread(target_user_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  actor_id uuid := auth.uid();
  found_thread_id uuid;
begin
  if actor_id is null then
    raise exception 'Authentication required.';
  end if;

  if not public.current_user_human_verified() then
    raise exception 'Only verified people can start direct messages.';
  end if;

  if target_user_id is null or target_user_id = actor_id then
    raise exception 'Target user is required.';
  end if;

  select participant.thread_id
  into found_thread_id
  from public.direct_message_participants participant
  where participant.user_id = actor_id
    and participant.thread_id in (
      select target_participant.thread_id
      from public.direct_message_participants target_participant
      where target_participant.user_id = target_user_id
    )
    and (
      select count(*)
      from public.direct_message_participants count_participant
      where count_participant.thread_id = participant.thread_id
    ) = 2
  limit 1;

  if found_thread_id is not null then
    return found_thread_id;
  end if;

  insert into public.direct_message_threads (created_by)
  values (actor_id)
  returning id into found_thread_id;

  insert into public.direct_message_participants (thread_id, user_id)
  values (found_thread_id, actor_id), (found_thread_id, target_user_id);

  return found_thread_id;
end;
$$;

grant execute on function public.create_or_get_direct_thread(uuid) to authenticated;

insert into public.chat_rooms (
  name,
  slug,
  focus,
  cadence,
  created_by,
  room_kind,
  room_capacity,
  is_lobby,
  is_active
)
values
  ('Great Hall', 'great-hall', 'Daily guild chatter, introductions, and cross-path support.', 'Open discussion', null, 'commons', 20, true, true),
  ('HR Fire', 'hr-fire', 'Hiring rituals, interview prep, and workplace policy navigation.', 'Open discussion', null, 'commons', 20, false, true),
  ('Technology Fire', 'technology-fire', 'Tech careers, portfolio builds, and practical implementation tips.', 'Open discussion', null, 'commons', 20, false, true),
  ('Hospitality Fire', 'hospitality-fire', 'Service leadership, guest recovery, and frontline growth stories.', 'Open discussion', null, 'commons', 20, false, true),
  ('Education Fire', 'education-fire', 'Learning pathways, certification planning, and training strategy.', 'Open discussion', null, 'commons', 20, false, true),
  ('Career Changers', 'career-changers', 'Role pivots, transferable skills, and transition support.', 'Open discussion', null, 'commons', 20, false, true),
  ('Student Commons', 'student-commons', 'Early-career guidance, internships, and starter portfolio help.', 'Open discussion', null, 'commons', 20, false, true),
  ('Mentor Pavilion', 'mentor-pavilion', 'High-signal coaching office hours and evidence-first feedback.', 'Open discussion', null, 'commons', 20, false, true)
on conflict (slug) do update
set
  focus = excluded.focus,
  cadence = excluded.cadence,
  room_kind = excluded.room_kind,
  room_capacity = excluded.room_capacity,
  is_lobby = excluded.is_lobby,
  is_active = excluded.is_active;
