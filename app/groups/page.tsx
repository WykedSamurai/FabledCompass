import PrototypeWatermark from "../../components/layout/PrototypeWatermark";

const groups = [
  {
    name: "Customer Experience Circle",
    focus: "Communication, empathy, escalation",
    members: 42,
    cadence: "Weekly debrief",
    status: "Joined"
  },
  {
    name: "Career Transitions Network",
    focus: "Role changes and growth planning",
    members: 58,
    cadence: "Twice monthly",
    status: "Suggested"
  },
  {
    name: "Leadership Signals Lab",
    focus: "Coaching and professionalism evidence",
    members: 34,
    cadence: "Weekly practice",
    status: "Suggested"
  }
];

export default function GroupsPage() {
  return (
    <div className="fc-page-stack fc-workspace-page fc-prototype-frame">
      <PrototypeWatermark />
      <section className="fc-workspace-hero">
        <p className="fc-eyebrow">Alliance Journey</p>
        <h1>Guilds</h1>
        <p>Collaborate with peers through focused communities and guided discussion.</p>
      </section>

      <section className="fc-workspace-grid">
        <div className="fc-group-grid">
          {groups.map((group) => (
            <article className="fc-card" key={group.name}>
              <div className="fc-card-header-row">
                <h2>{group.name}</h2>
                <span className="fc-status-pill">{group.status}</span>
              </div>
              <p className="fc-muted">{group.focus}</p>
              <p>{group.members} members • {group.cadence}</p>
              <div className="fc-action-row">
                <button className="fc-button" type="button">{group.status === "Joined" ? "Open Group" : "Join Group"}</button>
              </div>
            </article>
          ))}
        </div>

        <aside className="fc-card fc-side-card">
          <p className="fc-eyebrow">Guild Strategy</p>
          <ul className="fc-guidance-list">
            <li>Stay active in one core group tied to your target role.</li>
            <li>Use group feedback to strengthen your application stories.</li>
            <li>Share one evidence-backed insight after each challenge.</li>
          </ul>
        </aside>
      </section>
    </div>
  );
}
