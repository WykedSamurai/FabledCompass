import PrototypeWatermark from "../../components/layout/PrototypeWatermark";

export default function NetworkPage() {
  return (
    <div className="fc-page-stack fc-workspace-page fc-prototype-frame">
      <PrototypeWatermark />
      <section className="fc-workspace-hero">
        <p className="fc-eyebrow">Community Hub</p>
        <h1>Network</h1>
        <p>Build meaningful professional connections with the same interaction model as the Communication Hub.</p>
      </section>

      <section className="fc-network-grid">
        <article className="fc-card">
          <div className="fc-comms-header">
            <div>
              <p className="fc-eyebrow">Signal</p>
              <h2>Community Conversations</h2>
            </div>
          </div>

          <div className="fc-comms-tabs" role="tablist" aria-label="Network sections">
            <button type="button">Connections</button>
            <button type="button">Mentors</button>
            <button type="button">Groups</button>
          </div>

          <section className="fc-comms-panel">
            <p className="fc-eyebrow">Pinned</p>
            <article className="fc-conversation-card">
              <strong>Community Hub Guide</strong>
              <span>Find mentors, peer circles, and professional communities aligned with your goals.</span>
            </article>
          </section>

          <section className="fc-comms-panel">
            <p className="fc-eyebrow">Active spaces</p>
            <article className="fc-conversation-card">
              <strong>Customer Experience Circle</strong>
              <span>Weekly debriefs focused on communication and conflict resolution.</span>
            </article>
            <article className="fc-conversation-card">
              <strong>Career Transitions Network</strong>
              <span>Peer support and mentorship for role changes and growth plans.</span>
            </article>
          </section>

          <form className="fc-comms-compose">
            <input placeholder="Start a community message..." />
            <button type="button">Send</button>
          </form>
        </article>

        <aside className="fc-card fc-side-card">
          <p className="fc-eyebrow">Next Actions</p>
          <ul className="fc-guidance-list">
            <li>Connect with one mentor in your target career path.</li>
            <li>Join a group tied to your current competency goals.</li>
            <li>Share one evidence-backed project update this week.</li>
          </ul>
        </aside>
      </section>
    </div>
  );
}
