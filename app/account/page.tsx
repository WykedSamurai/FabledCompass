"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";
import {
  accountTypes,
  normalizeAccountType,
  normalizeProfileVisibility,
  profileVisibilityOptions,
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
      setMessage("");
    });
  }, [router]);

  async function saveSettings() {
    setSaving(true);
    setMessage("");
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      data: {
        account_type: accountType,
        profile_visibility: profileVisibility
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
          <div className="fc-action-row">
            <button className="fc-button" type="button" disabled={saving} onClick={saveSettings}>
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </article>
      </section>
    </div>
  );
}
