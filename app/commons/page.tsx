"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { commonsComingLater, commonsPrinciples, fires } from "../../lib/commons";
import { isHumanVerified } from "../../utils/account/types";
import { createClient } from "../../utils/supabase/client";

export default function CommonsPage() {
  const router = useRouter();
  const [selectedRoomSlug, setSelectedRoomSlug] = useState("");
  const [canEnterCommons, setCanEnterCommons] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const selectedRoom = fires.find((fire) => fire.slug === selectedRoomSlug);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        setCanEnterCommons(false);
        setAuthChecked(true);
        return;
      }
      setCanEnterCommons(isHumanVerified(data.user.user_metadata.human_verification_status));
      setAuthChecked(true);
    });
  }, []);

  function roomPopulation(slug: string): number {
    const room = fires.find((item) => item.slug === slug);
    if (!room) {
      return 0;
    }
    return room.travelerVoices.length;
  }

  function isRoomFull(slug: string): boolean {
    if (slug === "great-hall") {
      return false;
    }
    return roomPopulation(slug) >= 20;
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
    if (isRoomFull(selectedRoom.slug)) {
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
            <span className="fc-muted">{fires.length} active rooms</span>
          </div>
          <div className="fc-group-grid">
            {fires.map((fire) => (
              <article className="fc-card" key={fire.name}>
                <div className="fc-card-header-row">
                  <div>
                    <p className="fc-eyebrow">Fire</p>
                    <h3>{fire.name}</h3>
                  </div>
                  <span className="fc-status-pill">
                    {isRoomFull(fire.slug) ? "Room Full" : `${roomPopulation(fire.slug)} Travelers`}
                  </span>
                </div>
                <p className="fc-muted">{fire.description}</p>
                <div className="fc-inline-tags">
                  <span>{fire.keeperPresent ? "Keeper present" : "Keeper away"}</span>
                  <span>{fire.mentorPresent ? "Mentor present" : "Mentor away"}</span>
                </div>
                <div className="fc-action-row">
                  <button
                    className="fc-button"
                    type="button"
                    onClick={() => setSelectedRoomSlug(fire.slug)}
                  >
                    {selectedRoomSlug === fire.slug ? "Selected" : "Select Room"}
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
