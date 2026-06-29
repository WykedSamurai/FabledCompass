"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";
import { extractResumeText } from "../../utils/resume/extractText";
import styles from "./profile-workspace.module.css";

type ProfileVisibility = "private" | "employers" | "public";

type ArchetypeId =
  | "traveler" | "explorer" | "creator" | "leader" | "mentor"
  | "guardian" | "scholar" | "builder" | "innovator" | "steward"
  | "diplomat" | "strategist";

const ARCHETYPES: { id: ArchetypeId; name: string; icon: string }[] = [
  { id: "traveler",   name: "Traveler",   icon: "🌍" },
  { id: "explorer",   name: "Explorer",   icon: "🧭" },
  { id: "creator",    name: "Creator",    icon: "✨" },
  { id: "leader",     name: "Leader",     icon: "🏛" },
  { id: "mentor",     name: "Mentor",     icon: "🤝" },
  { id: "guardian",   name: "Guardian",   icon: "🛡" },
  { id: "scholar",    name: "Scholar",    icon: "🔬" },
  { id: "builder",    name: "Builder",    icon: "⚒" },
  { id: "innovator",  name: "Innovator",  icon: "💡" },
  { id: "steward",    name: "Steward",    icon: "🌱" },
  { id: "diplomat",   name: "Diplomat",   icon: "⚖" },
  { id: "strategist", name: "Strategist", icon: "🎯" }
];

type ProfileForm = {
  display_name: string;
  title: string;
  archetype: ArchetypeId;
  motto: string;
  personal_legend: string;
  career_path: string;
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
  profile_visibility: ProfileVisibility;
  show_public_email: boolean;
  show_phone: boolean;
  show_location: boolean;
  show_resume: boolean;
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
  title: "Compass Bearer",
  archetype: "traveler",
  motto: "",
  personal_legend: "",
  career_path: "Wayfinder",
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
  resume_file_path: "",
  profile_visibility: "private",
  show_public_email: false,
  show_phone: false,
  show_location: true,
  show_resume: false
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
  const [message, setMessage] = useState("Loading Professional Folio...");
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
        supabase.from("profiles").select("display_name, title, archetype, motto, personal_legend, career_path, headline, location, about, email_public, phone, website, linkedin_url, portfolio_url, skills, experience, education, resume_text, resume_file_path, profile_visibility, show_public_email, show_phone, show_location, show_resume").eq("id", user.id).maybeSingle(),
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

  function update<K extends keyof ProfileForm>(field: K, value: ProfileForm[K]) {
    setProfile((current) => ({ ...current, [field]: value }));
  }

  async function save(event?: FormEvent) {
    event?.preventDefault();
    if (!userId) return;
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from("profiles").upsert({ id: userId, ...profile, updated_at: new Date().toISOString() });
    setMessage(error ? error.message : "Professional Folio and privacy settings saved.");
    setSaving(false);
  }

  async function uploadResume(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !userId) return;

    setUploading(true);
    setMessage("Uploading and reading resume...");
    const supabase = createClient();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const path = `${userId}/${Date.now()}-${safeName}`;
    const { error: uploadError } = await supabase.storage.from("resumes").upload(path, file, { upsert: true });

    if (uploadError) {
      setMessage(uploadError.message);
      setUploading(false);
      return;
    }

    try {
      const text = await extractResumeText(file);
      const nextProfile = parseResumeText(text, { ...profile, resume_file_path: path });
      setProfile(nextProfile);
      setMessage("Resume uploaded and parsed. Review the imported Folio information, then save.");
    } catch (error) {
      const detail = error instanceof Error ? error.message : "The resume could not be parsed.";
      setProfile((current) => ({ ...current, resume_file_path: path }));
      setMessage(`Resume uploaded, but autofill was not completed: ${detail}`);
    } finally {
      setUploading(false);
    }
  }

  const initials = profile.display_name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "FC";
  const completedFields = useMemo(() => [
    profile.display_name,
    profile.headline,
    profile.location,
    profile.about,
    profile.skills,
    profile.experience,
    profile.education,
    profile.resume_file_path
  ].filter(Boolean).length, [profile]);
  const portfolioStrength = Math.round((completedFields / 8) * 100);

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <p className={styles.kicker}>Professional Folio</p>
        <h1>{profile.display_name || "Your Professional Folio"}</h1>
        <p>{profile.headline || "Build a living record of your professional identity, evidence, and growth."}</p>
      </section>

      <main className={styles.shell}>
        <section className={`${styles.card} ${styles.summary}`} aria-label="Professional Folio overview">
          <div className={styles.avatar}>{initials}</div>
          <div className={styles.summaryText}>
            <p className={styles.kicker}>Identity</p>
            <h2>{profile.display_name || "Navigator"}</h2>
            <p className={styles.muted}>{profile.headline || "Professional headline not added"}</p>
            <p>{profile.location || "Location not added"}</p>
          </div>
          <div className={styles.statGrid}>
            <div><span>Portfolio Strength</span><strong>{portfolioStrength}%</strong></div>
            <div><span>Evidence Stars</span><strong>{badges.length}</strong></div>
            <div><span>Journey Entries</span><strong>{attempts.length}</strong></div>
          </div>
        </section>

        <section className={styles.folioBand} aria-label="Folio status">
          <span>Identity</span><span>Competencies</span><span>Experience</span><span>Education</span><span>Story</span><span>Evidence</span>
        </section>

        <div className={styles.grid}>
          <form className={`${styles.card} ${styles.profileForm}`} onSubmit={save}>
            <details className={styles.collapseSection} open>
              <summary><span><small>00</small>Character Identity</span></summary>
              <div className={styles.sectionIntro}>Your Fabled Compass archetype and career identity.</div>
              <div className={styles.sectionGrid}>
                <label className={styles.field}>Archetype
                  <select className={styles.input} value={profile.archetype} onChange={(event) => update("archetype", event.target.value as ArchetypeId)}>
                    {ARCHETYPES.map((a) => (
                      <option key={a.id} value={a.id}>{a.icon} {a.name}</option>
                    ))}
                  </select>
                </label>
                <label className={styles.field}>Title
                  <input className={styles.input} value={profile.title} placeholder="e.g. Compass Bearer, Shift Leader" onChange={(event) => update("title", event.target.value)} />
                </label>
                <label className={styles.field}>Career Path
                  <input className={styles.input} value={profile.career_path} placeholder="e.g. Wayfinder, Operations" onChange={(event) => update("career_path", event.target.value)} />
                </label>
                <label className={styles.field}>Motto
                  <input className={styles.input} value={profile.motto} placeholder="A personal guiding phrase" onChange={(event) => update("motto", event.target.value)} />
                </label>
                <label className={`${styles.field} ${styles.fieldFull}`}>Personal Legend
                  <textarea className={styles.textarea} placeholder="What career story are you building? What drives your professional journey?" value={profile.personal_legend} onChange={(event) => update("personal_legend", event.target.value)} />
                </label>
              </div>
            </details>

            <details className={styles.collapseSection} open>
              <summary><span><small>01</small>Identity</span></summary>
              <div className={styles.sectionIntro}>Who is this professional?</div>
              <div className={styles.sectionGrid}>
                <label className={styles.field}>Display name<input className={styles.input} value={profile.display_name} onChange={(event) => update("display_name", event.target.value)} /></label>
                <label className={styles.field}>Professional headline<input className={styles.input} value={profile.headline} onChange={(event) => update("headline", event.target.value)} /></label>
                <label className={styles.field}>Public email<input className={styles.input} type="email" value={profile.email_public} onChange={(event) => update("email_public", event.target.value)} /></label>
                <label className={styles.field}>Phone<input className={styles.input} value={profile.phone} onChange={(event) => update("phone", event.target.value)} /></label>
                <label className={styles.field}>Location<input className={styles.input} value={profile.location} onChange={(event) => update("location", event.target.value)} /></label>
                <label className={styles.field}>Website<input className={styles.input} value={profile.website} onChange={(event) => update("website", event.target.value)} /></label>
                <label className={styles.field}>LinkedIn<input className={styles.input} value={profile.linkedin_url} onChange={(event) => update("linkedin_url", event.target.value)} /></label>
                <label className={styles.field}>Portfolio link<input className={styles.input} value={profile.portfolio_url} onChange={(event) => update("portfolio_url", event.target.value)} /></label>
              </div>
            </details>

            <details className={styles.collapseSection} open>
              <summary><span><small>02</small>Professional Story</span></summary>
              <div className={styles.sectionIntro}>What motivates this person, and where are they going?</div>
              <div className={styles.sectionBody}><textarea className={styles.textarea} aria-label="Professional story" placeholder="Describe your professional direction, values, and goals." value={profile.about} onChange={(event) => update("about", event.target.value)} /></div>
            </details>

            <details className={styles.collapseSection}>
              <summary><span><small>03</small>Competencies</span></summary>
              <div className={styles.sectionIntro}>What can this person demonstrate?</div>
              <div className={styles.sectionBody}><textarea className={styles.textarea} aria-label="Competencies" placeholder="List competencies supported by work, projects, education, or challenges." value={profile.skills} onChange={(event) => update("skills", event.target.value)} /></div>
            </details>

            <details className={styles.collapseSection}>
              <summary><span><small>04</small>Experience</span></summary>
              <div className={styles.sectionIntro}>Where has this person applied their abilities?</div>
              <div className={styles.sectionBody}><textarea className={styles.textarea} aria-label="Experience" value={profile.experience} onChange={(event) => update("experience", event.target.value)} /></div>
            </details>

            <details className={styles.collapseSection}>
              <summary><span><small>05</small>Education and Certifications</span></summary>
              <div className={styles.sectionIntro}>What formal learning supports this Folio?</div>
              <div className={styles.sectionBody}><textarea className={styles.textarea} aria-label="Education and certifications" value={profile.education} onChange={(event) => update("education", event.target.value)} /></div>
            </details>

            <details className={styles.collapseSection}>
              <summary><span><small>06</small>Professional Attributes</span></summary>
              <div className={styles.emptyState}>Evidence-backed attributes such as Leadership, Communication, Adaptability, and Professionalism will appear here.</div>
            </details>

            <details className={styles.collapseSection}>
              <summary><span><small>07</small>Projects and Evidence</span></summary>
              <div className={styles.emptyState}>Projects, challenge results, recommendations, and verified evidence will connect here.</div>
            </details>

            <details className={styles.collapseSection}>
              <summary><span><small>08</small>Professional Sky</span></summary>
              <div className={styles.skyPlaceholder}><span>✦</span><p>Your completed evidence will form constellations here.</p></div>
            </details>

            <div className={styles.actions}>
              <button className="button button-dark" disabled={saving || !userId} type="submit">{saving ? "Saving..." : "Save Professional Folio"}</button>
            </div>
          </form>

          <aside className={styles.stack}>
            <details className={`${styles.card} ${styles.sideCollapse}`} open>
              <summary><span><small>Evidence</small>Evidence Stars</span></summary>
              <div className={styles.sideContent}>
                <div className={styles.badgeStrip}>
                  {badges.length === 0 && <span className={styles.small}>Complete a challenge to place the first star in your sky.</span>}
                  {badges.map((badge) => (
                    <button className={styles.badgeButton} key={badge.id} type="button" aria-label={badge.badge_name}>
                      ✦
                      <span className={styles.tooltip}><strong>{badge.badge_name}</strong><br />Earned through {badge.source_scenario}. Version {badge.badge_version}, awarded {new Date(badge.earned_at).toLocaleDateString()}.</span>
                    </button>
                  ))}
                </div>
              </div>
            </details>

            <details className={`${styles.card} ${styles.sideCollapse}`} open>
              <summary><span><small>Privacy</small>Folio visibility</span></summary>
              <div className={styles.sideContent}>
                <label className={styles.field}>Who can view this Folio?
                  <select className={styles.input} value={profile.profile_visibility} onChange={(event) => update("profile_visibility", event.target.value as ProfileVisibility)}>
                    <option value="private">Only me</option>
                    <option value="employers">Approved employers</option>
                    <option value="public">Public Folio</option>
                  </select>
                </label>
                <div className={styles.privacyList}>
                  <label className={styles.toggleRow}><input type="checkbox" checked={profile.show_location} onChange={(event) => update("show_location", event.target.checked)} /><span>Show location</span></label>
                  <label className={styles.toggleRow}><input type="checkbox" checked={profile.show_public_email} onChange={(event) => update("show_public_email", event.target.checked)} /><span>Show public email</span></label>
                  <label className={styles.toggleRow}><input type="checkbox" checked={profile.show_phone} onChange={(event) => update("show_phone", event.target.checked)} /><span>Show phone number</span></label>
                  <label className={styles.toggleRow}><input type="checkbox" checked={profile.show_resume} onChange={(event) => update("show_resume", event.target.checked)} /><span>Allow resume access</span></label>
                </div>
                <p className={styles.small}>The private editor always shows all fields. These settings control employer and public views.</p>
                <button className="button button-dark" disabled={saving || !userId} type="button" onClick={() => save()}>{saving ? "Saving..." : "Save Privacy"}</button>
              </div>
            </details>

            <details className={`${styles.card} ${styles.sideCollapse}`} open>
              <summary><span><small>Documents</small>Resume import</span></summary>
              <div className={styles.sideContent}>
                <div className={styles.uploadBox}>
                  <input type="file" accept=".txt,.md,.pdf,.docx" disabled={uploading} onChange={uploadResume} />
                  <p className={styles.small}>Upload a resume to prefill available Folio fields. Review imported information before saving.</p>
                </div>
                {profile.resume_file_path && <p className={styles.small}>A resume is stored in this Folio.</p>}
              </div>
            </details>

            <details className={`${styles.card} ${styles.sideCollapse}`}>
              <summary><span><small>Journey</small>Recent challenge record</span></summary>
              <div className={styles.sideContent}>
                <div className={styles.history}>
                  {attempts.length === 0 && <p className={styles.small}>Your completed challenges will appear here.</p>}
                  {attempts.map((attempt) => (
                    <div className={styles.historyItem} key={attempt.id}>
                      <span>{new Date(attempt.completed_at).toLocaleDateString()}</span>
                      <strong>{attempt.overall_score}% · {attempt.passed ? "Completed" : "Reviewed"}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </details>
          </aside>
        </div>

        {message && <p className={styles.message} role="status">{message}</p>}
      </main>
    </div>
  );
}
