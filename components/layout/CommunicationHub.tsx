"use client";

import { PointerEvent, useEffect, useRef, useState } from "react";

type Position = {
  x: number;
  y: number;
};

const BUTTON_SIZE = 54;
const EDGE_PADDING = 16;
const STORAGE_KEY = "fc-comms-button-position";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getDefaultPosition(): Position {
  if (typeof window === "undefined") {
    return { x: 0, y: 0 };
  }

  return {
    x: window.innerWidth - BUTTON_SIZE - EDGE_PADDING,
    y: window.innerHeight - BUTTON_SIZE - EDGE_PADDING
  };
}

function keepInViewport(position: Position): Position {
  if (typeof window === "undefined") return position;

  return {
    x: clamp(position.x, EDGE_PADDING, window.innerWidth - BUTTON_SIZE - EDGE_PADDING),
    y: clamp(position.y, EDGE_PADDING, window.innerHeight - BUTTON_SIZE - EDGE_PADDING)
  };
}

export default function CommunicationHub() {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);
  const dragState = useRef({ dragging: false, moved: false, offsetX: 0, offsetY: 0 });

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setPosition(keepInViewport(JSON.parse(saved) as Position));
        return;
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }

    setPosition(getDefaultPosition());
  }, []);

  useEffect(() => {
    function handleResize() {
      setPosition((current) => current ? keepInViewport(current) : getDefaultPosition());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function startDrag(event: PointerEvent<HTMLButtonElement>) {
    if (!position) return;

    dragState.current = {
      dragging: true,
      moved: false,
      offsetX: event.clientX - position.x,
      offsetY: event.clientY - position.y
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveDrag(event: PointerEvent<HTMLButtonElement>) {
    if (!dragState.current.dragging) return;

    const nextPosition = keepInViewport({
      x: event.clientX - dragState.current.offsetX,
      y: event.clientY - dragState.current.offsetY
    });

    if (position && (Math.abs(nextPosition.x - position.x) > 3 || Math.abs(nextPosition.y - position.y) > 3)) {
      dragState.current.moved = true;
    }

    setPosition(nextPosition);
  }

  function endDrag(event: PointerEvent<HTMLButtonElement>) {
    if (!dragState.current.dragging) return;

    dragState.current.dragging = false;
    event.currentTarget.releasePointerCapture(event.pointerId);

    setPosition((current) => {
      const nextPosition = current ? keepInViewport(current) : getDefaultPosition();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPosition));
      return nextPosition;
    });
  }

  function openHub() {
    if (dragState.current.moved) {
      dragState.current.moved = false;
      return;
    }

    setOpen(true);
  }

  const buttonStyle = position
    ? { left: `${position.x}px`, top: `${position.y}px` }
    : undefined;

  return (
    <>
      <button
        className="fc-comms-button"
        style={buttonStyle}
        type="button"
        aria-label="Open Communications"
        title="Drag to move. Click to open Communications."
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClick={openHub}
      >
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
