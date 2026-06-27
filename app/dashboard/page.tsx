import { AtlasButton, AtlasCard, AtlasHeader } from "../../components/atlas";
import {
  buildConstellation,
  calculateAllCompetencies,
  calculateProfessionalCompass,
  sampleEvidence
} from "../../lib/evidence";

export default function DashboardPage() {
  const competencies = calculateAllCompetencies(sampleEvidence);
  const compass = calculateProfessionalCompass(competencies);
  const leadershipConstellation = buildConstellation("leadership", sampleEvidence);
  const topCompetencies = [...competencies]
    .sort((first, second) => second.progress - first.progress)
    .slice(0, 4);

  return (
    <div className="fc-page-stack">
      <div className="fc-page-header">
        <p className="fc-eyebrow">Career Journey</p>
        <h1>Navigator</h1>
        <p>Review your direction, progress, and next steps.</p>
      </div>

      <section className="fc-dashboard-grid">
        <AtlasCard>
          <AtlasHeader eyebrow="Compass" title="Professional Compass" />
          <div className="fc-compass-placeholder" aria-label="Professional Compass placeholder">
            <span>Leadership {compass.leadership}%</span>
            <span>Communication {compass.communication}%</span>
            <span>Problem Solving {compass.problemSolving}%</span>
            <span>Professionalism {compass.professionalism}%</span>
            <strong>{compass.overall}%</strong>
          </div>
        </AtlasCard>

        <AtlasCard>
          <AtlasHeader eyebrow="Next Step" title="Continue Journey" />
          <p className="fc-muted">Customer Recovery is ready to continue building evidence in your Professional Folio.</p>
          <AtlasButton href="/adventures/difficult-customer">Begin Challenge</AtlasButton>
        </AtlasCard>

        <AtlasCard>
          <AtlasHeader eyebrow="Folio" title="Portfolio Strength" />
          <p className="fc-score">{compass.overall}%</p>
          <p className="fc-muted">Based on {sampleEvidence.length} evidence records across {topCompetencies.length} active competency signals.</p>
        </AtlasCard>

        <AtlasCard>
          <AtlasHeader eyebrow="Signal" title="Compass Suggestions" />
          <ul className="fc-evidence-list">
            {topCompetencies.map((competency) => (
              <li key={competency.id}>
                <strong>{competency.label}</strong>
                <span>{competency.progress}% · {competency.evidenceCount} evidence</span>
              </li>
            ))}
          </ul>
        </AtlasCard>

        <AtlasCard>
          <AtlasHeader eyebrow="Constellation" title="Leadership Stars" />
          <div className="fc-constellation-list">
            {leadershipConstellation.stars.map((star) => (
              <span className={star.active ? "is-active" : ""} key={star.id}>✦</span>
            ))}
          </div>
          <p className="fc-muted">{leadershipConstellation.completion}% constellation completion.</p>
        </AtlasCard>
      </section>
    </div>
  );
}
