import PrototypeWatermark from "../../components/layout/PrototypeWatermark";

const baseThreads = [
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

export default async function MessagesPage({
  searchParams
}: {
  searchParams?: Promise<{ candidateId?: string; candidateName?: string }>;
}) {
  const query = (await searchParams) ?? {};
  const candidateId = query.candidateId;
  const candidateName = query.candidateName;

  const recruiterThread =
    candidateId && candidateName
      ? {
          name: candidateName,
          context: `Recruiter outreach · Candidate ${candidateId}`,
          preview: "Start your first contact message with role context and interview timeline.",
          when: "Now"
        }
      : null;

  const threads = recruiterThread ? [recruiterThread, ...baseThreads] : baseThreads;
  const composePlaceholder = recruiterThread
    ? `Message ${candidateName} about the opportunity...`
    : "Send a raven reply...";

  return (
    <div className="fc-page-stack fc-workspace-page fc-prototype-frame">
      <PrototypeWatermark />
      <section className="fc-workspace-hero">
        <p className="fc-eyebrow">Signal Hub</p>
        <h1>Signal Raven</h1>
        <p>Conversation tools stay connected to your portfolio and journey context.</p>
      </section>

      <section className="fc-network-grid">
        <div className="fc-page-stack">
          <article className="fc-card">
            <div className="fc-comms-tabs" role="tablist" aria-label="Signal sections">
              <button type="button">All</button>
              <button type="button">Recruiters</button>
              <button type="button">Groups</button>
              <button type="button">Guide</button>
            </div>

            <div className="fc-thread-list">
              {threads.map((thread) => (
                <button className="fc-thread-item" key={`${thread.name}-${thread.context}`} type="button">
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
              <h2>{recruiterThread ? "Recruiter Outreach Thread" : "Compass Guide"}</h2>
              <span className="fc-status-pill">Online</span>
            </div>
            <div className="fc-chat-log">
              {recruiterThread ? (
                <>
                  <p>
                    <strong>Recruiter:</strong> Hi {candidateName}, I reviewed your portfolio and wanted to discuss a role match.
                  </p>
                  <p>
                    <strong>Draft:</strong> Start by referencing one evidence highlight and expected timeline.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong>Guide:</strong> You are one strong interview story away from a stronger application package.
                  </p>
                  <p>
                    <strong>You:</strong> What should I prepare first?
                  </p>
                  <p>
                    <strong>Guide:</strong> Use your Customer Recovery scenario result and connect it to a real workplace example.
                  </p>
                </>
              )}
            </div>
            <form className="fc-comms-compose">
              <input placeholder={composePlaceholder} />
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
