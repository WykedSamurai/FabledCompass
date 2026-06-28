import Link from "next/link";
import { notFound } from "next/navigation";
import { commonsPrinciples, fires, getFire } from "../../../lib/commons";

type FireRoomPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function FireRoomPage({ params }: FireRoomPageProps) {
  const { slug } = await params;
  const fire = getFire(slug);

  if (!fire) {
    notFound();
  }

  return (
    <div className="fc-page-stack fc-workspace-page">
      <section className="fc-aol-shell">
        <div className="fc-aol-titlebar">
          <strong>{fire.name} - Fabled Compass Chat</strong>
          <span>{fire.travelers} Travelers Online</span>
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
            {fires.map((room) => (
              <Link
                key={room.slug}
                href={`/commons/${room.slug}`}
                className={`fc-aol-room ${room.slug === fire.slug ? "is-active" : ""}`}
              >
                <strong>{room.name}</strong>
                <span>{room.travelers} users</span>
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
            <span>Profiles</span>
          </div>
          <div className="fc-aol-user-list">
            {fire.travelerVoices.map((voice) => (
              <p key={`member-${voice.name}`}>
                <strong>
                  <Link href={`/profile?traveler=${encodeURIComponent(voice.name)}`}>{voice.name}</Link>
                </strong>{" "}
                <span className="fc-fire-role">{voice.role}</span>
              </p>
            ))}
            <p>
              <strong><Link href="/profile?traveler=Room%20Keeper">Room Keeper</Link></strong>{" "}
              <span className="fc-fire-role">{fire.keeperPresent ? "Online" : "Away"}</span>
            </p>
            <p>
              <strong><Link href="/profile?traveler=Mentor">Mentor</Link></strong>{" "}
              <span className="fc-fire-role">{fire.mentorPresent ? "Online" : "Away"}</span>
            </p>
          </div>
          <div className="fc-aol-actions">
            <button type="button">Whisper</button>
            <button type="button">Invite</button>
            <button type="button">Profile</button>
          </div>
          <ul className="fc-guidance-list">
            {commonsPrinciples.slice(0, 3).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </aside>
      </section>
    </div>
  );
}
