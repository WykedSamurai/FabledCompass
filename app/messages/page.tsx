const hubHighlights = [
  "Compass coach conversations connected to your current goals",
  "Recruiter and employer threads inside the workspace",
  "Message context linked to evidence and profile updates"
];

export default function MessagesPage() {
  return (
    <div className="fc-page-stack fc-workspace-page">
      <section className="fc-workspace-hero">
        <p className="fc-eyebrow">Communication Hub</p>
        <h1>Messages</h1>
        <p>Conversation tools stay connected to your portfolio and journey context.</p>
      </section>

      <article className="fc-card">
        <h2>What is coming next</h2>
        <ul className="fc-guidance-list">
          {hubHighlights.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </article>
    </div>
  );
}
