"use client";

import { useState } from "react";
import Link from "next/link";
import AtlasSky from "../atlas/AtlasSky";
import CommunicationHub from "./CommunicationHub";

const navigation = [
  {
    label: "Career",
    accent: "career",
    items: [
      { href: "/dashboard", label: "Navigator", icon: "N" },
      { href: "/portfolio", label: "Professional Folio", icon: "F" },
      { href: "/jobs", label: "Jobs", icon: "J" },
      { href: "/applications", label: "Applications", icon: "A" }
    ]
  },
  {
    label: "Community",
    accent: "community",
    items: [
      { href: "/network", label: "Network", icon: "N" },
      { href: "/groups", label: "Groups", icon: "G" },
      { href: "/messages", label: "Communication Hub", icon: "C" }
    ]
  },
  {
    label: "Adventure",
    accent: "adventure",
    items: [
      { href: "/adventures", label: "Challenges", icon: "C" },
      { href: "/assessments", label: "Assessments", icon: "A" },
      { href: "/competencies", label: "Competencies", icon: "S" }
    ]
  }
];

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
              <small>Navigate • Grow • Be remembered</small>
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
                  <span className="fc-nav-icon" aria-hidden="true">{item.icon}</span>
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
