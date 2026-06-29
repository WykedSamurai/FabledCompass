"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatCommunityGuardrail } from "../../../utils/community/guardrails";
import { createClient } from "../../../utils/supabase/client";

export type FireRoomSummary = {
  id: string;
  slug: string;
  name: string;
  focus: string;
  roomCapacity: number;
  isLobby: boolean;
  memberCount: number;
};

export type FireRoomMember = {
  userId: string;
  displayName: string;
  role: string;
};

export type FireRoomMessage = {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  body: string;
  createdAt: string;
};

type FireRoomClientProps = {
  room: FireRoomSummary;
  allRooms: FireRoomSummary[];
  members: FireRoomMember[];
  messages: FireRoomMessage[];
  principles: string[];
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

export default function FireRoomClient({ room, allRooms, members, messages, principles }: FireRoomClientProps) {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [canPost, setCanPost] = useState(false);
  const [draftMessage, setDraftMessage] = useState("");
  const [roomMessages, setRoomMessages] = useState<FireRoomMessage[]>(messages);
  const [selectedMemberId, setSelectedMemberId] = useState(members[0]?.userId ?? "");
  const [message, setMessage] = useState("");

  const selectedMember = useMemo(
    () => members.find((member) => member.userId === selectedMemberId) ?? null,
    [members, selectedMemberId]
  );

  useEffect(() => {
    async function ensureMembership() {
      const supabase = createClient();
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        setMessage(formatCommunityGuardrail("Sign in required."));
        setCanPost(false);
        return;
      }

      setUserId(authData.user.id);
      const { error } = await supabase
        .from("chat_room_memberships")
        .upsert({ room_id: room.id, user_id: authData.user.id }, { onConflict: "room_id,user_id" });

      if (error) {
        setMessage(formatCommunityGuardrail(error.message));
        setCanPost(false);
        return;
      }

      setCanPost(true);
      setMessage("");
    }

    void ensureMembership();
  }, [room.id]);

  async function sendRoomMessage(): Promise<void> {
    const text = draftMessage.trim();
    if (!text || !userId || !canPost) {
      return;
    }

    const supabase = createClient();
    const { data: inserted, error } = await supabase
      .from("chat_room_messages")
      .insert({
        room_id: room.id,
        sender_id: userId,
        body: text
      })
      .select("id, created_at")
      .single();

    if (error || !inserted) {
      setMessage(formatCommunityGuardrail(error?.message || "Could not send message."));
      return;
    }

    const supabaseUser = await supabase.auth.getUser();
    const profileName = typeof supabaseUser.data.user?.user_metadata.display_name === "string"
      ? supabaseUser.data.user.user_metadata.display_name
      : "You";

    setRoomMessages((current) => [
      ...current,
      {
        id: String(inserted.id),
        senderId: userId,
        senderName: profileName,
        senderRole: "Traveler",
        body: text,
        createdAt: inserted.created_at
      }
    ]);
    setDraftMessage("");
    setMessage("");
  }

  function openWhisper(): void {
    if (!selectedMember) {
      return;
    }
    router.push(`/messages?targetUserId=${encodeURIComponent(selectedMember.userId)}&targetName=${encodeURIComponent(selectedMember.displayName)}`);
  }

  function openInvite(): void {
    if (!selectedMember) {
      return;
    }
    router.push(`/messages?targetUserId=${encodeURIComponent(selectedMember.userId)}&targetName=${encodeURIComponent(selectedMember.displayName)}&intent=invite`);
  }

  function openProfile(): void {
    if (!selectedMember) {
      return;
    }
    router.push(`/profile?userId=${encodeURIComponent(selectedMember.userId)}`);
  }

  return (
    <section className="fc-aol-shell">
      <div className="fc-aol-titlebar">
        <strong>{room.name} - Fabled Compass Chat</strong>
        <span>{members.length} Travelers Online</span>
      </div>

      <aside className="fc-aol-panel fc-aol-rooms">
        <div className="fc-aol-panel-head">
          <p>Chat Room Listings</p>
          <Link className="fc-button" href="/commons">All Rooms</Link>
        </div>
        <div className="fc-aol-search">
          <input type="text" value={room.name} readOnly />
          <button type="button">Search</button>
        </div>
        <div className="fc-aol-list">
          {allRooms.map((nextRoom) => (
            <Link
              key={nextRoom.slug}
              href={`/commons/${nextRoom.slug}`}
              className={`fc-aol-room ${nextRoom.slug === room.slug ? "is-active" : ""}`}
            >
              <strong>{nextRoom.name}</strong>
              <span>{nextRoom.memberCount}/{nextRoom.roomCapacity} users</span>
            </Link>
          ))}
        </div>
      </aside>

      <article className="fc-aol-panel fc-aol-chat">
        <div className="fc-aol-panel-head">
          <p>Conversation: {room.name}</p>
          <span>{room.focus}</span>
        </div>
        <div className="fc-aol-topic">
          Topic: {room.focus}
        </div>

        <div className="fc-aol-log">
          {roomMessages.length === 0 && <p>No messages yet. Be the first to start this room.</p>}
          {roomMessages.map((entry) => (
            <p key={entry.id}>
              <span className="fc-chatroom-time">[{relativeTimeLabel(entry.createdAt)}]</span>{" "}
              <strong>
                <Link href={`/profile?userId=${encodeURIComponent(entry.senderId)}`}>{entry.senderName}</Link>
              </strong>{" "}
              <span className="fc-fire-role">&lt;{entry.senderRole}&gt;</span>: {entry.body}
            </p>
          ))}
        </div>

        <form
          className="fc-aol-compose"
          onSubmit={(event) => {
            event.preventDefault();
            void sendRoomMessage();
          }}
        >
          <input
            placeholder={`Say something in ${room.name}...`}
            value={draftMessage}
            onChange={(event) => setDraftMessage(event.target.value)}
            disabled={!canPost}
          />
          <button type="submit" disabled={!canPost}>Send</button>
          <button type="button" onClick={() => setDraftMessage("")} disabled={!canPost}>Clear</button>
        </form>
        {message && <p className="form-message">{message}</p>}
      </article>

      <aside className="fc-aol-panel fc-aol-users">
        <div className="fc-aol-panel-head">
          <p>People Here</p>
          <span>Verified members only</span>
        </div>
        <div className="fc-aol-user-list">
          {members.map((member) => (
            <button
              key={`member-${member.userId}`}
              type="button"
              className={`fc-aol-member-btn ${selectedMemberId === member.userId ? "is-active" : ""}`}
              onClick={() => setSelectedMemberId(member.userId)}
            >
              <strong>{member.displayName}</strong> <span className="fc-fire-role">{member.role}</span>
            </button>
          ))}
        </div>
        <p className="fc-fire-role">
          {selectedMember ? `Selected: ${selectedMember.displayName}` : "Select a member to choose a contact action."}
        </p>
        <div className="fc-aol-actions">
          <button type="button" onClick={openWhisper} disabled={!selectedMember}>Whisper</button>
          <button type="button" onClick={openInvite} disabled={!selectedMember}>Invite</button>
          <button type="button" onClick={openProfile} disabled={!selectedMember}>Profile</button>
        </div>
        <ul className="fc-guidance-list">
          {principles.slice(0, 3).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </aside>
    </section>
  );
}
