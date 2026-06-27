export type EvidenceType =
  | "project"
  | "job"
  | "adventure"
  | "assessment"
  | "certification"
  | "reflection"
  | "recommendation"
  | "resume_import"
  | "volunteer"
  | "achievement";

export type CompetencyId =
  | "leadership"
  | "communication"
  | "professionalism"
  | "problem_solving"
  | "teamwork"
  | "conflict_resolution"
  | "adaptability"
  | "critical_thinking"
  | "emotional_intelligence"
  | "customer_service"
  | "time_management";

export type EvidenceVerification = "self_reported" | "documented" | "verified";

export type EvidenceQuality = "starter" | "developing" | "strong" | "excellent";

export type EvidenceRecord = {
  id: string;
  type: EvidenceType;
  title: string;
  description: string;
  competencyIds: CompetencyId[];
  score: number;
  quality: EvidenceQuality;
  verification: EvidenceVerification;
  source: string;
  createdAt: string;
  metadata?: Record<string, string | number | boolean | null>;
};

export type CompetencyProgress = {
  id: CompetencyId;
  label: string;
  description: string;
  evidenceCount: number;
  averageScore: number;
  verificationScore: number;
  reflectionScore: number;
  progress: number;
  constellationCompletion: number;
};

export type ConstellationStar = {
  id: string;
  competencyId: CompetencyId;
  evidenceId?: string;
  label: string;
  x: number;
  y: number;
  active: boolean;
};

export type ConstellationPath = {
  from: string;
  to: string;
  active: boolean;
};

export type CompetencyConstellation = {
  competencyId: CompetencyId;
  label: string;
  stars: ConstellationStar[];
  paths: ConstellationPath[];
  completion: number;
};

export type ProfessionalCompass = {
  leadership: number;
  communication: number;
  professionalism: number;
  problemSolving: number;
  overall: number;
};
