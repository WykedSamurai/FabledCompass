"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../utils/supabase/client";
import styles from "./profile.module.css";

export default function EditProfileView() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [location, setLocation] = useState("");
  const [about, setAbout] = useState("");
  const [message, setMessage] = useState("Loading profile...");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        router.replace("/login");
        return;
      }

      setUserId(authData.user.id);
      const { data, error } = await supabase
        .from("profiles")
        .select("display_name, headline, location, about")
        .eq("id", authData.user.id)
        .maybeSingle();

      if (error) {
        setMessage(error.message);
        return;
      }

      setName(data?.display_name ?? String(authData.user.user_metadata.display_name ?? ""));
      setHeadline(data?.headline ?? "");
      setLocation(data?.location ?? "");
      setAbout(data?.about ?? "");
      setMessage("");
    }

    load();
  }, [router]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!userId) return;

    const supabase = createClient();
    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      display_name: name,
      headline,
      location,
      about,
      updated_at: new Date().toISOString()
    });

    setMessage(error ? error.message : "Profile saved.");
  }

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <p className="eyebrow">Profile Setup</p>
        <h1>Tell employers where your path has led.</h1>
        <p>Keep your professional information clear, current, and easy to scan.</p>
      </section>

      <section className={styles.shell}>
        <article className={styles.card}>
          <form className={styles.form} onSubmit={save}>
            <label className={styles.field}>Display name<input className={styles.input} value={name} required onChange={(event) => setName(event.target.value)} /></label>
            <label className={styles.field}>Professional headline<input className={styles.input} value={headline} onChange={(event) => setHeadline(event.target.value)} /></label>
            <label className={`${styles.field} ${styles.fieldFull}`}>Location<input className={styles.input} value={location} onChange={(event) => setLocation(event.target.value)} /></label>
            <label className={`${styles.field} ${styles.fieldFull}`}>About<textarea className={styles.textarea} rows={6} value={about} onChange={(event) => setAbout(event.target.value)} /></label>
            <div className={styles.actions}>
              <button className="button button-dark" disabled={!userId} type="submit">Save Profile</button>
              <a className="button" href="/profile">View Profile</a>
            </div>
          </form>
          {message && <p className={styles.message} role="status">{message}</p>}
        </article>
      </section>
    </div>
  );
}
