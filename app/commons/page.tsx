"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { commonsComingLater, commonsPrinciples } from "../../lib/commons";
import { isHumanVerified } from "../../utils/account/types";
import { createClient } from "../../utils/supabase/client";

type CommonsRoom = {
  id: string;
  slug: string;
  name: string;
  focus: string;
  roomCapacity: number;
  isLobby: boolean;
  members: number;
};

type RoomRow = {
  id: string;
  slug: string;
  name: string;
  focus: string | null;
  room_capacity: number | null;
  is_lobby: boolean | null;
};

type MembershipRow = {
  room_id: string;
};

export default function CommonsPage() {
  const router = useRouter();
  const [selectedRoomSlug, setSelectedRoomSlug] = useState("");
  const [rooms, setRooms] = useState<CommonsRoom[]>([]);
  const [canEnterCommons, setCanEnterCommons] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [message, setMessage] = useState("Loading rooms...");

  const selectedRoom = useMemo(
    () => rooms.find((room) => room.slug === selectedRoomSlug) ?? null,
    [rooms, selectedRoomSlug]
  );

  useEffect(() => {
    async function loadCommonsRooms() {
      const supabase = createClient();
      const { data: authData } = await supabase.auth.getUser();

      if (!authData.user) {
        router.replace("/login?next=/commons");
        return;
      }

      const verified = isHumanVerified(authData.user.user_metadata.human_verification_status);
      setCanEnterCommons(verified);

      const { data: roomData, error: roomError } = await supabase
        .from("chat_rooms")
        .select("id, slug, name, focus, room_capacity, is_lobby")
        .eq("room_kind", "commons")
        .eq("is_active", true)
        .order("is_lobby", { ascending: false })
        .order("name", { ascending: true })
        .limit(100);

      if (roomError) {
        setMessage(`Could not load commons rooms: ${roomError.message}`);
        setRooms([]);
        setAuthChecked(true);
        return;
      }

      const roomRows = (roomData ?? []) as RoomRow[];
      if (roomRows.length === 0) {
        setMessage("No commons rooms are available yet.");
        setRooms([]);
        setAuthChecked(true);
        return;
      }

      const roomIds = roomRows.map((room) => room.id);
      const { data: membershipData, error: membershipError } = await supabase
        .from("chat_room_memberships")
        .select("room_id")
        .in("room_id", roomIds);

      if (membershipError) {
        setMessage(`Could not load room populations: ${membershipError.message}`);
        setRooms([]);
        setAuthChecked(true);
        return;
      }

      const memberCounts = (membershipData ?? []).reduce<Record<string, number>>((acc, membership) => {
        const typed = membership as MembershipRow;
        acc[typed.room_id] = (acc[typed.room_id] ?? 0) + 1;
        return acc;
      }, {});

      const nextRooms = roomRows.map((room) => ({
        id: room.id,
        slug: room.slug,
        name: room.name,
        focus: room.focus || "Commons discussion",
        roomCapacity: room.room_capacity ?? 20,
        isLobby: Boolean(room.is_lobby),
        members: memberCounts[room.id] ?? 0
      }));

      setRooms(nextRooms);
      setSelectedRoomSlug((current) => current || nextRooms[0].slug);
      setMessage("");
      setAuthChecked(true);
    }

    void loadCommonsRooms();
  }, [router]);

  function isRoomFull(room: CommonsRoom): boolean {
    return !room.isLobby && room.members >= room.roomCapacity;
  }

  function enterSelectedRoom(): void {
    if (!selectedRoom) {
      return;
    }
    if (!authChecked) {
      return;
    }
    if (!canEnterCommons) {
      window.alert("Only verified people can join rooms. Complete verification in Account settings first.");
      router.push("/account");
      return;
    }
    if (isRoomFull(selectedRoom)) {
      window.alert("This room is full (20/20). Please choose another room or start a new one.");
      return;
    }
    router.push(`/commons/${selectedRoom.slug}`);
  }

  return (
    <div className="fc-page-stack fc-workspace-page">
      <section className="fc-workspace-hero">
        <p className="fc-eyebrow">The Commons</p>
        <h1>The Commons</h1>
        <p>A place where Travelers gather to share experience, ask questions, and help each other grow.</p>
      </section>

      <section className="fc-workspace-grid">
        <article className="fc-card">
          <div className="fc-card-header-row">
            <h2>Fires</h2>
            <span className="fc-muted">{rooms.length} active rooms</span>
          </div>
          {message && <p className="form-message">{message}</p>}
          <div className="fc-group-grid">
            {rooms.map((room) => (
              <article className="fc-card" key={room.id}>
                <div className="fc-card-header-row">
                  <div>
                    <p className="fc-eyebrow">Fire</p>
                    <h3>{room.name}</h3>
                  </div>
                  <span className="fc-status-pill">
                    {isRoomFull(room) ? "Room Full" : `${room.members}/${room.roomCapacity} Travelers`}
                  </span>
                </div>
                <p className="fc-muted">{room.focus}</p>
                <div className="fc-inline-tags">
                  <span>{room.isLobby ? "Lobby room" : "Standard room"}</span>
                  <span>{room.isLobby ? "No hard cap" : "20 person cap"}</span>
                </div>
                <div className="fc-action-row">
                  <button
                    className="fc-button"
                    type="button"
                    onClick={() => setSelectedRoomSlug(room.slug)}
                  >
                    {selectedRoomSlug === room.slug ? "Selected" : "Select Room"}
                  </button>
                </div>
              </article>
            ))}
          </div>
          <div className="fc-action-row">
            <button
              className="fc-button"
              type="button"
              disabled={!selectedRoom || !authChecked}
              onClick={enterSelectedRoom}
            >
              {selectedRoom ? `Enter ${selectedRoom.name}` : "Select a room to enter"}
            </button>
          </div>
        </article>

        <aside className="fc-page-stack">
          <article className="fc-card fc-side-card">
            <p className="fc-eyebrow">Community Principles</p>
            <ul className="fc-guidance-list">
              {commonsPrinciples.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="fc-card fc-side-card">
            <p className="fc-eyebrow">Today's Prompt</p>
            <h3>What is one professional lesson you learned the hard way?</h3>
          </article>

          <article className="fc-card fc-side-card">
            <p className="fc-eyebrow">Coming Later</p>
            <ul className="fc-guidance-list">
              {commonsComingLater.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </aside>
      </section>
    </div>
  );
}
