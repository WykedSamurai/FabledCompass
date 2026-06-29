"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PrototypeWatermark from "../../components/layout/PrototypeWatermark";
import { createClient } from "../../utils/supabase/client";
import { isHumanVerified } from "../../utils/account/types";
import { formatCommunityGuardrail } from "../../utils/community/guardrails";

type ParticipantRow = {
  thread_id: string;
  user_id: string;
};

type MessageRow = {
  id: number;
  thread_id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

type ProfileRow = {
  id: string;
  display_name: string | null;
};

type DirectMessageThread = {
  id: string;
  name: string;
  context: string;
  when: string;
  participants: string[];
  messages: Array<{
    id: string;
    senderId: string;
    senderName: string;
    body: string;
    createdAt: string;
  }>;
};

type MessagesClientProps = {
  initialQuery: {
    targetUserId?: string;
    targetName?: string;
    candidateId?: string;
    candidateName?: string;
    intent?: string;
  };
};

function relativeTimeLabel(timestamp: string): string {
  const deltaMs = Date.now() - new Date(timestamp).getTime();
  const deltaMinutes = Math.max(0, Math.floor(deltaMs / 60000));
  if (deltaMinutes < 1) {
    return "Now";
  }
  if (deltaMinutes < 60) {
    return `${deltaMinutes}m`;
  }
  const deltaHours = Math.floor(deltaMinutes / 60);
  if (deltaHours < 24) {
    return `${deltaHours}h`;
  }
  return `${Math.floor(deltaHours / 24)}d`;
}

export default function MessagesClient({ initialQuery }: MessagesClientProps) {
  const router = useRouter();
  const targetUserId = initialQuery.targetUserId || initialQuery.candidateId;
  const targetName = initialQuery.targetName || initialQuery.candidateName;
  const intent = initialQuery.intent;

  const [userId, setUserId] = useState("");
  const [verified, setVerified] = useState(false);
  const [threads, setThreads] = useState<DirectMessageThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState("");
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState("Loading Signal Hub...");

  const activeThread = useMemo(
    () => threads.find((thread) => thread.id === activeThreadId) ?? threads[0] ?? null,
    [activeThreadId, threads]
  );

  async function loadThreadsForUser(currentUserId: string, preferredThreadId?: string): Promise<void> {
    const supabase = createClient();

    const { data: myParticipants, error: myParticipantsError } = await supabase
      .from("direct_message_participants")
      .select("thread_id, user_id")
      .eq("user_id", currentUserId);

    if (myParticipantsError) {
      setStatus(formatCommunityGuardrail(myParticipantsError.message));
      setThreads([]);
      return;
    }

    const ownRows = (myParticipants ?? []) as ParticipantRow[];
    const threadIds = ownRows.map((row) => row.thread_id);
    if (threadIds.length === 0) {
      setThreads([]);
      setActiveThreadId("");
      setStatus("No direct conversations yet.");
      return;
    }

    const [allParticipantsResult, messagesResult] = await Promise.all([
      supabase
        .from("direct_message_participants")
        .select("thread_id, user_id")
        .in("thread_id", threadIds),
      supabase
        .from("direct_message_messages")
        .select("id, thread_id, sender_id, body, created_at")
        .in("thread_id", threadIds)
        .order("created_at", { ascending: true })
        .limit(1000)
    ]);

    if (allParticipantsResult.error) {
      setStatus(formatCommunityGuardrail(allParticipantsResult.error.message));
      setThreads([]);
      return;
    }

    if (messagesResult.error) {
      setStatus(formatCommunityGuardrail(messagesResult.error.message));
      setThreads([]);
      return;
    }

    const participantRows = (allParticipantsResult.data ?? []) as ParticipantRow[];
    const messageRows = (messagesResult.data ?? []) as MessageRow[];
    const participantIds = Array.from(new Set(participantRows.map((row) => row.user_id)));

    const profileLookup = new Map<string, string>();
    if (participantIds.length > 0) {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, display_name")
        .in("id", participantIds);

      for (const profile of (profileData ?? []) as ProfileRow[]) {
        profileLookup.set(profile.id, profile.display_name || `Member ${profile.id.slice(0, 8)}`);
      }
    }

    const threadsMap = new Map<string, DirectMessageThread>();
    for (const threadId of threadIds) {
      const threadParticipants = participantRows.filter((row) => row.thread_id === threadId);
      const counterpart = threadParticipants.find((row) => row.user_id !== currentUserId);
      const fallbackName = counterpart?.user_id === targetUserId && targetName ? targetName : "Direct Message";
      const counterpartName = counterpart ? profileLookup.get(counterpart.user_id) || fallbackName : "Direct Message";
      threadsMap.set(threadId, {
        id: threadId,
        name: counterpartName,
        context: counterpart ? `Conversation with ${counterpartName}` : "Personal thread",
        when: "Now",
        participants: threadParticipants.map((row) => row.user_id),
        messages: []
      });
    }

    for (const row of messageRows) {
      const thread = threadsMap.get(row.thread_id);
      if (!thread) {
        continue;
      }
      thread.messages.push({
        id: String(row.id),
        senderId: row.sender_id,
        senderName: profileLookup.get(row.sender_id) || (row.sender_id === currentUserId ? "You" : `Member ${row.sender_id.slice(0, 8)}`),
        body: row.body,
        createdAt: row.created_at
      });
      thread.when = relativeTimeLabel(row.created_at);
    }

    const nextThreads = Array.from(threadsMap.values()).sort((first, second) => {
      const firstLast = first.messages[first.messages.length - 1]?.createdAt ?? "1970-01-01T00:00:00.000Z";
      const secondLast = second.messages[second.messages.length - 1]?.createdAt ?? "1970-01-01T00:00:00.000Z";
      return secondLast.localeCompare(firstLast);
    });

    setThreads(nextThreads);
    setActiveThreadId(preferredThreadId && nextThreads.some((thread) => thread.id === preferredThreadId) ? preferredThreadId : nextThreads[0]?.id || "");
    setStatus("");
  }

  useEffect(() => {
    async function initializeMessages() {
      const supabase = createClient();
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        router.replace("/login?next=/messages");
        return;
      }

      setUserId(authData.user.id);
      const isVerified = isHumanVerified(authData.user.user_metadata.human_verification_status);
      setVerified(isVerified);
      if (!isVerified) {
        setStatus("Only verified people can use direct messages. Verify your account in Navigator Center.");
        return;
      }

      let preferredThreadId: string | undefined;
      if (targetUserId && targetUserId !== authData.user.id) {
        const { data: threadId, error } = await supabase.rpc("create_or_get_direct_thread", {
          target_user_id: targetUserId
        });

        if (error) {
          setStatus(formatCommunityGuardrail(error.message));
        } else if (typeof threadId === "string") {
          preferredThreadId = threadId;
        }
      }

      await loadThreadsForUser(authData.user.id, preferredThreadId);
    }

    void initializeMessages();
  }, [router, targetName, targetUserId]);

  async function sendMessage(event: FormEvent): Promise<void> {
    event.preventDefault();
    if (!activeThread || !verified || !userId) {
      return;
    }
    const body = draft.trim();
    if (!body) {
      return;
    }

    const supabase = createClient();
    const { error } = await supabase
      .from("direct_message_messages")
      .insert({
        thread_id: activeThread.id,
        sender_id: userId,
        body
      });

    if (error) {
      setStatus(formatCommunityGuardrail(error.message));
      return;
    }

    setDraft("");
    await loadThreadsForUser(userId, activeThread.id);
  }

  const composePlaceholder = !activeThread
    ? "Choose a conversation..."
    : intent === "invite"
      ? `Invite ${activeThread.name} to collaborate...`
      : `Message ${activeThread.name}...`;

  return (
    <div className="fc-page-stack fc-workspace-page fc-prototype-frame">
      <PrototypeWatermark />
      <section className="fc-workspace-hero">
        <p className="fc-eyebrow">Signal Hub</p>
        <h1>Signal Raven</h1>
        <p>Verified direct messaging for recruiters, candidates, and allies.</p>
      </section>

      <section className="fc-network-grid">
        <div className="fc-page-stack">
          <article className="fc-card">
            <div className="fc-comms-tabs" role="tablist" aria-label="Signal sections">
              <button type="button">All</button>
              <button type="button">Recruiters</button>
              <button type="button">Groups</button>
              <button type="button">Guide</button>
            </div>

            {status && <p className="form-message">{status}</p>}
            <div className="fc-thread-list">
              {threads.map((thread) => (
                <button
                  className="fc-thread-item"
                  key={thread.id}
                  type="button"
                  onClick={() => setActiveThreadId(thread.id)}
                >
                  <div>
                    <strong>{thread.name}</strong>
                    <p>{thread.context}</p>
                    <span>{thread.messages[thread.messages.length - 1]?.body || "Start this conversation."}</span>
                  </div>
                  <small>{thread.when}</small>
                </button>
              ))}
            </div>
          </article>

          <article className="fc-card">
            <div className="fc-card-header-row">
              <h2>{activeThread ? activeThread.name : "Signal Thread"}</h2>
              <span className="fc-status-pill">{verified ? "Verified" : "Verification Needed"}</span>
            </div>
            <div className="fc-chat-log">
              {activeThread?.messages.length ? (
                activeThread.messages.map((entry) => (
                  <p key={entry.id}>
                    <strong>{entry.senderName}:</strong> {entry.body}
                  </p>
                ))
              ) : (
                <p>No messages yet.</p>
              )}
            </div>
            <form className="fc-comms-compose" onSubmit={(event) => void sendMessage(event)}>
              <input
                placeholder={composePlaceholder}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                disabled={!verified || !activeThread}
              />
              <button type="submit" disabled={!verified || !activeThread}>Send</button>
            </form>
          </article>
        </div>

        <aside className="fc-card fc-side-card">
          <p className="fc-eyebrow">Next Actions</p>
          <ul className="fc-guidance-list">
            <li>Keep messages evidence-based and role relevant.</li>
            <li>Follow up within one business day.</li>
            <li>Use invite threads to move to room collaboration.</li>
          </ul>
        </aside>
      </section>
    </div>
  );
}
