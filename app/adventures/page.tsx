import Link from "next/link";

export default function AdventuresPage() {
  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">Adventure Library</p>
        <h1>Practice before the moment matters.</h1>
        <p>Work through realistic workplace situations, understand the consequences of your choices, and build evidence of practical skill.</p>
      </section>

      <section className="section section-narrow">
        <article className="card adventure-card">
          <div>
            <p className="eyebrow">Foundational Adventure</p>
            <h2>The Difficult Customer</h2>
            <p className="muted">A customer is frustrated with a purchase problem and demands an immediate solution. Clarify the issue, work within policy, and decide when escalation is appropriate.</p>
            <div className="tag-row">
              <span className="tag">Communication</span>
              <span className="tag">Empathy</span>
              <span className="tag">Professionalism</span>
              <span className="tag">Conflict Resolution</span>
              <span className="tag">5–7 minutes</span>
            </div>
            <Link className="button button-dark" href="/adventures/difficult-customer">Start Adventure</Link>
          </div>
          <aside className="badge-preview">
            <div className="badge-seal">✦</div>
            <strong>Customer Service Foundations</strong>
            <p className="muted">Available badge</p>
          </aside>
        </article>
      </section>
    </>
  );
}
