export type SanctumRole =
  | "soldier"
  | "courtier"
  | "agent"
  | "scholar"
  | "cleric"
  | "warden"
  | "artisan"
  | "merchant"
  | "performer"
  | "physician";

export type Homeland =
  | "england"
  | "scotland"
  | "france"
  | "spain"
  | "portugal"
  | "italian-states"
  | "holy-roman-empire"
  | "poland-lithuania"
  | "ottoman-empire"
  | "ming-china"
  | "joseon-korea"
  | "japan"
  | "mughal-india"
  | "safavid-persia"
  | "kingdom-of-kongo"
  | "ethiopia"
  | "indigenous-americas"
  | "unknown";

export type SocialStanding =
  | "royal"
  | "high-noble"
  | "lesser-noble"
  | "gentry"
  | "clergy"
  | "military-officer"
  | "guild-member"
  | "merchant"
  | "skilled-artisan"
  | "commoner"
  | "servant"
  | "outlaw"
  | "indentured"
  | "concealed";

export type SanctumAttribute = "might" | "finesse" | "vitality" | "reason" | "awareness" | "presence";

export interface SanctumAttributes {
  might: number;
  finesse: number;
  vitality: number;
  reason: number;
  awareness: number;
  presence: number;
}

export interface RoleDefinition {
  id: SanctumRole;
  name: string;
  icon: string;
  description: string;
  primaryAttributes: SanctumAttribute[];
  conditionBase: number;
  skillFocus: string[];
  motto: string;
}

export interface HomelandDefinition {
  id: Homeland;
  name: string;
  icon: string;
  description: string;
  languages: string[];
  motto: string;
}

export interface SocialStandingDefinition {
  id: SocialStanding;
  name: string;
  description: string;
  access: string;
  obligation: string;
}

export interface PlayableCharacter {
  id: string;
  name: string;
  role: SanctumRole;
  homeland: Homeland;
  socialStanding: SocialStanding;
  specialty: string;
  occupation: string;
  rank: number;
  renown: number;
  attributes: SanctumAttributes;
  condition: number;
  defense: number;
  readiness: number;
  endurance: number;
  reaction: number;
  resolve: number;
  combatTraining: number;
  backstory?: string;
  personalLegend?: string;
  createdAt: string;
  updatedAt: string;
}

export type SanctuumCharacter = PlayableCharacter;

// Temporary compatibility aliases while older pages migrate to the Sanctum naming model.
export type CharacterClass = SanctumRole;
export type CharacterRace = Homeland;
export type AbilityScore = SanctumAttribute;
export type AbilityScores = SanctumAttributes;
export type ClassDefinition = RoleDefinition;
export type RaceDefinition = HomelandDefinition;
