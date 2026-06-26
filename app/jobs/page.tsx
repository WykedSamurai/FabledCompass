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
    <>
      <section className="page-hero">
        <p className="eyebrow">Career Board</p>
        <h1>Find the next path worth taking.</h1>
        <p>This prototype uses sample listings to demonstrate how careers and earned skills will connect.</p>
      </section>
      <section className="section section-narrow">
        <div className="jobs-grid">
          {jobs.map((job) => (
            <article className="card job-card" key={`${job.company}-${job.title}`}>
              <div>
                <p className="eyebrow">{job.type}</p>
                <h2>{job.title}</h2>
                <strong>{job.company}</strong>
                <p className="muted">{job.location}</p>
                <p>{job.summary}</p>
              </div>
              <button className="button button-dark" type="button">View Role</button>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
