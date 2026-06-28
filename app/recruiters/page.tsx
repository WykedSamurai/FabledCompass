import PrototypeWatermark from "../../components/layout/PrototypeWatermark";

const sixAttributes = [
  "Leadership",
  "Communication",
  "Problem Solving",
  "Professionalism",
  "Adaptability",
  "Collaboration"
] as const;

const recruiters = [
  {
    name: "Mira of Northstar",
    focus: "Customer leadership and frontline coaching",
    lookingFor: ["Leadership", "Communication", "Adaptability", "Service recovery proof"],
    status: "Reviewing candidates"
  },
  {
    name: "Jonas of Brightpath",
    focus: "Training, onboarding, and learning design",
    lookingFor: ["Communication", "Problem Solving", "Collaboration", "Teaching examples"],
    status: "Open to introductions"
  },
  {
    name: "Elara of Harbor & Pine",
    focus: "People operations and hospitality systems",
    lookingFor: ["Professionalism", "Collaboration", "Leadership", "Reliability evidence"],
    status: "Building talent bench"
  }
] as const;

const recruiterActions = [
  "Tie one Chronicle entry to each of the six core attributes.",
  "Pin one challenge result that demonstrates composure under pressure.",
  "Keep one short professional introduction ready for outreach or follow-up."
];

const comingLater = [
  "Recruiter profiles and verification",
  "Job posting tools",
  "Candidate shortlists",
  "Private recruiter messages",
  "Evidence-based candidate matching"
];

export default function RecruitersPage() {
  return (
    <div className="fc-page-stack fc-workspace-page fc-prototype-frame">
      <PrototypeWatermark />
      <section className="fc-workspace-hero">
        <p className="fc-eyebrow">Recruiters Guild</p>
        <h1>Recruiters</h1>
        <p>A prototype hiring space where companies can find evidence-backed candidates from the Fabled Compass job board.</p>
      </section>

      <section className="fc-workspace-grid">
        <div className="fc-page-stack">
          <article className="fc-card">
            <div className="fc-card-header-row">
              <div>
                <p className="fc-eyebrow">Hiring Board</p>
                <h2>Active recruiters</h2>
              </div>
              <span className="fc-muted">{recruiters.length} hiring leads in view</span>
            </div>
            <div className="fc-group-grid">
              {recruiters.map((recruiter) => (
                <article className="fc-card" key={recruiter.name}>
                  <div className="fc-card-header-row">
                    <div>
                      <h3>{recruiter.name}</h3>
                      <p className="fc-muted">{recruiter.focus}</p>
                    </div>
                    <span className="fc-status-pill">{recruiter.status}</span>
                  </div>
                  <p className="fc-eyebrow">Looking for</p>
                  <div className="fc-inline-tags">
                    {recruiter.lookingFor.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                  <div className="fc-action-row">
                    <button className="fc-button" type="button">View Recruiter</button>
                  </div>
                </article>
              ))}
            </div>
          </article>

          <article className="fc-card">
            <p className="fc-eyebrow">What recruiters need</p>
            <h2>Believable proof over vague claims</h2>
            <ul className="fc-guidance-list">
              <li>Clear role-aligned evidence from your Chronicle and assessments.</li>
              <li>Concise summaries that explain what you handled, improved, or delivered.</li>
              <li>Signals across all six attributes — not just keywords.</li>
            </ul>
          </article>
        </div>

        <aside className="fc-page-stack">
          <article className="fc-card fc-side-card">
            <p className="fc-eyebrow">Six Attribute Signals</p>
            <div className="fc-inline-tags">
              {sixAttributes.map((attribute) => (
                <span key={attribute}>{attribute}</span>
              ))}
            </div>
          </article>

          <article className="fc-card fc-side-card">
            <p className="fc-eyebrow">Next Actions</p>
            <ul className="fc-guidance-list">
              {recruiterActions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
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
