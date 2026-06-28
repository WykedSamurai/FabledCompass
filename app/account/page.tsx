"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";
import {
  MAX_COMPANY_RECRUITER_ACCOUNTS,
  accountTypes,
  normalizeCompanyNarrative,
  normalizeAccountType,
  normalizeProfileVisibility,
  normalizeRecruiterSeatEmails,
  profileVisibilityOptions,
  type CompanyNarrative,
  type AccountType,
  type ProfileVisibility
} from "../../utils/account/types";

export default function AccountPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("Loading account...");
  const [saving, setSaving] = useState(false);
  const [accountType, setAccountType] = useState<AccountType>("job_seeker");
  const [profileVisibility, setProfileVisibility] = useState<ProfileVisibility>("private");
  const [companyNarrative, setCompanyNarrative] = useState<CompanyNarrative>({
    who: "",
    what: "",
    why: "",
    where: "",
    how_future_focus: ""
  });
  const [recruiterSeats, setRecruiterSeats] = useState<string[]>(
    Array.from({ length: MAX_COMPANY_RECRUITER_ACCOUNTS }, () => "")
  );

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/login");
        return;
      }
      setEmail(data.user.email ?? "");
      setAccountType(normalizeAccountType(data.user.user_metadata.account_type));
      setProfileVisibility(normalizeProfileVisibility(data.user.user_metadata.profile_visibility));
      setCompanyNarrative(normalizeCompanyNarrative(data.user.user_metadata.company_narrative));
      setRecruiterSeats(normalizeRecruiterSeatEmails(data.user.user_metadata.company_recruiter_accounts));
      setMessage("");
    });
  }, [router]);

  function updateRecruiterSeat(index: number, value: string) {
    setRecruiterSeats((current) => current.map((entry, entryIndex) => (entryIndex === index ? value : entry)));
  }

  async function saveSettings() {
    setSaving(true);
    setMessage("");
    const supabase = createClient();
    const normalizedSeats = recruiterSeats
      .map((entry) => entry.trim())
      .filter((entry, index, array) => Boolean(entry) && array.indexOf(entry) === index)
      .slice(0, MAX_COMPANY_RECRUITER_ACCOUNTS);
    const { error } = await supabase.auth.updateUser({
      data: {
        account_type: accountType,
        profile_visibility: profileVisibility,
        company_narrative: companyNarrative,
        company_recruiter_accounts: normalizedSeats
      }
    });
    setSaving(false);
    setMessage(error ? error.message : "Account settings saved.");
  }

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/");
    router.refresh();
  }

  return (
    <div className="fc-page-stack fc-workspace-page">
      <section className="fc-workspace-hero">
        <p className="fc-eyebrow">Navigator Center</p>
        <h1>Account Control</h1>
        <p>Manage profile details, badges, and access settings in one place.</p>
      </section>

      <section className="fc-workspace-grid">
        <article className="fc-card">
          <h2>Connected Account</h2>
          <p className="fc-muted">{message || email}</p>
          <div className="fc-action-row">
            <Link className="fc-button" href="/account/profile">Edit Profile</Link>
            <Link className="fc-button" href="/account/badges">Badges & Attempts</Link>
            <button className="fc-button" type="button" onClick={signOut}>Sign Out</button>
          </div>
        </article>

        <article className="fc-card">
          <h2>Access Settings</h2>
          <p className="fc-muted">Choose how this account is treated across job seeker and recruiter surfaces.</p>
          <div className="fc-auth-form">
            <label>
              Account type
              <select value={accountType} onChange={(event) => setAccountType(event.target.value as AccountType)}>
                {accountTypes.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Profile visibility
              <select value={profileVisibility} onChange={(event) => setProfileVisibility(event.target.value as ProfileVisibility)}>
                {profileVisibilityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            {accountType === "company_admin" && (
              <>
                <h3>Company Narrative</h3>
                <p className="fc-muted">Share who you are, what you do, and how you plan to improve for employees and community.</p>
                <label>
                  Who are you?
                  <textarea
                    rows={2}
                    value={companyNarrative.who}
                    onChange={(event) => setCompanyNarrative({ ...companyNarrative, who: event.target.value })}
                  />
                </label>
                <label>
                  What do you do?
                  <textarea
                    rows={2}
                    value={companyNarrative.what}
                    onChange={(event) => setCompanyNarrative({ ...companyNarrative, what: event.target.value })}
                  />
                </label>
                <label>
                  Why do you do it?
                  <textarea
                    rows={2}
                    value={companyNarrative.why}
                    onChange={(event) => setCompanyNarrative({ ...companyNarrative, why: event.target.value })}
                  />
                </label>
                <label>
                  Where are you?
                  <textarea
                    rows={2}
                    value={companyNarrative.where}
                    onChange={(event) => setCompanyNarrative({ ...companyNarrative, where: event.target.value })}
                  />
                </label>
                <label>
                  How will you become more community and employee focused?
                  <textarea
                    rows={3}
                    value={companyNarrative.how_future_focus}
                    onChange={(event) => setCompanyNarrative({ ...companyNarrative, how_future_focus: event.target.value })}
                  />
                </label>

                <h3>Recruiter Accounts</h3>
                <p className="fc-muted">Company accounts support up to {MAX_COMPANY_RECRUITER_ACCOUNTS} recruiter seats.</p>
                {recruiterSeats.map((seat, index) => (
                  <label key={`recruiter-seat-${index}`}>
                    Recruiter seat {index + 1} email
                    <input
                      type="email"
                      value={seat}
                      onChange={(event) => updateRecruiterSeat(index, event.target.value)}
                      placeholder="recruiter@company.com"
                    />
                  </label>
                ))}
              </>
            )}

            <div className="fc-action-row">
              <button className="fc-button" type="button" disabled={saving} onClick={saveSettings}>
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
