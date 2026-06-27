import Link from "next/link";

export default function AdventuresPage() {
  return (
    <div className="fc-page-stack fc-workspace-page">
      <section className="fc-workspace-hero">
        <p className="fc-eyebrow">Adventure Journey</p>
        <h1>Adventure Library</h1>
        <p>Practice before the moment matters with evidence-backed scenario challenges.</p>
      </section>

      <section className="fc-workspace-grid">
        <article className="fc-card fc-adventure-card">
          <div className="fc-card-header-row">
            <div>
              <p className="fc-eyebrow">Foundational Challenge</p>
              <h2>The Difficult Customer</h2>
            </div>
            <span className="fc-status-pill">Ready</span>
          </div>
          <p className="fc-muted">A customer is frustrated with a purchase problem and demands an immediate solution. Clarify the issue, work within policy, and decide when escalation is appropriate.</p>
          <div className="fc-inline-tags">
            <span>Communication</span>
            <span>Empathy</span>
            <span>Professionalism</span>
            <span>Conflict Resolution</span>
            <span>5–7 minutes</span>
          </div>
          <div className="fc-action-row">
            <Link className="fc-button" href="/adventures/difficult-customer">Start Challenge</Link>
          </div>
        </article>

        <aside className="fc-card fc-side-card">
          <p className="fc-eyebrow">Badge Reward</p>
          <h3>Customer Service Foundations</h3>
          <p className="fc-muted">Earned by completing the scenario with passing competency thresholds.</p>
          <div className="fc-badge-seal" aria-hidden="true">✦</div>
        </aside>
      </section>
    </div>
  );
}
