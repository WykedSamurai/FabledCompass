export type ArchetypeId =
  | "traveler"
  | "explorer"
  | "creator"
  | "leader"
  | "mentor"
  | "guardian"
  | "scholar"
  | "builder"
  | "innovator"
  | "steward"
  | "diplomat"
  | "strategist";

export type ArchetypeTheme = {
  primaryMotif: string;
  accent: string;
  backgroundMood: string;
};

export type Archetype = {
  id: ArchetypeId;
  name: string;
  icon: string;
  motto: string;
  description: string;
  theme: ArchetypeTheme;
  aiVoice: string;
};
