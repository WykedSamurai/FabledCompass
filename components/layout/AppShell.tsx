import Link from "next/link";
import CommunicationHub from "./CommunicationHub";

const navigation = [
  {
    label: "Career",
    accent: "career",
    items: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/portfolio", label: "Portfolio" },
      { href: "/jobs", label: "Jobs" },
      { href: "/applications", label: "Applications" }
    ]
  },
  {
    label: "Community",
    accent: "community",
    items: [
      { href: "/network", label: "Network" },
      { href: "/groups", label: "Groups" },
      { href: "/messages", label: "Messages" }
    ]
  },
  {
    label: "Adventure",
    accent: "adventure",
    items: [
      { href: "/adventures", label: "Challenges" },
      { href: "/assessments", label: "Assessments" },
      { href: "/competencies", label: "Competencies" }
    ]
  }
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="fc-shell" data-journey="career">
      <aside className="fc-sidebar" aria-label="Fabled Compass navigation">
        <Link className="fc-brand" href="/dashboard">
          <span className="fc-brand-mark" aria-hidden="true">◈</span>
          <span>
            <strong>Fabled Compass</strong>
            <small>Navigate. Grow. Be remembered.</small>
          </span>
        </Link>

        <nav className="fc-nav">
          {navigation.map((group) => (
            <section className="fc-nav-group" data-accent={group.accent} key={group.label}>
              <p>{group.label}</p>
              {group.items.map((item) => (
                <Link className="fc-nav-link" href={item.href} key={item.href}>{item.label}</Link>
              ))}
            </section>
          ))}
        </nav>
      </aside>

      <div className="fc-workspace">
        <header className="fc-topbar">
          <label className="fc-search">
            <span>Search</span>
            <input placeholder="Search Fabled Compass" />
          </label>
          <div className="fc-top-actions">
            <Link href="/account">Navigator Center</Link>
          </div>
        </header>

        <main className="fc-content">{children}</main>
      </div>

      <CommunicationHub />
    </div>
  );
}
