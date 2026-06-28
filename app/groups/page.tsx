 "use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PrototypeWatermark from "../../components/layout/PrototypeWatermark";
import { createClient } from "../../utils/supabase/client";
import { isHumanVerified } from "../../utils/account/types";

type RoomMessage = {
  id: string;
  sender: string;
  text: string;
  when: string;
};

type Room = {
  id: string;
  slug: string;
  name: string;
  focus: string;
  members: number;
  cadence: string;
  roomCapacity: number;
  isLobby: boolean;
  joined: boolean;
  messages: RoomMessage[];
};

type RoomRow = {
  id: string;
  slug: string;
  name: string;
  focus: string | null;
  cadence: string | null;
  room_capacity: number | null;
  is_lobby: boolean | null;
  created_at: string;
};

type MembershipRow = {
  room_id: string;
  user_id: string;
};

type MessageRow = {
  id: number;
  room_id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

type ProfileNameRow = {
  id: string;
  display_name: string | null;
};

function relativeTimeLabel(timestamp: string): string {
  const deltaMs = Date.now() - new Date(timestamp).getTime();
  const deltaMinutes = Math.max(0, Math.floor(deltaMs / 60000));
  if (deltaMinutes < 1) {
    return "Now";
  }
  if (deltaMinutes < 60) {
    return `${deltaMinutes}m`;
  }
  const deltaHours = Math.floor(deltaMinutes / 60);
  if (deltaHours < 24) {
    return `${deltaHours}h`;
  }
  return `${Math.floor(deltaHours / 24)}d`;
}

function makeSlug(name: string): string {
  return `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${Date.now()}`;
}

export default function GroupsPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeRoomId, setActiveRoomId] = useState("");
  const [userId, setUserId] = useState("");
  const [authLoading, setAuthLoading] = useState(true);
  const [workspaceMessage, setWorkspaceMessage] = useState("Loading chatrooms...");
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomFocus, setNewRoomFocus] = useState("");
  const [draftMessage, setDraftMessage] = useState("");

  const activeRoom = useMemo(
    () => rooms.find((room) => room.id === activeRoomId) ?? rooms[0] ?? null,
    [activeRoomId, rooms]
  );

  const joinedCount = useMemo(
    () => rooms.filter((room) => room.joined).length,
    [rooms]
  );

  const loadRooms = useCallback(async () => {
    const supabase = createClient();
    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user;
    if (!user) {
      router.replace("/login?next=/groups");
      return;
    }
    if (!isHumanVerified(user.user_metadata.human_verification_status)) {
      setWorkspaceMessage("Only verified people can access chatrooms. Verify your account in Navigator Center.");
      setRooms([]);
      setAuthLoading(false);
      return;
    }

    setUserId(user.id);

    const { data: roomData, error: roomError } = await supabase
      .from("chat_rooms")
      .select("id, slug, name, focus, cadence, room_capacity, is_lobby, created_at")
      .eq("room_kind", "groups")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(100);

    if (roomError) {
      setWorkspaceMessage(`Chat backend is not ready yet: ${roomError.message}`);
      setRooms([]);
      setAuthLoading(false);
      return;
    }

    const roomsList = (roomData ?? []) as RoomRow[];
    if (roomsList.length === 0) {
      setWorkspaceMessage("No chatrooms yet. Create the first one.");
      setRooms([]);
      setActiveRoomId("");
      setAuthLoading(false);
      return;
    }

    const roomIds = roomsList.map((room) => room.id);
    const [membershipResult, messageResult] = await Promise.all([
      supabase.from("chat_room_memberships").select("room_id, user_id").in("room_id", roomIds),
      supabase
        .from("chat_room_messages")
        .select("id, room_id, sender_id, body, created_at")
        .in("room_id", roomIds)
        .order("created_at", { ascending: true })
        .limit(500)
    ]);

    if (membershipResult.error) {
      setWorkspaceMessage(`Failed to load room memberships: ${membershipResult.error.message}`);
      setRooms([]);
      setAuthLoading(false);
      return;
    }

    if (messageResult.error) {
      setWorkspaceMessage(`Failed to load room messages: ${messageResult.error.message}`);
      setRooms([]);
      setAuthLoading(false);
      return;
    }

    const membershipRows = (membershipResult.data ?? []) as MembershipRow[];
    const messageRows = (messageResult.data ?? []) as MessageRow[];
    const senderIds = Array.from(new Set(messageRows.map((message) => message.sender_id)));
    const profileLookup = new Map<string, string>();

    if (senderIds.length > 0) {
      const { data: profileRows, error: profileError } = await supabase
        .from("profiles")
        .select("id, display_name")
        .in("id", senderIds);

      if (!profileError) {
        for (const profile of (profileRows ?? []) as ProfileNameRow[]) {
          profileLookup.set(profile.id, profile.display_name || "Member");
        }
      }
    }

    const memberCountByRoom = membershipRows.reduce<Record<string, number>>((acc, membership) => {
      acc[membership.room_id] = (acc[membership.room_id] ?? 0) + 1;
      return acc;
    }, {});

    const joinedRoomIds = new Set(
      membershipRows.filter((membership) => membership.user_id === user.id).map((membership) => membership.room_id)
    );

    const messagesByRoom = messageRows.reduce<Record<string, RoomMessage[]>>((acc, message) => {
      const sender = message.sender_id === user.id ? "You" : profileLookup.get(message.sender_id) || "Member";
      const nextMessage: RoomMessage = {
        id: String(message.id),
        sender,
        text: message.body,
        when: relativeTimeLabel(message.created_at)
      };
      if (!acc[message.room_id]) {
        acc[message.room_id] = [];
      }
      acc[message.room_id].push(nextMessage);
      return acc;
    }, {});

    const nextRooms = roomsList.map((room) => ({
      id: room.id,
      slug: room.slug,
      name: room.name,
      focus: room.focus || "Professional discussion",
      members: memberCountByRoom[room.id] ?? 0,
      cadence: room.cadence || "Open discussion",
      roomCapacity: room.room_capacity ?? 20,
      isLobby: Boolean(room.is_lobby),
      joined: joinedRoomIds.has(room.id),
      messages: messagesByRoom[room.id] ?? []
    }));

    setRooms(nextRooms);
    setActiveRoomId((current) => (current && nextRooms.some((room) => room.id === current) ? current : nextRooms[0].id));
    setWorkspaceMessage("");
    setAuthLoading(false);
  }, [router]);

  useEffect(() => {
    void loadRooms();
  }, [loadRooms]);

  async function joinRoom(roomId: string): Promise<void> {
    if (!userId) {
      return;
    }
    const supabase = createClient();
    const { error } = await supabase
      .from("chat_room_memberships")
      .upsert({ room_id: roomId, user_id: userId }, { onConflict: "room_id,user_id" });

    if (error) {
      setWorkspaceMessage(`Could not join room: ${error.message}`);
      return;
    }

    await loadRooms();
  }

  async function createRoom(): Promise<void> {
    const name = newRoomName.trim();
    const focus = newRoomFocus.trim();
    if (!name || !focus) {
      return;
    }

    if (!userId) {
      setWorkspaceMessage("Sign in before creating rooms.");
      return;
    }

    const supabase = createClient();
    const slug = makeSlug(name);
    const { data: roomInsert, error: roomError } = await supabase
      .from("chat_rooms")
      .insert({
        slug,
        name,
        focus,
        cadence: "Open discussion",
        room_kind: "groups",
        room_capacity: 20,
        is_lobby: false,
        created_by: userId
      })
      .select("id")
      .single();

    if (roomError || !roomInsert) {
      setWorkspaceMessage(`Could not create room: ${roomError?.message || "Unknown error"}`);
      return;
    }

    const { error: membershipError } = await supabase
      .from("chat_room_memberships")
      .upsert({ room_id: roomInsert.id, user_id: userId }, { onConflict: "room_id,user_id" });

    if (membershipError) {
      setWorkspaceMessage(`Room created, but join failed: ${membershipError.message}`);
      return;
    }

    setNewRoomName("");
    setNewRoomFocus("");
    await loadRooms();
    setActiveRoomId(roomInsert.id);
  }

  async function sendMessage(event?: FormEvent): Promise<void> {
    event?.preventDefault();
    const text = draftMessage.trim();
    if (!text || !activeRoom) {
      return;
    }

    if (!activeRoom.joined) {
      setWorkspaceMessage("Join this room before sending messages.");
      return;
    }

    if (!userId) {
      setWorkspaceMessage("Sign in before sending messages.");
      return;
    }

    const supabase = createClient();
    const { data: insertedMessage, error } = await supabase
      .from("chat_room_messages")
      .insert({
        room_id: activeRoom.id,
        sender_id: userId,
        body: text
      })
      .select("id, created_at")
      .single();

    if (error) {
      setWorkspaceMessage(`Could not send message: ${error.message}`);
      return;
    }

    setRooms((current) => current.map((room) => (
      room.id === activeRoom.id
        ? {
            ...room,
            messages: [
              ...room.messages,
              {
                id: String(insertedMessage.id),
                sender: "You",
                text,
                when: relativeTimeLabel(insertedMessage.created_at)
              }
            ]
          }
        : room
    )));
    setDraftMessage("");
    setWorkspaceMessage("");
  }

  if (authLoading) {
    return (
      <div className="fc-page-stack fc-workspace-page fc-prototype-frame">
        <PrototypeWatermark />
        <section className="fc-workspace-hero">
          <p className="fc-eyebrow">Alliance Journey</p>
          <h1>Guild Chatrooms</h1>
          <p>Loading chatroom workspace...</p>
        </section>
      </div>
    );
  }

  return (
    <div className="fc-page-stack fc-workspace-page fc-prototype-frame">
      <PrototypeWatermark />
      <section className="fc-workspace-hero">
        <p className="fc-eyebrow">Alliance Journey</p>
        <h1>Guild Chatrooms</h1>
        <p>Create rooms, join professional circles, and message collaborators in one workspace.</p>
      </section>

      <section className="fc-workspace-grid">
        <div className="fc-group-grid">
          <article className="fc-card">
            <div className="fc-card-header-row">
              <div>
                <p className="fc-eyebrow">Create Chatroom</p>
                <h2>Start a new room</h2>
              </div>
              <span className="fc-status-pill">{joinedCount} joined</span>
            </div>
            <div className="fc-auth-form fc-recruiter-filter-grid">
              <label>
                Room name
                <input
                  type="text"
                  value={newRoomName}
                  placeholder="Ex: Interview Prep Circle"
                  onChange={(event) => setNewRoomName(event.target.value)}
                />
              </label>
              <label>
                Focus
                <input
                  type="text"
                  value={newRoomFocus}
                  placeholder="Ex: Mock interview feedback"
                  onChange={(event) => setNewRoomFocus(event.target.value)}
                />
              </label>
            </div>
            <div className="fc-action-row">
              <button className="fc-button" type="button" onClick={() => void createRoom()}>
                Create Room
              </button>
            </div>
            {workspaceMessage && <p className="form-message">{workspaceMessage}</p>}
          </article>

          {rooms.length === 0 && (
            <article className="fc-card">
              <p className="fc-muted">No rooms are available yet. Create the first chatroom to start networking.</p>
            </article>
          )}

          {rooms.map((room) => (
            <article className="fc-card" key={room.id}>
              <div className="fc-card-header-row">
                <h2>{room.name}</h2>
                <span className="fc-status-pill">
                  {!room.isLobby && room.members >= room.roomCapacity ? "Room Full" : room.joined ? "Joined" : "Suggested"}
                </span>
              </div>
              <p className="fc-muted">{room.focus}</p>
              <p>{room.members}/{room.roomCapacity} members • {room.cadence}</p>
              <div className="fc-action-row">
                {!room.joined && (
                  <button
                    className="fc-button"
                    type="button"
                    disabled={!room.isLobby && room.members >= room.roomCapacity}
                    onClick={() => void joinRoom(room.id)}
                  >
                    Join Room
                  </button>
                )}
                <button className="fc-button" type="button" onClick={() => setActiveRoomId(room.id)}>
                  Open Room
                </button>
              </div>
            </article>
          ))}
        </div>

        <aside className="fc-card fc-side-card">
          {!activeRoom ? (
            <>
              <p className="fc-eyebrow">Room Chat</p>
              <p className="fc-muted">Create or join a room to begin chatting.</p>
            </>
          ) : (
            <>
              <p className="fc-eyebrow">Room Chat</p>
              <h2>{activeRoom.name}</h2>
              <p className="fc-muted">{activeRoom.focus}</p>

              <div className="fc-chat-log">
                {activeRoom.messages.length === 0 && <p>No messages yet. Start the conversation.</p>}
                {activeRoom.messages.map((message) => (
                  <p key={`${activeRoom.id}-${message.id}`}>
                    <strong>{message.sender}:</strong> {message.text}
                  </p>
                ))}
              </div>

              <form
                className="fc-comms-compose"
                onSubmit={(event) => {
                  void sendMessage(event);
                }}
              >
                <input
                  value={draftMessage}
                  placeholder={`Message ${activeRoom.name}...`}
                  onChange={(event) => setDraftMessage(event.target.value)}
                  disabled={!activeRoom.joined}
                />
                <button type="submit" disabled={!activeRoom.joined}>Send</button>
              </form>
              {!activeRoom.joined && <p className="form-message">Join this room to send messages.</p>}
            </>
          )}
        </aside>
      </section>
    </div>
  );
}
