import type { CompetencyId, CompetencyProgress, EvidenceRecord } from "./types";

export const competencyDefinitions: Record<CompetencyId, Pick<CompetencyProgress, "id" | "label" | "description">> = {
  leadership: { id: "leadership", label: "Leadership", description: "Guiding people, decisions, and outcomes with accountability." },
  communication: { id: "communication", label: "Communication", description: "Sharing information clearly across audiences and situations." },
  professionalism: { id: "professionalism", label: "Professionalism", description: "Reliability, judgment, ethics, and workplace maturity." },
  problem_solving: { id: "problem_solving", label: "Problem Solving", description: "Analyzing issues, choosing solutions, and improving outcomes." },
  teamwork: { id: "teamwork", label: "Teamwork", description: "Working with others toward shared goals." },
  conflict_resolution: { id: "conflict_resolution", label: "Conflict Resolution", description: "Navigating disagreement with fairness and composure." },
  adaptability: { id: "adaptability", label: "Adaptability", description: "Adjusting effectively when needs, constraints, or conditions change." },
  critical_thinking: { id: "critical_thinking", label: "Critical Thinking", description: "Evaluating information and making reasoned judgments." },
  emotional_intelligence: { id: "emotional_intelligence", label: "Emotional Intelligence", description: "Reading context, responding with awareness, and building trust." },
  customer_service: { id: "customer_service", label: "Customer Service", description: "Supporting people with patience, clarity, and effective recovery." },
  time_management: { id: "time_management", label: "Time Management", description: "Prioritizing work, meeting deadlines, and managing workload." }
};

const verificationWeights = { self_reported: 0.35, documented: 0.7, verified: 1 } as const;

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function calculateCompetencyProgress(competencyId: CompetencyId, evidence: EvidenceRecord[]): CompetencyProgress {
  const definition = competencyDefinitions[competencyId];
  const relatedEvidence = evidence.filter((item) => item.competencyIds.includes(competencyId));
  const evidenceCount = relatedEvidence.length;

  if (evidenceCount === 0) {
    return { ...definition, evidenceCount: 0, averageScore: 0, verificationScore: 0, reflectionScore: 0, progress: 0, constellationCompletion: 0 };
  }

  const averageScore = relatedEvidence.reduce((total, item) => total + item.score, 0) / evidenceCount;
  const verificationScore = relatedEvidence.reduce((total, item) => total + verificationWeights[item.verification] * 100, 0) / evidenceCount;
  const reflectionScore = relatedEvidence.some((item) => item.type === "reflection") ? 100 : 35;
  const progress = averageScore * 0.55 + verificationScore * 0.3 + reflectionScore * 0.15;

  return {
    ...definition,
    evidenceCount,
    averageScore: clampScore(averageScore),
    verificationScore: clampScore(verificationScore),
    reflectionScore: clampScore(reflectionScore),
    progress: clampScore(progress),
    constellationCompletion: clampScore(Math.min(100, evidenceCount * 20))
  };
}

export function calculateAllCompetencies(evidence: EvidenceRecord[]) {
  return Object.keys(competencyDefinitions).map((competencyId) => calculateCompetencyProgress(competencyId as CompetencyId, evidence));
}
