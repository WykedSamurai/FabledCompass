"use client";

import { useState } from "react";
import { AtlasButton } from "../../components/atlas";
import {
  characterClasses,
  characterRaces,
  baseAbilityScore,
  rollAbilityScore,
  calculateModifier,
  getModifierSign,
  type PlayableCharacter,
  type CharacterClass,
  type CharacterRace,
  type AbilityScores
} from "../../lib/pathfinder";

const abilityLabels: Record<keyof AbilityScores, string> = {
  strength: "Strength",
  dexterity: "Dexterity",
  constitution: "Constitution",
  intelligence: "Intelligence",
  wisdom: "Wisdom",
  charisma: "Charisma"
};

const abilityShort: Record<keyof AbilityScores, string> = {
  strength: "STR",
  dexterity: "DEX",
  constitution: "CON",
  intelligence: "INT",
  wisdom: "WIS",
  charisma: "CHA"
};

function generateCharacterId(): string {
  return `char_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function createNewCharacter(): PlayableCharacter {
  const abilities: AbilityScores = {
    strength: rollAbilityScore(),
    dexterity: rollAbilityScore(),
    constitution: rollAbilityScore(),
    intelligence: rollAbilityScore(),
    wisdom: rollAbilityScore(),
    charisma: rollAbilityScore()
  };

  const conMod = calculateModifier(abilities.constitution);
  const hpPerLevel = 6 + conMod;

  return {
    id: generateCharacterId(),
    name: "New Adventurer",
    class: "fighter",
    race: "human",
    level: 1,
    experience: 0,
    abilityScores: abilities,
    hitPoints: Math.max(hpPerLevel, 1),
    armor: 10,
    backstory: "",
    personalLegend: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export default function SanctuumPage() {
  const [characters, setCharacters] = useState<PlayableCharacter[]>([
    {
      id: "char_sample_001",
      name: "Kael Ironbrand",
      class: "fighter",
      race: "human",
      level: 3,
      experience: 2100,
      abilityScores: {
        strength: 16,
        dexterity: 12,
        constitution: 15,
        intelligence: 10,
        wisdom: 13,
        charisma: 11
      },
      hitPoints: 24,
      armor: 14,
      backstory: "A former soldier seeking redemption through adventure.",
      personalLegend: "The Steel Knight Who Chose Honor Over Orders",
      createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
    }
  ]);

  const [activeCharacterId, setActiveCharacterId] = useState(characters[0]?.id || null);
  const [creationMode, setCreationMode] = useState(false);

  const activeCharacter = characters.find((c) => c.id === activeCharacterId);

  function handleCreateCharacter() {
    const newChar = createNewCharacter();
    setCharacters([...characters, newChar]);
    setActiveCharacterId(newChar.id);
    setCreationMode(false);
  }

  function handleUpdateCharacter(updates: Partial<PlayableCharacter>) {
    if (!activeCharacter) return;
    const updated = {
      ...activeCharacter,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    setCharacters(characters.map((c) => (c.id === activeCharacter.id ? updated : c)));
  }

  function handleDeleteCharacter(id: string) {
    const newChars = characters.filter((c) => c.id !== id);
    setCharacters(newChars);
    if (activeCharacterId === id) {
      setActiveCharacterId(newChars[0]?.id || null);
    }
  }

  if (!activeCharacter) {
    return (
      <div className="fc-page-stack">
        <div className="fc-page-header">
          <h1>The Sanctum</h1>
          <p className="fc-eyebrow">Your Private Pathfinder Campaign</p>
        </div>
        <div className="fc-section">
          <p>No characters yet. Create your first Pathfinder to begin.</p>
          <AtlasButton onClick={handleCreateCharacter} variant="primary">
            Create Character
          </AtlasButton>
        </div>
      </div>
    );
  }

  return (
    <div className="fc-page-stack fc-compact-sheet">
      {/* Header */}
      <section className="fc-character-sheet-hero">
        <div className="fc-identity-core">
          <div className="fc-archetype-portrait" aria-hidden="true">
            {characterClasses[activeCharacter.class]?.icon || "⚔️"}
          </div>
          <div>
            <p className="fc-eyebrow">The Sanctum</p>
            <h1>Pathfinder's Chamber</h1>
            <p className="fc-identity-name">{activeCharacter.name}</p>
            <p className="fc-identity-title">
              Level {activeCharacter.level} {characterClasses[activeCharacter.class]?.name || "Adventurer"} •{" "}
              {characterRaces[activeCharacter.race]?.name || "Human"}
            </p>
          </div>
        </div>
        <div className="fc-identity-details">
          <div className="fc-detail-row">
            <span className="fc-label">Hit Points</span>
            <span className="fc-value">{activeCharacter.hitPoints}</span>
          </div>
          <div className="fc-detail-row">
            <span className="fc-label">Armor Class</span>
            <span className="fc-value">{activeCharacter.armor}</span>
          </div>
          <div className="fc-detail-row">
            <span className="fc-label">Experience</span>
            <span className="fc-value">{activeCharacter.experience.toLocaleString()}</span>
          </div>
        </div>
      </section>

      {/* Core Abilities */}
      <section className="fc-section">
        <h2>Core Attributes</h2>
        <div className="fc-abilities-grid">
          {(Object.keys(abilityLabels) as Array<keyof AbilityScores>).map((ability) => {
            const score = activeCharacter.abilityScores[ability];
            const mod = calculateModifier(score);
            return (
              <div key={ability} className="fc-ability-card">
                <div className="fc-ability-short">{abilityShort[ability]}</div>
                <div className="fc-ability-score">{score}</div>
                <div className="fc-ability-mod">{getModifierSign(mod)}</div>
                <div className="fc-ability-label">{abilityLabels[ability]}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Character Customization */}
      <section className="fc-section fc-collapsible">
        <details>
          <summary>📖 Character Details</summary>
          <div className="fc-collapsible-content">
            <div className="fc-form-group">
              <label>Character Name</label>
              <input
                type="text"
                value={activeCharacter.name}
                onChange={(e) => handleUpdateCharacter({ name: e.target.value })}
                className="fc-input"
              />
            </div>
            <div className="fc-form-row">
              <div className="fc-form-group">
                <label>Class</label>
                <select
                  value={activeCharacter.class}
                  onChange={(e) => handleUpdateCharacter({ class: e.target.value as CharacterClass })}
                  className="fc-select"
                >
                  {Object.entries(characterClasses).map(([key, cls]) => (
                    <option key={key} value={key}>
                      {cls.icon} {cls.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="fc-form-group">
                <label>Race</label>
                <select
                  value={activeCharacter.race}
                  onChange={(e) => handleUpdateCharacter({ race: e.target.value as CharacterRace })}
                  className="fc-select"
                >
                  {Object.entries(characterRaces).map(([key, race]) => (
                    <option key={key} value={key}>
                      {race.icon} {race.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="fc-form-group">
              <label>Personal Quest</label>
              <textarea
                value={activeCharacter.personalLegend || ""}
                onChange={(e) => handleUpdateCharacter({ personalLegend: e.target.value })}
                className="fc-textarea"
                placeholder="What is your character's defining quest or legend?"
                rows={2}
              />
            </div>
            <div className="fc-form-group">
              <label>Backstory</label>
              <textarea
                value={activeCharacter.backstory || ""}
                onChange={(e) => handleUpdateCharacter({ backstory: e.target.value })}
                className="fc-textarea"
                placeholder="Where did they come from? What drives them?"
                rows={3}
              />
            </div>
          </div>
        </details>
      </section>

      {/* Character Selector & Actions */}
      <section className="fc-section">
        <h3>Your Pathfinders</h3>
        <div className="fc-character-list">
          {characters.map((char) => (
            <div
              key={char.id}
              className={`fc-character-card ${activeCharacterId === char.id ? "active" : ""}`}
              onClick={() => setActiveCharacterId(char.id)}
            >
              <div className="fc-card-icon">{characterClasses[char.class]?.icon || "⚔️"}</div>
              <div className="fc-card-content">
                <div className="fc-card-name">{char.name}</div>
                <div className="fc-card-meta">
                  Level {char.level} {characterClasses[char.class]?.name} • {characterRaces[char.race]?.name}
                </div>
              </div>
              {characters.length > 1 && activeCharacterId === char.id && (
                <button
                  className="fc-delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCharacter(char.id);
                  }}
                  aria-label="Delete character"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="fc-button-row">
          <AtlasButton onClick={handleCreateCharacter} variant="ghost">
            + Create Character
          </AtlasButton>
        </div>
      </section>

      {/* Class & Race Info */}
      {activeCharacter && (
        <section className="fc-section fc-collapsible">
          <details>
            <summary>ℹ️ {characterClasses[activeCharacter.class]?.name || "Class"} & {characterRaces[activeCharacter.race]?.name || "Race"}</summary>
            <div className="fc-collapsible-content">
              <div className="fc-info-block">
                <h4>{characterClasses[activeCharacter.class]?.name}</h4>
                <p className="fc-motto">"{characterClasses[activeCharacter.class]?.motto}"</p>
                <p>{characterClasses[activeCharacter.class]?.description}</p>
              </div>
              <div className="fc-info-block">
                <h4>{characterRaces[activeCharacter.race]?.name}</h4>
                <p className="fc-motto">"{characterRaces[activeCharacter.race]?.motto}"</p>
                <p>{characterRaces[activeCharacter.race]?.description}</p>
              </div>
            </div>
          </details>
        </section>
      )}
    </div>
  );
}
