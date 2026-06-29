"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../utils/supabase/client";
import {
  normalizeAccountType,
  normalizeHumanVerificationStatus,
  normalizeProfileVisibility
} from "../../../utils/account/types";

function getSafeNextPath() {
  const next = new URLSearchParams(window.location.search).get("next") || "/dashboard";
  return next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
}

export default function ConfirmPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Finishing sign in...");

  useEffect(() => {
    async function confirm() {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getSession();
      const next = getSafeNextPath();

      if (error) {
        setMessage(error.message);
        return;
      }

      if (data.session) {
        const user = data.session.user;
        const hasAccountType = typeof user.user_metadata.account_type === "string";
        const hasVisibility = typeof user.user_metadata.profile_visibility === "string";
        const currentVerification = normalizeHumanVerificationStatus(user.user_metadata.human_verification_status);
        const hasVerification = typeof user.user_metadata.human_verification_status === "string";
        const baselineVerification = user.email_confirmed_at ? "email_verified" : "unverified";
        const nextVerification =
          currentVerification === "human_verified"
            ? "human_verified"
            : baselineVerification;

        if (!hasAccountType || !hasVisibility || !hasVerification || currentVerification !== nextVerification) {
          await supabase.auth.updateUser({
            data: {
              ...user.user_metadata,
              account_type: normalizeAccountType(user.user_metadata.account_type),
              profile_visibility: normalizeProfileVisibility(user.user_metadata.profile_visibility),
              human_verification_status: nextVerification
            }
          });
        }

        router.replace(next);
        router.refresh();
        return;
      }

      setMessage("We could not finish the sign-in session. Return to Sign In to continue.");
    }

    confirm();
  }, [router]);

  return (
    <div className="fc-page-stack fc-workspace-page">
      <section className="fc-workspace-hero">
        <p className="fc-eyebrow">Navigator Access</p>
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
