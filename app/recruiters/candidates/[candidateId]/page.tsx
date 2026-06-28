import Link from "next/link";
import { createClient } from "../../../../utils/supabase/server";

type CandidateProfile = {
  id: string;
  display_name: string | null;
  headline: string | null;
  location: string | null;
  about: string | null;
  skills: string | null;
  experience: string | null;
  education: string | null;
  portfolio_url: string | null;
  resume_file_path: string | null;
  profile_visibility: string | null;
};

type CandidateBadge = {
  id: number;
  badge_name: string;
  source_scenario: string;
  earned_at: string;
};

type CandidateAttempt = {
  id: number;
  overall_score: number;
  passed: boolean;
  completed_at: string;
};

export const dynamic = "force-dynamic";

export default async function RecruiterCandidatePage({
  params,
  searchParams
}: {
  params: Promise<{ candidateId: string }>;
  searchParams?: Promise<{ tab?: string }>;
}) {
  const { candidateId } = await params;
  const query = (await searchParams) ?? {};
  const tab = query.tab === "resume" ? "resume" : "portfolio";

  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) {
    return (
      <div className="fc-page-stack fc-workspace-page">
        <section className="fc-workspace-hero">
          <p className="fc-eyebrow">Recruiter Workspace</p>
          <h1>Candidate Viewer</h1>
          <p>Please sign in to view candidate details.</p>
        </section>
      </div>
    );
  }

  const [profileResult, badgeResult, attemptResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, display_name, headline, location, about, skills, experience, education, portfolio_url, resume_file_path, profile_visibility")
      .eq("id", candidateId)
      .maybeSingle(),
    supabase
      .from("user_badges")
      .select("id, badge_name, source_scenario, earned_at")
      .eq("user_id", candidateId)
      .order("earned_at", { ascending: false })
      .limit(10),
    supabase
      .from("scenario_attempts")
      .select("id, overall_score, passed, completed_at")
      .eq("user_id", candidateId)
      .order("completed_at", { ascending: false })
      .limit(10)
  ]);

  const candidate = profileResult.data as CandidateProfile | null;
  const badges = (badgeResult.data ?? []) as CandidateBadge[];
  const attempts = (attemptResult.data ?? []) as CandidateAttempt[];
  const resumeAvailable = Boolean(candidate?.resume_file_path);

  if (!candidate) {
    return (
      <div className="fc-page-stack fc-workspace-page">
        <section className="fc-workspace-hero">
          <p className="fc-eyebrow">Recruiter Workspace</p>
          <h1>Candidate not found</h1>
          <p>This candidate profile is unavailable or not visible to recruiters.</p>
        </section>
      </div>
    );
  }

  return (
    <div className="fc-page-stack fc-workspace-page">
      <section className="fc-workspace-hero">
        <p className="fc-eyebrow">Recruiter Workspace</p>
        <h1>{candidate.display_name || "Candidate Profile"}</h1>
        <p>{candidate.headline || "Professional candidate profile"}</p>
      </section>

      <section className="fc-workspace-grid fc-recruiter-browser-grid">
        <div className="fc-page-stack">
          <article className="fc-card">
            <div className="fc-card-header-row">
              <h2>{tab === "resume" ? "Resume View" : "Portfolio View"}</h2>
              <span className="fc-status-pill">{candidate.location || "Location not set"}</span>
            </div>

            <div className="fc-action-row">
              <Link className="fc-button" href={`/recruiters/candidates/${candidate.id}`}>
                Portfolio
              </Link>
              <Link className="fc-button" href={`/recruiters/candidates/${candidate.id}?tab=resume`}>
                Resume
              </Link>
              <Link
                className="fc-button"
                href={`/messages?candidateId=${encodeURIComponent(candidate.id)}&candidateName=${encodeURIComponent(candidate.display_name || "Candidate")}`}
              >
                Contact Candidate
              </Link>
            </div>

            {tab === "resume" ? (
              <div className="fc-page-stack">
                <p className="fc-muted">
                  {resumeAvailable
                    ? "A resume is attached to this profile. Use the candidate outreach thread to request latest copy if needed."
                    : "No resume file is currently attached. Portfolio details are still available."}
                </p>
                {resumeAvailable && (
                  <p className="fc-muted">
                    Resume path: <code>{candidate.resume_file_path}</code>
                  </p>
                )}
              </div>
            ) : (
              <div className="fc-page-stack">
                <p>{candidate.about || "No profile summary provided yet."}</p>
                <h3>Skills</h3>
                <p className="fc-muted">{candidate.skills || "No skills section provided yet."}</p>
                <h3>Experience</h3>
                <p className="fc-muted">{candidate.experience || "No experience section provided yet."}</p>
                <h3>Education</h3>
                <p className="fc-muted">{candidate.education || "No education section provided yet."}</p>
                {candidate.portfolio_url && (
                  <p>
                    <a className="fc-button" href={candidate.portfolio_url} target="_blank" rel="noreferrer">
                      Open External Portfolio
                    </a>
                  </p>
                )}
              </div>
            )}
          </article>
        </div>

        <aside className="fc-page-stack">
          <article className="fc-card fc-side-card">
            <p className="fc-eyebrow">Evidence Snapshot</p>
            <ul className="fc-guidance-list">
              <li>Badges: {badges.length}</li>
              <li>Recent attempts: {attempts.length}</li>
              <li>Visibility: {candidate.profile_visibility || "private"}</li>
            </ul>
          </article>

          <article className="fc-card fc-side-card">
            <p className="fc-eyebrow">Recent Achievements</p>
            <ul className="fc-guidance-list">
              {badges.length === 0 && <li>No badges published yet.</li>}
              {badges.map((badge) => (
                <li key={badge.id}>
                  {badge.badge_name} ({new Date(badge.earned_at).toLocaleDateString()})
                </li>
              ))}
            </ul>
          </article>

          <article className="fc-card fc-side-card">
            <p className="fc-eyebrow">Recent Scenario Results</p>
            <ul className="fc-guidance-list">
              {attempts.length === 0 && <li>No scenario attempts available.</li>}
              {attempts.map((attempt) => (
                <li key={attempt.id}>
                  {attempt.overall_score}% - {attempt.passed ? "Passed" : "Reviewed"} ({new Date(attempt.completed_at).toLocaleDateString()})
                </li>
              ))}
            </ul>
          </article>
        </aside>
      </section>
    </div>
  );
}
