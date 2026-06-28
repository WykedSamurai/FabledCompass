import type { CompetencyId, CompetencyProgress } from "../../lib/evidence";
import { calculateAllCompetencies, sampleEvidence } from "../../lib/evidence";

const coreTrack: CompetencyId[] = [
  "leadership",
  "communication",
  "problem_solving",
  "professionalism",
  "adaptability",
  "teamwork"
];

const levelBands = [
  { threshold: 0, label: "Initiate" },
  { threshold: 25, label: "Pathfinder" },
  { threshold: 50, label: "Trailblazer" },
  { threshold: 70, label: "Vanguard" },
  { threshold: 85, label: "Legend" }
] as const;

const actionsByCompetency: Record<CompetencyId, string> = {
  leadership: "Lead one small sprint or handoff this week and capture what decisions you made.",
  communication: "Publish one concise status update with risks, next steps, and owner commitments.",
  professionalism: "Create a reliability streak: complete and close three planned tasks on schedule.",
  problem_solving: "Run one short root-cause review and document two alternative fixes before choosing.",
  teamwork: "Support one teammate deliverable end-to-end and log the collaboration outcome.",
  conflict_resolution: "Practice one de-escalation script in your next roleplay scenario replay.",
  adaptability: "Take one changing requirement and rewrite your plan in under 10 minutes.",
  critical_thinking: "Challenge one assumption in your current plan and validate it with evidence.",
  emotional_intelligence: "Capture one reflection on tone, trust, and stakeholder response this week.",
  customer_service: "Replay Service Recovery Constellation and target stronger policy clarity.",
  time_management: "Timebox your top three tasks daily and compare planned versus actual completion."
};

function getRank(progress: number) {
  return [...levelBands].reverse().find((band) => progress >= band.threshold) ?? levelBands[0];
}

function getNextUnlock(progress: number) {
  const next = levelBands.find((band) => band.threshold > progress);
  if (!next) {
    return "Legend tier reached. Keep building evidence quality and verification depth.";
  }
  return `${next.threshold - progress}% to ${next.label}`;
}

export default function CompetenciesPage() {
  const allCompetencies = calculateAllCompetencies(sampleEvidence);
  const isDefinedCompetency = (value: CompetencyProgress | undefined): value is CompetencyProgress => Boolean(value);
  const orderedCompetencies = [
    ...coreTrack.map((id) => allCompetencies.find((competency) => competency.id === id)).filter(isDefinedCompetency),
    ...allCompetencies.filter((competency) => !coreTrack.includes(competency.id))
  ];
  const coreAverage = Math.round(
    coreTrack
      .map((id) => allCompetencies.find((competency) => competency.id === id)?.progress ?? 0)
      .reduce((sum, value) => sum + value, 0) / coreTrack.length
  );
  const weakest = [...orderedCompetencies]
    .sort((first, second) => first.progress - second.progress)
    .slice(0, 4);

  return (
    <div className="fc-page-stack fc-workspace-page">
      <section className="fc-workspace-hero">
        <p className="fc-eyebrow">Career Progression Board</p>
        <h1>Competency Atlas</h1>
        <p>Track rank progression, inspect evidence sources, and follow your next best action for every skill path.</p>
      </section>

      <section className="fc-workspace-grid">
        <article className="fc-card fc-competency-summary">
          <div className="fc-card-header-row">
            <div>
              <p className="fc-eyebrow">Core Track</p>
              <h2>Professional Path Level</h2>
            </div>
            <span className="fc-status-pill">{coreAverage}% average</span>
          </div>
          <p className="fc-muted">Your six core attributes drive your headline Compass growth and unlock stronger career routes.</p>
          <div className="fc-inline-tags">
            {coreTrack.map((id) => {
              const competency = allCompetencies.find((item) => item.id === id);
              if (!competency) return null;
              return <span key={id}>{competency.label} {competency.progress}%</span>;
            })}
          </div>
        </article>

        <aside className="fc-card fc-side-card fc-next-rail">
          <p className="fc-eyebrow">Next Best Actions</p>
          <h3>Weakest lanes first</h3>
          <ul className="fc-guidance-list">
            {weakest.map((competency) => (
              <li key={competency.id}>
                <strong>{competency.label}:</strong> {actionsByCompetency[competency.id]}
              </li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="fc-competency-board">
        {orderedCompetencies.map((competency) => {
          const rank = getRank(competency.progress);
          const evidence = sampleEvidence.filter((item) => item.competencyIds.includes(competency.id)).slice(0, 3);
          return (
            <article className="fc-card fc-competency-node" key={competency.id}>
              <div className="fc-card-header-row">
                <div>
                  <h3>{competency.label}</h3>
                  <p className="fc-muted">{competency.description}</p>
                </div>
                <span className="fc-rank-pill">{rank.label}</span>
              </div>

              <div className="fc-competency-metrics">
                <p><strong>{competency.progress}%</strong> progression</p>
                <p>{getNextUnlock(competency.progress)}</p>
              </div>
              <div className="progress"><div className="progress-bar" style={{ width: `${competency.progress}%` }} /></div>

              <div className="fc-inline-tags">
                <span>Evidence {competency.evidenceCount}</span>
                <span>Quality {competency.averageScore}%</span>
                <span>Verification {competency.verificationScore}%</span>
                <span>Constellation {competency.constellationCompletion}%</span>
              </div>

              <div className="fc-evidence-source-list">
                <p className="fc-eyebrow">Evidence Sources</p>
                {evidence.length > 0 ? (
                  <ul className="fc-guidance-list">
                    {evidence.map((item) => (
                      <li key={item.id}>
                        <strong>{item.title}</strong> - {item.source} ({item.score}%)
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="fc-muted">No recorded evidence yet. Complete a roleplay, add portfolio proof, or write a reflection.</p>
                )}
              </div>

              <div className="fc-next-action">
                <p className="fc-eyebrow">Next Action</p>
                <p className="fc-muted">{actionsByCompetency[competency.id]}</p>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
