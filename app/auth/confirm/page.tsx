"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../utils/supabase/client";

export default function ConfirmPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Confirming your email...");

  useEffect(() => {
    async function confirm() {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        setMessage(error.message);
        return;
      }

      if (data.session) {
        router.replace("/account");
        router.refresh();
        return;
      }

      setMessage("Your email has been confirmed. Return to Sign In to continue.");
    }

    confirm();
  }, [router]);

  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">Email Confirmation</p>
        <h1>Returning to Fabled Compass.</h1>
      </section>
      <section className="section section-narrow">
        <article className="card auth-card">
          <p role="status">{message}</p>
          <a className="button button-dark" href="/login">Go to Sign In</a>
        </article>
      </section>
    </>
  );
}
