export type CharacterClass =
  | "fighter"
  | "rogue"
  | "wizard"
  | "cleric"
  | "ranger"
  | "paladin"
  | "barbarian"
  | "bard"
  | "druid"
  | "monk"
  | "sorcerer"
  | "warlock";

export type CharacterRace =
  | "human"
  | "elf"
  | "dwarf"
  | "halfling"
  | "gnome"
  | "half-orc"
  | "half-elf"
  | "tiefling"
  | "dragonborn"
  | "aasimar";

export type AbilityScore = "strength" | "dexterity" | "constitution" | "intelligence" | "wisdom" | "charisma";

export interface AbilityScores {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface ClassDefinition {
  id: CharacterClass;
  name: string;
  icon: string;
  description: string;
  primaryAbilities: AbilityScore[];
  hitDie: number;
  skillPoints: number;
  motto: string;
}

export interface RaceDefinition {
  id: CharacterRace;
  name: string;
  icon: string;
  description: string;
  abilityBonuses: Partial<AbilityScores>;
  speed: number;
  motto: string;
}

export interface PlayableCharacter {
  id: string;
  name: string;
  class: CharacterClass;
  race: CharacterRace;
  level: number;
  experience: number;
  abilityScores: AbilityScores;
  hitPoints: number;
  armor: number;
  backstory?: string;
  personalLegend?: string;
  createdAt: string;
  updatedAt: string;
}

export type SanctuumCharacter = PlayableCharacter;
