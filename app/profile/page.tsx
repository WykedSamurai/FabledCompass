export default function ProfilePage() {
  return (
    <>
      <section className="profile-hero">
        <p className="eyebrow">Navigator Profile</p>
        <h1>Profile and earned recognition</h1>
        <p>Career information and demonstrated workplace skills in one place.</p>
      </section>

      <section className="section section-narrow">
        <div className="profile-grid">
          <aside className="card">
            <div className="avatar">PC</div>
            <h2>Sample Navigator</h2>
            <p className="muted">Customer service and people operations professional</p>
            <p>Building a career profile through practical experience, workplace learning, and demonstrated skills.</p>
          </aside>

          <div>
            <article className="card">
              <p className="eyebrow">Demonstrated Skills</p>
              <h2>Badge Collection</h2>
              <div className="adventure-card">
                <div>
                  <h3>Customer Service Foundations</h3>
                  <p>Demonstrates foundational communication, empathy, professionalism, conflict resolution, and policy awareness in a customer complaint scenario.</p>
                  <div className="tag-row">
                    <span className="tag">Communication</span>
                    <span className="tag">Empathy</span>
                    <span className="tag">Professionalism</span>
                  </div>
                  <p className="muted">Prototype badge · Source: The Difficult Customer · Version 1</p>
                </div>
                <div className="badge-preview">
                  <div className="badge-seal">✦</div>
                  <strong>Foundations</strong>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
