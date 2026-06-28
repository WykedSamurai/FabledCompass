export const accountTypes = ["job_seeker", "recruiter", "company_admin"] as const;
export type AccountType = (typeof accountTypes)[number];

export const profileVisibilityOptions = ["private", "recruiters_only", "public"] as const;
export type ProfileVisibility = (typeof profileVisibilityOptions)[number];
export const MAX_COMPANY_RECRUITER_ACCOUNTS = 3;

export interface CompanyNarrative {
  who: string;
  what: string;
  why: string;
  where: string;
  how_future_focus: string;
}

export function normalizeAccountType(value: unknown): AccountType {
  if (value === "recruiter" || value === "company_admin") {
    return value;
  }
  return "job_seeker";
}

export function normalizeProfileVisibility(value: unknown): ProfileVisibility {
  if (value === "public" || value === "recruiters_only") {
    return value;
  }
  return "private";
}

export function canAccessRecruiterWorkspace(accountType: AccountType): boolean {
  return accountType === "recruiter" || accountType === "company_admin";
}

export function normalizeCompanyNarrative(value: unknown): CompanyNarrative {
  if (typeof value !== "object" || value === null) {
    return {
      who: "",
      what: "",
      why: "",
      where: "",
      how_future_focus: ""
    };
  }

  const record = value as Record<string, unknown>;
  return {
    who: typeof record.who === "string" ? record.who : "",
    what: typeof record.what === "string" ? record.what : "",
    why: typeof record.why === "string" ? record.why : "",
    where: typeof record.where === "string" ? record.where : "",
    how_future_focus: typeof record.how_future_focus === "string" ? record.how_future_focus : ""
  };
}

export function normalizeRecruiterSeatEmails(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return Array.from({ length: MAX_COMPANY_RECRUITER_ACCOUNTS }, () => "");
  }

  const normalized = value
    .filter((entry) => typeof entry === "string")
    .map((entry) => entry.trim())
    .slice(0, MAX_COMPANY_RECRUITER_ACCOUNTS);

  while (normalized.length < MAX_COMPANY_RECRUITER_ACCOUNTS) {
    normalized.push("");
  }

  return normalized;
}
