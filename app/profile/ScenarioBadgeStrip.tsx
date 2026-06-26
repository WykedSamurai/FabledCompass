"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { createClient } from "../../utils/supabase/client";
import styles from "./profile-workspace.module.css";

type BadgeDefinition = {
  badge_name: string;
  badge_description: string;
  badge_icon: string;
  skills_demonstrated: string[];
  version: number;
};

type EarnedBadge = {
  id: number;
  overall_score: number | null;
  earned_at: string;
  source_scenario: string;
  scenario_badges: BadgeDefinition | BadgeDefinition[] | null;
};

export default function ScenarioBadgeStrip() {
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [badges, setBadges] = useState<EarnedBadge[]>([]);

  useEffect(() => {
    const oldStrip = document.querySelector(`.${styles.badgeStrip}`) as HTMLElement | null;
    if (oldStrip) {
      oldStrip.style.display = "none";
      setTarget(oldStrip.parentElement);
    }

    async function load() {
      const supabase = createClient();
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) return;

      const { data } = await supabase
        .from("user_badges")
        .select("id, overall_score, earned_at, source_scenario, scenario_badges(badge_name, badge_description, badge_icon, skills_demonstrated, version)")
        .eq("user_id", authData.user.id)
        .order("earned_at", { ascending: false });

      setBadges((data ?? []) as unknown as EarnedBadge[]);
    }

    load();
  }, []);

  if (!target) return null;

  return createPortal(
    <div className={styles.scenarioBadgeStrip}>
      {badges.length === 0 && <span className={styles.small}>None yet</span>}
      {badges.map((badge) => {
        const definition = Array.isArray(badge.scenario_badges)
          ? badge.scenario_badges[0]
          : badge.scenario_badges;

        if (!definition) return null;

        return (
          <button
            className={styles.scenarioBadgeButton}
            key={badge.id}
            type="button"
            aria-label={`${definition.badge_name} badge details`}
          >
            <span aria-hidden="true">↺</span>
            <span className={styles.scenarioBadgeTooltip}>
              <strong>{definition.badge_name}</strong>
              <span>{badge.source_scenario}</span>
              <span>{definition.badge_description}</span>
              <span><b>Skills:</b> {definition.skills_demonstrated.join(", ")}</span>
              {badge.overall_score !== null && <span><b>Score:</b> {badge.overall_score}%</span>}
              <span><b>Earned:</b> {new Date(badge.earned_at).toLocaleDateString()} · Version {definition.version}</span>
            </span>
          </button>
        );
      })}
    </div>,
    target
  );
}
