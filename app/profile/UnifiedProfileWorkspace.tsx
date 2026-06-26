"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";
import styles from "./profile-workspace.module.css";

type ProfileForm = {
  display_name: string;
  headline: string;
  location: string;
  about: string;
  email_public: string;
  phone: string;
  website: string;
  linkedin_url: string;
  portfolio_url: string;
  skills: string;
  experience: string;
  education: string;
  resume_text: string;
  resume_file_path: string;
};

type Badge = {
  id: number;
  badge_name: string;
  source_scenario: string;
  badge_version: number;
  earned_at: string;
};

type Attempt = {
  id: number;
  overall_score: number;
  passed: boolean;
  completed_at: string;
};

const emptyProfile: ProfileForm = {
  display_name: "",
  headline: "",
  location: "",
  about: "",
  email_public: "",
  phone: "",
  website: "",
  linkedin_url: "",
  portfolio_url: "",
  skills: "",
  experience: "",
  education: "",
  resume_text: "",
  resume_file_path: ""
};

function parseResumeText(text: string, current: ProfileForm): ProfileForm {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const email = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] ?? "";
  const phone = text.match(/(?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/)?.[0] ?? "";
  const linkedin = text.match(/https?:\/\/(?:www\.)?linkedin\.com\/[^\s]+/i)?.[0] ?? "";
  const website = text.match(/https?:\/\/(?![^\s]*linkedin\.com)[^\s]+/i)?.[0] ?? "";
  const name = lines[0] && lines[0].length < 80 ? lines[0] : current.display_name;

  const section = (heading: string, nextHeadings: string[]) => {
    const pattern = new RegExp(`${heading}\\s*[:\\n]([\\s\\S]*?)(?=${nextHeadings.join("|")}|$)`, "i");
    return text.match(pattern)?.[1]?.trim() ?? "";
  };

  const skills = section("skills", ["experience", "employment", "education", "projects", "certifications"]);
  const experience = section("(?:experience|employment)", ["education", "skills", "projects", "certifications"]);
  const education = section("education", ["skills", "experience", "employment", "projects", "certifications"]);

  return {
    ...current,
    display_name: current.display_name || name,
    email_public: current.email_public || email,
    phone: current.phone || phone,
    linkedin_url: current.linkedin_url || linkedin,
    website: current.website || website,
    skills: current.skills || skills,
    experience: current.experience || experience,
    education: current.education || education,
    resume_text: text
  };
}

export default function UnifiedProfileWorkspace() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [profile, setProfile] = useState<ProfileForm>(emptyProfile);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [message, setMessage] = useState("Loading profile...");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: authData } = await supabase.auth.getUser();
      const user = authData.user;

      if (!user) {
        router.replace("/login");
        return;
      }

      setUserId(user.id);
      const [profileResult, badgeResult, attemptResult] = await Promise.all([
        supabase.from("profiles").select("display_name, headline, location, about, email_public, phone, website, linkedin_url, portfolio_url, skills, experience, education, resume_text, resume_file_path").eq("id", user.id).maybeSingle(),
        supabase.from("user_badges").select("id, badge_name, source_scenario, badge_version, earned_at").eq("user_id", user.id).order("earned_at", { ascending: false }),
        supabase.from("scenario_attempts").select("id, overall_score, passed, completed_at").eq("user_id", user.id).order("completed_at", { ascending: false }).limit(5)
      ]);

      if (profileResult.error) {
        setMessage(profileResult.error.message);
        return;
      }

      const data = profileResult.data;
      setProfile({
        ...emptyProfile,
        ...data,
        display_name: data?.display_name || String(user.user_metadata.display_name || "Navigator"),
        email_public: data?.email_public || user.email || ""
      } as ProfileForm);
      setBadges((badgeResult.data || []) as Badge[]);
      setAttempts((attemptResult.data || []) as Attempt[]);
      setMessage("");
    }

    load();
  }, [router]);

  function update(field: keyof ProfileForm, value: string) {
    setProfile((current) => ({ ...current, [field]: value }));
  }

  async function save(event?: FormEvent) {
    event?.preventDefault();
    if (!userId) return;
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from("profiles").upsert({ id: userId, ...profile, updated_at: new Date().toISOString() });
    setMessage(error ? error.message : "Profile saved.");
    setSaving(false);
  }

  async function uploadResume(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !userId) return;

    setUploading(true);
    setMessage("");
    const supabase = createClient();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const path = `${userId}/${Date.now()}-${safeName}`;
    const { error: uploadError } = await supabase.storage.from("resumes").upload(path, file, { upsert: true });

    if (uploadError) {
      setMessage(uploadError.message);
      setUploading(false);
      return;
    }

    let nextProfile = { ...profile, resume_file_path: path };
    if (file.type.startsWith("text/") || file.name.endsWith(".txt") || file.name.endsWith(".md")) {
      const text = await file.text();
      nextProfile = parseResumeText(text, nextProfile);
      setMessage("Resume uploaded and available information was added to the profile. Review before saving.");
    } else {
      setMessage("Resume uploaded. PDF and DOCX autofill will be connected in the document-parsing step.");
    }

    setProfile(nextProfile);
    setUploading(false);
  }

  const initials = profile.display_name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "FC";

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <p className="eyebrow">Navigator Profile</p>
        <h1>{profile.display_name || "Your profile"}</h1>
        <p>{profile.headline || "Build one complete professional profile with demonstrated workplace skills."}</p>
      </section>

      <main className={styles.shell}>
        <section className={`${styles.card} ${styles.summary}`}>
          <div className="avatar">{initials}</div>
          <div className={styles.summaryText}>
            <h2>{profile.display_name || "Navigator"}</h2>
            <p className="muted">{profile.headline || "Professional headline not added"}</p>
            <p>{profile.location || "Location not added"}</p>
          </div>
          <div>
            <p className="eyebrow">Badges</p>
            <div className={styles.badgeStrip}>
              {badges.length === 0 && <span className={styles.small}>None yet</span>}
              {badges.map((badge) => (
                <button className={styles.badgeButton} key={badge.id} type="button" aria-label={badge.badge_name}>
                  F
                  <span className={styles.tooltip}>
                    <strong>{badge.badge_name}</strong><br />
                    Earned through {badge.source_scenario}. Version {badge.badge_version}, awarded {new Date(badge.earned_at).toLocaleDateString()}.
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className={styles.grid}>
          <form className={`${styles.card} ${styles.form}`} onSubmit={save}>
            <label className={styles.field}>Display name<input className={styles.input} value={profile.display_name} onChange={(event) => update("display_name", event.target.value)} /></label>
            <label className={styles.field}>Professional headline<input className={styles.input} value={profile.headline} onChange={(event) => update("headline", event.target.value)} /></label>
            <label className={styles.field}>Public email<input className={styles.input} type="email" value={profile.email_public} onChange={(event) => update("email_public", event.target.value)} /></label>
            <label className={styles.field}>Phone<input className={styles.input} value={profile.phone} onChange={(event) => update("phone", event.target.value)} /></label>
            <label className={styles.field}>Location<input className={styles.input} value={profile.location} onChange={(event) => update("location", event.target.value)} /></label>
            <label className={styles.field}>Website<input className={styles.input} value={profile.website} onChange={(event) => update("website", event.target.value)} /></label>
            <label className={styles.field}>LinkedIn<input className={styles.input} value={profile.linkedin_url} onChange={(event) => update("linkedin_url", event.target.value)} /></label>
            <label className={styles.field}>Portfolio link<input className={styles.input} value={profile.portfolio_url} onChange={(event) => update("portfolio_url", event.target.value)} /></label>
            <label className={`${styles.field} ${styles.full}`}>Professional summary<textarea className={styles.textarea} value={profile.about} onChange={(event) => update("about", event.target.value)} /></label>
            <label className={`${styles.field} ${styles.full}`}>Skills<textarea className={styles.textarea} value={profile.skills} onChange={(event) => update("skills", event.target.value)} /></label>
            <label className={`${styles.field} ${styles.full}`}>Experience<textarea className={styles.textarea} value={profile.experience} onChange={(event) => update("experience", event.target.value)} /></label>
            <label className={`${styles.field} ${styles.full}`}>Education and certifications<textarea className={styles.textarea} value={profile.education} onChange={(event) => update("education", event.target.value)} /></label>
            <div className={styles.actions}>
              <button className="button button-dark" disabled={saving || !userId} type="submit">{saving ? "Saving..." : "Save Profile"}</button>
            </div>
          </form>

          <aside className={styles.stack}>
            <section className={styles.card}>
              <p className="eyebrow">Resume Import</p>
              <h2>Upload and autofill</h2>
              <div className={styles.uploadBox}>
                <input type="file" accept=".txt,.md,.pdf,.doc,.docx" disabled={uploading} onChange={uploadResume} />
                <p className={styles.small}>Text and Markdown files autofill immediately. PDF and DOCX files are stored securely and will use the document parser in the next step.</p>
              </div>
              {profile.resume_file_path && <p className={styles.small}>A resume is stored with this profile.</p>}
            </section>

            <section className={styles.card}>
              <p className="eyebrow">Recent Activity</p>
              <h2>Scenario attempts</h2>
              <div className={styles.history}>
                {attempts.length === 0 && <p className={styles.small}>No saved attempts yet.</p>}
                {attempts.map((attempt) => (
                  <div className={styles.historyItem} key={attempt.id}>
                    <span>{new Date(attempt.completed_at).toLocaleDateString()}</span>
                    <strong>{attempt.overall_score}% · {attempt.passed ? "Passed" : "Reviewed"}</strong>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>

        {message && <p className={styles.message} role="status">{message}</p>}
      </main>
    </div>
  );
}
