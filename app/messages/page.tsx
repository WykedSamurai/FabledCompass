import PrototypeWatermark from "../../components/layout/PrototypeWatermark";

const threads = [
  {
    name: "Compass Coach",
    context: "Portfolio guidance",
    preview: "Great work. Next, add one quantified example to your leadership evidence.",
    when: "Now"
  },
  {
    name: "Brightpath Recruiter",
    context: "Training Specialist application",
    preview: "Can you share one scenario example that shows conflict resolution?",
    when: "2h"
  },
  {
    name: "Customer Experience Circle",
    context: "Group discussion",
    preview: "This week's debrief starts Friday at 6 PM.",
    when: "1d"
  }
];

export default function MessagesPage() {
  return (
    <div className="fc-page-stack fc-workspace-page fc-prototype-frame">
      <PrototypeWatermark />
      <section className="fc-workspace-hero">
        <p className="fc-eyebrow">Communication Hub</p>
        <h1>Messages</h1>
        <p>Conversation tools stay connected to your portfolio and journey context.</p>
      </section>

      <section className="fc-network-grid">
        <div className="fc-page-stack">
          <article className="fc-card">
            <div className="fc-comms-tabs" role="tablist" aria-label="Message sections">
              <button type="button">All</button>
              <button type="button">Recruiters</button>
              <button type="button">Groups</button>
              <button type="button">Compass</button>
            </div>

            <div className="fc-thread-list">
              {threads.map((thread) => (
                <button className="fc-thread-item" key={thread.name} type="button">
                  <div>
                    <strong>{thread.name}</strong>
                    <p>{thread.context}</p>
                    <span>{thread.preview}</span>
                  </div>
                  <small>{thread.when}</small>
                </button>
              ))}
            </div>
          </article>

          <article className="fc-card">
            <div className="fc-card-header-row">
              <h2>Compass Coach</h2>
              <span className="fc-status-pill">Active</span>
            </div>
            <div className="fc-chat-log">
              <p><strong>Compass:</strong> You are one strong interview story away from a stronger application package.</p>
              <p><strong>You:</strong> What should I prepare first?</p>
              <p><strong>Compass:</strong> Use your Customer Recovery scenario result and connect it to a real workplace example.</p>
            </div>
            <form className="fc-comms-compose">
              <input placeholder="Reply to Compass..." />
              <button type="button">Send</button>
            </form>
          </article>
        </div>

        <aside className="fc-card fc-side-card">
          <p className="fc-eyebrow">Next Actions</p>
          <ul className="fc-guidance-list">
            <li>Reply to recruiter messages within one business day.</li>
            <li>Keep one active thread with Compass for weekly guidance.</li>
            <li>Pin the conversations tied to current applications.</li>
          </ul>
        </aside>
      </section>
    </div>
  );
}
