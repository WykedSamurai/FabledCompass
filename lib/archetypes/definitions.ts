import type { Archetype, ArchetypeId } from "./types";

export const archetypes: Record<ArchetypeId, Archetype> = {
  traveler: { id: "traveler", name: "Traveler", icon: "🌍", motto: "Every journey teaches.", description: "One who keeps moving forward and learning from each experience.", theme: { primaryMotif: "Compass", accent: "cyan", backgroundMood: "horizon and stars" }, aiVoice: "Reflective and focused on growth through experience." },
  explorer: { id: "explorer", name: "Explorer", icon: "🧭", motto: "Beyond every horizon is another.", description: "Drawn toward new knowledge and unfamiliar paths.", theme: { primaryMotif: "Telescope", accent: "blue", backgroundMood: "distant constellations" }, aiVoice: "Curious and opportunity-focused." },
  creator: { id: "creator", name: "Creator", icon: "✨", motto: "Ideas become reality.", description: "Turns ideas into useful work, products, stories, and solutions.", theme: { primaryMotif: "Ink and stars", accent: "violet", backgroundMood: "sketches and constellations" }, aiVoice: "Imaginative and practical." },
  leader: { id: "leader", name: "Leader", icon: "🏛", motto: "Others rise when leadership serves.", description: "Guides people, decisions, and outcomes with accountability.", theme: { primaryMotif: "Column", accent: "gold", backgroundMood: "structured starlight" }, aiVoice: "Steady and responsibility-focused." },
  mentor: { id: "mentor", name: "Mentor", icon: "🤝", motto: "Growth shared is growth multiplied.", description: "Helps others develop through teaching, coaching, and encouragement.", theme: { primaryMotif: "Lantern", accent: "amber", backgroundMood: "warm guiding light" }, aiVoice: "Supportive and instructive." },
  guardian: { id: "guardian", name: "Guardian", icon: "🛡", motto: "Protect what matters.", description: "Protects standards, quality, people, and trust.", theme: { primaryMotif: "Shield", accent: "steel", backgroundMood: "deep navy stone" }, aiVoice: "Measured and standard-focused." },
  scholar: { id: "scholar", name: "Scholar", icon: "🔬", motto: "Knowledge illuminates the path.", description: "Seeks understanding through study, research, analysis, and reflection.", theme: { primaryMotif: "Observatory", accent: "indigo", backgroundMood: "celestial charts" }, aiVoice: "Analytical and evidence-focused." },
  builder: { id: "builder", name: "Builder", icon: "⚒", motto: "Strong foundations endure.", description: "Creates lasting systems, processes, structures, and results.", theme: { primaryMotif: "Blueprint", accent: "bronze", backgroundMood: "geometric lines" }, aiVoice: "Practical and structured." },
  innovator: { id: "innovator", name: "Innovator", icon: "💡", motto: "Tomorrow begins with one idea.", description: "Turns new ideas into useful change.", theme: { primaryMotif: "Spark", accent: "yellow", backgroundMood: "bright emerging stars" }, aiVoice: "Forward-looking and experimental." },
  steward: { id: "steward", name: "Steward", icon: "🌱", motto: "Leave every place better than it was found.", description: "Develops people, communities, and resources with care.", theme: { primaryMotif: "Growth rings", accent: "green", backgroundMood: "soft living sky" }, aiVoice: "Grounded and sustainability-focused." },
  diplomat: { id: "diplomat", name: "Diplomat", icon: "⚖", motto: "Understanding builds bridges.", description: "Connects people, resolves tension, and helps groups work together.", theme: { primaryMotif: "Bridge", accent: "teal", backgroundMood: "balanced stars" }, aiVoice: "Balanced and trust-focused." },
  strategist: { id: "strategist", name: "Strategist", icon: "🎯", motto: "Preparation shapes progress.", description: "Plans ahead, reads patterns, and prepares for long-term outcomes.", theme: { primaryMotif: "Map grid", accent: "red", backgroundMood: "plotted routes" }, aiVoice: "Focused and priority-aware." }
};

export const defaultArchetype = archetypes.traveler;

export function getArchetype(id: ArchetypeId = "traveler") {
  return archetypes[id] ?? defaultArchetype;
}
