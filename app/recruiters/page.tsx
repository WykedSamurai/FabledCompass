"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PrototypeWatermark from "../../components/layout/PrototypeWatermark";
import { createClient } from "../../utils/supabase/client";
import {
  canAccessRecruiterWorkspace,
  normalizeAccountType,
  normalizeCompanyNarrative,
  normalizeRecruiterSeatEmails,
  type AccountType
} from "../../utils/account/types";

const sixAttributes = [
  { label: "Policy Alignment", key: "leadership" },
  { label: "Respectful Outreach", key: "communication" },
  { label: "Evidence Discipline", key: "problemSolving" },
  { label: "Professional Conduct", key: "professionalism" },
  { label: "Workflow Compliance", key: "adaptability" },
  { label: "Community Focus", key: "collaboration" }
] as const;

type AttributeKey = (typeof sixAttributes)[number]["key"];

type Candidate = {
  id: string;
  name: string;
  title: string;
  location: string;
  roleFit: string;
  profileVisibility: "public" | "recruiters_only";
  resumeStatus: "Attached" | "Portfolio only";
  portfolioStrength: number;
  attributes: Record<AttributeKey, number>;
  evidenceHighlights: string[];
};

type ProfileRecord = {
  id: string;
  display_name: string | null;
  headline: string | null;
  location: string | null;
  profile_visibility: string | null;
  resume_file_path: string | null;
  about: string | null;
};

type AttemptRecord = {
  user_id: string;
  overall_score: number | null;
  passed: boolean | null;
};

type BadgeRecord = {
  user_id: string;
};

const roleFilters = ["All", "Customer Operations", "People Ops", "Learning & Development", "General"] as const;

function inferRoleFit(headline: string): (typeof roleFilters)[number] {
  const lower = headline.toLowerCase();
  if (lower.includes("customer") || lower.includes("service") || lower.includes("support")) {
    return "Customer Operations";
  }
  if (lower.includes("people") || lower.includes("hr") || lower.includes("human")) {
    return "People Ops";
  }
  if (lower.includes("training") || lower.includes("learning")) {
    return "Learning & Development";
  }
  return "General";
}

function clampPercentage(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function completionScore(values: string[]): number {
  if (values.length === 0) {
    return 0;
  }
  const filled = values.filter((value) => value.trim().length > 0).length;
  return clampPercentage((filled / values.length) * 100);
}

function buildAttributes(portfolioStrength: number, passRate: number): Record<AttributeKey, number> {
  return {
    leadership: clampPercentage(portfolioStrength * 0.95 + passRate * 0.2),
    communication: clampPercentage(portfolioStrength * 0.98 + passRate * 0.18),
    problemSolving: clampPercentage(portfolioStrength * 0.92 + passRate * 0.26),
    professionalism: clampPercentage(portfolioStrength * 1.02 + passRate * 0.15),
    adaptability: clampPercentage(portfolioStrength * 0.9 + passRate * 0.24),
    collaboration: clampPercentage(portfolioStrength * 0.96 + passRate * 0.2)
  };
}

export default function RecruitersPage() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<AccountType>("job_seeker");
  const [authLoading, setAuthLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState<(typeof roleFilters)[number]>("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [minimumScore, setMinimumScore] = useState(0);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [candidateMessage, setCandidateMessage] = useState("Loading candidate browser...");
  const [policyAdherenceScore, setPolicyAdherenceScore] = useState(60);
  const [communityFocusScore, setCommunityFocusScore] = useState(55);
  const [filterInteractions, setFilterInteractions] = useState(0);
  const [portfolioViews, setPortfolioViews] = useState(0);
  const [resumeViews, setResumeViews] = useState(0);
  const [contactActions, setContactActions] = useState(0);

  useEffect(() => {
    async function loadAccessAndCandidates() {
      const supabase = createClient();
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        router.replace("/login?next=/recruiters");
        return;
      }

      const userType = normalizeAccountType(authData.user.user_metadata.account_type);
      setAccountType(userType);
      if (!canAccessRecruiterWorkspace(userType)) {
        setAuthLoading(false);
        return;
      }

      const companyNarrative = normalizeCompanyNarrative(authData.user.user_metadata.company_narrative);
      const recruiterSeats = normalizeRecruiterSeatEmails(authData.user.user_metadata.company_recruiter_accounts);
      const narrativeCompletion = completionScore([
        companyNarrative.who,
        companyNarrative.what,
        companyNarrative.why,
        companyNarrative.where,
        companyNarrative.how_future_focus
      ]);
      const seatsConfigured = recruiterSeats.filter((entry) => entry.length > 0).length;
      const seatsCompletion = clampPercentage((seatsConfigured / recruiterSeats.length) * 100);
      const baselinePolicy = userType === "company_admin" ? 55 : 70;

      setPolicyAdherenceScore(clampPercentage((baselinePolicy + narrativeCompletion * 0.3 + seatsCompletion * 0.15)));
      setCommunityFocusScore(clampPercentage(narrativeCompletion * 0.7 + seatsCompletion * 0.3));

      const [profileResult, attemptResult, badgeResult] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, display_name, headline, location, profile_visibility, resume_file_path, about")
          .in("profile_visibility", ["public", "recruiters_only", "employers"])
          .order("updated_at", { ascending: false })
          .limit(100),
        supabase
          .from("scenario_attempts")
          .select("user_id, overall_score, passed")
          .order("completed_at", { ascending: false })
          .limit(500),
        supabase
          .from("user_badges")
          .select("user_id")
          .order("earned_at", { ascending: false })
          .limit(500)
      ]);

      if (profileResult.error) {
        setCandidateMessage(profileResult.error.message);
        setAuthLoading(false);
        return;
      }

      const attemptsByUser = new Map<string, AttemptRecord[]>();
      for (const attempt of (attemptResult.data ?? []) as AttemptRecord[]) {
        const current = attemptsByUser.get(attempt.user_id) ?? [];
        current.push(attempt);
        attemptsByUser.set(attempt.user_id, current);
      }

      const badgesByUser = new Map<string, number>();
      for (const badge of (badgeResult.data ?? []) as BadgeRecord[]) {
        badgesByUser.set(badge.user_id, (badgesByUser.get(badge.user_id) ?? 0) + 1);
      }

      const nextCandidates = ((profileResult.data ?? []) as ProfileRecord[]).map((profile) => {
        const attempts = attemptsByUser.get(profile.id) ?? [];
        const badgeCount = badgesByUser.get(profile.id) ?? 0;
        const averageAttempt =
          attempts.length > 0
            ? attempts.reduce((sum, attempt) => sum + (attempt.overall_score ?? 0), 0) / attempts.length
            : 0;
        const passCount = attempts.filter((attempt) => Boolean(attempt.passed)).length;
        const passRate = attempts.length > 0 ? (passCount / attempts.length) * 100 : 0;
        const portfolioStrength = clampPercentage(averageAttempt * 0.7 + badgeCount * 6 + (profile.resume_file_path ? 10 : 0));
        const attributes = buildAttributes(portfolioStrength, passRate);

        return {
          id: profile.id,
          name: profile.display_name || "Navigator",
          title: profile.headline || "Professional Candidate",
          location: profile.location || "Location not set",
          roleFit: inferRoleFit(profile.headline || ""),
          profileVisibility: profile.profile_visibility === "public" ? "public" : "recruiters_only",
          resumeStatus: profile.resume_file_path ? "Attached" : "Portfolio only",
          portfolioStrength,
          attributes,
          evidenceHighlights: [
            `Scenario attempts: ${attempts.length}`,
            `Badges earned: ${badgeCount}`,
            `Pass rate: ${clampPercentage(passRate)}%`
          ]
        } as Candidate;
      });

      setCandidates(nextCandidates);
      setCandidateMessage(nextCandidates.length ? "" : "No candidates are visible yet. Ask users to set profile visibility to recruiters_only or public.");
      setAuthLoading(false);
    }

    loadAccessAndCandidates();
  }, [router]);

  const recruiterOverallScore = useMemo(() => {
    const platformPlayScore = clampPercentage(
      45 +
        filterInteractions * 4 +
        portfolioViews * 6 +
        resumeViews * 6 +
        contactActions * 10
    );
    return clampPercentage(policyAdherenceScore * 0.6 + platformPlayScore * 0.4);
  }, [contactActions, filterInteractions, policyAdherenceScore, portfolioViews, resumeViews]);

  const recruiterScorecard: Record<AttributeKey, number> = useMemo(() => {
    const platformPlayScore = clampPercentage(
      45 +
        filterInteractions * 4 +
        portfolioViews * 6 +
        resumeViews * 6 +
        contactActions * 10
    );
    const evidenceDiscipline = clampPercentage(
      55 +
        portfolioViews * 8 +
        resumeViews * 8 +
        (candidates.length > 0 ? 10 : 0)
    );
    const respectfulContact = clampPercentage(
      50 +
        contactActions * 12 +
        Math.min(portfolioViews + resumeViews, 5) * 5
    );
    return {
      leadership: clampPercentage(policyAdherenceScore * 0.7 + platformPlayScore * 0.3),
      communication: respectfulContact,
      problemSolving: clampPercentage(policyAdherenceScore * 0.35 + evidenceDiscipline * 0.65),
      professionalism: clampPercentage(policyAdherenceScore * 0.8 + platformPlayScore * 0.2),
      adaptability: platformPlayScore,
      collaboration: clampPercentage(communityFocusScore * 0.55 + platformPlayScore * 0.45)
    };
  }, [candidates.length, communityFocusScore, contactActions, filterInteractions, policyAdherenceScore, portfolioViews, resumeViews]);

  const locationFilters = useMemo(() => {
    const unique = Array.from(new Set(candidates.map((candidate) => candidate.location)));
    return ["All", ...unique];
  }, [candidates]);

  const filteredCandidates = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    return candidates.filter((candidate) => {
      const matchesSearch =
        !query ||
        candidate.name.toLowerCase().includes(query) ||
        candidate.title.toLowerCase().includes(query) ||
        candidate.evidenceHighlights.some((highlight) => highlight.toLowerCase().includes(query));
      const matchesRole = roleFilter === "All" || candidate.roleFit === roleFilter;
      const matchesLocation = locationFilter === "All" || candidate.location === locationFilter;
      const meetsScore = candidate.portfolioStrength >= minimumScore;
      return matchesSearch && matchesRole && matchesLocation && meetsScore;
    });
  }, [candidates, locationFilter, minimumScore, roleFilter, searchText]);

  if (authLoading) {
    return (
      <div className="fc-page-stack fc-workspace-page fc-prototype-frame">
        <PrototypeWatermark />
        <section className="fc-workspace-hero">
          <p className="fc-eyebrow">Recruiters Guild</p>
          <h1>Recruiters</h1>
          <p>Checking account access...</p>
        </section>
      </div>
    );
  }

  if (!canAccessRecruiterWorkspace(accountType)) {
    return (
      <div className="fc-page-stack fc-workspace-page fc-prototype-frame">
        <PrototypeWatermark />
        <section className="fc-workspace-hero">
          <p className="fc-eyebrow">Recruiters Guild</p>
          <h1>Recruiters</h1>
          <p>This workspace is for recruiter and company accounts.</p>
        </section>
      </div>
    );
  }

  return (
    <div className="fc-page-stack fc-workspace-page fc-prototype-frame">
      <PrototypeWatermark />
      <section className="fc-workspace-hero">
        <p className="fc-eyebrow">Recruiters Guild</p>
        <h1>Recruiters</h1>
        <p>Browse evidence-backed resumes and portfolios, contact candidates, and track recruiter quality signals.</p>
      </section>

      <section className="fc-workspace-grid fc-recruiter-browser-grid">
        <div className="fc-page-stack">
          <article className="fc-card">
            <div className="fc-card-header-row">
              <div>
                <p className="fc-eyebrow">Candidate Browser</p>
                <h2>Resumes & Portfolio Signals</h2>
              </div>
              <span className="fc-muted">{filteredCandidates.length} candidates match filters</span>
            </div>

            <div className="fc-auth-form fc-recruiter-filter-grid">
              <label>
                Search candidates
                <input
                  type="text"
                  value={searchText}
                  placeholder="Name, title, evidence keyword"
                  onChange={(event) => {
                    setSearchText(event.target.value);
                    setFilterInteractions((current) => current + 1);
                  }}
                />
              </label>
              <label>
                Role fit
                <select
                  value={roleFilter}
                  onChange={(event) => {
                    setRoleFilter(event.target.value as (typeof roleFilters)[number]);
                    setFilterInteractions((current) => current + 1);
                  }}
                >
                  {roleFilters.map((filter) => (
                    <option key={filter} value={filter}>
                      {filter}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Location
                <select
                  value={locationFilter}
                  onChange={(event) => {
                    setLocationFilter(event.target.value);
                    setFilterInteractions((current) => current + 1);
                  }}
                >
                  {locationFilters.map((filter) => (
                    <option key={filter} value={filter}>
                      {filter}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Minimum portfolio strength
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={minimumScore}
                  onChange={(event) => {
                    setMinimumScore(Math.max(0, Math.min(100, Number(event.target.value) || 0)));
                    setFilterInteractions((current) => current + 1);
                  }}
                />
              </label>
            </div>

            {candidateMessage && <p className="form-message">{candidateMessage}</p>}

            <div className="fc-candidate-list">
              {filteredCandidates.map((candidate) => (
                <article className="fc-card fc-candidate-card" key={candidate.id}>
                  <div className="fc-card-header-row">
                    <div>
                      <h3>{candidate.name}</h3>
                      <p className="fc-muted">
                        {candidate.title} • {candidate.location}
                      </p>
                    </div>
                    <span className="fc-status-pill">{candidate.portfolioStrength}% strength</span>
                  </div>

                  <div className="fc-inline-tags">
                    <span>{candidate.roleFit}</span>
                    <span>{candidate.profileVisibility === "public" ? "Public Profile" : "Recruiters Only"}</span>
                    <span>{candidate.resumeStatus}</span>
                  </div>

                  <ul className="fc-recruiter-attribute-bars">
                    {sixAttributes.map((attribute) => (
                      <li key={`${candidate.id}-${attribute.key}`}>
                        <span>{attribute.label}</span>
                        <strong>{candidate.attributes[attribute.key]}%</strong>
                      </li>
                    ))}
                  </ul>

                  <ul className="fc-guidance-list">
                    {candidate.evidenceHighlights.map((highlight) => (
                      <li key={`${candidate.id}-${highlight}`}>{highlight}</li>
                    ))}
                  </ul>

                  <div className="fc-action-row">
                    <button
                      className="fc-button"
                      type="button"
                      onClick={() => {
                        setPortfolioViews((current) => current + 1);
                        router.push(`/recruiters/candidates/${candidate.id}`);
                      }}
                    >
                      View Portfolio
                    </button>
                    <button
                      className="fc-button"
                      type="button"
                      onClick={() => {
                        setResumeViews((current) => current + 1);
                        router.push(`/recruiters/candidates/${candidate.id}?tab=resume`);
                      }}
                    >
                      View Resume
                    </button>
                    <button
                      className="fc-button"
                      type="button"
                      onClick={() => {
                        setContactActions((current) => current + 1);
                        router.push(`/messages?candidateId=${encodeURIComponent(candidate.id)}&candidateName=${encodeURIComponent(candidate.name)}`);
                      }}
                    >
                      Contact Candidate
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </article>
        </div>

        <aside className="fc-page-stack">
          <article className="fc-card fc-side-card">
            <p className="fc-eyebrow">Recruiter Scorecard</p>
            <h2>{recruiterOverallScore}% Recruiter Strength</h2>
            <p className="fc-muted">Scored by policy adherence (60%) and platform play quality (40%).</p>
            <ul className="fc-recruiter-attribute-bars">
              {sixAttributes.map((attribute) => (
                <li key={`score-${attribute.key}`}>
                  <span>{attribute.label}</span>
                  <strong>{recruiterScorecard[attribute.key]}%</strong>
                </li>
              ))}
            </ul>
          </article>

          <article className="fc-card fc-side-card">
            <p className="fc-eyebrow">Recruiter Workflow</p>
            <ul className="fc-guidance-list">
              <li>Policy adherence score: {policyAdherenceScore}%</li>
              <li>Platform workflow actions: {filterInteractions + portfolioViews + resumeViews + contactActions}</li>
              <li>Community and employee focus score: {communityFocusScore}%</li>
            </ul>
          </article>
        </aside>
      </section>
    </div>
  );
}
