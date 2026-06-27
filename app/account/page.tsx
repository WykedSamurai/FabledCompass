"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";

export default function AccountPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("Loading account...");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/login");
        return;
      }
      setEmail(data.user.email ?? "");
      setMessage("");
    });
  }, [router]);

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
      </section>
    </div>
  );
}
