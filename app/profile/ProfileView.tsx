"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";

type Profile = { display_name: string | null; headline: string | null; location: string | null; about: string | null };
type Badge = { id: number; badge_name: string; source_scenario: string; badge_version: number; earned_at: string };

export default function ProfileView() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [message, setMessage] = useState("Loading profile...");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: authData } = await supabase.auth.getUser();
      const user = authData.user;

      if (!user) {
        router.replace("/login");
        return;
      }

      const profileResult = await supabase
        .from("profiles")
        .select("display_name, headline, location, about")
        .eq("id", user.id)
        .maybeSingle();

      const badgeResult = await supabase
        .from("user_badges")
        .select("id, badge_name, source_scenario, badge_version, earned_at")
        .eq("user_id", user.id)
        .order("earned_at", { ascending: false });

      if (profileResult.error || badgeResult.error) {
        setMessage(profileResult.error?.message || badgeResult.error?.message || "Unable to load profile.");
        return;
      }

      setProfile({
        display_name: profileResult.data?.display_name || String(user.user_metadata.display_name || "Navigator"),
        headline: profileResult.data?.headline || null,
        location: profileResult.data?.location || null,
        about: profileResult.data?.about || null
      });
      setBadges((badgeResult.data || []) as Badge[]);
      setMessage("");
    }

    load();
  }, [router]);

  const initials = profile?.display_name
    ? profile.display_name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()
    : "FC";

  return (
    <>
      <section className="page-hero" style={{ padding: "2rem 6vw" }}>
        <p className="eyebrow">Navigator Profile</p>
        <h1 style={{ fontSize: "3rem", marginBottom: ".5rem" }}>{profile?.display_name || "Your profile"}</h1>
        <p>{profile?.headline || "Build a profile around demonstrated workplace skills."}</p>
      </section>

      <section className="section section-narrow">
        {message && <p role="status">{message}</p>}
        {profile && (
          <div className="profile-grid">
            <aside className="card">
              <div className="avatar">{initials}</div>
              <h2>{profile.display_name}</h2>
              <p className="muted">{profile.headline || "Professional headline not added"}</p>
              <p>{profile.location || "Location not added"}</p>
              <p>{profile.about || "Add an About section to tell employers more about your experience and goals."}</p>
              <a className="button button-dark" href="/account/profile">Edit Profile</a>
            </aside>

            <article className="card">
              <p className="eyebrow">Demonstrated Skills</p>
              <h2>Badge Collection</h2>
              {badges.length === 0 ? (
                <div>
                  <p className="muted">No badges earned yet.</p>
                  <a className="button button-dark" href="/adventures">Explore Adventures</a>
                </div>
              ) : (
                <div className="jobs-grid">
                  {badges.map((badge) => (
                    <div className="adventure-card" key={badge.id}>
                      <div>
                        <h3>{badge.badge_name}</h3>
                        <p>Earned by completing {badge.source_scenario}.</p>
                        <div className="tag-row">
                          <span className="tag">Communication</span>
                          <span className="tag">Empathy</span>
                          <span className="tag">Professionalism</span>
                        </div>
                        <p className="muted">Version {badge.badge_version} · Earned {new Date(badge.earned_at).toLocaleDateString()}</p>
                      </div>
                      <div className="badge-preview">
                        <div className="badge-seal">F</div>
                        <strong>Foundations</strong>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </article>
          </div>
        )}
      </section>
    </>
  );
}
