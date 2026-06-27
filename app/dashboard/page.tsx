import { AtlasButton, AtlasCard, AtlasHeader } from "../../components/atlas";
import { getArchetype } from "../../lib/archetypes";
import {
  buildConstellation,
  calculateAllCompetencies,
  calculateProfessionalCompass,
  sampleEvidence
} from "../../lib/evidence";

const primaryAttributes = [
  { label: "Leadership", key: "leadership" },
  { label: "Communication", key: "communication" },
  { label: "Problem Solving", key: "problemSolving" },
  { label: "Professionalism", key: "professionalism" },
  { label: "Adaptability", key: "adaptability" },
  { label: "Collaboration", key: "collaboration" }
] as const;

export default function DashboardPage() {
  const archetype = getArchetype("traveler");
  const competencies = calculateAllCompetencies(sampleEvidence);
  const compass = calculateProfessionalCompass(competencies);
  const leadershipConstellation = buildConstellation("leadership", sampleEvidence);
  const topCompetencies = [...competencies].sort((first, second) => second.progress - first.progress).slice(0, 4);
  const attributeScores = {
    leadership: compass.leadership,
    communication: compass.communication,
    problemSolving: compass.problemSolving,
    professionalism: compass.professionalism,
    adaptability: competencies.find((competency) => competency.id === "adaptability")?.progress ?? 0,
    collaboration: competencies.find((competency) => competency.id === "teamwork")?.progress ?? 0
  };

  return (
    <div className="fc-page-stack fc-compact-sheet">
      <section className="fc-character-sheet-hero">
        <div>
          <p className="fc-eyebrow">Professional Character Sheet</p>
          <h1>Career Navigator</h1>
          <div className="fc-archetype-line">
            <span>{archetype.icon}</span>
            <strong>{archetype.name}</strong>
            <em>{archetype.motto}</em>
          </div>
          <p className="fc-muted">Personal Legend: Build a career story through evidence, reflection, and growth.</p>
        </div>
        <div className="fc-character-summary">
          <span>Level 7</span>
          <span>Career Path Active</span>
          <strong>{compass.overall}% Portfolio</strong>
        </div>
      </section>

      <section className="fc-character-sheet-grid">
        <details className="fc-sheet-section" open>
          <summary>Six Attributes <span>{compass.overall}% overall</span></summary>
          <div className="fc-attribute-grid">
            {primaryAttributes.map((attribute) => (
              <div className="fc-attribute-row" key={attribute.key}>
                <span>{attribute.label}</span>
                <strong>{attributeScores[attribute.key]}%</strong>
              </div>
            ))}
          </div>
        </details>

        <details className="fc-sheet-section">
          <summary>Professional Compass <span>{compass.overall}%</span></summary>
          <div className="fc-compass-placeholder" aria-label="Professional Compass scores">
            <span>Leadership {compass.leadership}%</span>
            <span>Communication {compass.communication}%</span>
            <span>Problem Solving {compass.problemSolving}%</span>
            <span>Professionalism {compass.professionalism}%</span>
            <strong>{compass.overall}%</strong>
          </div>
        </details>

        <details className="fc-sheet-section">
          <summary>Skills <span>{topCompetencies.length} active signals</span></summary>
          <ul className="fc-evidence-list">
            {topCompetencies.map((competency) => (
              <li key={competency.id}>
                <strong>{competency.label}</strong>
                <span>{competency.progress}% - {competency.evidenceCount} evidence</span>
              </li>
            ))}
          </ul>
        </details>

        <details className="fc-sheet-section">
          <summary>Evidence <span>{sampleEvidence.length} records</span></summary>
          <ul className="fc-evidence-list">
            {sampleEvidence.map((evidence) => (
              <li key={evidence.id}>
                <strong>{evidence.title}</strong>
                <span>{evidence.score}% - {evidence.verification}</span>
              </li>
            ))}
          </ul>
        </details>

        <details className="fc-sheet-section">
          <summary>Constellations <span>{leadershipConstellation.completion}% Leadership</span></summary>
          <div className="fc-constellation-list">
            {leadershipConstellation.stars.map((star) => (
              <span className={star.active ? "is-active" : ""} key={star.id}>*</span>
            ))}
          </div>
        </details>

        <AtlasCard>
          <AtlasHeader eyebrow="Next Step" title="Continue Journey" />
          <p className="fc-muted">Customer Recovery is ready to continue building evidence.</p>
          <AtlasButton href="/adventures/difficult-customer">Begin Challenge</AtlasButton>
        </AtlasCard>
      </section>
    </div>
  );
}
