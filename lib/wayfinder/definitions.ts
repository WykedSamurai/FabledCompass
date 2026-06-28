import type { ClassDefinition, RaceDefinition } from "./types";

export const characterClasses: Record<string, ClassDefinition> = {
  fighter: {
    id: "fighter",
    name: "Man-at-Arms",
    icon: "⚔️",
    description: "A drilled professional in pike, sword, and formation tactics.",
    primaryAbilities: ["strength", "constitution"],
    hitDie: 10,
    skillPoints: 2,
    motto: "Drill and steel hold the line."
  },
  rogue: {
    id: "rogue",
    name: "Courier-Spymaster",
    icon: "🗡️",
    description: "A fast mover of letters, secrets, and negotiated advantage.",
    primaryAbilities: ["dexterity", "charisma"],
    hitDie: 8,
    skillPoints: 8,
    motto: "Information arrives before armies."
  },
  wizard: {
    id: "wizard",
    name: "Natural Philosopher",
    icon: "📚",
    description: "A scholar of mathematics, astronomy, and practical experimentation.",
    primaryAbilities: ["intelligence", "wisdom"],
    hitDie: 6,
    skillPoints: 2,
    motto: "Measured truth outlasts rumor."
  },
  cleric: {
    id: "cleric",
    name: "Chaplain-Healer",
    icon: "⛪",
    description: "A caretaker of body and conscience serving parish, camp, and court.",
    primaryAbilities: ["wisdom", "strength"],
    hitDie: 8,
    skillPoints: 2,
    motto: "Steady hands and steady hearts."
  },
  ranger: {
    id: "ranger",
    name: "Frontier Scout",
    icon: "🏹",
    description: "A tracker and guide for roads, forests, and contested borders.",
    primaryAbilities: ["dexterity", "wisdom"],
    hitDie: 10,
    skillPoints: 6,
    motto: "Read the land before it reads you."
  },
  paladin: {
    id: "paladin",
    name: "Knight-Errant",
    icon: "🛡️",
    description: "An oath-bound rider balancing honor, duty, and political reality.",
    primaryAbilities: ["strength", "charisma"],
    hitDie: 10,
    skillPoints: 2,
    motto: "Honor is proven in service."
  },
  barbarian: {
    id: "barbarian",
    name: "Free Company Veteran",
    icon: "🔥",
    description: "A hardened mercenary from rough campaigns and long roads.",
    primaryAbilities: ["strength", "constitution"],
    hitDie: 12,
    skillPoints: 2,
    motto: "Endurance wins wars of attrition."
  },
  bard: {
    id: "bard",
    name: "Diplomat-Orator",
    icon: "🎵",
    description: "A persuasive performer and negotiator shaping alliances and morale.",
    primaryAbilities: ["charisma", "intelligence"],
    hitDie: 8,
    skillPoints: 8,
    motto: "A well-placed word can move a kingdom."
  },
  druid: {
    id: "druid",
    name: "Field Physick",
    icon: "🌿",
    description: "A practical herbalist and survival expert trained by hard seasons.",
    primaryAbilities: ["wisdom", "constitution"],
    hitDie: 8,
    skillPoints: 4,
    motto: "Study the earth; preserve the people."
  },
  monk: {
    id: "monk",
    name: "Monastic Scholar",
    icon: "✋",
    description: "A disciplined student of scripture, languages, and controlled movement.",
    primaryAbilities: ["dexterity", "wisdom"],
    hitDie: 8,
    skillPoints: 4,
    motto: "Discipline sharpens every craft."
  },
  sorcerer: {
    id: "sorcerer",
    name: "Master Artisan",
    icon: "⚙️",
    description: "A gifted craft specialist whose workshop output reshapes entire towns.",
    primaryAbilities: ["charisma", "constitution"],
    hitDie: 6,
    skillPoints: 2,
    motto: "Mastery turns skill into legacy."
  },
  warlock: {
    id: "warlock",
    name: "Court Strategist",
    icon: "🏛️",
    description: "An advisor skilled in patronage, policy, and high-risk political bargains.",
    primaryAbilities: ["charisma", "intelligence"],
    hitDie: 6,
    skillPoints: 2,
    motto: "Every alliance carries a cost."
  }
};

export const characterRaces: Record<string, RaceDefinition> = {
  human: {
    id: "human",
    name: "Kingdom Native",
    icon: "👤",
    description: "Raised in a local crown domain with broad practical expectations.",
    abilityBonuses: { strength: 1, dexterity: 1, constitution: 1, intelligence: 1, wisdom: 1, charisma: 1 },
    speed: 30,
    motto: "Adapt and advance."
  },
  elf: {
    id: "elf",
    name: "Merchant Republic Native",
    icon: "⚓",
    description: "From port cities where trade routes, credit, and diplomacy define status.",
    abilityBonuses: { dexterity: 2, intelligence: 1 },
    speed: 30,
    motto: "Trade binds distant worlds."
  },
  dwarf: {
    id: "dwarf",
    name: "Mountain March Native",
    icon: "⛰️",
    description: "From upland regions known for mining, metalwork, and defensive strongholds.",
    abilityBonuses: { constitution: 2, wisdom: 1 },
    speed: 25,
    motto: "Build to outlast the century."
  },
  halfling: {
    id: "halfling",
    name: "Market Town Native",
    icon: "🧺",
    description: "From close-knit trading towns where trust and reputation are currency.",
    abilityBonuses: { dexterity: 2, charisma: 1 },
    speed: 25,
    motto: "Community makes resilience."
  },
  gnome: {
    id: "gnome",
    name: "University City Native",
    icon: "🏫",
    description: "From scholarly centers shaped by printing presses and public debate.",
    abilityBonuses: { intelligence: 2, wisdom: 1 },
    speed: 25,
    motto: "Curiosity opens every gate."
  },
  "half-orc": {
    id: "half-orc",
    name: "Frontier Garrison Native",
    icon: "🏹",
    description: "Raised on contested borders where militia duty and survival are daily life.",
    abilityBonuses: { strength: 2, constitution: 1, charisma: -1 },
    speed: 30,
    motto: "Hold fast at the edge."
  },
  "half-elf": {
    id: "half-elf",
    name: "Cross-Border Native",
    icon: "🧭",
    description: "Shaped by multiple cultures, languages, and laws across shifting frontiers.",
    abilityBonuses: { charisma: 2, dexterity: 1, intelligence: 1 },
    speed: 30,
    motto: "Bridge the map, bridge the people."
  },
  tiefling: {
    id: "tiefling",
    name: "Exile Community Native",
    icon: "🕯️",
    description: "From displaced communities that survive through craft, memory, and grit.",
    abilityBonuses: { charisma: 2, intelligence: 1, dexterity: 1 },
    speed: 30,
    motto: "Rebuild, even far from home."
  },
  dragonborn: {
    id: "dragonborn",
    name: "Naval Port Native",
    icon: "🚢",
    description: "Raised in maritime cities where fleets, maps, and storms decide fortunes.",
    abilityBonuses: { strength: 2, charisma: 1 },
    speed: 30,
    motto: "The horizon rewards preparation."
  },
  aasimar: {
    id: "aasimar",
    name: "Pilgrimage Route Native",
    icon: "🛤️",
    description: "From crossroads sustained by faith travelers, inns, and charitable orders.",
    abilityBonuses: { charisma: 2, wisdom: 1 },
    speed: 30,
    motto: "Service leaves the deepest mark."
  }
};

export function getClass(id: string): ClassDefinition {
  return characterClasses[id] || characterClasses.fighter;
}

export function getRace(id: string): RaceDefinition {
  return characterRaces[id] || characterRaces.human;
}

export const baseAbilityScore = 10;

export function rollAbilityScore(): number {
  const rolls = [
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1
  ];
  return rolls.sort((a, b) => b - a).slice(0, 3).reduce((sum, val) => sum + val, 0);
}

export function calculateModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function getModifierSign(mod: number): string {
  return mod > 0 ? `+${mod}` : `${mod}`;
}
