import ResumeDocumentLibrary from "../profile/ResumeDocumentLibrary";
import ScenarioBadgeStrip from "../profile/ScenarioBadgeStrip";
import UnifiedProfileWorkspace from "../profile/UnifiedProfileWorkspace";

export default function ProfessionalFolioPage() {
  return (
    <div className="fc-page-stack fc-workspace-page">
      <section className="fc-workspace-hero">
        <p className="fc-eyebrow">Professional Folio</p>
        <h1>Evidence-Centered Portfolio</h1>
        <p>Your Folio should explain what your scores mean and what actions improve them next.</p>
      </section>

      <section className="fc-workspace-grid">
        <article className="fc-card">
          <h2>How Portfolio Strength is calculated</h2>
          <p className="fc-muted">Portfolio Strength rises as you complete identity, story, competency, experience, education, and resume evidence fields. Scenario outcomes and badges add demonstrated proof.</p>
        </article>
        <article className="fc-card fc-side-card">
          <p className="fc-eyebrow">Next Actions</p>
          <ul className="fc-guidance-list">
            <li>Complete missing Folio fields.</li>
            <li>Finish an Adventure to add verified evidence.</li>
            <li>Set privacy visibility before sharing with employers.</li>
          </ul>
        </article>
      </section>

      <section className="fc-portfolio-stack">
      <UnifiedProfileWorkspace />
      <ScenarioBadgeStrip />
      <ResumeDocumentLibrary />
      </section>
    </div>
  );
}
