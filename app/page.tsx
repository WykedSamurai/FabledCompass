import Link from "next/link";
import { createClient } from "../utils/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const isSignedIn = Boolean(authData.user);

  return (
    <section className="fc-home-landing fc-workspace-page">
      <div className="fc-home-landing-panel">
        <p className="fc-eyebrow">Navigator Access</p>
        <h1>Chart your legend.</h1>
        <p className="fc-home-landing-copy">
          {isSignedIn
            ? "You are signed in. Continue your journey through the Guild Hall, Commons, and career path."
            : "Sign in to enter the Guild Hall, join the Commons, and build career proof across your journey."}
        </p>
        <div className="fc-action-row">
          {isSignedIn ? (
            <Link className="fc-button" href="/dashboard">Enter Guild Hall</Link>
          ) : (
            <Link className="fc-button" href="/login">Sign In</Link>
          )}
          <Link className="fc-ghost-button" href="/jobs">Browse Jobs First</Link>
        </div>
        <p className="fc-home-landing-note">
          {isSignedIn
            ? "Welcome back, Traveler."
            : "Use Google sign-in or a free email magic link."}
        </p>
      </div>
    </section>
  );
}
