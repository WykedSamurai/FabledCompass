import type { ArchetypeId } from "../archetypes/types";

export type UserProfile = {
  id: string;
  displayName: string | null;
  title: string;
  archetype: ArchetypeId;
  motto: string | null;
  personalLegend: string | null;
  level: number;
  careerPath: string;
  createdAt: string;
  updatedAt: string;
};

export type ProfileRow = {
  id: string;
  display_name: string | null;
  title: string;
  archetype: string;
  motto: string | null;
  personal_legend: string | null;
  level: number;
  career_path: string;
  created_at: string;
  updated_at: string;
};

export type EvidenceRow = {
  id: string;
  user_id: string;
  type: string;
  title: string;
  description: string | null;
  competency_ids: string[];
  score: number;
  quality: string;
  verification: string;
  source: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
};
