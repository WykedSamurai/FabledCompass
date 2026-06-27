import { AtlasButton } from "../../components/atlas";
import { getArchetype } from "../../lib/archetypes";
import {
  buildConstellation,
  calculateAllCompetencies,
  calculateProfessionalCompass,
  sampleEvidence
} from "../../lib/evidence";

const primaryAttributes = [
  { label: "Leadership", key: "leadership", icon: "L" },
  { label: "Communication", key: "communication", icon: "C" },
  { label: "Problem Solving", key: "problemSolving", icon: "P" },
  { label: "Professionalism", key: "professionalism", icon: "R" },
  { label: "Adaptability", key: "adaptability", icon: "A" },
  { label: "Collaboration", key: "collaboration", icon: "T" }
] as const;

const sheetRows = [
  { label: "Skills", detail: "Abilities developed and improving", count: "36 Skills", icon: "S" },
  { label: "Evidence", detail: "Proof of experience and impact", count: "3 Records", icon: "E" },
  { label: "Constellations", detail: "Patterns of strengths", count: "1 Active", icon: "C" },
  { label: "Career", detail: "Experience, roles, and achievements", count: "4 Roles", icon: "R" },
  { label: "Education and Certifications", detail: "Learning and credentials", count: "6 Items", icon: "D" },
  { label: "Achievements", detail: "Milestones earned", count: "18 Badges", icon: "A" },
  { label: "AI Mentor", detail: "Personal guidance", count: "Ask", icon: "M" }
];

export default function DashboardPage() {
  const archetype = getArchetype("traveler");
  const competencies = calculateAllCompetencies(sampleEvidence);
  const compass = calculateProfessionalCompass(competencies);
  const leadershipConstellation = buildConstellation("leadership", sampleEvidence);
  const attributeScores = {
    leadership: compass.leadership,
    communication: compass.communication,
    problemSolving: compass.problemSolving,
    professionalism: compass.professionalism,
    adaptability: competencies.find((competency) => competency.id === "adaptability")?.progress ?? 0,
    collaboration: competencies.find((competency) => competency.id === "teamwork")?.progress ?? 0
  };

  return (
    <div className="fc-page-stack fc-polished-sheet">
      <section className="fc-sheet-identity">
        <div className="fc-sheet-portrait" aria-hidden="true">
          <span>{archetype.icon}</span>
        </div>

        <div className="fc-sheet-title-block">
          <h1>Penny Carter</h1>
          <div className="fc-archetype-control">
            <strong>{archetype.icon} {archetype.name}</strong>
            <button type="button">Change Archetype</button>
          </div>
          <p className="fc-archetype-motto">{archetype.motto}</p>
          <p className="fc-muted">Personal Legend: Helping people grow through thoughtful leadership and practical problem solving.</p>
        </div>

        <div className="fc-sheet-rank">
          <span>Level 7</span>
          <small>Professional</small>
          <span>Career Path</span>
          <small>Human Resources</small>
          <span>Portfolio Strength</span>
          <strong>{compass.overall}%</strong>
          <AtlasButton href="/portfolio" variant="ghost">View Progress</AtlasButton>
        </div>
      </section>

      <section className="fc-sheet-main-row">
        <div className="fc-sheet-panel fc-attributes-panel">
          <div className="fc-sheet-panel-heading">
            <p>Six Attributes</p>
            <span>{compass.overall}% overall</span>
          </div>
          <div className="fc-attribute-cards">
            {primaryAttributes.map((attribute) => (
              <article className="fc-attribute-card" key={attribute.key}>
                <span className="fc-attribute-icon">{attribute.icon}</span>
                <strong>{attribute.label}</strong>
                <b>{attributeScores[attribute.key]}%</b>
                <i><span style={{ width: `${attributeScores[attribute.key]}%` }} /></i>
              </article>
            ))}
          </div>
        </div>

        <div className="fc-sheet-panel fc-mini-compass-panel">
          <div className="fc-sheet-panel-heading">
            <p>Professional Compass</p>
            <span>{compass.overall}%</span>
          </div>
          <div className="fc-mini-compass" aria-label="Professional Compass scores">
            <span className="north">L</span>
            <span className="east">C</span>
            <span className="south">R</span>
            <span className="west">P</span>
            <strong>{compass.overall}</strong>
          </div>
        </div>
      </section>

      <section className="fc-sheet-rows">
        {sheetRows.map((row) => (
          <details className="fc-sheet-row" key={row.label}>
            <summary>
              <span className="fc-row-icon">{row.icon}</span>
              <strong>{row.label}</strong>
              <em>{row.detail}</em>
              <small>{row.count}</small>
              <b>&gt;</b>
            </summary>
            <div className="fc-row-detail">
              {row.label === "Constellations" ? (
                <div className="fc-constellation-list">
                  {leadershipConstellation.stars.map((star) => (
                    <span className={star.active ? "is-active" : ""} key={star.id}>*</span>
                  ))}
                </div>
              ) : (
                <p className="fc-muted">This section will expand into the full {row.label.toLowerCase()} record.</p>
              )}
            </div>
          </details>
        ))}
      </section>
    </div>
  );
}
