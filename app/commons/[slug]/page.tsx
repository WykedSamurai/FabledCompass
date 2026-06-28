import { notFound, redirect } from "next/navigation";
import { commonsPrinciples } from "../../../lib/commons";
import { createClient } from "../../../utils/supabase/server";
import FireRoomClient, {
  type FireRoomMember,
  type FireRoomMessage,
  type FireRoomSummary
} from "./FireRoomClient";

type FireRoomPageProps = {
  params: Promise<{ slug: string }>;
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
  user_id: string;
};

type MessageRow = {
  id: number;
  room_id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

type ProfileRow = {
  id: string;
  display_name: string | null;
  headline: string | null;
};

export const dynamic = "force-dynamic";

export default async function FireRoomPage({ params }: FireRoomPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) {
    redirect(`/login?next=/commons/${slug}`);
  }

  const { data: roomData, error: roomError } = await supabase
    .from("chat_rooms")
    .select("id, slug, name, focus, room_capacity, is_lobby")
    .eq("room_kind", "commons")
    .eq("is_active", true)
    .order("is_lobby", { ascending: false })
    .order("name", { ascending: true });

  if (roomError || !roomData || roomData.length === 0) {
    notFound();
  }

  const roomRows = roomData as RoomRow[];
  const activeRoom = roomRows.find((room) => room.slug === slug);
  if (!activeRoom) {
    notFound();
  }

  const roomIds = roomRows.map((room) => room.id);
  const [membershipResult, messageResult] = await Promise.all([
    supabase
      .from("chat_room_memberships")
      .select("room_id, user_id")
      .in("room_id", roomIds),
    supabase
      .from("chat_room_messages")
      .select("id, room_id, sender_id, body, created_at")
      .eq("room_id", activeRoom.id)
      .order("created_at", { ascending: true })
      .limit(250)
  ]);

  const membershipRows = (membershipResult.data ?? []) as MembershipRow[];
  const messageRows = (messageResult.data ?? []) as MessageRow[];

  const userIds = Array.from(new Set([
    ...membershipRows.map((membership) => membership.user_id),
    ...messageRows.map((message) => message.sender_id)
  ]));

  const profileLookup = new Map<string, ProfileRow>();
  if (userIds.length > 0) {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("id, display_name, headline")
      .in("id", userIds);

    for (const profile of (profileData ?? []) as ProfileRow[]) {
      profileLookup.set(profile.id, profile);
    }
  }

  const memberCounts = membershipRows.reduce<Record<string, number>>((acc, membership) => {
    acc[membership.room_id] = (acc[membership.room_id] ?? 0) + 1;
    return acc;
  }, {});

  const allRooms: FireRoomSummary[] = roomRows.map((room) => ({
    id: room.id,
    slug: room.slug,
    name: room.name,
    focus: room.focus || "Commons discussion",
    roomCapacity: room.room_capacity ?? 20,
    isLobby: Boolean(room.is_lobby),
    memberCount: memberCounts[room.id] ?? 0
  }));

  const activeRoomSummary = allRooms.find((room) => room.id === activeRoom.id);
  if (!activeRoomSummary) {
    notFound();
  }

  const activeMemberRows = membershipRows.filter((membership) => membership.room_id === activeRoom.id);
  const roomMembers: FireRoomMember[] = activeMemberRows.map((membership) => {
    const profile = profileLookup.get(membership.user_id);
    return {
      userId: membership.user_id,
      displayName: profile?.display_name || `Member ${membership.user_id.slice(0, 8)}`,
      role: profile?.headline || "Traveler"
    };
  });

  const roomMessages: FireRoomMessage[] = messageRows.map((message) => {
    const profile = profileLookup.get(message.sender_id);
    return {
      id: String(message.id),
      senderId: message.sender_id,
      senderName: profile?.display_name || `Member ${message.sender_id.slice(0, 8)}`,
      senderRole: profile?.headline || "Traveler",
      body: message.body,
      createdAt: message.created_at
    };
  });

  return (
    <div className="fc-page-stack fc-workspace-page">
      <FireRoomClient
        room={activeRoomSummary}
        allRooms={allRooms}
        members={roomMembers}
        messages={roomMessages}
        principles={commonsPrinciples}
      />
    </div>
  );
}
