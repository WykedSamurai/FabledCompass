import type { EvidenceRecord } from "./types";

export const sampleEvidence: EvidenceRecord[] = [
  {
    id: "evidence-customer-recovery-1",
    type: "adventure",
    title: "Customer Recovery Scenario",
    description: "Handled a high-friction client interaction with calm communication and service recovery.",
    competencyIds: ["customer_service", "communication", "conflict_resolution"],
    score: 82,
    quality: "strong",
    verification: "documented",
    source: "Fabled Compass Assessment",
    createdAt: "2026-06-27T00:00:00.000Z",
    metadata: { scenario: "difficult-customer" }
  },
  {
    id: "evidence-team-lead-1",
    type: "job",
    title: "Shift Leadership Evidence",
    description: "Demonstrated reliability, prioritization, and team support in a shift leadership role.",
    competencyIds: ["leadership", "teamwork", "time_management", "professionalism"],
    score: 78,
    quality: "strong",
    verification: "self_reported",
    source: "Work Experience",
    createdAt: "2026-06-27T00:00:00.000Z",
    metadata: { category: "experience" }
  },
  {
    id: "evidence-reflection-1",
    type: "reflection",
    title: "Professional Growth Reflection",
    description: "Reflection explaining what was learned and how the skill can be applied in future work.",
    competencyIds: ["professionalism", "critical_thinking", "communication"],
    score: 86,
    quality: "excellent",
    verification: "documented",
    source: "Portfolio Reflection",
    createdAt: "2026-06-27T00:00:00.000Z",
    metadata: { reflection: true }
  }
];
