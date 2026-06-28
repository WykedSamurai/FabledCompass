"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";
import AtlasSky from "../atlas/AtlasSky";
import CommunicationHub from "./CommunicationHub";
import SiteFooter from "./SiteFooter";

type NavIcon = "compass" | "folio" | "jobs" | "applications" | "recruiters" | "commons" | "network" | "groups" | "messages" | "challenges" | "assessments" | "competencies";
type NavItem = { href: string; label: string; icon: NavIcon };
type NavGroup = { label: string; accent: "career" | "community" | "adventure"; items: NavItem[] };

const navigation = [
  {
    label: "Journey",
    accent: "career",
    items: [
      { href: "/dashboard", label: "Compass", icon: "compass" },
      { href: "/portfolio", label: "Chronicle", icon: "folio" },
      { href: "/jobs", label: "Quest Board", icon: "jobs" },
      { href: "/applications", label: "Quest Log", icon: "applications" }
    ]
  },
  {
    label: "Allies",
    accent: "community",
    items: [
      { href: "/recruiters", label: "Recruiters", icon: "recruiters" },
      { href: "/commons", label: "The Commons", icon: "commons" },
      { href: "/network", label: "Alliance Web", icon: "network" },
      { href: "/groups", label: "Guilds", icon: "groups" },
      { href: "/messages", label: "Signal Hub", icon: "messages" }
    ]
  },
  {
    label: "Trials",
    accent: "adventure",
    items: [
      { href: "/adventures", label: "Questline", icon: "challenges" },
      { href: "/assessments", label: "Trial Grounds", icon: "assessments" },
      { href: "/competencies", label: "Skill Tree", icon: "competencies" }
    ]
  }
] satisfies NavGroup[];

function NavGlyph({ icon }: { icon: NavIcon }) {
  const glyphs: Record<NavIcon, ReactNode> = {
    compass: (
      <>
        <circle cx="12" cy="12" r="7" />
        <path d="M14.8 9.2 13 13l-3.8 1.8L11 11z" />
      </>
    ),
    folio: (
      <>
        <path d="M6.5 5.5h8a2 2 0 0 1 2 2v9H8.2a1.7 1.7 0 0 0-1.7 1.7V7.5a2 2 0 0 1 2-2Z" />
        <path d="M8.2 16.5h9.3" />
      </>
    ),
    jobs: (
      <>
        <rect x="4.8" y="7" width="14.4" height="10" rx="2" />
        <path d="M9 7V5.8A1.8 1.8 0 0 1 10.8 4h2.4A1.8 1.8 0 0 1 15 5.8V7" />
      </>
    ),
    applications: (
      <>
        <path d="M8 4.8h6.8l3 3V19H8z" />
        <path d="M14.8 4.8V8h3" />
        <path d="m10 13 1.7 1.7L15.5 11" />
      </>
    ),
    recruiters: (
      <>
        <circle cx="12" cy="8" r="2.4" />
        <path d="M8 18c.6-2.3 2.2-3.8 4-3.8s3.4 1.5 4 3.8" />
        <path d="M17.8 8.8 19.2 10l1.9-2.4" />
      </>
    ),
    commons: (
      <>
        <path d="M12 4.5c1.4 2 2.6 3.9 2.6 5.7A2.6 2.6 0 0 1 12 12.8a2.6 2.6 0 0 1-2.6-2.6c0-1.8 1.2-3.7 2.6-5.7Z" />
        <path d="M7.2 16.8c1.2-1.6 2.9-2.4 4.8-2.4s3.6.8 4.8 2.4" />
        <path d="M6.3 19h11.4" />
      </>
    ),
    network: (
      <>
        <circle cx="12" cy="6.6" r="2.2" />
        <circle cx="7" cy="15.2" r="2.2" />
        <circle cx="17" cy="15.2" r="2.2" />
        <path d="M10.8 8.4 8.2 13" />
        <path d="m13.2 8.4 2.6 4.6" />
      </>
    ),
    groups: (
      <>
        <circle cx="8.3" cy="9" r="2.4" />
        <circle cx="15.7" cy="9" r="2.4" />
        <path d="M4.8 17c.5-2 2-3.2 3.5-3.2S11.3 15 11.8 17" />
        <path d="M12.2 17c.5-2 2-3.2 3.5-3.2s3 1.2 3.5 3.2" />
      </>
    ),
    messages: (
      <>
        <path d="M5.2 6.2h13.6v8.2H13l-3.5 3v-3H5.2z" />
        <path d="M8 9.8h8" />
      </>
    ),
    challenges: (
      <>
        <path d="M12 4.5 6.2 6.8v4.6c0 3.3 2.2 6.3 5.8 8.1 3.6-1.8 5.8-4.8 5.8-8.1V6.8Z" />
        <path d="m10.1 11.7 1.4 1.4 2.5-2.5" />
      </>
    ),
    assessments: (
      <>
        <path d="M6 6h12" />
        <path d="M6 11h8" />
        <path d="M6 16h6" />
        <circle cx="16.5" cy="16.5" r="2.2" />
      </>
    ),
    competencies: (
      <>
        <path d="m12 4.8 2 4.1 4.5.6-3.2 3.1.8 4.6-4.1-2.2-4.1 2.2.8-4.6-3.2-3.1 4.5-.6z" />
      </>
    )
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {glyphs[icon]}
    </svg>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`fc-shell ${collapsed ? "is-sidebar-collapsed" : ""}`} data-journey="career">
      <AtlasSky />

      <aside className="fc-sidebar" aria-label="Fabled Compass navigation">
        <div className="fc-sidebar-top">
          <Link className="fc-brand" href="/dashboard">
            <span className="fc-brand-mark" aria-hidden="true">◈</span>
            <span className="fc-brand-text">
              <strong>Fabled Compass</strong>
              <small>Chart your path • Gather proof • Become legend</small>
            </span>
          </Link>

          <button
            className="fc-sidebar-toggle"
            type="button"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setCollapsed((current) => !current)}
          >
            {collapsed ? "›" : "‹"}
          </button>
        </div>

        <nav className="fc-nav" aria-label="Main navigation">
          {navigation.map((group) => (
            <section className="fc-nav-group" data-accent={group.accent} key={group.label}>
              <p>{group.label}</p>
              {group.items.map((item) => (
                <Link className="fc-nav-link" href={item.href} key={item.href} title={item.label}>
                  <span className="fc-nav-icon" aria-hidden="true"><NavGlyph icon={item.icon} /></span>
                  <span className="fc-nav-label">{item.label}</span>
                </Link>
              ))}
            </section>
          ))}
        </nav>
      </aside>

      <div className="fc-workspace">
        <header className="fc-topbar">
          <label className="fc-search">
            <span>Search</span>
            <input placeholder="Search the realm" />
          </label>
          <div className="fc-top-actions">
            <Link href="/account">Guild Hall</Link>
          </div>
        </header>

        <main className="fc-content">{children}</main>
        <SiteFooter />
      </div>

      <CommunicationHub />
    </div>
  );
}
