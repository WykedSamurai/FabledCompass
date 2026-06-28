import PrototypeWatermark from "../../components/layout/PrototypeWatermark";

const competencyHighlights = [
  "Evidence-backed competency trends by category",
  "Reasoned score explanations tied to specific artifacts",
  "Recommended actions to strengthen weaker competencies"
];

export default function CompetenciesPage() {
  return (
    <div className="fc-page-stack fc-workspace-page fc-prototype-frame">
      <PrototypeWatermark />
      <section className="fc-workspace-hero">
        <p className="fc-eyebrow">Adventure Journey</p>
        <h1>Competencies</h1>
        <p>Track demonstrated competency growth and convert insights into action plans.</p>
      </section>

      <article className="fc-card">
        <h2>What is coming next</h2>
        <ul className="fc-guidance-list">
          {competencyHighlights.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </article>
    </div>
  );
}
