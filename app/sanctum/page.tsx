"use client";

import { useState } from "react";
import { AtlasButton } from "../../components/atlas";
import {
  characterRoles,
  homelandOptions,
  socialStandings,
  rollAttributeScore,
  calculateModifier,
  getModifierSign,
  type PlayableCharacter,
  type Homeland,
  type SanctumAttributes,
  type SanctumRole,
  type SocialStanding
} from "../../lib/wayfinder";

const MAX_CHARACTER_SLOTS = 3;
const ACCOUNT_PLAYER_NAME = "Atlas Professional";

const attributeLabels: Record<keyof SanctumAttributes, string> = {
  might: "Might",
  finesse: "Finesse",
  vitality: "Vitality",
  reason: "Reason",
  awareness: "Awareness",
  presence: "Presence"
};

const attributeShort: Record<keyof SanctumAttributes, string> = {
  might: "MIG",
  finesse: "FIN",
  vitality: "VIT",
  reason: "REA",
  awareness: "AWR",
  presence: "PRE"
};

function generateCharacterId(): string {
  return `char_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function deriveCharacterStats(attributes: SanctumAttributes, rank = 1) {
  const vitalityMod = calculateModifier(attributes.vitality);
  const finesseMod = calculateModifier(attributes.finesse);
  const awarenessMod = calculateModifier(attributes.awareness);
  const presenceMod = calculateModifier(attributes.presence);

  return {
    condition: Math.max(8 + rank * 4 + vitalityMod, 1),
    defense: 10 + finesseMod,
    readiness: finesseMod,
    endurance: vitalityMod,
    reaction: finesseMod,
    resolve: Math.max(awarenessMod, presenceMod),
    combatTraining: rank
  };
}

function createNewCharacter(): PlayableCharacter {
  const attributes: SanctumAttributes = {
    might: rollAttributeScore(),
    finesse: rollAttributeScore(),
    vitality: rollAttributeScore(),
    reason: rollAttributeScore(),
    awareness: rollAttributeScore(),
    presence: rollAttributeScore()
  };

  return {
    id: generateCharacterId(),
    name: "New Character",
    role: "soldier",
    homeland: "england",
    socialStanding: "commoner",
    specialty: "Man-at-Arms",
    occupation: "Unwritten",
    rank: 1,
    renown: 0,
    attributes,
    ...deriveCharacterStats(attributes, 1),
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
      role: "soldier",
      homeland: "holy-roman-empire",
      socialStanding: "military-officer",
      specialty: "Landsknecht",
      occupation: "Mercenary Captain",
      rank: 3,
      renown: 2100,
      attributes: {
        might: 16,
        finesse: 12,
        vitality: 15,
        reason: 10,
        awareness: 13,
        presence: 11
      },
      condition: 24,
      defense: 14,
      readiness: 1,
      endurance: 2,
      reaction: 1,
      resolve: 1,
      combatTraining: 3,
      backstory: "A former soldier seeking redemption through disciplined service.",
      personalLegend: "The Steel Knight Who Chose Honor Over Orders",
      createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
    }
  ]);

  const [activeCharacterId, setActiveCharacterId] = useState(characters[0]?.id || null);
  const activeCharacter = characters.find((c) => c.id === activeCharacterId);
  const canCreateCharacter = characters.length < MAX_CHARACTER_SLOTS;

  function handleCreateCharacter() {
    if (!canCreateCharacter) {
      return;
    }

    const newChar = createNewCharacter();
    setCharacters([...characters, newChar]);
    setActiveCharacterId(newChar.id);
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
          <p className="fc-eyebrow">1500s Earth Roleplay</p>
        </div>
        <div className="fc-section">
          <p>No characters yet. Create your first Sanctum character to begin.</p>
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
            {characterRoles[activeCharacter.role]?.icon || "✦"}
          </div>
          <div>
            <p className="fc-eyebrow">The Sanctum • Earth, 1500s</p>
            <h1>Sanctum Character Chamber</h1>
            <p className="fc-identity-name">{activeCharacter.name}</p>
            <p className="fc-identity-title">
              Rank {activeCharacter.rank} {characterRoles[activeCharacter.role]?.name || "Character"} •{" "}
              {homelandOptions[activeCharacter.homeland]?.name || "Unknown Homeland"}
            </p>
          </div>
        </div>
        <div className="fc-identity-details">
          <div className="fc-detail-row">
            <span className="fc-label">Condition</span>
            <span className="fc-value">{activeCharacter.condition}</span>
          </div>
          <div className="fc-detail-row">
            <span className="fc-label">Defense</span>
            <span className="fc-value">{activeCharacter.defense}</span>
          </div>
          <div className="fc-detail-row">
            <span className="fc-label">Renown</span>
            <span className="fc-value">{activeCharacter.renown.toLocaleString()}</span>
          </div>
        </div>
      </section>

      {/* Core Attributes */}
      <section className="fc-section">
        <h2>Core Attributes</h2>
        <div className="fc-abilities-grid">
          {(Object.keys(attributeLabels) as Array<keyof SanctumAttributes>).map((attribute) => {
            const score = activeCharacter.attributes[attribute];
            const mod = calculateModifier(score);
            return (
              <div key={attribute} className="fc-ability-card">
                <div className="fc-ability-short">{attributeShort[attribute]}</div>
                <div className="fc-ability-score">{score}</div>
                <div className="fc-ability-mod">{getModifierSign(mod)}</div>
                <div className="fc-ability-label">{attributeLabels[attribute]}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Derived Stats */}
      <section className="fc-section">
        <h2>Derived Stats</h2>
        <div className="fc-abilities-grid">
          <div className="fc-ability-card">
            <div className="fc-ability-short">RDY</div>
            <div className="fc-ability-score">{getModifierSign(activeCharacter.readiness)}</div>
            <div className="fc-ability-label">Readiness</div>
          </div>
          <div className="fc-ability-card">
            <div className="fc-ability-short">END</div>
            <div className="fc-ability-score">{getModifierSign(activeCharacter.endurance)}</div>
            <div className="fc-ability-label">Endurance</div>
          </div>
          <div className="fc-ability-card">
            <div className="fc-ability-short">RCT</div>
            <div className="fc-ability-score">{getModifierSign(activeCharacter.reaction)}</div>
            <div className="fc-ability-label">Reaction</div>
          </div>
          <div className="fc-ability-card">
            <div className="fc-ability-short">RES</div>
            <div className="fc-ability-score">{getModifierSign(activeCharacter.resolve)}</div>
            <div className="fc-ability-label">Resolve</div>
          </div>
          <div className="fc-ability-card">
            <div className="fc-ability-short">CT</div>
            <div className="fc-ability-score">{activeCharacter.combatTraining}</div>
            <div className="fc-ability-label">Combat Training</div>
          </div>
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
                <label>Role</label>
                <select
                  value={activeCharacter.role}
                  onChange={(e) => handleUpdateCharacter({ role: e.target.value as SanctumRole })}
                  className="fc-select"
                >
                  {Object.entries(characterRoles).map(([key, role]) => (
                    <option key={key} value={key}>
                      {role.icon} {role.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="fc-form-group">
                <label>Homeland</label>
                <select
                  value={activeCharacter.homeland}
                  onChange={(e) => handleUpdateCharacter({ homeland: e.target.value as Homeland })}
                  className="fc-select"
                >
                  {Object.entries(homelandOptions).map(([key, homeland]) => (
                    <option key={key} value={key}>
                      {homeland.icon} {homeland.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="fc-form-row">
              <div className="fc-form-group">
                <label>Social Standing</label>
                <select
                  value={activeCharacter.socialStanding}
                  onChange={(e) => handleUpdateCharacter({ socialStanding: e.target.value as SocialStanding })}
                  className="fc-select"
                >
                  {Object.entries(socialStandings).map(([key, standing]) => (
                    <option key={key} value={key}>
                      {standing.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="fc-form-group">
                <label>Specialty</label>
                <input
                  type="text"
                  value={activeCharacter.specialty}
                  onChange={(e) => handleUpdateCharacter({ specialty: e.target.value })}
                  className="fc-input"
                  placeholder="Spy, physician, courtier, landsknecht..."
                />
              </div>
            </div>
            <div className="fc-form-group">
              <label>Occupation</label>
              <input
                type="text"
                value={activeCharacter.occupation}
                onChange={(e) => handleUpdateCharacter({ occupation: e.target.value })}
                className="fc-input"
                placeholder="What do they actually do in the world?"
              />
            </div>
            <div className="fc-form-group">
              <label>Personal Quest</label>
              <textarea
                value={activeCharacter.personalLegend || ""}
                onChange={(e) => handleUpdateCharacter({ personalLegend: e.target.value })}
                className="fc-textarea"
                placeholder="What is your character's defining quest, vow, or reputation?"
                rows={2}
              />
            </div>
            <div className="fc-form-group">
              <label>Backstory</label>
              <textarea
                value={activeCharacter.backstory || ""}
                onChange={(e) => handleUpdateCharacter({ backstory: e.target.value })}
                className="fc-textarea"
                placeholder="Where did they come from? Who protects them? Who threatens them?"
                rows={3}
              />
            </div>
          </div>
        </details>
      </section>

      {/* Character Selector & Actions */}
      <section className="fc-section">
        <h3>Your Sanctum Characters ({characters.length}/{MAX_CHARACTER_SLOTS})</h3>
        <div className="fc-character-list">
          {characters.map((char) => (
            <div
              key={char.id}
              className={`fc-character-card ${activeCharacterId === char.id ? "active" : ""}`}
              onClick={() => setActiveCharacterId(char.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setActiveCharacterId(char.id);
                }
              }}
            >
              <div className="fc-card-icon">{characterRoles[char.role]?.icon || "✦"}</div>
              <div className="fc-card-content">
                <div className="fc-card-name">{char.name}</div>
                <div className="fc-card-meta">
                  Rank {char.rank} {characterRoles[char.role]?.name} • {homelandOptions[char.homeland]?.name}
                </div>
              </div>
              <div className="fc-character-hover-card" role="status" aria-live="polite">
                <p className="fc-hover-title">{char.name}</p>
                <p>Role: {characterRoles[char.role]?.name}</p>
                <p>Homeland: {homelandOptions[char.homeland]?.name}</p>
                <p>Standing: {socialStandings[char.socialStanding]?.name}</p>
                <p>Rank {char.rank} • Condition {char.condition} • Defense {char.defense}</p>
                <p>Played by: {ACCOUNT_PLAYER_NAME}</p>
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
          {Array.from({ length: Math.max(MAX_CHARACTER_SLOTS - characters.length, 0) }).map((_, index) => (
            <div key={`empty-slot-${index}`} className="fc-character-card fc-character-slot-empty">
              <div className="fc-card-icon">✦</div>
              <div className="fc-card-content">
                <div className="fc-card-name">Empty Slot</div>
                <div className="fc-card-meta">Create a new Sanctum character for this account</div>
              </div>
            </div>
          ))}
        </div>
        <div className="fc-button-row">
          <AtlasButton onClick={handleCreateCharacter} variant="ghost">
            + Create Character
          </AtlasButton>
          {!canCreateCharacter && (
            <p className="fc-slot-limit-note">All 3 character slots are in use for this account.</p>
          )}
        </div>
      </section>

      {/* Role & Setting Info */}
      {activeCharacter && (
        <section className="fc-section fc-collapsible">
          <details>
            <summary>
              ℹ️ {characterRoles[activeCharacter.role]?.name || "Role"}, {homelandOptions[activeCharacter.homeland]?.name || "Homeland"} & {socialStandings[activeCharacter.socialStanding]?.name || "Standing"}
            </summary>
            <div className="fc-collapsible-content">
              <div className="fc-info-block">
                <h4>{characterRoles[activeCharacter.role]?.name}</h4>
                <p className="fc-motto">"{characterRoles[activeCharacter.role]?.motto}"</p>
                <p>{characterRoles[activeCharacter.role]?.description}</p>
              </div>
              <div className="fc-info-block">
                <h4>{homelandOptions[activeCharacter.homeland]?.name}</h4>
                <p className="fc-motto">"{homelandOptions[activeCharacter.homeland]?.motto}"</p>
                <p>{homelandOptions[activeCharacter.homeland]?.description}</p>
              </div>
              <div className="fc-info-block">
                <h4>{socialStandings[activeCharacter.socialStanding]?.name}</h4>
                <p>{socialStandings[activeCharacter.socialStanding]?.description}</p>
                <p><strong>Access:</strong> {socialStandings[activeCharacter.socialStanding]?.access}</p>
                <p><strong>Obligation:</strong> {socialStandings[activeCharacter.socialStanding]?.obligation}</p>
              </div>
            </div>
          </details>
        </section>
      )}
    </div>
  );
}
