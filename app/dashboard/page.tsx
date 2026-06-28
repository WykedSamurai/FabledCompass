import { AtlasButton } from "../../components/atlas";
import { archetypes, getArchetype, type ArchetypeId } from "../../lib/archetypes";
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
  const archetypeIds = Object.keys(archetypes) as ArchetypeId[];
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
        <div className="fc-identity-core">
          <div className="fc-archetype-portrait" aria-hidden="true">{archetype.icon}</div>
          <div>
            <p className="fc-eyebrow">Professional Character</p>
            <h1>Career Compass</h1>
            <p className="fc-identity-name">Atlas Professional</p>
            <p className="fc-identity-title">Compass Bearer</p>
          </div>
        </div>
        <div className="fc-identity-details">
          <label className="fc-archetype-picker">
            <span>Archetype</span>
            <select aria-label="Archetype" defaultValue={archetype.id}>
              {archetypeIds.map((archetypeId) => (
                <option key={archetypeId} value={archetypeId}>
                  {archetypes[archetypeId].name}
                </option>
              ))}
            </select>
          </label>
          <p className="fc-archetype-motto">Motto: {archetype.motto}</p>
          <p className="fc-muted fc-personal-legend">
            Personal Legend: Build a career story through evidence, reflection, and growth.
          </p>
        </div>
        <div className="fc-character-summary">
          <span><small>Level</small><strong>7</strong></span>
          <span><small>Career Path</small><strong>Pathfinder</strong></span>
          <span><small>Portfolio Strength</small><strong>{compass.overall}%</strong></span>
        </div>
      </section>

      <section className="fc-character-sheet-grid">
        <article className="fc-sheet-section fc-sheet-section-static">
          <header>
            <h2>Attributes</h2>
            <span>{compass.overall}% overall</span>
          </header>
          <div className="fc-attribute-grid">
            {primaryAttributes.map((attribute) => (
              <div className="fc-attribute-row" key={attribute.key}>
                <span>{attribute.label}</span>
                <strong>{attributeScores[attribute.key]}%</strong>
              </div>
            ))}
          </div>
        </article>

        <details className="fc-sheet-section">
          <summary>Competencies <span>{topCompetencies.length} active signals</span></summary>
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
          <summary>Next Challenge <span>Ready</span></summary>
          <p className="fc-muted">Service Recovery Constellation is ready to continue building evidence.</p>
          <AtlasButton href="/assessments/service-recovery-constellation">Begin Challenge</AtlasButton>
        </details>
      </section>
    </div>
  );
}
