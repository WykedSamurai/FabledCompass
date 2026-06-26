import Card from "../../components/ui/Card";
import PageHeader from "../../components/ui/PageHeader";

export default function DashboardPage() {
  return (
    <div className="fc-page-stack">
      <PageHeader
        eyebrow="Career Journey"
        title="Dashboard"
        description="A quiet workspace for direction, progress, and next steps."
      />

      <section className="fc-dashboard-grid">
        <Card eyebrow="Compass" title="Professional Compass">
          <div className="fc-compass-placeholder" aria-label="Professional Compass placeholder">
            <span>Leadership</span>
            <span>Communication</span>
            <span>Problem Solving</span>
            <span>Professionalism</span>
            <strong>◈</strong>
          </div>
        </Card>

        <Card eyebrow="Next Step" title="Continue Journey">
          <p className="fc-muted">Customer Recovery is ready to continue building evidence in your Portfolio.</p>
          <a className="fc-button" href="/adventures/difficult-customer">Begin Challenge</a>
        </Card>

        <Card eyebrow="Strength" title="Portfolio Strength">
          <p className="fc-score">—</p>
          <p className="fc-muted">Scoring will always explain what contributed to the result and what can improve it.</p>
        </Card>

        <Card eyebrow="Signal" title="Compass Suggestions">
          <p className="fc-muted">The Communication Hub will surface contextual coaching, messages, and OOC support here.</p>
        </Card>
      </section>
    </div>
  );
}
