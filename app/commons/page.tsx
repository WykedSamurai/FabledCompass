import Link from "next/link";
import { commonsComingLater, commonsPrinciples, fires } from "../../lib/commons";

export default function CommonsPage() {
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
                  <span className="fc-status-pill">{fire.travelers} Travelers</span>
                </div>
                <p className="fc-muted">{fire.description}</p>
                <div className="fc-inline-tags">
                  <span>{fire.keeperPresent ? "Keeper present" : "Keeper away"}</span>
                  <span>{fire.mentorPresent ? "Mentor present" : "Mentor away"}</span>
                </div>
                <div className="fc-action-row">
                  <Link className="fc-button" href={`/commons/${fire.slug}`}>Enter Fire</Link>
                </div>
              </article>
            ))}
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
