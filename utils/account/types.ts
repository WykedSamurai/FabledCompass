export const accountTypes = ["job_seeker", "recruiter", "company_admin"] as const;
export type AccountType = (typeof accountTypes)[number];

export const profileVisibilityOptions = ["private", "recruiters_only", "public"] as const;
export type ProfileVisibility = (typeof profileVisibilityOptions)[number];

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
