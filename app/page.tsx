import Link from "next/link";
import { createClient } from "../utils/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const isSignedIn = Boolean(authData.user);

  if (!isSignedIn) {
    return (
      <div className="fc-page-stack fc-workspace-page fc-auth-atmosphere">
        <section className="fc-workspace-hero">
          <p className="fc-eyebrow">Navigator Access</p>
          <h1>Chart your legend.</h1>
          <p>Sign in to enter the Guild Hall, join the Commons, and build career proof across your journey.</p>
        </section>

        <section>
          <article className="fc-card fc-auth-panel fc-auth-card">
            <div className="fc-action-row">
              <Link className="fc-button" href="/login">Sign In</Link>
              <Link className="fc-ghost-button" href="/jobs">Browse Jobs First</Link>
            </div>
            <p className="fc-muted">Use Google sign-in or a free email magic link.</p>
          </article>
        </section>
      </div>
    );
  }

  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">Careers · Adventures · Growth</p>
          <h1>Find your path. Prove what you can do.</h1>
          <p className="hero-copy">
            Fabled Compass combines a practical job board with interactive workplace adventures that help people practice real decisions, receive useful feedback, and earn evidence-based badges.
          </p>
          <div className="actions">
            <Link className="button button-primary" href="/adventures">Begin an Adventure</Link>
            <Link className="button button-secondary" href="/jobs">Explore Jobs</Link>
          </div>
        </div>
        <aside className="compass-card" aria-label="Fabled Compass overview">
          <div className="compass-symbol">✦</div>
          <h3>Every career has a story.</h3>
          <p>Build a profile that shows more than claims. Demonstrate communication, judgment, empathy, and professionalism through guided scenarios.</p>
        </aside>
      </section>

      <section className="section section-narrow">
        <div className="section-heading">
          <p className="eyebrow">The Journey</p>
          <h2>One platform, three connected paths</h2>
          <p className="muted">Professional usefulness comes first. Adventure gives the experience structure, meaning, and momentum.</p>
        </div>
        <div className="grid-3">
          <article className="card card-accent">
            <div className="card-icon">⌕</div>
            <h3>Careers</h3>
            <p>Discover opportunities, review employers, and build a profile around real experience and demonstrated strengths.</p>
          </article>
          <article className="card card-accent">
            <div className="card-icon">✦</div>
            <h3>Adventures</h3>
            <p>Roleplay through workplace situations, make decisions, and receive clear feedback tied to observable behavior.</p>
          </article>
          <article className="card card-accent">
            <div className="card-icon">◎</div>
            <h3>Recognition</h3>
            <p>Earn badges with documented criteria and display what each scenario actually assessed.</p>
          </article>
        </div>
      </section>
    </>
  );
}
