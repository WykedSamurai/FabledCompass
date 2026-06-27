const applications = [
  {
    role: "Customer Experience Team Lead",
    company: "Northstar Market Group",
    status: "Submitted",
    updated: "2 days ago",
    note: "Application submitted with Professional Folio and scenario evidence."
  },
  {
    role: "Training Specialist",
    company: "Brightpath Services",
    status: "Interview",
    updated: "Today",
    note: "Phone interview scheduled. Review communication and conflict-resolution evidence."
  }
];

export default function ApplicationsPage() {
  return (
    <div className="fc-page-stack fc-workspace-page">
      <section className="fc-workspace-hero">
        <p className="fc-eyebrow">Applications</p>
        <h1>Application Tracker</h1>
        <p>Track where each opportunity stands and keep your next action clear.</p>
      </section>

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
          </article>
        ))}
      </section>
    </div>
  );
}
