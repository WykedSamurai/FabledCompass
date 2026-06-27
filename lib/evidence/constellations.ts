import type { CompetencyConstellation, CompetencyId, EvidenceRecord } from "./types";
import { competencyDefinitions } from "./competencies";

const starLayout = [
  { x: 22, y: 34 },
  { x: 38, y: 22 },
  { x: 55, y: 39 },
  { x: 70, y: 28 },
  { x: 78, y: 58 }
] as const;

export function buildConstellation(competencyId: CompetencyId, evidence: EvidenceRecord[]): CompetencyConstellation {
  const relatedEvidence = evidence.filter((item) => item.competencyIds.includes(competencyId)).slice(0, starLayout.length);
  const stars = starLayout.map((point, index) => {
    const evidenceItem = relatedEvidence[index];

    return {
      id: `${competencyId}-star-${index + 1}`,
      competencyId,
      evidenceId: evidenceItem?.id,
      label: evidenceItem?.title ?? `Evidence Star ${index + 1}`,
      x: point.x,
      y: point.y,
      active: Boolean(evidenceItem)
    };
  });

  const paths = stars.slice(1).map((star, index) => ({
    from: stars[index].id,
    to: star.id,
    active: stars[index].active && star.active
  }));

  return {
    competencyId,
    label: competencyDefinitions[competencyId].label,
    stars,
    paths,
    completion: Math.round((relatedEvidence.length / starLayout.length) * 100)
  };
}

export function buildConstellations(evidence: EvidenceRecord[]) {
  return Object.keys(competencyDefinitions).map((competencyId) =>
    buildConstellation(competencyId as CompetencyId, evidence)
  );
}
