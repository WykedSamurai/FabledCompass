import Link from "next/link";
import { createClient } from "../utils/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const isSignedIn = Boolean(authData.user);

  return (
    <div className="fc-page-stack fc-workspace-page fc-auth-atmosphere">
      <section className="fc-workspace-hero">
        <p className="fc-eyebrow">Navigator Access</p>
        <h1>Chart your legend.</h1>
        <p>
          {isSignedIn
            ? "You are signed in. Continue your journey through the Guild Hall, Commons, and career path."
            : "Sign in to enter the Guild Hall, join the Commons, and build career proof across your journey."}
        </p>
      </section>

      <section>
        <article className="fc-card fc-auth-panel fc-auth-card">
          <div className="fc-action-row">
            {isSignedIn ? (
              <Link className="fc-button" href="/dashboard">Enter Guild Hall</Link>
            ) : (
              <Link className="fc-button" href="/login">Sign In</Link>
            )}
            <Link className="fc-ghost-button" href="/jobs">Browse Jobs First</Link>
          </div>
          <p className="fc-muted">
            {isSignedIn
              ? "Welcome back, Traveler."
              : "Use Google sign-in or a free email magic link."}
          </p>
        </article>
      </section>
    </div>
  );
}
