"use client";

import { useState, useTransition } from "react";
import { createClient } from "../../utils/supabase/client";
import { archetypes, type ArchetypeId } from "../../lib/archetypes";

type Props = {
  userId: string;
  archetypeId: ArchetypeId;
  displayName: string;
  title: string;
  motto: string;
  personalLegend: string;
  careerPath: string;
  level: number;
  overallScore: number;
};

export default function IdentityPanel({
  userId,
  archetypeId: initialArchetypeId,
  displayName,
  title: initialTitle,
  motto: initialMotto,
  personalLegend: initialLegend,
  careerPath,
  level,
  overallScore
}: Props) {
  const [archetypeId, setArchetypeId] = useState<ArchetypeId>(initialArchetypeId);
  const [title, setTitle] = useState(initialTitle);
  const [motto, setMotto] = useState(initialMotto);
  const [legend, setLegend] = useState(initialLegend);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const archetype = archetypes[archetypeId];
  const archetypeIds = Object.keys(archetypes) as ArchetypeId[];

  function handleSave() {
    startTransition(async () => {
      const supabase = createClient();
      await supabase.from("profiles").upsert({
        id: userId,
        archetype: archetypeId,
        title,
        motto,
        personal_legend: legend,
        updated_at: new Date().toISOString()
      });
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 3000);
    });
  }

  return (
    <>
      <div className="fc-identity-core">
        <div className="fc-archetype-portrait" aria-hidden="true">{archetype.icon}</div>
        <div>
          <p className="fc-eyebrow">Professional Character</p>
          <h1>Career Compass</h1>
          <p className="fc-identity-name">{displayName}</p>
          <p className="fc-identity-title">{title}</p>
        </div>
      </div>

      <div className="fc-identity-details">
        {editing ? (
          <div className="fc-identity-edit-form">
            <label className="fc-archetype-picker">
              <span>Archetype</span>
              <select
                aria-label="Archetype"
                value={archetypeId}
                onChange={(e) => setArchetypeId(e.target.value as ArchetypeId)}
              >
                {archetypeIds.map((id) => (
                  <option key={id} value={id}>
                    {archetypes[id].icon} {archetypes[id].name}
                  </option>
                ))}
              </select>
            </label>
            <label className="fc-identity-field">
              <span>Title</span>
              <input
                className="fc-identity-input"
                value={title}
                placeholder="e.g. Compass Bearer"
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
            <label className="fc-identity-field">
              <span>Motto</span>
              <input
                className="fc-identity-input"
                value={motto}
                placeholder="A personal guiding phrase"
                onChange={(e) => setMotto(e.target.value)}
              />
            </label>
            <label className="fc-identity-field fc-identity-field-full">
              <span>Personal Legend</span>
              <textarea
                className="fc-identity-input"
                rows={2}
                value={legend}
                placeholder="What career story are you building?"
                onChange={(e) => setLegend(e.target.value)}
              />
            </label>
            <div className="fc-identity-edit-actions">
              <button
                className="fc-btn-save"
                onClick={handleSave}
                disabled={isPending}
                type="button"
              >
                {isPending ? "Saving…" : "Save"}
              </button>
              <button
                className="fc-btn-cancel"
                onClick={() => setEditing(false)}
                type="button"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <label className="fc-archetype-picker">
              <span>Archetype</span>
              <select aria-label="Archetype" value={archetypeId} disabled>
                {archetypeIds.map((id) => (
                  <option key={id} value={id}>
                    {archetypes[id].icon} {archetypes[id].name}
                  </option>
                ))}
              </select>
            </label>
            <p className="fc-archetype-motto">Motto: {motto || archetype.motto}</p>
            <p className="fc-muted fc-personal-legend">
              Personal Legend: {legend || "Build a career story through evidence, reflection, and growth."}
            </p>
            <button
              className="fc-btn-edit-identity"
              onClick={() => setEditing(true)}
              type="button"
            >
              ✎ Edit Identity
            </button>
            {saved && <span className="fc-save-confirm">✓ Saved</span>}
          </>
        )}
      </div>

      <div className="fc-character-summary">
        <span><small>Level</small><strong>{level}</strong></span>
        <span><small>Career Path</small><strong>{careerPath}</strong></span>
        <span><small>Portfolio Strength</small><strong>{overallScore}%</strong></span>
      </div>
    </>
  );
}
