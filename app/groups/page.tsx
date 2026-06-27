const groupHighlights = [
  "Career-focused circles by role and industry",
  "Facilitated challenge debriefs and peer learning",
  "Community goals tied to competencies"
];

export default function GroupsPage() {
  return (
    <div className="fc-page-stack fc-workspace-page">
      <section className="fc-workspace-hero">
        <p className="fc-eyebrow">Community Journey</p>
        <h1>Groups</h1>
        <p>Collaborate with peers through focused communities and guided discussion.</p>
      </section>

      <article className="fc-card">
        <h2>What is coming next</h2>
        <ul className="fc-guidance-list">
          {groupHighlights.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </article>
    </div>
  );
}
