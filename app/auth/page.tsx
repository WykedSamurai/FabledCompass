"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const displayName = String(form.get("displayName") ?? "").trim();
    const accountType = String(form.get("accountType") ?? "job_seeker");
    const supabase = createClient();

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: { display_name: displayName, account_type: accountType }
        }
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage("Check your email to confirm your account, then return to sign in.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setMessage(error.message);
      } else {
        router.push("/profile");
        router.refresh();
      }
    }

    setLoading(false);
  }

  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">Navigator Access</p>
        <h1>{mode === "login" ? "Welcome back." : "Begin your journey."}</h1>
        <p>Create an account to save profile information, scenario results, and earned badges.</p>
      </section>

      <section className="section section-narrow auth-wrap">
        <article className="card auth-card">
          <div className="auth-tabs" role="tablist" aria-label="Account access">
            <button className={mode === "login" ? "auth-tab active" : "auth-tab"} onClick={() => setMode("login")} type="button">Sign In</button>
            <button className={mode === "signup" ? "auth-tab active" : "auth-tab"} onClick={() => setMode("signup")} type="button">Create Account</button>
          </div>

          <form className="form-grid" onSubmit={submit}>
            {mode === "signup" && (
              <>
                <label>
                  Display name
                  <input name="displayName" required maxLength={80} />
                </label>
                <label>
                  Account type
                  <select name="accountType" defaultValue="job_seeker">
                    <option value="job_seeker">Job Seeker</option>
                    <option value="employer">Employer</option>
                  </select>
                </label>
              </>
            )}
            <label>
              Email
              <input name="email" type="email" autoComplete="email" required />
            </label>
            <label>
              Password
              <input name="password" type="password" minLength={8} autoComplete={mode === "login" ? "current-password" : "new-password"} required />
            </label>
            <button className="button button-dark" disabled={loading} type="submit">
              {loading ? "Working..." : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          {message && <p className="form-message" role="status">{message}</p>}
        </article>
      </section>
    </>
  );
}
