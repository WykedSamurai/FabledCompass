import { AtlasCard, AtlasHeader } from "../../components/atlas";

export default function DashboardPage() {
  return (
    <div className="fc-page-stack">
      <div className="fc-page-header">
        <p className="fc-eyebrow">Career Journey</p>
        <h1>Navigator</h1>
        <p>Review your direction, progress, and next steps.</p>
      </div>

      <section className="fc-dashboard-grid">
        <AtlasCard>
          <AtlasHeader eyebrow="Compass" title="Professional Compass" />
          <div className="fc-compass-placeholder" aria-label="Professional Compass placeholder">
            <span>Leadership</span>
            <span>Communication</span>
            <span>Problem Solving</span>
            <span>Professionalism</span>
            <strong>◈</strong>
          </div>
        </AtlasCard>

        <AtlasCard>
          <AtlasHeader eyebrow="Next Step" title="Continue Journey" />
          <p className="fc-muted">Customer Recovery is ready to continue building evidence in your Professional Folio.</p>
          <a className="fc-button" href="/adventures/difficult-customer">Begin Challenge</a>
        </AtlasCard>

        <AtlasCard>
          <AtlasHeader eyebrow="Folio" title="Portfolio Strength" />
          <p className="fc-score">—</p>
          <p className="fc-muted">Scoring will explain what contributed to the result and what can improve it.</p>
        </AtlasCard>

        <AtlasCard>
          <AtlasHeader eyebrow="Signal" title="Compass Suggestions" />
          <p className="fc-muted">The Communication Hub will surface contextual coaching, messages, and OOC support here.</p>
        </AtlasCard>
      </section>
    </div>
  );
}
