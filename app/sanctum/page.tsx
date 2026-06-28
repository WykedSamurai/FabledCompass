"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AtlasButton } from "../../components/atlas";
import PrototypeWatermark from "../../components/layout/PrototypeWatermark";
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
import { createClient } from "../../utils/supabase/client";

const MAX_CHARACTER_SLOTS = 3;
const ACCOUNT_PLAYER_NAME = "Atlas Professional";
const MIN_ATTRIBUTE_SCORE = 1;
const MAX_ATTRIBUTE_SCORE = 20;
const MIN_RANK = 1;
const MAX_RANK = 20;

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

function clampNumber(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function deriveCharacterStats(attributes: SanctumAttributes, rank = 1, role: SanctumRole = "soldier") {
  const vitalityMod = calculateModifier(attributes.vitality);
  const finesseMod = calculateModifier(attributes.finesse);
  const awarenessMod = calculateModifier(attributes.awareness);
  const presenceMod = calculateModifier(attributes.presence);
  const roleBase = characterRoles[role]?.conditionBase ?? 8;

  return {
    condition: Math.max(roleBase + rank * 4 + vitalityMod, 1),
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
    ...deriveCharacterStats(attributes, 1, "soldier"),
    backstory: "",
    personalLegend: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export default function SanctuumPage() {
  const router = useRouter();
  const [characters, setCharacters] = useState<PlayableCharacter[]>([]);
  const [activeCharacterId, setActiveCharacterId] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const activeCharacter = characters.find((c) => c.id === activeCharacterId);
  const canCreateCharacter = characters.length < MAX_CHARACTER_SLOTS;

  useEffect(() => {
    async function loadAuth() {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.replace("/login?next=/sanctum");
        return;
      }
      setAuthLoading(false);
    }

    loadAuth();
  }, [router]);

  function handleCreateCharacter() {
    if (!canCreateCharacter) {
      return;
    }

    const newChar = createNewCharacter();
    setCharacters([...characters, newChar]);
    setActiveCharacterId(newChar.id);
  }

  function updateCharacterWithRecalc(updates: Partial<PlayableCharacter>) {
    if (!activeCharacter) return;

    const nextCharacter = {
      ...activeCharacter,
      ...updates
    };

    const recalculated = deriveCharacterStats(
      nextCharacter.attributes,
      clampNumber(nextCharacter.rank, MIN_RANK, MAX_RANK),
      nextCharacter.role
    );

    const updated: PlayableCharacter = {
      ...nextCharacter,
      rank: clampNumber(nextCharacter.rank, MIN_RANK, MAX_RANK),
      renown: Math.max(nextCharacter.renown, 0),
      ...recalculated,
      updatedAt: new Date().toISOString()
    };

    setCharacters(characters.map((c) => (c.id === activeCharacter.id ? updated : c)));
  }

  function handleAttributeChange(attribute: keyof SanctumAttributes, rawValue: string) {
    if (!activeCharacter) return;
    const nextValue = clampNumber(Number(rawValue) || MIN_ATTRIBUTE_SCORE, MIN_ATTRIBUTE_SCORE, MAX_ATTRIBUTE_SCORE);
    updateCharacterWithRecalc({
      attributes: {
        ...activeCharacter.attributes,
        [attribute]: nextValue
      }
    });
  }

  function handleDeleteCharacter(id: string) {
    const newChars = characters.filter((c) => c.id !== id);
    setCharacters(newChars);
    if (activeCharacterId === id) {
      setActiveCharacterId(newChars[0]?.id || null);
    }
  }

  return (
    <div className="fc-page-stack fc-compact-sheet fc-prototype-frame">
      <PrototypeWatermark />
      {authLoading ? (
        <section className="fc-section fc-empty-state">
          <h2>Loading Sanctum</h2>
          <p>Checking account access...</p>
        </section>
      ) : (
        <>
      <section className="fc-sanctum-toolbar">
        <div>
          <p className="fc-eyebrow">The Sanctum • Earth, 1500s</p>
          <h1>Character Sheet</h1>
        </div>
        <div className="fc-sanctum-toolbar-actions">
          <AtlasButton onClick={handleCreateCharacter} variant="primary">
            Create Character
          </AtlasButton>

          <select
            className="fc-select"
            value={activeCharacterId ?? ""}
            onChange={(event) => setActiveCharacterId(event.target.value)}
            disabled={!characters.length}
          >
            {!characters.length && <option value="">No characters yet</option>}
            {characters.map((character) => (
              <option key={character.id} value={character.id}>
                {character.name}
              </option>
            ))}
          </select>
        </div>
      </section>

      {!activeCharacter ? (
        <section className="fc-section fc-empty-state">
          <h2>Start your Sanctum character</h2>
          <p>Create up to three private characters. Select one any time from the top bar.</p>
          {!canCreateCharacter && <p>All character slots are currently in use.</p>}
        </section>
      ) : (
        <>
          <section className="fc-character-sheet-hero">
            <div className="fc-identity-core">
              <div className="fc-archetype-portrait" aria-hidden="true">
                {characterRoles[activeCharacter.role]?.icon || "✦"}
              </div>
              <div>
                <p className="fc-eyebrow">Active Character</p>
                <p className="fc-identity-name">{activeCharacter.name}</p>
                <p className="fc-identity-title">
                  Rank {activeCharacter.rank} {characterRoles[activeCharacter.role]?.name || "Character"} •{" "}
                  {homelandOptions[activeCharacter.homeland]?.name || "Unknown Homeland"}
                </p>
              </div>
            </div>

            <div className="fc-identity-details">
              <div className="fc-detail-row">
                <span className="fc-label">Rank</span>
                <input
                  type="number"
                  min={MIN_RANK}
                  max={MAX_RANK}
                  value={activeCharacter.rank}
                  className="fc-stat-input"
                  onChange={(event) =>
                    updateCharacterWithRecalc({
                      rank: clampNumber(Number(event.target.value) || MIN_RANK, MIN_RANK, MAX_RANK)
                    })
                  }
                />
              </div>
              <div className="fc-detail-row">
                <span className="fc-label">Renown</span>
                <input
                  type="number"
                  min={0}
                  value={activeCharacter.renown}
                  className="fc-stat-input"
                  onChange={(event) =>
                    updateCharacterWithRecalc({
                      renown: Math.max(Number(event.target.value) || 0, 0)
                    })
                  }
                />
              </div>
              <div className="fc-detail-row">
                <span className="fc-label">Condition</span>
                <span className="fc-value">{activeCharacter.condition}</span>
              </div>
              <div className="fc-detail-row">
                <span className="fc-label">Defense</span>
                <span className="fc-value">{activeCharacter.defense}</span>
              </div>
            </div>
          </section>

          <section className="fc-section">
            <h2>Core Attributes</h2>
            <div className="fc-attribute-editor-grid">
              {(Object.keys(attributeLabels) as Array<keyof SanctumAttributes>).map((attribute) => {
                const score = activeCharacter.attributes[attribute];
                const mod = calculateModifier(score);
                return (
                  <div key={attribute} className="fc-ability-card fc-ability-edit-card">
                    <div className="fc-ability-short">{attributeShort[attribute]}</div>
                    <input
                      type="number"
                      min={MIN_ATTRIBUTE_SCORE}
                      max={MAX_ATTRIBUTE_SCORE}
                      value={score}
                      className="fc-attribute-input"
                      onChange={(event) => handleAttributeChange(attribute, event.target.value)}
                    />
                    <div className="fc-ability-mod">{getModifierSign(mod)}</div>
                    <div className="fc-ability-label">{attributeLabels[attribute]}</div>
                  </div>
                );
              })}
            </div>
          </section>

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

          <section className="fc-section fc-collapsible">
            <details open>
              <summary>Character Details</summary>
              <div className="fc-collapsible-content">
                <div className="fc-form-group">
                  <label>Character Name</label>
                  <input
                    type="text"
                    value={activeCharacter.name}
                    onChange={(e) => updateCharacterWithRecalc({ name: e.target.value })}
                    className="fc-input"
                  />
                </div>

                <div className="fc-form-row">
                  <div className="fc-form-group">
                    <label>Role</label>
                    <select
                      value={activeCharacter.role}
                      onChange={(e) => updateCharacterWithRecalc({ role: e.target.value as SanctumRole })}
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
                      onChange={(e) => updateCharacterWithRecalc({ homeland: e.target.value as Homeland })}
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
                      onChange={(e) => updateCharacterWithRecalc({ socialStanding: e.target.value as SocialStanding })}
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
                      onChange={(e) => updateCharacterWithRecalc({ specialty: e.target.value })}
                      className="fc-input"
                    />
                  </div>
                </div>

                <div className="fc-form-group">
                  <label>Occupation</label>
                  <input
                    type="text"
                    value={activeCharacter.occupation}
                    onChange={(e) => updateCharacterWithRecalc({ occupation: e.target.value })}
                    className="fc-input"
                  />
                </div>

                <div className="fc-form-group">
                  <label>Personal Legend</label>
                  <textarea
                    value={activeCharacter.personalLegend || ""}
                    onChange={(e) => updateCharacterWithRecalc({ personalLegend: e.target.value })}
                    className="fc-textarea"
                    rows={2}
                  />
                </div>

                <div className="fc-form-group">
                  <label>Backstory</label>
                  <textarea
                    value={activeCharacter.backstory || ""}
                    onChange={(e) => updateCharacterWithRecalc({ backstory: e.target.value })}
                    className="fc-textarea"
                    rows={3}
                  />
                </div>
              </div>
            </details>
          </section>

          <section className="fc-section fc-collapsible">
            <details>
              <summary>Your Characters ({characters.length}/{MAX_CHARACTER_SLOTS})</summary>
              <div className="fc-collapsible-content">
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
                        <p>
                          Rank {char.rank} • Condition {char.condition} • Defense {char.defense}
                        </p>
                        <p>Played by: {ACCOUNT_PLAYER_NAME}</p>
                      </div>
                      {characters.length > 1 && activeCharacterId === char.id && (
                        <button
                          className="fc-delete-btn"
                          onClick={(event) => {
                            event.stopPropagation();
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
              </div>
            </details>
          </section>

          <section className="fc-section fc-collapsible">
            <details>
              <summary>
                Role & Setting Notes ({characterRoles[activeCharacter.role]?.name}, {homelandOptions[activeCharacter.homeland]?.name})
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
                  <p>
                    <strong>Access:</strong> {socialStandings[activeCharacter.socialStanding]?.access}
                  </p>
                  <p>
                    <strong>Obligation:</strong> {socialStandings[activeCharacter.socialStanding]?.obligation}
                  </p>
                </div>
              </div>
            </details>
          </section>
        </>
      )}
        </>
      )}
    </div>
  );
}
