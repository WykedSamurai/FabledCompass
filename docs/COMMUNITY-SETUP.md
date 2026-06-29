# Community Backend Setup

This setup powers:

1. `/commons` room listing and room chat
2. `/groups` room creation, join, and room chat
3. `/messages` verified direct messages

## SQL migration order

Run these files in Supabase SQL Editor in this order:

1. `db/chatrooms.sql`
2. `db/community_upgrade.sql`

`community_upgrade.sql` assumes the base chatroom tables already exist.

## SQL Editor copy rules (important)

Paste **only SQL** into the editor.

- Do not include explanatory lines.
- Do not include markdown fences such as ```sql or ```.
- First line should be SQL (for example: `create extension if not exists pgcrypto;`).

## Expected objects after setup

- `chat_rooms` columns: `slug`, `room_kind`, `room_capacity`, `is_lobby`, `is_active`
- Trigger-based guardrails for verified users, room capacity, and membership-before-send
- Direct message tables:
  - `direct_message_threads`
  - `direct_message_participants`
  - `direct_message_messages`
- RPC function: `create_or_get_direct_thread(uuid)`

## Quick smoke checklist

1. Verified user can join a room and send in `/commons/[slug]`.
2. Verified user can create/join/send in `/groups`.
3. Unverified user sees guardrail messaging and cannot join or send.
4. Direct message thread opens from people list and sends from `/messages`.
