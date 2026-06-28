 "use client";

import { useMemo, useState } from "react";
import PrototypeWatermark from "../../components/layout/PrototypeWatermark";

type RoomMessage = {
  id: string;
  sender: string;
  text: string;
  when: string;
};

type Room = {
  id: string;
  name: string;
  focus: string;
  members: number;
  cadence: string;
  joined: boolean;
  messages: RoomMessage[];
};

const initialRooms: Room[] = [
  {
    id: "customer-experience-circle",
    name: "Customer Experience Circle",
    focus: "Communication, empathy, escalation",
    members: 42,
    cadence: "Weekly debrief",
    joined: true,
    messages: [
      { id: "m1", sender: "Facilitator", text: "Welcome back. Share one service recovery win this week.", when: "Now" },
      { id: "m2", sender: "Lina", text: "I used de-escalation framing and turned around a difficult call.", when: "8m" }
    ]
  },
  {
    id: "career-transitions-network",
    name: "Career Transitions Network",
    focus: "Role changes and growth planning",
    members: 58,
    cadence: "Twice monthly",
    joined: false,
    messages: [{ id: "m1", sender: "Host", text: "Share one role transition goal for the next quarter.", when: "13m" }]
  },
  {
    id: "leadership-signals-lab",
    name: "Leadership Signals Lab",
    focus: "Coaching and professionalism evidence",
    members: 34,
    cadence: "Weekly practice",
    joined: false,
    messages: [{ id: "m1", sender: "Coach", text: "This week: post a leadership story with measurable outcomes.", when: "25m" }]
  }
];

function makeRoomId(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "new-room";
}

export default function GroupsPage() {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [activeRoomId, setActiveRoomId] = useState(initialRooms[0].id);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomFocus, setNewRoomFocus] = useState("");
  const [draftMessage, setDraftMessage] = useState("");

  const activeRoom = useMemo(
    () => rooms.find((room) => room.id === activeRoomId) ?? rooms[0] ?? null,
    [activeRoomId, rooms]
  );

  const joinedCount = useMemo(
    () => rooms.filter((room) => room.joined).length,
    [rooms]
  );

  function joinRoom(roomId: string): void {
    setRooms((current) =>
      current.map((room) =>
        room.id === roomId && !room.joined
          ? { ...room, joined: true, members: room.members + 1 }
          : room
      )
    );
  }

  function createRoom(): void {
    const name = newRoomName.trim();
    const focus = newRoomFocus.trim();
    if (!name || !focus) {
      return;
    }

    const roomId = makeRoomId(name);
    setRooms((current) => {
      if (current.some((room) => room.id === roomId)) {
        return current;
      }
      return [
        {
          id: roomId,
          name,
          focus,
          members: 1,
          cadence: "Open discussion",
          joined: true,
          messages: [{ id: "m1", sender: "System", text: "Room created. Introduce your goals and invite peers.", when: "Now" }]
        },
        ...current
      ];
    });
    setActiveRoomId(roomId);
    setNewRoomName("");
    setNewRoomFocus("");
  }

  function sendMessage(): void {
    const text = draftMessage.trim();
    if (!text || !activeRoom) {
      return;
    }

    setRooms((current) =>
      current.map((room) =>
        room.id === activeRoom.id
          ? {
              ...room,
              messages: [
                ...room.messages,
                {
                  id: `m${room.messages.length + 1}`,
                  sender: "You",
                  text,
                  when: "Now"
                }
              ]
            }
          : room
      )
    );
    setDraftMessage("");
  }

  return (
    <div className="fc-page-stack fc-workspace-page fc-prototype-frame">
      <PrototypeWatermark />
      <section className="fc-workspace-hero">
        <p className="fc-eyebrow">Alliance Journey</p>
        <h1>Guild Chatrooms</h1>
        <p>Create rooms, join professional circles, and message collaborators in one workspace.</p>
      </section>

      <section className="fc-workspace-grid">
        <div className="fc-group-grid">
          <article className="fc-card">
            <div className="fc-card-header-row">
              <div>
                <p className="fc-eyebrow">Create Chatroom</p>
                <h2>Start a new room</h2>
              </div>
              <span className="fc-status-pill">{joinedCount} joined</span>
            </div>
            <div className="fc-auth-form fc-recruiter-filter-grid">
              <label>
                Room name
                <input
                  type="text"
                  value={newRoomName}
                  placeholder="Ex: Interview Prep Circle"
                  onChange={(event) => setNewRoomName(event.target.value)}
                />
              </label>
              <label>
                Focus
                <input
                  type="text"
                  value={newRoomFocus}
                  placeholder="Ex: Mock interview feedback"
                  onChange={(event) => setNewRoomFocus(event.target.value)}
                />
              </label>
            </div>
            <div className="fc-action-row">
              <button className="fc-button" type="button" onClick={createRoom}>
                Create Room
              </button>
            </div>
          </article>

          {rooms.map((room) => (
            <article className="fc-card" key={room.id}>
              <div className="fc-card-header-row">
                <h2>{room.name}</h2>
                <span className="fc-status-pill">{room.joined ? "Joined" : "Suggested"}</span>
              </div>
              <p className="fc-muted">{room.focus}</p>
              <p>{room.members} members • {room.cadence}</p>
              <div className="fc-action-row">
                {!room.joined && (
                  <button className="fc-button" type="button" onClick={() => joinRoom(room.id)}>
                    Join Room
                  </button>
                )}
                <button className="fc-button" type="button" onClick={() => setActiveRoomId(room.id)}>
                  Open Room
                </button>
              </div>
            </article>
          ))}
        </div>

        <aside className="fc-card fc-side-card">
          {!activeRoom ? (
            <>
              <p className="fc-eyebrow">Room Chat</p>
              <p className="fc-muted">Create or join a room to begin chatting.</p>
            </>
          ) : (
            <>
              <p className="fc-eyebrow">Room Chat</p>
              <h2>{activeRoom.name}</h2>
              <p className="fc-muted">{activeRoom.focus}</p>

              <div className="fc-chat-log">
                {activeRoom.messages.map((message) => (
                  <p key={`${activeRoom.id}-${message.id}`}>
                    <strong>{message.sender}:</strong> {message.text}
                  </p>
                ))}
              </div>

              <form
                className="fc-comms-compose"
                onSubmit={(event) => {
                  event.preventDefault();
                  sendMessage();
                }}
              >
                <input
                  value={draftMessage}
                  placeholder={`Message ${activeRoom.name}...`}
                  onChange={(event) => setDraftMessage(event.target.value)}
                />
                <button type="submit">Send</button>
              </form>
            </>
          )}
        </aside>
      </section>
    </div>
  );
}
