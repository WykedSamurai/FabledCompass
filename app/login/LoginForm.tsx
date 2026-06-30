"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";

function getSafeNextPath() {
  const next = new URLSearchParams(window.location.search).get("next") || "/dashboard";
  return next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
}

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const error = new URLSearchParams(window.location.search).get("error");
    if (error) {
      setMessage(error);
    }
  }, []);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = email.trim();
    if (!normalizedEmail || !password) {
      setMessage("Enter your email and password to sign in.");
      return;
    }

    setLoading(true);
    setMessage("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.replace(getSafeNextPath());
    router.refresh();
  }

  async function createAccount() {
    const normalizedEmail = email.trim();
    if (!normalizedEmail || !password) {
      setMessage("Enter an email and password to create an account.");
      return;
    }

    setCreatingAccount(true);
    setMessage("");

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(getSafeNextPath())}`
      }
    });

    setCreatingAccount(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Account created. Check your email to confirm your account, then sign in.");
  }

  return (
    <div className="fc-page-stack fc-workspace-page fc-auth-atmosphere">
      <section className="fc-workspace-hero">
        <p className="fc-eyebrow">Navigator Access</p>
        <h1>Chart your legend.</h1>
        <p>Sign in to Fabled Compass with your email and password.</p>
      </section>

      <section>
        <article className="fc-card fc-auth-panel fc-auth-card">
          <form onSubmit={signIn}>
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

            <label>
              Password
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>

            <button className="fc-button" type="submit" disabled={loading || creatingAccount}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <button className="fc-ghost-button" type="button" onClick={createAccount} disabled={loading || creatingAccount}>
            {creatingAccount ? "Creating account..." : "Create Account"}
          </button>

          {message && <p className="form-message" role="status">{message}</p>}
        </article>
      </section>
    </div>
  );
}
