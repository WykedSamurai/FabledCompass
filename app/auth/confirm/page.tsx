"use client";

import Link from "next/link";
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
      const next = new URLSearchParams(window.location.search).get("next") || "/account";

      if (error) {
        setMessage(error.message);
        return;
      }

      if (data.session) {
        router.replace(next);
        router.refresh();
        return;
      }

      setMessage("Your email has been confirmed. Return to Sign In to continue.");
    }

    confirm();
  }, [router]);

  return (
    <div className="fc-page-stack fc-workspace-page">
      <section className="fc-workspace-hero">
        <p className="fc-eyebrow">Email Confirmation</p>
        <h1>Returning to Fabled Compass.</h1>
      </section>
      <section>
        <article className="fc-card fc-auth-panel">
          <p className="fc-muted" role="status">{message}</p>
          <Link className="fc-button" href="/login">Go to Sign In</Link>
        </article>
      </section>
    </div>
  );
}
