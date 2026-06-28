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
      <section className="fc-chatroom-shell">
        <aside className="fc-chatroom-rooms fc-card">
          <div className="fc-chatroom-rooms-head">
            <p className="fc-eyebrow">Fire Rooms</p>
            <Link className="fc-button" href="/commons">Browse</Link>
          </div>
          <div className="fc-chatroom-room-list">
            {fires.map((room) => (
              <Link
                key={room.slug}
                href={`/commons/${room.slug}`}
                className={`fc-chatroom-room-item ${room.slug === fire.slug ? "is-active" : ""}`}
              >
                <strong>#{room.name}</strong>
                <span>{room.travelers} travelers</span>
              </Link>
            ))}
          </div>
        </aside>

        <article className="fc-card fc-chatroom-main">
          <header className="fc-chatroom-main-head">
            <div>
              <p className="fc-eyebrow">Live Room</p>
              <h1>{fire.name}</h1>
              <p className="fc-muted">{fire.description}</p>
            </div>
            <span className="fc-status-pill">{fire.travelers} online</span>
          </header>

          <div className="fc-chatroom-topic">
            <strong>Today's Spark:</strong> {fire.prompt}
          </div>

          <div className="fc-chatroom-feed">
            {fire.travelerVoices.map((voice, index) => (
              <p key={`${voice.name}-${voice.message}`}>
                <span className="fc-chatroom-time">[{`12:${String(10 + index * 3).padStart(2, "0")}`}]</span>{" "}
                <strong>{voice.name}</strong> <span className="fc-fire-role">&lt;{voice.role}&gt;</span>: {voice.message}
              </p>
            ))}
          </div>

          <form className="fc-comms-compose fc-chatroom-compose">
            <input placeholder={`Message #${fire.name}...`} />
            <button type="button">Send</button>
          </form>
        </article>

        <aside className="fc-card fc-chatroom-members">
          <p className="fc-eyebrow">People in Room</p>
          <div className="fc-chatroom-member-list">
            {fire.travelerVoices.map((voice) => (
              <p key={`member-${voice.name}`}>
                <strong>{voice.name}</strong> <span className="fc-fire-role">{voice.role}</span>
              </p>
            ))}
            <p><strong>Room Keeper</strong> <span className="fc-fire-role">{fire.keeperPresent ? "Online" : "Away"}</span></p>
            <p><strong>Mentor</strong> <span className="fc-fire-role">{fire.mentorPresent ? "Online" : "Away"}</span></p>
          </div>
          <hr className="fc-chatroom-divider" />
          <p className="fc-eyebrow">Room Rules</p>
          <ul className="fc-guidance-list">
            {commonsPrinciples.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </aside>
      </section>
    </div>
  );
}
