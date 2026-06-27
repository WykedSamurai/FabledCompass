const networkHighlights = [
  "Mentor matching and professional introductions",
  "Connection goals linked to your career path",
  "Evidence-aware conversation starters"
];

export default function NetworkPage() {
  return (
    <div className="fc-page-stack fc-workspace-page">
      <section className="fc-workspace-hero">
        <p className="fc-eyebrow">Community Journey</p>
        <h1>Network</h1>
        <p>Build meaningful professional connections that support your growth plan.</p>
      </section>

      <article className="fc-card">
        <h2>What is coming next</h2>
        <ul className="fc-guidance-list">
          {networkHighlights.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </article>
    </div>
  );
}
