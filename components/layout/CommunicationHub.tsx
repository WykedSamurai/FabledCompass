"use client";

import { useState } from "react";

export default function CommunicationHub() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="fc-comms-button" type="button" aria-label="Open Communications" onClick={() => setOpen(true)}>
        ◈
      </button>

      <div className={`fc-comms-scrim ${open ? "is-open" : ""}`} onClick={() => setOpen(false)} />

      <aside className={`fc-comms-drawer ${open ? "is-open" : ""}`} aria-label="Communication Hub" aria-hidden={!open}>
        <div className="fc-comms-header">
          <div>
            <p className="fc-eyebrow">Signal</p>
            <h2>Communications</h2>
          </div>
          <button className="fc-ghost-button" type="button" onClick={() => setOpen(false)}>Close</button>
        </div>

        <div className="fc-comms-tabs" role="tablist" aria-label="Communication sections">
          <button type="button">Chats</button>
          <button type="button">Friends</button>
          <button type="button">Compass</button>
        </div>

        <section className="fc-comms-panel">
          <p className="fc-eyebrow">Pinned</p>
          <article className="fc-conversation-card">
            <strong>Compass</strong>
            <span>Your career coach, portfolio guide, and OOC support.</span>
          </article>
        </section>

        <section className="fc-comms-panel">
          <p className="fc-eyebrow">Coming soon</p>
          <article className="fc-conversation-card muted">
            <strong>Friends, recruiters, guilds, and OOC chat</strong>
            <span>This drawer will become the permanent communication layer for Fabled Compass.</span>
          </article>
        </section>

        <form className="fc-comms-compose">
          <input placeholder="Ask Compass..." />
          <button type="button">Send</button>
        </form>
      </aside>
    </>
  );
}
