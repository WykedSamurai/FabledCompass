import { getArchetype, archetypes } from "../../lib/archetypes";
import {
  buildConstellation,
  calculateAllCompetencies,
  calculateProfessionalCompass,
  sampleEvidence
} from "../../lib/evidence";

const primaryAttributes = [
  { label: "Leadership", key: "leadership", short: "LDR" },
  { label: "Communication", key: "communication", short: "COM" },
  { label: "Problem Solving", key: "problemSolving", short: "SOL" },
  { label: "Professionalism", key: "professionalism", short: "PRO" },
  { label: "Adaptability", key: "adaptability", short: "ADP" },
  { label: "Collaboration", key: "collaboration", short: "COL" }
] as const;

export default function DashboardPage() {
  const archetype = getArchetype("traveler");
  const competencies = calculateAllCompetencies(sampleEvidence);
  const compass = calculateProfessionalCompass(competencies);
  const leadershipConstellation = buildConstellation("leadership", sampleEvidence);
  const topCompetencies = [...competencies].sort((first, second) => second.progress - first.progress).slice(0, 5);
  const attributeScores = {
    leadership: compass.leadership,
    communication: compass.communication,
    problemSolving: compass.problemSolving,
    professionalism: compass.professionalism,
    adaptability: competencies.find((competency) => competency.id === "adaptability")?.progress ?? 0,
    collaboration: competencies.find((competency) => competency.id === "teamwork")?.progress ?? 0
  };

  return (
    <div className="fc-character-v2">
      <section className="fc-v2-hero">
        <div className="fc-v2-portrait" aria-hidden="true">{archetype.icon}</div>
        <div className="fc-v2-identity">
          <p className="fc-eyebrow">Professional Character</p>
          <h1>Career Navigator</h1>
          <label className="fc-v2-select-label" htmlFor="archetype-select">Archetype</label>
          <select className="fc-v2-select" id="archetype-select" defaultValue={archetype.id}>
            {Object.values(archetypes).map((option) => (
              <option value={option.id} key={option.id}>{option.icon} {option.name}</option>
            ))}
          </select>
          <p className="fc-v2-motto">{archetype.motto}</p>
          <p className="fc-muted">Personal Legend: Build a career story through evidence, reflection, and growth.</p>
        </div>
        <div className="fc-v2-rank-card">
          <span>Level</span><strong>7</strong>
          <span>Path</span><strong>Active</strong>
          <span>Portfolio</span><strong>{compass.overall}%</strong>
        </div>
      </section>

      <section className="fc-v2-board">
        <details className="fc-v2-panel fc-v2-attributes" open>
          <summary><strong>Six Attributes</strong><span>{compass.overall}% overall</span></summary>
          <div className="fc-v2-attribute-grid">
            {primaryAttributes.map((attribute) => (
              <div className="fc-v2-attribute" key={attribute.key}>
                <span>{attribute.short}</span>
                <strong>{attribute.label}</strong>
                <b>{attributeScores[attribute.key]}%</b>
                <i><span style={{ width: `${attributeScores[attribute.key]}%` }} /></i>
              </div>
            ))}
          </div>
        </details>

        <details className="fc-v2-panel">
          <summary><strong>Competencies</strong><span>{topCompetencies.length} active</span></summary>
          <ul className="fc-v2-list">
            {topCompetencies.map((competency) => (
              <li key={competency.id}><strong>{competency.label}</strong><span>{competency.progress}% / {competency.evidenceCount} evidence</span></li>
            ))}
          </ul>
        </details>

        <details className="fc-v2-panel">
          <summary><strong>Evidence</strong><span>{sampleEvidence.length} records</span></summary>
          <ul className="fc-v2-list">
            {sampleEvidence.map((evidence) => (
              <li key={evidence.id}><strong>{evidence.title}</strong><span>{evidence.score}% / {evidence.verification}</span></li>
            ))}
          </ul>
        </details>

        <details className="fc-v2-panel">
          <summary><strong>Constellations</strong><span>{leadershipConstellation.completion}% Leadership</span></summary>
          <div className="fc-v2-stars">
            {leadershipConstellation.stars.map((star) => (
              <span className={star.active ? "is-active" : ""} key={star.id}>✦</span>
            ))}
          </div>
        </details>

        <details className="fc-v2-panel">
          <summary><strong>Professional Compass</strong><span>{compass.overall}%</span></summary>
          <div className="fc-v2-compass">
            <span>Leadership {compass.leadership}%</span>
            <span>Communication {compass.communication}%</span>
            <span>Problem Solving {compass.problemSolving}%</span>
            <span>Professionalism {compass.professionalism}%</span>
          </div>
        </details>

        <details className="fc-v2-panel">
          <summary><strong>Next Challenge</strong><span>Customer Recovery</span></summary>
          <p className="fc-muted">Continue building evidence through a professional scenario.</p>
          <a className="fc-v2-action" href="/adventures/difficult-customer">Begin Challenge</a>
        </details>
      </section>
    </div>
  );
}
