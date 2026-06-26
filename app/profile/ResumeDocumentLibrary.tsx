"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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

function formatSize(bytes: number | null) {
  if (!bytes) return "Unknown size";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function extractFields(text: string) {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const section = (heading: string, nextHeadings: string[]) => {
    const pattern = new RegExp(`${heading}\\s*[:\\n]([\\s\\S]*?)(?=${nextHeadings.join("|")}|$)`, "i");
    return text.match(pattern)?.[1]?.trim() ?? "";
  };

  return {
    display_name: lines[0] && lines[0].length < 80 ? lines[0] : undefined,
    email_public: text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0],
    phone: text.match(/(?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/)?.[0],
    linkedin_url: text.match(/https?:\/\/(?:www\.)?linkedin\.com\/[^\s]+/i)?.[0],
    website: text.match(/https?:\/\/(?![^\s]*linkedin\.com)[^\s]+/i)?.[0],
    skills: section("skills", ["experience", "employment", "education", "projects", "certifications"]),
    experience: section("(?:experience|employment)", ["education", "skills", "projects", "certifications"]),
    education: section("education", ["skills", "experience", "employment", "projects", "certifications"]),
    resume_text: text
  };
}

export default function ResumeDocumentLibrary() {
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [userId, setUserId] = useState("");
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draftName, setDraftName] = useState("");

  async function loadDocuments(id = userId) {
    if (!id) return;
    setLoading(true);
    const supabase = createClient();

    const { data: storedFiles } = await supabase.storage.from("resumes").list(id, {
      limit: 100,
      sortBy: { column: "created_at", order: "desc" }
    });

    const { data: existing } = await supabase
      .from("profile_documents")
      .select("file_path")
      .eq("user_id", id);

    const knownPaths = new Set((existing ?? []).map((item) => item.file_path));
    const missing = (storedFiles ?? [])
      .filter((file) => !knownPaths.has(`${id}/${file.name}`))
      .map((file) => ({
        user_id: id,
        file_path: `${id}/${file.name}`,
        file_name: file.name,
        display_name: file.name.replace(/^\d+-/, ""),
        mime_type: file.metadata?.mimetype ?? null,
        size_bytes: file.metadata?.size ?? null,
        document_type: "resume"
      }));

    if (missing.length) await supabase.from("profile_documents").insert(missing);

    const { data, error } = await supabase
      .from("profile_documents")
      .select("id, file_path, file_name, display_name, mime_type, size_bytes, document_type, is_active, uploaded_at")
      .eq("user_id", id)
      .order("uploaded_at", { ascending: false });

    if (error) setMessage(error.message);
    else setDocuments((data ?? []) as DocumentRecord[]);
    setLoading(false);
  }

  useEffect(() => {
    const uploadBox = document.querySelector(`.${styles.uploadBox}`);
    setTarget(uploadBox?.parentElement ?? null);

    async function start() {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;
      setUserId(data.user.id);
      await loadDocuments(data.user.id);
    }
    start();
  }, []);

  async function useDocument(document: DocumentRecord) {
    setBusyId(document.id);
    setMessage("Reading document...");
    const supabase = createClient();
    const { data, error } = await supabase.storage.from("resumes").download(document.file_path);

    if (error || !data) {
      setMessage(error?.message ?? "The document could not be downloaded.");
      setBusyId(null);
      return;
    }

    try {
      const file = new File([data], document.file_name, { type: document.mime_type ?? data.type });
      const text = await extractResumeText(file);
      const fields = extractFields(text);
      const cleanFields = Object.fromEntries(Object.entries(fields).filter(([, value]) => value));

      await supabase.from("profile_documents").update({ is_active: false }).eq("user_id", userId);
      await supabase.from("profile_documents").update({ is_active: true }).eq("id", document.id).eq("user_id", userId);
      const { error: profileError } = await supabase.from("profiles").update({
        ...cleanFields,
        resume_file_path: document.file_path,
        updated_at: new Date().toISOString()
      }).eq("id", userId);

      if (profileError) throw profileError;
      setMessage(`${document.display_name} is active and its information was applied to the profile.`);
      await loadDocuments();
      window.location.reload();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The document could not be parsed.");
    }
    setBusyId(null);
  }

  async function saveRename(document: DocumentRecord) {
    const name = draftName.trim();
    if (!name) return;
    const supabase = createClient();
    const { error } = await supabase.from("profile_documents").update({ display_name: name }).eq("id", document.id).eq("user_id", userId);
    if (error) setMessage(error.message);
    else {
      setEditingId(null);
      setDraftName("");
      setMessage("Document name updated.");
      await loadDocuments();
    }
  }

  async function deleteDocument(document: DocumentRecord) {
    if (!window.confirm(`Delete ${document.display_name}? This cannot be undone.`)) return;
    setBusyId(document.id);
    setMessage("Deleting document...");
    const supabase = createClient();

    const { error: storageError } = await supabase.storage.from("resumes").remove([document.file_path]);
    if (storageError) {
      setMessage(`The stored file could not be deleted: ${storageError.message}`);
      setBusyId(null);
      return;
    }

    const folder = document.file_path.split("/")[0];
    const filename = document.file_path.split("/").slice(1).join("/");
    const { data: remainingFiles, error: listError } = await supabase.storage.from("resumes").list(folder, {
      search: filename,
      limit: 10
    });

    if (listError) {
      setMessage(`The delete could not be verified: ${listError.message}`);
      setBusyId(null);
      return;
    }

    if ((remainingFiles ?? []).some((file) => file.name === filename)) {
      setMessage("The file is still in storage. Add the Supabase delete policy, then try again.");
      setBusyId(null);
      return;
    }

    const { error: recordError } = await supabase
      .from("profile_documents")
      .delete()
      .eq("id", document.id)
      .eq("user_id", userId);

    if (recordError) {
      setMessage(recordError.message);
    } else {
      setDocuments((current) => current.filter((item) => item.id !== document.id));
      setMessage("Document deleted.");
    }
    setBusyId(null);
  }

  if (!target) return null;

  return createPortal(
    <div className={styles.inlineLibrary}>
      <h3>Available documents</h3>
      <p className={styles.small}>Choose which document should autofill the profile, rename it, or delete it.</p>
      {message && <p className={styles.message} role="status">{message}</p>}
      {loading ? <p className={styles.small}>Loading documents...</p> : documents.length === 0 ? <p className={styles.small}>No uploaded documents yet.</p> : (
        <div className={styles.documentList}>
          {documents.map((document) => (
            <article className={styles.documentItem} key={document.id}>
              <div className={styles.documentMain}>
                {editingId === document.id ? (
                  <div className={styles.renameRow}>
                    <input className={styles.input} value={draftName} onChange={(event) => setDraftName(event.target.value)} />
                    <button className="button button-dark" type="button" onClick={() => saveRename(document)}>Save</button>
                    <button className="button" type="button" onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <div className={styles.documentTitleRow}><strong>{document.display_name}</strong>{document.is_active && <span className={styles.activePill}>Active</span>}</div>
                    <p className={styles.small}>{document.file_name}</p>
                    <p className={styles.small}>{formatSize(document.size_bytes)} · Uploaded {new Date(document.uploaded_at).toLocaleDateString()}</p>
                  </>
                )}
              </div>
              {editingId !== document.id && (
                <div className={styles.documentActions}>
                  <button className="button button-dark" type="button" disabled={busyId === document.id} onClick={() => useDocument(document)}>{busyId === document.id ? "Working..." : "Use"}</button>
                  <button className="button" type="button" onClick={() => { setEditingId(document.id); setDraftName(document.display_name); }}>Rename</button>
                  <button className={styles.dangerButton} type="button" disabled={busyId === document.id} onClick={() => deleteDocument(document)}>{busyId === document.id ? "Deleting..." : "Delete"}</button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>,
    target
  );
}
