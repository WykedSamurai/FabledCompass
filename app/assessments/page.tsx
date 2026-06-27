const assessmentHighlights = [
  "Baseline professional strengths and growth opportunities",
  "Assessment outcomes translated into clear improvement tasks",
  "Results linked to Professional Compass progress"
];

export default function AssessmentsPage() {
  return (
    <div className="fc-page-stack fc-workspace-page">
      <section className="fc-workspace-hero">
        <p className="fc-eyebrow">Adventure Journey</p>
        <h1>Assessments</h1>
        <p>Run structured assessments that explain scores and map to next actions.</p>
      </section>

      <article className="fc-card">
        <h2>What is coming next</h2>
        <ul className="fc-guidance-list">
          {assessmentHighlights.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </article>
    </div>
  );
}
