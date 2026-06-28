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
              <p className="fc-eyebrow">Adventure Update</p>
              <h2>Scenario challenges moved to Assessments</h2>
            </div>
            <span className="fc-status-pill">Ready</span>
          </div>
          <p className="fc-muted">Your live scenario runs now launch from Assessments so roleplay quizzes and challenge scoring stay in one place.</p>
          <div className="fc-inline-tags">
            <span>Assessments Hub</span>
            <span>Roleplay Quizzes</span>
            <span>Scenario Runs</span>
          </div>
          <div className="fc-action-row">
            <Link className="fc-button" href="/assessments">Open Assessments</Link>
          </div>
        </article>

        <aside className="fc-card fc-side-card">
          <p className="fc-eyebrow">Now Featured</p>
          <h3>Service Recovery Constellation</h3>
          <p className="fc-muted">The first live scenario now sits in Assessments with the rest of your roleplay tracks.</p>
          <div className="fc-badge-seal" aria-hidden="true">✦</div>
        </aside>
      </section>
    </div>
  );
}
