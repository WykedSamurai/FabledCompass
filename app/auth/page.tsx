"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function signInWithGoogle() {
    const nextPath = new URLSearchParams(window.location.search).get("next") || "/dashboard";
    setGoogleLoading(true);
    setMessage("");
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`
      }
    });

    if (error) {
      setMessage(error.message);
      setGoogleLoading(false);
      return;
    }

    router.push(`/auth/callback?next=${encodeURIComponent(nextPath)}`);
    router.refresh();
  }

  async function sendMagicLink() {
    const nextPath = new URLSearchParams(window.location.search).get("next") || "/dashboard";
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
        emailRedirectTo: `${window.location.origin}/auth/confirm?next=${encodeURIComponent(nextPath)}`
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
        <p>Enter Fabled Compass with Google, or use a free email magic link.</p>
      </section>

      <section>
        <article className="fc-card fc-auth-panel fc-auth-card">
          <button className="fc-button" disabled={googleLoading || emailLoading} onClick={signInWithGoogle} type="button">
            {googleLoading ? "Redirecting..." : "Continue with Google"}
          </button>
          <p className="fc-muted">Google sign-in must be enabled in Supabase Auth provider settings.</p>

          <label>
            Email for magic link
            <input
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <button className="fc-ghost-button" type="button" onClick={sendMagicLink} disabled={googleLoading || emailLoading}>
            {emailLoading ? "Sending..." : "Send Magic Link"}
          </button>

          {message && <p className="form-message" role="status">{message}</p>}
        </article>
      </section>
    </div>
  );
}
