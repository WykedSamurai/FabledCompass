import type { SupabaseClient } from "@supabase/supabase-js";
import type { UserProfile, ProfileRow, EvidenceRow } from "./types";
import type { ArchetypeId } from "../archetypes/types";
import type { EvidenceRecord, CompetencyId } from "../evidence/types";

export type { UserProfile } from "./types";

const VALID_ARCHETYPES: ArchetypeId[] = [
  "traveler", "explorer", "creator", "leader", "mentor",
  "guardian", "scholar", "builder", "innovator", "steward",
  "diplomat", "strategist"
];

function toArchetypeId(value: string): ArchetypeId {
  return VALID_ARCHETYPES.includes(value as ArchetypeId)
    ? (value as ArchetypeId)
    : "traveler";
}

function rowToProfile(row: ProfileRow): UserProfile {
  return {
    id: row.id,
    displayName: row.display_name,
    title: row.title,
    archetype: toArchetypeId(row.archetype),
    motto: row.motto,
    personalLegend: row.personal_legend,
    level: row.level,
    careerPath: row.career_path,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function rowToEvidence(row: EvidenceRow): EvidenceRecord {
  return {
    id: row.id,
    type: row.type as EvidenceRecord["type"],
    title: row.title,
    description: row.description ?? "",
    competencyIds: row.competency_ids as CompetencyId[],
    score: row.score,
    quality: row.quality as EvidenceRecord["quality"],
    verification: row.verification as EvidenceRecord["verification"],
    source: row.source ?? "",
    createdAt: row.created_at,
    metadata: row.metadata as Record<string, string | number | boolean | null> | undefined
  };
}

export async function getProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) return null;
  return rowToProfile(data as ProfileRow);
}

export async function upsertProfile(
  supabase: SupabaseClient,
  userId: string,
  updates: Partial<Omit<UserProfile, "id" | "createdAt" | "updatedAt">>
): Promise<UserProfile | null> {
  const row: Partial<ProfileRow> & { id: string } = { id: userId };
  if (updates.displayName !== undefined) row.display_name = updates.displayName;
  if (updates.title !== undefined) row.title = updates.title;
  if (updates.archetype !== undefined) row.archetype = updates.archetype;
  if (updates.motto !== undefined) row.motto = updates.motto;
  if (updates.personalLegend !== undefined) row.personal_legend = updates.personalLegend;
  if (updates.level !== undefined) row.level = updates.level;
  if (updates.careerPath !== undefined) row.career_path = updates.careerPath;

  const { data, error } = await supabase
    .from("profiles")
    .upsert(row)
    .select("*")
    .single();

  if (error || !data) return null;
  return rowToProfile(data as ProfileRow);
}

export async function getUserEvidence(
  supabase: SupabaseClient,
  userId: string
): Promise<EvidenceRecord[]> {
  const { data, error } = await supabase
    .from("evidence")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return (data as EvidenceRow[]).map(rowToEvidence);
}

export async function addEvidence(
  supabase: SupabaseClient,
  userId: string,
  record: Omit<EvidenceRecord, "id" | "createdAt">
): Promise<EvidenceRecord | null> {
  const { data, error } = await supabase
    .from("evidence")
    .insert({
      user_id: userId,
      type: record.type,
      title: record.title,
      description: record.description,
      competency_ids: record.competencyIds,
      score: record.score,
      quality: record.quality,
      verification: record.verification,
      source: record.source,
      metadata: record.metadata ?? null
    })
    .select("*")
    .single();

  if (error || !data) return null;
  return rowToEvidence(data as EvidenceRow);
}
