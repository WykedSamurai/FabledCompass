"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    const supabase = createClient();

    if (creating) {
      const displayName = String(form.get("displayName") || "");
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
          data: { display_name: displayName }
        }
      });
      setMessage(error ? error.message : "Check your email to confirm the account. The link will return you to Fabled Compass.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
      return;
    }

    router.push("/account");
    router.refresh();
  }

  return (
    <div className="fc-page-stack fc-workspace-page">
      <section className="fc-workspace-hero">
        <p className="fc-eyebrow">Navigator Access</p>
        <h1>{creating ? "Create your account." : "Sign in to continue."}</h1>
        <p>Access your profile, applications, and evidence-backed progress.</p>
      </section>

      <section>
        <article className="fc-card fc-auth-panel">
          <form className="fc-auth-form" onSubmit={submit}>
            {creating && <label>Display name<input name="displayName" required /></label>}
            <label>Email<input name="email" type="email" required /></label>
            <label>Password<input name="password" type="password" minLength={8} required /></label>
            <button className="fc-button" type="submit">{creating ? "Create Account" : "Sign In"}</button>
          </form>
          <button className="fc-ghost-button" type="button" onClick={() => setCreating(!creating)}>
            {creating ? "Use an existing account" : "Create a new account"}
          </button>
          {message && <p className="form-message" role="status">{message}</p>}
        </article>
      </section>
    </div>
  );
}
