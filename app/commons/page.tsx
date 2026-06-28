type FireRoom = {
  name: string;
  description: string;
  travelers: number;
  keeperPresent: boolean;
  mentorPresent: boolean;
};

const fires: FireRoom[] = [
  { name: "Great Hall", description: "Daily guild chatter, introductions, and cross-path support.", travelers: 34, keeperPresent: true, mentorPresent: true },
  { name: "HR Fire", description: "Hiring rituals, interview prep, and workplace policy navigation.", travelers: 22, keeperPresent: true, mentorPresent: false },
  { name: "Technology Fire", description: "Tech careers, portfolio builds, and practical implementation tips.", travelers: 29, keeperPresent: false, mentorPresent: true },
  { name: "Hospitality Fire", description: "Service leadership, guest recovery, and frontline growth stories.", travelers: 18, keeperPresent: true, mentorPresent: false },
  { name: "Education Fire", description: "Learning pathways, certification planning, and training strategy.", travelers: 16, keeperPresent: false, mentorPresent: true },
  { name: "Career Changers", description: "Role pivots, transferable skills, and transition support.", travelers: 27, keeperPresent: true, mentorPresent: true },
  { name: "Student Commons", description: "Early-career guidance, internships, and starter portfolio help.", travelers: 20, keeperPresent: false, mentorPresent: true },
  { name: "Mentor Pavilion", description: "High-signal coaching office hours and evidence-first feedback.", travelers: 12, keeperPresent: true, mentorPresent: true }
];

const principles = [
  "Be respectful.",
  "Share knowledge freely.",
  "Support evidence-based advice.",
  "Help Travelers grow.",
  "Leave the Commons better than you found it."
];

const comingLater = [
  "Live text chat",
  "Temporary Campfires",
  "Guild Halls",
  "Mentor Q&A",
  "Library summaries"
];

export default function CommonsPage() {
  return (
    <div className="fc-page-stack fc-workspace-page">
      <section className="fc-workspace-hero">
        <p className="fc-eyebrow">The Commons</p>
        <h1>The Commons</h1>
        <p>A place where Travelers gather to share experience, ask questions, and help each other grow.</p>
      </section>

      <section className="fc-workspace-grid">
        <article className="fc-card">
          <div className="fc-card-header-row">
            <h2>Fires</h2>
            <span className="fc-muted">{fires.length} active rooms</span>
          </div>
          <div className="fc-group-grid">
            {fires.map((fire) => (
              <article className="fc-card" key={fire.name}>
                <div className="fc-card-header-row">
                  <div>
                    <p className="fc-eyebrow">Fire</p>
                    <h3>{fire.name}</h3>
                  </div>
                  <span className="fc-status-pill">{fire.travelers} Travelers</span>
                </div>
                <p className="fc-muted">{fire.description}</p>
                <div className="fc-inline-tags">
                  <span>{fire.keeperPresent ? "Keeper present" : "Keeper away"}</span>
                  <span>{fire.mentorPresent ? "Mentor present" : "Mentor away"}</span>
                </div>
                <div className="fc-action-row">
                  <button className="fc-button" type="button">Enter Fire</button>
                </div>
              </article>
            ))}
          </div>
        </article>

        <aside className="fc-page-stack">
          <article className="fc-card fc-side-card">
            <p className="fc-eyebrow">Community Principles</p>
            <ul className="fc-guidance-list">
              {principles.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="fc-card fc-side-card">
            <p className="fc-eyebrow">Today's Prompt</p>
            <h3>What is one professional lesson you learned the hard way?</h3>
          </article>

          <article className="fc-card fc-side-card">
            <p className="fc-eyebrow">Coming Later</p>
            <ul className="fc-guidance-list">
              {comingLater.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </aside>
      </section>
    </div>
  );
}
