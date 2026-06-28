import type { ClassDefinition, RaceDefinition } from "./types";

export const characterClasses: Record<string, ClassDefinition> = {
  fighter: {
    id: "fighter",
    name: "Fighter",
    icon: "⚔️",
    description: "Master of weapons and armor, disciplined and tactical.",
    primaryAbilities: ["strength", "constitution"],
    hitDie: 10,
    skillPoints: 2,
    motto: "Discipline and steel shape victory."
  },
  rogue: {
    id: "rogue",
    name: "Rogue",
    icon: "🗡️",
    description: "Swift, cunning, and deadly. Expert in stealth and precision.",
    primaryAbilities: ["dexterity", "charisma"],
    hitDie: 8,
    skillPoints: 8,
    motto: "Shadows hide the sharpest blade."
  },
  wizard: {
    id: "wizard",
    name: "Wizard",
    icon: "🔮",
    description: "Student of the arcane arts, wielding spells and ancient knowledge.",
    primaryAbilities: ["intelligence", "wisdom"],
    hitDie: 6,
    skillPoints: 2,
    motto: "Knowledge is the ultimate power."
  },
  cleric: {
    id: "cleric",
    name: "Cleric",
    icon: "✨",
    description: "Channel divine power to heal and smite. Touched by the sacred.",
    primaryAbilities: ["wisdom", "strength"],
    hitDie: 8,
    skillPoints: 2,
    motto: "Faith guides the hand of the healer."
  },
  ranger: {
    id: "ranger",
    name: "Ranger",
    icon: "🏹",
    description: "Tracker and marksman. At home in the wilderness.",
    primaryAbilities: ["dexterity", "wisdom"],
    hitDie: 10,
    skillPoints: 6,
    motto: "Nature's secrets are mine to read."
  },
  paladin: {
    id: "paladin",
    name: "Paladin",
    icon: "⚜️",
    description: "Oath-bound warrior of conviction. Holy and righteous.",
    primaryAbilities: ["strength", "charisma"],
    hitDie: 10,
    skillPoints: 2,
    motto: "Conviction tempers the blade."
  },
  barbarian: {
    id: "barbarian",
    name: "Barbarian",
    icon: "🔥",
    description: "Primal fury and raw power. Unstoppable force.",
    primaryAbilities: ["strength", "constitution"],
    hitDie: 12,
    skillPoints: 2,
    motto: "Rage is the truest strength."
  },
  bard: {
    id: "bard",
    name: "Bard",
    icon: "🎵",
    description: "Master of words, music, and magic. Inspiring and versatile.",
    primaryAbilities: ["charisma", "intelligence"],
    hitDie: 8,
    skillPoints: 8,
    motto: "Words and music move the world."
  },
  druid: {
    id: "druid",
    name: "Druid",
    icon: "🌿",
    description: "One with nature. Shapeshifter and healer.",
    primaryAbilities: ["wisdom", "constitution"],
    hitDie: 8,
    skillPoints: 4,
    motto: "The balance sustains all life."
  },
  monk: {
    id: "monk",
    name: "Monk",
    icon: "✋",
    description: "Disciplined martial artist. Mind and body as one.",
    primaryAbilities: ["dexterity", "wisdom"],
    hitDie: 8,
    skillPoints: 4,
    motto: "The body is a temple of discipline."
  },
  sorcerer: {
    id: "sorcerer",
    name: "Sorcerer",
    icon: "⚡",
    description: "Magic courses through your blood. Innate power.",
    primaryAbilities: ["charisma", "constitution"],
    hitDie: 6,
    skillPoints: 2,
    motto: "Power flows where it will."
  },
  warlock: {
    id: "warlock",
    name: "Warlock",
    icon: "👁️",
    description: "Bound to eldritch power. Dangerous and enigmatic.",
    primaryAbilities: ["charisma", "intelligence"],
    hitDie: 6,
    skillPoints: 2,
    motto: "Knowledge and power exact their price."
  }
};

export const characterRaces: Record<string, RaceDefinition> = {
  human: {
    id: "human",
    name: "Human",
    icon: "👤",
    description: "Adaptable and ambitious. Born for greatness.",
    abilityBonuses: { strength: 1, dexterity: 1, constitution: 1, intelligence: 1, wisdom: 1, charisma: 1 },
    speed: 30,
    motto: "We are limited only by our will."
  },
  elf: {
    id: "elf",
    name: "Elf",
    icon: "🧝",
    description: "Graceful and timeless. Keepers of ancient magic.",
    abilityBonuses: { dexterity: 2, intelligence: 1 },
    speed: 30,
    motto: "Time reveals all truths."
  },
  dwarf: {
    id: "dwarf",
    name: "Dwarf",
    icon: "🧔",
    description: "Sturdy and resolute. Masters of stone and steel.",
    abilityBonuses: { constitution: 2, wisdom: 1 },
    speed: 25,
    motto: "Stone endures. So do we."
  },
  halfling: {
    id: "halfling",
    name: "Halfling",
    icon: "🐹",
    description: "Small in stature, great in spirit. Lucky and clever.",
    abilityBonuses: { dexterity: 2, charisma: 1 },
    speed: 25,
    motto: "Fortune favors the bold."
  },
  gnome: {
    id: "gnome",
    name: "Gnome",
    icon: "🧙",
    description: "Curious and inventive. Tinkerer of wonder.",
    abilityBonuses: { intelligence: 2, wisdom: 1 },
    speed: 25,
    motto: "Imagination is the only limit."
  },
  "half-orc": {
    id: "half-orc",
    name: "Half-Orc",
    icon: "🗡️",
    description: "Fierce and powerful. Caught between two worlds.",
    abilityBonuses: { strength: 2, constitution: 1, charisma: -1 },
    speed: 30,
    motto: "Strength and honor earn respect."
  },
  "half-elf": {
    id: "half-elf",
    name: "Half-Elf",
    icon: "🌙",
    description: "Bridging two worlds. Charming and diplomatic.",
    abilityBonuses: { charisma: 2, dexterity: 1, intelligence: 1 },
    speed: 30,
    motto: "We walk between worlds."
  },
  tiefling: {
    id: "tiefling",
    name: "Tiefling",
    icon: "👹",
    description: "Touched by infernal heritage. Exotic and mysterious.",
    abilityBonuses: { charisma: 2, intelligence: 1, dexterity: 1 },
    speed: 30,
    motto: "Destiny is written in blood."
  },
  dragonborn: {
    id: "dragonborn",
    name: "Dragonborn",
    icon: "🐉",
    description: "Dragon-descended warrior. Proud and mighty.",
    abilityBonuses: { strength: 2, charisma: 1 },
    speed: 30,
    motto: "Dragon fire burns eternal."
  },
  aasimar: {
    id: "aasimar",
    name: "Aasimar",
    icon: "😇",
    description: "Touched by celestial grace. Light-bringer.",
    abilityBonuses: { charisma: 2, wisdom: 1 },
    speed: 30,
    motto: "Light shines through the darkness."
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
