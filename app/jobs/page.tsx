import PrototypeWatermark from "../../components/layout/PrototypeWatermark";
import { createClient } from "../../utils/supabase/server";

type JobRole = "Customer Operations" | "People Ops" | "Learning & Development";

type JobListing = {
  title: string;
  company: string;
  location: string;
  type: string;
  summary: string;
  roleTrack: JobRole;
};

type ProfileRecord = {
  display_name: string | null;
  headline: string | null;
  about: string | null;
  skills: string | null;
  experience: string | null;
  education: string | null;
  resume_file_path: string | null;
};

type AttemptRecord = {
  overall_score: number | null;
};

function clampPercentage(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function completionScore(values: Array<string | null | undefined>): number {
  if (values.length === 0) {
    return 0;
  }
  const completeCount = values.filter((value) => Boolean(value && value.trim().length > 0)).length;
  return clampPercentage((completeCount / values.length) * 100);
}

function inferRoleFit(headline: string): JobRole {
  const lower = headline.toLowerCase();
  if (lower.includes("people") || lower.includes("hr") || lower.includes("human")) {
    return "People Ops";
  }
  if (lower.includes("training") || lower.includes("learning")) {
    return "Learning & Development";
  }
  return "Customer Operations";
}

const jobs: JobListing[] = [
  {
    title: "Customer Experience Team Lead",
    company: "Northstar Market Group",
    location: "Jacksonville, FL · On-site",
    type: "Full-time",
    summary: "Coach a frontline service team, resolve escalated concerns, and support daily operations.",
    roleTrack: "Customer Operations"
  },
  {
    title: "People Operations Coordinator",
    company: "Harbor & Pine Hospitality",
    location: "Remote · United States",
    type: "Full-time",
    summary: "Support onboarding, employee records, scheduling, and internal communication across a growing hospitality group.",
    roleTrack: "People Ops"
  },
  {
    title: "Training Specialist",
    company: "Brightpath Services",
    location: "Orlando, FL · Hybrid",
    type: "Full-time",
    summary: "Create practical training experiences and help managers develop consistent coaching practices.",
    roleTrack: "Learning & Development"
  }
];

export default async function JobsPage() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const userId = authData.user?.id;

  let profileStrength: number | null = null;
  let userRoleTrack: JobRole = "Customer Operations";

  if (userId) {
    const [profileResult, attemptResult, badgeResult] = await Promise.all([
      supabase
        .from("profiles")
        .select("display_name, headline, about, skills, experience, education, resume_file_path")
        .eq("id", userId)
        .maybeSingle(),
      supabase
        .from("scenario_attempts")
        .select("overall_score")
        .eq("user_id", userId)
        .order("completed_at", { ascending: false })
        .limit(25),
      supabase
        .from("user_badges")
        .select("id")
        .eq("user_id", userId)
    ]);

    const profile = profileResult.data as ProfileRecord | null;
    const attempts = (attemptResult.data ?? []) as AttemptRecord[];
    const badgeCount = badgeResult.data?.length ?? 0;
    const averageAttempt =
      attempts.length > 0
        ? attempts.reduce((sum, attempt) => sum + (attempt.overall_score ?? 0), 0) / attempts.length
        : 0;
    const profileCompletion = completionScore([
      profile?.display_name,
      profile?.headline,
      profile?.about,
      profile?.skills,
      profile?.experience,
      profile?.education
    ]);

    profileStrength = clampPercentage(
      averageAttempt * 0.65 + badgeCount * 6 + (profile?.resume_file_path ? 10 : 0) + profileCompletion * 0.2
    );
    userRoleTrack = inferRoleFit(profile?.headline || "");
  }

  return (
    <div className="fc-page-stack fc-workspace-page fc-prototype-frame">
      <PrototypeWatermark />
      <section className="fc-workspace-hero">
        <p className="fc-eyebrow">Quest Board</p>
        <h1>Open Quests</h1>
        <p>Browse roles that align with your professional strengths and demonstrated evidence.</p>
      </section>

      <section className="fc-job-list">
        {jobs.map((job) => (
          <article className="fc-card fc-job-card" key={`${job.company}-${job.title}`}>
            <div className="fc-card-header-row">
              <div>
                <p className="fc-eyebrow">{job.type}</p>
                <h2>{job.title}</h2>
                <p className="fc-muted">{job.company} • {job.location}</p>
              </div>
              <span className="fc-status-pill">
                {profileStrength === null
                  ? "Sign in for match score"
                  : `${clampPercentage(profileStrength * 0.75 + (job.roleTrack === userRoleTrack ? 95 : 70) * 0.25)}% match`}
              </span>
              <button className="fc-button" type="button">View Quest</button>
            </div>
            <p>{job.summary}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
