"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../utils/supabase/client";

function getSafeNextPath() {
  const next = new URLSearchParams(window.location.search).get("next") || "/dashboard";
  return next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
}

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const error = new URLSearchParams(window.location.search).get("error");
    if (error) {
      setMessage(error);
    }
  }, []);

  async function sendMagicLink() {
    const nextPath = getSafeNextPath();
    const normalizedEmail = email.trim();
    if (!normalizedEmail) {
      setMessage("Enter your email to receive a magic sign-in link.");
      return;
    }

    setEmailLoading(true);
    setMessage("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`
      }
    });

    setEmailLoading(false);
    setMessage(
      error
        ? error.message
        : "Magic link sent. Check your email and open the link to finish signing in."
    );
  }

  return (
    <div className="fc-page-stack fc-workspace-page fc-auth-atmosphere">
      <section className="fc-workspace-hero">
        <p className="fc-eyebrow">Navigator Access</p>
        <h1>Chart your legend.</h1>
        <p>Enter Fabled Compass with a secure email magic link.</p>
      </section>

      <section>
        <article className="fc-card fc-auth-panel fc-auth-card">
          <label>
            Email address
            <input
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <button className="fc-button" type="button" onClick={sendMagicLink} disabled={emailLoading}>
            {emailLoading ? "Sending..." : "Send Magic Link"}
          </button>

          {message && <p className="form-message" role="status">{message}</p>}
        </article>
      </section>
    </div>
  );
}
