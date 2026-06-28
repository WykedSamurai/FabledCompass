import Link from "next/link";
import { notFound } from "next/navigation";
import { commonsPrinciples, getFire } from "../../../lib/commons";

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
      <section className="fc-workspace-hero">
        <p className="fc-eyebrow">Fire Room</p>
        <h1>{fire.name}</h1>
        <p>{fire.welcome}</p>
      </section>

      <section className="fc-network-grid">
        <div className="fc-page-stack">
          <article className="fc-card">
            <div className="fc-card-header-row">
              <div>
                <p className="fc-eyebrow">Room Status</p>
                <h2>Gathered at the fire</h2>
              </div>
              <span className="fc-status-pill">{fire.travelers} Travelers</span>
            </div>
            <p className="fc-muted">{fire.description}</p>
            <div className="fc-inline-tags">
              <span>{fire.keeperPresent ? "Keeper present" : "Keeper away"}</span>
              <span>{fire.mentorPresent ? "Mentor present" : "Mentor away"}</span>
            </div>
            <div className="fc-action-row">
              <Link className="fc-button" href="/commons">Return to The Commons</Link>
            </div>
          </article>

          <article className="fc-card">
            <p className="fc-eyebrow">Today's Spark</p>
            <h2>{fire.prompt}</h2>
            <div className="fc-inline-tags">
              {fire.activeTopics.map((topic) => (
                <span key={topic}>{topic}</span>
              ))}
            </div>
          </article>

          <article className="fc-card">
            <p className="fc-eyebrow">Traveler Voices</p>
            <div className="fc-chat-log">
              {fire.travelerVoices.map((voice) => (
                <p key={`${voice.name}-${voice.message}`}>
                  <strong>{voice.name}</strong> <span className="fc-fire-role">({voice.role})</span>: {voice.message}
                </p>
              ))}
            </div>
            <form className="fc-comms-compose">
              <input placeholder="Speak into the fire..." />
              <button type="button">Send</button>
            </form>
          </article>
        </div>

        <aside className="fc-page-stack">
          <article className="fc-card fc-side-card">
            <p className="fc-eyebrow">Fire Customs</p>
            <ul className="fc-guidance-list">
              {commonsPrinciples.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="fc-card fc-side-card">
            <p className="fc-eyebrow">What to share here</p>
            <ul className="fc-guidance-list">
              <li>One clear question or story from your current journey.</li>
              <li>Evidence, examples, or context that helps others guide you.</li>
              <li>What kind of support you want from Keepers, Mentors, or fellow Travelers.</li>
            </ul>
          </article>
        </aside>
      </section>
    </div>
  );
}
