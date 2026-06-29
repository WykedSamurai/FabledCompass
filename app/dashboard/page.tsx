import { AtlasButton } from "../../components/atlas";
import { archetypes, type ArchetypeId } from "../../lib/archetypes";
import {
  buildConstellation,
  calculateAllCompetencies,
  calculateProfessionalCompass,
  sampleEvidence
} from "../../lib/evidence";
import { createClient } from "../../utils/supabase/server";
import { getProfile, getUserEvidence } from "../../lib/profile";
import IdentityPanel from "./IdentityPanel";

const primaryAttributes = [
  { label: "Leadership", key: "leadership" },
  { label: "Communication", key: "communication" },
  { label: "Problem Solving", key: "problemSolving" },
  { label: "Professionalism", key: "professionalism" },
  { label: "Adaptability", key: "adaptability" },
  { label: "Collaboration", key: "collaboration" }
] as const;

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const userId = authData.user?.id;

  const [profile, userEvidence] = userId
    ? await Promise.all([getProfile(supabase, userId), getUserEvidence(supabase, userId)])
    : [null, []];

  const hasEvidence = userEvidence.length > 0;
  const evidence = hasEvidence ? userEvidence : sampleEvidence;

  const archetypeId: ArchetypeId = profile?.archetype ?? "traveler";
  const archetype = archetypes[archetypeId];

  const competencies = calculateAllCompetencies(evidence);
  const compass = calculateProfessionalCompass(competencies);
  const leadershipConstellation = buildConstellation("leadership", evidence);
  const topCompetencies = [...competencies].sort((first, second) => second.progress - first.progress).slice(0, 4);
  const attributeScores = {
    leadership: compass.leadership,
    communication: compass.communication,
    problemSolving: compass.problemSolving,
    professionalism: compass.professionalism,
    adaptability: competencies.find((competency) => competency.id === "adaptability")?.progress ?? 0,
    collaboration: competencies.find((competency) => competency.id === "teamwork")?.progress ?? 0
  };

  const displayName = profile?.displayName ?? authData.user?.email?.split("@")[0] ?? "Traveler";
  const title = profile?.title ?? "Compass Bearer";
  const careerPath = profile?.careerPath ?? "Wayfinder";
  const level = profile?.level ?? 1;
  const personalLegend = profile?.personalLegend ?? "Build a career story through evidence, reflection, and growth.";

  return (
    <div className="fc-page-stack fc-compact-sheet">
      {!hasEvidence && userId && (
        <div className="fc-onboarding-notice">
          <span>⭐</span>
          <div>
            <strong>Welcome to your Character Sheet</strong>
            <p>Complete your first Adventure or add a Portfolio entry to start building real evidence. Scores shown are sample data.</p>
          </div>
          <AtlasButton href="/assessments/service-recovery-constellation">Start First Challenge</AtlasButton>
        </div>
      )}

      <section className="fc-character-sheet-hero">
        {userId ? (
          <IdentityPanel
            userId={userId}
            archetypeId={archetypeId}
            displayName={displayName}
            title={title}
            motto={profile?.motto ?? ""}
            personalLegend={personalLegend}
            careerPath={careerPath}
            level={level}
            overallScore={compass.overall}
          />
        ) : (
          <>
            <div className="fc-identity-core">
              <div className="fc-archetype-portrait" aria-hidden="true">{archetype.icon}</div>
              <div>
                <p className="fc-eyebrow">Professional Character</p>
                <h1>Career Compass</h1>
                <p className="fc-identity-name">{displayName}</p>
                <p className="fc-identity-title">{title}</p>
              </div>
            </div>
            <div className="fc-identity-details">
              <p className="fc-archetype-motto">Motto: {archetype.motto}</p>
              <p className="fc-muted fc-personal-legend">Personal Legend: {personalLegend}</p>
            </div>
            <div className="fc-character-summary">
              <span><small>Level</small><strong>{level}</strong></span>
              <span><small>Career Path</small><strong>{careerPath}</strong></span>
              <span><small>Portfolio Strength</small><strong>{compass.overall}%</strong></span>
            </div>
          </>
        )}
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
                <span>{competency.progress}% · {competency.evidenceCount} evidence</span>
              </li>
            ))}
          </ul>
        </details>

        <details className="fc-sheet-section">
          <summary>Evidence <span>{evidence.length} record{evidence.length !== 1 ? "s" : ""}</span></summary>
          <ul className="fc-evidence-list">
            {evidence.map((ev) => (
              <li key={ev.id}>
                <strong>{ev.title}</strong>
                <span>{ev.score}% · {ev.verification.replace("_", " ")}</span>
              </li>
            ))}
          </ul>
        </details>

        <details className="fc-sheet-section">
          <summary>Constellations <span>{leadershipConstellation.completion}% Leadership</span></summary>
          <div className="fc-constellation-list">
            {leadershipConstellation.stars.map((star) => (
              <span className={star.active ? "is-active" : ""} key={star.id}>✦</span>
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
