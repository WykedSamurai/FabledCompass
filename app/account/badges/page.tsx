"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../utils/supabase/client";

type Badge = {
  id: number;
  badge_name: string;
  source_scenario: string;
  badge_version: number;
  earned_at: string;
};

type Attempt = {
  id: number;
  scenario_slug: string;
  overall_score: number;
  passed: boolean;
  completed_at: string;
};

export default function AccountBadgesPage() {
  const router = useRouter();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [message, setMessage] = useState("Loading achievements...");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        router.replace("/login");
        return;
      }

      const [badgeResult, attemptResult] = await Promise.all([
        supabase.from("user_badges").select("id, badge_name, source_scenario, badge_version, earned_at").eq("user_id", authData.user.id).order("earned_at", { ascending: false }),
        supabase.from("scenario_attempts").select("id, scenario_slug, overall_score, passed, completed_at").eq("user_id", authData.user.id).order("completed_at", { ascending: false }).limit(10)
      ]);

      if (badgeResult.error || attemptResult.error) {
        setMessage(badgeResult.error?.message ?? attemptResult.error?.message ?? "Unable to load achievements.");
        return;
      }

      setBadges((badgeResult.data ?? []) as Badge[]);
      setAttempts((attemptResult.data ?? []) as Attempt[]);
      setMessage("");
    }

    load();
  }, [router]);

  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">Achievements</p>
        <h1>Your earned badges and recent attempts.</h1>
      </section>
      <section className="section section-narrow">
        {message && <p className="form-message" role="status">{message}</p>}

        <div className="jobs-grid">
          <article className="card">
            <p className="eyebrow">Badge Collection</p>
            <h2>Earned recognition</h2>
            {badges.length === 0 ? (
              <p className="muted">No badges earned yet.</p>
            ) : (
              badges.map((badge) => (
                <div className="adventure-card" key={badge.id}>
                  <div>
                    <h3>{badge.badge_name}</h3>
                    <p>Source: {badge.source_scenario}</p>
                    <p className="muted">Version {badge.badge_version} · Earned {new Date(badge.earned_at).toLocaleDateString()}</p>
                  </div>
                  <div className="badge-preview"><div className="badge-seal">✦</div><strong>Foundations</strong></div>
                </div>
              ))
            )}
          </article>

          <article className="card">
            <p className="eyebrow">Recent History</p>
            <h2>Scenario attempts</h2>
            {attempts.length === 0 ? (
              <p className="muted">No saved attempts yet.</p>
            ) : (
              attempts.map((attempt) => (
                <div className="job-card" key={attempt.id}>
                  <div>
                    <h3>The Difficult Customer</h3>
                    <p className="muted">{new Date(attempt.completed_at).toLocaleString()}</p>
                  </div>
                  <strong>{attempt.overall_score}% · {attempt.passed ? "Passed" : "Reviewed"}</strong>
                </div>
              ))
            )}
          </article>
        </div>
      </section>
    </>
  );
}
