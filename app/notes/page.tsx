import { createClient } from "../../utils/supabase/server";

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
        <section className="section section-narrow">
          <p className="eyebrow">Supabase Connection Test</p>
          <h1>Database connected, but the notes query failed.</h1>
          <article className="card">
            <p>{error.message}</p>
            <p className="muted">
              Confirm that the notes table and its public read policy were created in the Supabase SQL Editor.
            </p>
          </article>
        </section>
      );
    }

    const notes = (data ?? []) as Note[];

    return (
      <section className="section section-narrow">
        <p className="eyebrow">Supabase Connection Test</p>
        <h1>Fabled Compass is reading from Supabase.</h1>
        <p className="muted">
          This temporary page confirms that the Vercel environment variables and database query are working.
        </p>

        <div className="jobs-grid">
          {notes.length > 0 ? (
            notes.map((note) => (
              <article className="card" key={note.id}>
                <strong>Note {note.id}</strong>
                <p>{note.title}</p>
              </article>
            ))
          ) : (
            <article className="card">
              <p>The notes table is available, but it does not contain any rows yet.</p>
            </article>
          )}
        </div>
      </section>
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Supabase configuration error.";

    return (
      <section className="section section-narrow">
        <p className="eyebrow">Supabase Connection Test</p>
        <h1>Supabase is not available in this deployment yet.</h1>
        <article className="card">
          <p>{message}</p>
          <p className="muted">
            In Vercel, verify that the Supabase variables are assigned to Preview as well as Production, then redeploy the branch.
          </p>
        </article>
      </section>
    );
  }
}
