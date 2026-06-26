"use client";

import { useEffect, useState } from "react";
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
        router.replace("/auth");
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
    <>
      <section className="page-hero">
        <p className="eyebrow">Navigator Account</p>
        <h1>Your account is connected.</h1>
        <p>Signed-in users can now be linked to saved profile and scenario data.</p>
      </section>
      <section className="section section-narrow">
        <article className="card auth-card">
          <h2>Account</h2>
          <p>{message || email}</p>
          <div className="actions">
            <a className="button button-dark" href="/profile">Open Profile</a>
            <button className="button" type="button" onClick={signOut}>Sign Out</button>
          </div>
        </article>
      </section>
    </>
  );
}
