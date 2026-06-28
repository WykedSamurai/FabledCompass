"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { FireRoom } from "../../../lib/commons";
import { isHumanVerified } from "../../../utils/account/types";
import { createClient } from "../../../utils/supabase/client";

type FireRoomClientProps = {
  fire: FireRoom;
  allFires: FireRoom[];
  principles: string[];
};

type RoomMember = {
  name: string;
  role: string;
};

export default function FireRoomClient({ fire, allFires, principles }: FireRoomClientProps) {
  const router = useRouter();
  const [isVerifiedPerson, setIsVerifiedPerson] = useState(false);

  const roomMembers = useMemo<RoomMember[]>(() => {
    const seen = new Set<string>();
    const members: RoomMember[] = [];
    for (const voice of fire.travelerVoices) {
      if (!seen.has(voice.name)) {
        members.push({ name: voice.name, role: voice.role });
        seen.add(voice.name);
      }
    }
    return members;
  }, [fire.travelerVoices]);

  const [selectedMemberName, setSelectedMemberName] = useState(roomMembers[0]?.name ?? "");
  const selectedMember = roomMembers.find((member) => member.name === selectedMemberName) ?? null;

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setIsVerifiedPerson(Boolean(data.user && isHumanVerified(data.user.user_metadata.human_verification_status)));
    });
  }, []);

  function openWhisper(): void {
    if (!selectedMember) {
      return;
    }
    if (!isVerifiedPerson) {
      window.alert("Only verified people can contact members. Complete verification in Account settings first.");
      router.push("/account");
      return;
    }
    router.push(`/messages?candidateName=${encodeURIComponent(selectedMember.name)}&source=commons`);
  }

  function openInvite(): void {
    if (!selectedMember) {
      return;
    }
    if (!isVerifiedPerson) {
      window.alert("Only verified people can contact members. Complete verification in Account settings first.");
      router.push("/account");
      return;
    }
    router.push(`/messages?candidateName=${encodeURIComponent(selectedMember.name)}&source=commons-invite`);
  }

  function openProfile(): void {
    if (!selectedMember) {
      return;
    }
    router.push(`/profile?traveler=${encodeURIComponent(selectedMember.name)}`);
  }

  return (
    <section className="fc-aol-shell">
      <div className="fc-aol-titlebar">
        <strong>{fire.name} - Fabled Compass Chat</strong>
        <span>{roomMembers.length} Travelers Online</span>
      </div>

      <aside className="fc-aol-panel fc-aol-rooms">
        <div className="fc-aol-panel-head">
          <p>Chat Room Listings</p>
          <Link className="fc-button" href="/commons">All Rooms</Link>
        </div>
        <div className="fc-aol-search">
          <input type="text" value={fire.name} readOnly />
          <button type="button">Search</button>
        </div>
        <div className="fc-aol-list">
          {allFires.map((room) => (
            <Link
              key={room.slug}
              href={`/commons/${room.slug}`}
              className={`fc-aol-room ${room.slug === fire.slug ? "is-active" : ""}`}
            >
              <strong>{room.name}</strong>
              <span>{room.travelerVoices.length} users</span>
            </Link>
          ))}
        </div>
      </aside>

      <article className="fc-aol-panel fc-aol-chat">
        <div className="fc-aol-panel-head">
          <p>Conversation: {fire.name}</p>
          <span>{fire.description}</span>
        </div>
        <div className="fc-aol-topic">Topic: {fire.prompt}</div>

        <div className="fc-aol-log">
          {fire.travelerVoices.map((voice, index) => (
            <p key={`${voice.name}-${voice.message}`}>
              <span className="fc-chatroom-time">[{`12:${String(10 + index * 3).padStart(2, "0")}`}]</span>{" "}
              <strong>
                <Link href={`/profile?traveler=${encodeURIComponent(voice.name)}`}>{voice.name}</Link>
              </strong>{" "}
              <span className="fc-fire-role">&lt;{voice.role}&gt;</span>: {voice.message}
            </p>
          ))}
        </div>

        <form className="fc-aol-compose">
          <input placeholder={`Say something in ${fire.name}...`} />
          <button type="button">Send</button>
          <button type="button">Clear</button>
        </form>
      </article>

      <aside className="fc-aol-panel fc-aol-users">
        <div className="fc-aol-panel-head">
          <p>People Here</p>
          <span>Verified members only</span>
        </div>
        <div className="fc-aol-user-list">
          {roomMembers.map((member) => (
            <button
              key={`member-${member.name}`}
              type="button"
              className={`fc-aol-member-btn ${selectedMemberName === member.name ? "is-active" : ""}`}
              onClick={() => setSelectedMemberName(member.name)}
            >
              <strong>{member.name}</strong> <span className="fc-fire-role">{member.role}</span>
            </button>
          ))}
        </div>
        <p className="fc-fire-role">
          {selectedMember ? `Selected: ${selectedMember.name}` : "Select a member to choose a contact action."}
        </p>
        {!isVerifiedPerson && (
          <p className="form-message">Verification required: only verified people can start contact actions.</p>
        )}
        <div className="fc-aol-actions">
          <button type="button" onClick={openWhisper} disabled={!selectedMember || !isVerifiedPerson}>Whisper</button>
          <button type="button" onClick={openInvite} disabled={!selectedMember || !isVerifiedPerson}>Invite</button>
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
