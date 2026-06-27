import ResumeDocumentLibrary from "./ResumeDocumentLibrary";
import ScenarioBadgeStrip from "./ScenarioBadgeStrip";
import UnifiedProfileWorkspace from "./UnifiedProfileWorkspace";

export default function ProfilePage() {
  return (
    <div className="fc-page-stack fc-workspace-page">
      <section className="fc-workspace-hero">
        <p className="fc-eyebrow">Navigator Profile</p>
        <h1>Professional Identity Workspace</h1>
        <p>Keep your identity, evidence, and visibility controls aligned with employer-facing goals.</p>
      </section>

      <section className="fc-portfolio-stack">
        <UnifiedProfileWorkspace />
        <ScenarioBadgeStrip />
        <ResumeDocumentLibrary />
      </section>
    </div>
  );
}
