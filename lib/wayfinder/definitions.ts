import type { HomelandDefinition, RoleDefinition, SocialStandingDefinition } from "./types";

export const characterRoles: Record<string, RoleDefinition> = {
  soldier: {
    id: "soldier",
    name: "Soldier",
    icon: "⚔️",
    description: "A trained combatant shaped by drill, discipline, weapons, and campaign hardship.",
    primaryAttributes: ["might", "vitality"],
    conditionBase: 10,
    skillFocus: ["Blades", "Polearms", "Shields", "Warfare"],
    motto: "Discipline and steel shape victory."
  },
  courtier: {
    id: "courtier",
    name: "Courtier",
    icon: "⚜️",
    description: "A social operator fluent in etiquette, patronage, reputation, and political danger.",
    primaryAttributes: ["presence", "awareness"],
    conditionBase: 8,
    skillFocus: ["Etiquette", "Persuasion", "Insight", "Heraldry"],
    motto: "A room is a battlefield before the first blade is drawn."
  },
  agent: {
    id: "agent",
    name: "Agent",
    icon: "🗡️",
    description: "A spy, investigator, thief, courier, or hidden hand who thrives where records and secrets meet.",
    primaryAttributes: ["finesse", "awareness"],
    conditionBase: 8,
    skillFocus: ["Stealth", "Deception", "Investigation", "Lockcraft"],
    motto: "The quiet hand moves history."
  },
  scholar: {
    id: "scholar",
    name: "Scholar",
    icon: "📚",
    description: "An educated specialist trained in law, medicine, engineering, history, theology, or natural philosophy.",
    primaryAttributes: ["reason", "awareness"],
    conditionBase: 6,
    skillFocus: ["Research", "Law", "Medicine", "Natural Philosophy"],
    motto: "Knowledge is leverage."
  },
  cleric: {
    id: "cleric",
    name: "Cleric",
    icon: "✠",
    description: "A religious figure whose authority comes from doctrine, confession, literacy, and institutional reach.",
    primaryAttributes: ["awareness", "presence"],
    conditionBase: 8,
    skillFocus: ["Religion", "Insight", "Persuasion", "Administration"],
    motto: "Faith binds what law cannot reach."
  },
  warden: {
    id: "warden",
    name: "Warden",
    icon: "🏹",
    description: "A hunter, scout, forester, outrider, guide, or border watchman skilled beyond city walls.",
    primaryAttributes: ["finesse", "awareness"],
    conditionBase: 10,
    skillFocus: ["Survival", "Tracking", "Bows", "Animal Handling"],
    motto: "The land speaks to those who listen."
  },
  artisan: {
    id: "artisan",
    name: "Artisan",
    icon: "🛠️",
    description: "A skilled maker whose tools, workshop, guild ties, and reputation can open unexpected doors.",
    primaryAttributes: ["reason", "finesse"],
    conditionBase: 8,
    skillFocus: ["Craft", "Appraisal", "Commerce", "Guild Law"],
    motto: "A steady hand can build a kingdom."
  },
  merchant: {
    id: "merchant",
    name: "Merchant",
    icon: "⚖️",
    description: "A trader, factor, broker, banker, caravan master, or smuggler who understands risk and access.",
    primaryAttributes: ["reason", "presence"],
    conditionBase: 8,
    skillFocus: ["Commerce", "Persuasion", "Appraisal", "Streetwise"],
    motto: "Every gate has a price."
  },
  performer: {
    id: "performer",
    name: "Performer",
    icon: "🎭",
    description: "A musician, dancer, actor, acrobat, or storyteller who turns attention into influence.",
    primaryAttributes: ["presence", "finesse"],
    conditionBase: 8,
    skillFocus: ["Performance", "Etiquette", "Acrobatics", "Deception"],
    motto: "The audience remembers what power forgets."
  },
  physician: {
    id: "physician",
    name: "Physician",
    icon: "⚕️",
    description: "A healer, surgeon, apothecary, or learned practitioner navigating illness, anatomy, and trust.",
    primaryAttributes: ["reason", "awareness"],
    conditionBase: 8,
    skillFocus: ["Medicine", "Observation", "Apothecary", "Research"],
    motto: "A pulse tells truths the tongue conceals."
  }
};

export const homelandOptions: Record<string, HomelandDefinition> = {
  england: { id: "england", name: "England", icon: "♜", description: "A Tudor realm of court politics, church tension, ports, nobles, and ambitious households.", languages: ["English", "Latin"], motto: "Honor and opportunity under a watchful crown." },
  scotland: { id: "scotland", name: "Scotland", icon: "☘", description: "A kingdom of clans, border conflict, noble rivalries, scholars, and hard-won alliances.", languages: ["Scots", "Scottish Gaelic", "Latin"], motto: "Loyalty is kinship, oath, and necessity." },
  france: { id: "france", name: "France", icon: "⚜", description: "A powerful realm of courtly refinement, noble houses, religious strain, and military ambition.", languages: ["French", "Latin"], motto: "Grace conceals strategy." },
  spain: { id: "spain", name: "Spain", icon: "☀", description: "An expanding monarchy shaped by empire, faith, seafaring, court ceremony, and military prestige.", languages: ["Spanish", "Latin"], motto: "Faith, crown, and conquest cast long shadows." },
  portugal: { id: "portugal", name: "Portugal", icon: "⚓", description: "A maritime power of navigators, merchants, nobles, missionaries, and ocean routes.", languages: ["Portuguese", "Latin"], motto: "The sea is a road and a wager." },
  "italian-states": { id: "italian-states", name: "Italian States", icon: "◆", description: "City-states of banking, art, family politics, mercenaries, diplomats, and church influence.", languages: ["Italian", "Latin"], motto: "A city may be smaller than a kingdom and sharper than a sword." },
  "holy-roman-empire": { id: "holy-roman-empire", name: "Holy Roman Empire", icon: "🜂", description: "A patchwork of princes, free cities, guilds, soldiers, reformers, and imperial claims.", languages: ["German", "Latin"], motto: "Order is negotiated, not assumed." },
  "poland-lithuania": { id: "poland-lithuania", name: "Poland-Lithuania", icon: "♞", description: "A vast commonwealth of nobles, estates, borders, cavalry traditions, and layered identities.", languages: ["Polish", "Ruthenian", "Latin"], motto: "Liberty and duty ride together." },
  "ottoman-empire": { id: "ottoman-empire", name: "Ottoman Empire", icon: "☾", description: "An imperial power of courts, armies, scholars, trade routes, administrators, and frontier politics.", languages: ["Ottoman Turkish", "Arabic", "Persian"], motto: "Empire moves through law, sword, and ledger." },
  "ming-china": { id: "ming-china", name: "Ming China", icon: "龍", description: "A sophisticated imperial world of examinations, officials, artisans, cities, and guarded borders.", languages: ["Mandarin Chinese", "Classical Chinese"], motto: "Order begins with the written record." },
  "joseon-korea": { id: "joseon-korea", name: "Joseon Korea", icon: "☯", description: "A Confucian kingdom of scholars, court factions, family duty, military pressures, and ritual order.", languages: ["Korean", "Classical Chinese"], motto: "Principle is power when men obey it." },
  japan: { id: "japan", name: "Japan", icon: "◉", description: "A fractured age of daimyo, samurai households, temples, merchants, spies, and shifting loyalties.", languages: ["Japanese", "Classical Chinese"], motto: "The blade serves house, name, and survival." },
  "mughal-india": { id: "mughal-india", name: "Mughal India", icon: "✦", description: "A rising imperial order of courts, armies, poets, merchants, faiths, and regional powers.", languages: ["Persian", "Hindavi", "Sanskrit"], motto: "Splendor and command share the same hall." },
  "safavid-persia": { id: "safavid-persia", name: "Safavid Persia", icon: "✶", description: "A Persianate imperial world of shahs, clerics, cavalry, artisans, trade, and religious identity.", languages: ["Persian", "Azerbaijani", "Arabic"], motto: "Beauty, doctrine, and steel endure." },
  "kingdom-of-kongo": { id: "kingdom-of-kongo", name: "Kingdom of Kongo", icon: "◇", description: "A Central African kingdom of nobles, trade, diplomacy, Christianity, lineage, and regional power.", languages: ["Kikongo", "Portuguese"], motto: "Lineage carries authority across rivers and roads." },
  ethiopia: { id: "ethiopia", name: "Ethiopia", icon: "✚", description: "A highland Christian empire of nobles, clergy, soldiers, merchants, and contested frontiers.", languages: ["Ge'ez", "Amharic"], motto: "Faith and crown stand on ancient stone." },
  "indigenous-americas": { id: "indigenous-americas", name: "Indigenous Americas", icon: "✹", description: "A broad option for characters from the many distinct nations and communities of the Americas.", languages: ["Local language"], motto: "People, place, and memory are not separate things." },
  unknown: { id: "unknown", name: "Unknown or Concealed", icon: "?", description: "A hidden, disputed, forgotten, or intentionally obscured origin.", languages: ["Unlisted"], motto: "What is not named may still matter." }
};

export const socialStandings: Record<string, SocialStandingDefinition> = {
  royal: { id: "royal", name: "Royal", description: "Born or married into sovereign bloodlines.", access: "Highest court access and dynastic recognition.", obligation: "Constant scrutiny, inheritance politics, and symbolic duty." },
  "high-noble": { id: "high-noble", name: "High Noble", description: "Great houses with land, titles, retainers, and political consequence.", access: "Councils, commanders, bishops, and elite marriage networks.", obligation: "House reputation, patronage, taxes, and factional pressure." },
  "lesser-noble": { id: "lesser-noble", name: "Lesser Noble", description: "Titled or blooded nobility with limited resources or regional influence.", access: "Local courts, officers, patronage, and formal respect.", obligation: "Service, appearances, and dependence on stronger patrons." },
  gentry: { id: "gentry", name: "Gentry", description: "Respectable landholders and educated families below titled nobility.", access: "Local administration, marriage prospects, and social credibility.", obligation: "Reputation, property management, and public conduct." },
  clergy: { id: "clergy", name: "Clergy", description: "A member of a religious institution or household.", access: "Church courts, literacy, confession, sanctuary, and records.", obligation: "Doctrine, obedience, vows, and institutional politics." },
  "military-officer": { id: "military-officer", name: "Military Officer", description: "A commander or ranked servant of an army, navy, militia, or guard.", access: "Arsenals, patrols, officers, maps, and military justice.", obligation: "Orders, discipline, chain of command, and campaign duty." },
  "guild-member": { id: "guild-member", name: "Guild Member", description: "Recognized within a trade, craft, or urban professional body.", access: "Workshops, apprentices, suppliers, and guild courts.", obligation: "Dues, standards, rival masters, and city regulations." },
  merchant: { id: "merchant", name: "Merchant", description: "A trader, broker, shipper, banker, or commercial agent.", access: "Markets, credit, warehouses, contracts, and travel papers.", obligation: "Debts, tariffs, partners, and reputation for reliability." },
  "skilled-artisan": { id: "skilled-artisan", name: "Skilled Artisan", description: "A trained craftsperson whose labor has recognized value.", access: "Tools, workshops, patrons, and technical knowledge.", obligation: "Deadlines, materials, masters, and client expectations." },
  commoner: { id: "commoner", name: "Commoner", description: "A free person without noble, clerical, guild, or elite rank.", access: "Ordinary local networks and practical knowledge.", obligation: "Taxes, labor expectations, and vulnerability to authority." },
  servant: { id: "servant", name: "Servant", description: "Attached to a household, estate, court, inn, or institution.", access: "Back rooms, routines, overheard secrets, and domestic trust.", obligation: "Obedience, discretion, hierarchy, and dependence." },
  outlaw: { id: "outlaw", name: "Outlaw", description: "Living outside lawful protection by crime, exile, debt, or political accusation.", access: "Criminal networks, hiding places, and desperate allies.", obligation: "Risk of arrest, betrayal, violence, and false names." },
  indentured: { id: "indentured", name: "Enslaved or Indentured", description: "Bound by force, debt, law, war, or contract to another's control.", access: "Restricted movement but intimate knowledge of households and labor systems.", obligation: "Coercion, surveillance, limited legal protection, and survival pressure." },
  concealed: { id: "concealed", name: "Social Standing Concealed", description: "True status is hidden, forged, disputed, or deliberately performed.", access: "Depends on the cover identity.", obligation: "Discovery can destroy protection, trust, or freedom." }
};

export const baseAttributeScore = 10;

export function rollAttributeScore(): number {
  const rolls = [
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1
  ];
  return rolls.sort((a, b) => b - a).slice(0, 3).reduce((sum, val) => sum + val, 0);
}

export const rollAbilityScore = rollAttributeScore;

export function calculateModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function getModifierSign(mod: number): string {
  return mod > 0 ? `+${mod}` : `${mod}`;
}

export function getRole(id: string): RoleDefinition {
  return characterRoles[id] || characterRoles.soldier;
}

export function getHomeland(id: string): HomelandDefinition {
  return homelandOptions[id] || homelandOptions.england;
}

export const characterClasses = characterRoles;
export const characterRaces = homelandOptions;
