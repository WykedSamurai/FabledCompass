import PrototypeWatermark from "../../components/layout/PrototypeWatermark";

type ApplicationStatus = "Draft" | "Submitted" | "Interview" | "Offer";

type ApplicationEntry = {
  role: string;
  company: string;
  status: ApplicationStatus;
  updated: string;
  note: string;
  nextAction: string;
  evidence: string[];
  timeline: string[];
};

const lanes: ApplicationStatus[] = ["Draft", "Submitted", "Interview", "Offer"];

const applications = [
  {
    role: "Customer Experience Team Lead",
    company: "Northstar Market Group",
    status: "Submitted",
    updated: "2 days ago",
    note: "Application submitted with Professional Folio and scenario evidence.",
    nextAction: "Follow up with recruiter in 48 hours.",
    evidence: ["Customer Recovery scenario result", "Portfolio Strength: 51%"],
    timeline: ["Resume tailored and uploaded", "Application sent", "Awaiting response"]
  },
  {
    role: "Training Specialist",
    company: "Brightpath Services",
    status: "Interview",
    updated: "Today",
    note: "Phone interview scheduled. Review communication and conflict-resolution evidence.",
    nextAction: "Prepare interview examples tied to evidence before tomorrow.",
    evidence: ["Communication trend highlights", "Leadership constellation progress"],
    timeline: ["Application sent", "Recruiter screening complete", "Interview booked"]
  }
] as const satisfies ApplicationEntry[];

export default function ApplicationsPage() {
  const pipelineCounts = lanes.map((lane) => ({
    lane,
    count: applications.filter((application) => application.status === lane).length
  }));

  return (
    <div className="fc-page-stack fc-workspace-page fc-prototype-frame">
      <PrototypeWatermark />
      <section className="fc-workspace-hero">
        <p className="fc-eyebrow">Applications</p>
        <h1>Application Tracker</h1>
        <p>Track where each opportunity stands and keep your next action clear.</p>
      </section>

      <section className="fc-workspace-grid">
        <div className="fc-page-stack">
          <article className="fc-card">
            <div className="fc-card-header-row">
              <h2>Pipeline</h2>
              <span className="fc-muted">{applications.length} active applications</span>
            </div>
            <div className="fc-pipeline-grid">
              {pipelineCounts.map((item) => (
                <div className="fc-pipeline-lane" key={item.lane}>
                  <p>{item.lane}</p>
                  <strong>{item.count}</strong>
                </div>
              ))}
            </div>
          </article>

          <section className="fc-job-list">
            {applications.map((application) => (
              <article className="fc-card fc-job-card" key={`${application.company}-${application.role}`}>
                <div className="fc-card-header-row">
                  <div>
                    <p className="fc-eyebrow">{application.status}</p>
                    <h2>{application.role}</h2>
                    <p className="fc-muted">{application.company} • Updated {application.updated}</p>
                  </div>
                  <span className="fc-status-pill">{application.status}</span>
                </div>
                <p>{application.note}</p>
                <p className="fc-application-next"><strong>Next action:</strong> {application.nextAction}</p>
                <div className="fc-inline-tags">
                  {application.evidence.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
                <ul className="fc-application-timeline">
                  {application.timeline.map((entry) => (
                    <li key={entry}>{entry}</li>
                  ))}
                </ul>
              </article>
            ))}
          </section>
        </div>

        <aside className="fc-card fc-side-card">
          <p className="fc-eyebrow">Today</p>
          <h3>Application Actions</h3>
          <ul className="fc-guidance-list">
            <li>Send one follow-up for submitted applications with no response.</li>
            <li>Attach one evidence example to each interview prep note.</li>
            <li>Review portfolio visibility before sharing with employers.</li>
          </ul>

          <p className="fc-eyebrow">This week</p>
          <ul className="fc-guidance-list">
            <li>Move one draft application to submitted.</li>
            <li>Log interview outcomes and convert insights into next steps.</li>
          </ul>
        </aside>
      </section>
    </div>
  );
}
