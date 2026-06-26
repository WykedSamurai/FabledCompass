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
        options: { data: { display_name: displayName } }
      });
      setMessage(error ? error.message : "Check your email to confirm the account, then sign in.");
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
    <>
      <section className="page-hero">
        <p className="eyebrow">Navigator Access</p>
        <h1>{creating ? "Begin your journey." : "Welcome back."}</h1>
      </section>
      <section className="section section-narrow">
        <article className="card auth-card">
          <form className="form-grid" onSubmit={submit}>
            {creating && <label>Display name<input name="displayName" required /></label>}
            <label>Email<input name="email" type="email" required /></label>
            <label>Password<input name="password" type="password" minLength={8} required /></label>
            <button className="button button-dark" type="submit">{creating ? "Create Account" : "Sign In"}</button>
          </form>
          <button className="button" type="button" onClick={() => setCreating(!creating)}>
            {creating ? "Use an existing account" : "Create a new account"}
          </button>
          {message && <p role="status">{message}</p>}
        </article>
      </section>
    </>
  );
}
