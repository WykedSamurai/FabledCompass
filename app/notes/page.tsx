import { createClient } from "../../utils/supabase/server";
import PrototypeWatermark from "../../components/layout/PrototypeWatermark";

type Note = {
  id: number;
  title: string;
};

export const dynamic = "force-dynamic";

export default async function NotesPage() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("notes")
      .select("id, title")
      .order("id", { ascending: true });

    if (error) {
      return (
        <div className="fc-page-stack fc-workspace-page fc-prototype-frame">
          <PrototypeWatermark />
          <section className="fc-workspace-hero">
            <p className="fc-eyebrow">Supabase Connection Test</p>
            <h1>Database connected, but the notes query failed.</h1>
          </section>
          <article className="fc-card">
            <p>{error.message}</p>
            <p className="fc-muted">Confirm that the notes table and its public read policy were created in the Supabase SQL Editor.</p>
          </article>
        </div>
      );
    }

    const notes = (data ?? []) as Note[];

    return (
      <div className="fc-page-stack fc-workspace-page fc-prototype-frame">
        <PrototypeWatermark />
        <section className="fc-workspace-hero">
          <p className="fc-eyebrow">Supabase Connection Test</p>
          <h1>Fabled Compass is reading from Supabase.</h1>
          <p>This temporary page confirms that the Vercel environment variables and database query are working.</p>
        </section>
        <div className="fc-note-grid">
          {notes.length > 0 ? (
            notes.map((note) => (
              <article className="fc-card" key={note.id}>
                <p className="fc-eyebrow">Note {note.id}</p>
                <p>{note.title}</p>
              </article>
            ))
          ) : (
            <article className="fc-card">
              <p>The notes table is available, but it does not contain any rows yet.</p>
            </article>
          )}
        </div>
      </div>
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Supabase configuration error.";

    return (
      <div className="fc-page-stack fc-workspace-page fc-prototype-frame">
        <PrototypeWatermark />
        <section className="fc-workspace-hero">
          <p className="fc-eyebrow">Supabase Connection Test</p>
          <h1>Supabase is not available in this deployment yet.</h1>
        </section>
        <article className="fc-card">
          <p>{message}</p>
          <p className="fc-muted">In Vercel, verify that the Supabase variables are assigned to Preview as well as Production, then redeploy the branch.</p>
        </article>
      </div>
    );
  }
}
