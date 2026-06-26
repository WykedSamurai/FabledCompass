"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../utils/supabase/client";
import { extractResumeText } from "../../utils/resume/extractText";
import styles from "./profile-workspace.module.css";

type DocumentRecord = {
  id: number;
  file_path: string;
  file_name: string;
  display_name: string;
  mime_type: string | null;
  size_bytes: number | null;
  document_type: "resume" | "portfolio" | "other";
  is_active: boolean;
  uploaded_at: string;
};

type Props = {
  userId: string;
  refreshKey: number;
  onUse: (text: string, filePath: string) => void;
  onMessage: (message: string) => void;
};

function formatSize(bytes: number | null) {
  if (!bytes) return "Unknown size";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ResumeDocumentLibrary({ userId, refreshKey, onUse, onMessage }: Props) {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draftName, setDraftName] = useState("");

  async function loadDocuments() {
    if (!userId) return;
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("profile_documents")
      .select("id, file_path, file_name, display_name, mime_type, size_bytes, document_type, is_active, uploaded_at")
      .eq("user_id", userId)
      .order("uploaded_at", { ascending: false });

    if (error) onMessage(error.message);
    else setDocuments((data ?? []) as DocumentRecord[]);
    setLoading(false);
  }

  useEffect(() => {
    loadDocuments();
  }, [userId, refreshKey]);

  async function useDocument(document: DocumentRecord) {
    setBusyId(document.id);
    const supabase = createClient();
    const { data, error } = await supabase.storage.from("resumes").download(document.file_path);

    if (error || !data) {
      onMessage(error?.message ?? "The document could not be downloaded.");
      setBusyId(null);
      return;
    }

    try {
      const file = new File([data], document.file_name, { type: document.mime_type ?? data.type });
      const text = await extractResumeText(file);

      await supabase.from("profile_documents").update({ is_active: false }).eq("user_id", userId);
      const { error: activeError } = await supabase
        .from("profile_documents")
        .update({ is_active: true, updated_at: new Date().toISOString() })
        .eq("id", document.id)
        .eq("user_id", userId);

      if (activeError) throw activeError;
      onUse(text, document.file_path);
      onMessage(`${document.display_name} is now the active document. Review the autofilled fields before saving.`);
      await loadDocuments();
    } catch (error) {
      onMessage(error instanceof Error ? error.message : "The document could not be parsed.");
    }

    setBusyId(null);
  }

  async function saveRename(document: DocumentRecord) {
    const name = draftName.trim();
    if (!name) return;
    setBusyId(document.id);
    const supabase = createClient();
    const { error } = await supabase
      .from("profile_documents")
      .update({ display_name: name, updated_at: new Date().toISOString() })
      .eq("id", document.id)
      .eq("user_id", userId);

    if (error) onMessage(error.message);
    else {
      setEditingId(null);
      setDraftName("");
      onMessage("Document name updated.");
      await loadDocuments();
    }
    setBusyId(null);
  }

  async function deleteDocument(document: DocumentRecord) {
    if (!window.confirm(`Delete ${document.display_name}? This cannot be undone.`)) return;
    setBusyId(document.id);
    const supabase = createClient();
    const { error: storageError } = await supabase.storage.from("resumes").remove([document.file_path]);

    if (storageError) {
      onMessage(storageError.message);
      setBusyId(null);
      return;
    }

    const { error: recordError } = await supabase
      .from("profile_documents")
      .delete()
      .eq("id", document.id)
      .eq("user_id", userId);

    if (recordError) onMessage(recordError.message);
    else {
      onMessage("Document deleted.");
      await loadDocuments();
    }
    setBusyId(null);
  }

  if (loading) return <p className={styles.small}>Loading documents...</p>;
  if (documents.length === 0) return <p className={styles.small}>No uploaded documents yet.</p>;

  return (
    <div className={styles.documentList}>
      {documents.map((document) => (
        <article className={styles.documentItem} key={document.id}>
          <div className={styles.documentMain}>
            {editingId === document.id ? (
              <div className={styles.renameRow}>
                <input className={styles.input} value={draftName} onChange={(event) => setDraftName(event.target.value)} />
                <button className="button button-dark" type="button" disabled={busyId === document.id} onClick={() => saveRename(document)}>Save</button>
                <button className="button" type="button" onClick={() => setEditingId(null)}>Cancel</button>
              </div>
            ) : (
              <>
                <div className={styles.documentTitleRow}>
                  <strong>{document.display_name}</strong>
                  {document.is_active && <span className={styles.activePill}>Active</span>}
                </div>
                <p className={styles.small}>{document.file_name}</p>
                <p className={styles.small}>{formatSize(document.size_bytes)} · Uploaded {new Date(document.uploaded_at).toLocaleDateString()}</p>
              </>
            )}
          </div>

          {editingId !== document.id && (
            <div className={styles.documentActions}>
              <button className="button button-dark" type="button" disabled={busyId === document.id} onClick={() => useDocument(document)}>
                {busyId === document.id ? "Working..." : "Use"}
              </button>
              <button className="button" type="button" onClick={() => { setEditingId(document.id); setDraftName(document.display_name); }}>Rename</button>
              <button className={`${styles.dangerButton}`} type="button" disabled={busyId === document.id} onClick={() => deleteDocument(document)}>Delete</button>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
