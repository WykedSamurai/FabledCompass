import PrototypeWatermark from "../../components/layout/PrototypeWatermark";

const jobs = [
  {
    title: "Customer Experience Team Lead",
    company: "Northstar Market Group",
    location: "Jacksonville, FL · On-site",
    type: "Full-time",
    summary: "Coach a frontline service team, resolve escalated concerns, and support daily operations."
  },
  {
    title: "People Operations Coordinator",
    company: "Harbor & Pine Hospitality",
    location: "Remote · United States",
    type: "Full-time",
    summary: "Support onboarding, employee records, scheduling, and internal communication across a growing hospitality group."
  },
  {
    title: "Training Specialist",
    company: "Brightpath Services",
    location: "Orlando, FL · Hybrid",
    type: "Full-time",
    summary: "Create practical training experiences and help managers develop consistent coaching practices."
  }
];

export default function JobsPage() {
  return (
    <div className="fc-page-stack fc-workspace-page fc-prototype-frame">
      <PrototypeWatermark />
      <section className="fc-workspace-hero">
        <p className="fc-eyebrow">Career Board</p>
        <h1>Open Opportunities</h1>
        <p>Browse roles that align with your professional strengths and demonstrated evidence.</p>
      </section>

      <section className="fc-job-list">
        {jobs.map((job) => (
          <article className="fc-card fc-job-card" key={`${job.company}-${job.title}`}>
            <div className="fc-card-header-row">
              <div>
                <p className="fc-eyebrow">{job.type}</p>
                <h2>{job.title}</h2>
                <p className="fc-muted">{job.company} • {job.location}</p>
              </div>
              <button className="fc-button" type="button">View Role</button>
            </div>
            <p>{job.summary}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
