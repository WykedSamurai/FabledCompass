import type { CompetencyProgress, ProfessionalCompass } from "./types";

function findProgress(competencies: CompetencyProgress[], id: CompetencyProgress["id"]) {
  return competencies.find((competency) => competency.id === id)?.progress ?? 0;
}

function average(values: number[]) {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((total, value) => total + value, 0) / values.length);
}

export function calculateProfessionalCompass(competencies: CompetencyProgress[]): ProfessionalCompass {
  const leadership = findProgress(competencies, "leadership");
  const communication = average([
    findProgress(competencies, "communication"),
    findProgress(competencies, "customer_service"),
    findProgress(competencies, "emotional_intelligence")
  ]);
  const professionalism = average([
    findProgress(competencies, "professionalism"),
    findProgress(competencies, "time_management"),
    findProgress(competencies, "teamwork")
  ]);
  const problemSolving = average([
    findProgress(competencies, "problem_solving"),
    findProgress(competencies, "critical_thinking"),
    findProgress(competencies, "adaptability")
  ]);

  return {
    leadership,
    communication,
    professionalism,
    problemSolving,
    overall: average([leadership, communication, professionalism, problemSolving])
  };
}
