"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../utils/supabase/client";

export default function AccountProfilePage() {
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
        router.replace("/auth");
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
    <>
      <section className="page-hero">
        <p className="eyebrow">Profile Setup</p>
        <h1>Tell employers where your path has led.</h1>
      </section>
      <section className="section section-narrow">
        <article className="card auth-card">
          <form className="form-grid" onSubmit={save}>
            <label>Display name<input value={name} required onChange={(event) => setName(event.target.value)} /></label>
            <label>Professional headline<input value={headline} onChange={(event) => setHeadline(event.target.value)} /></label>
            <label>Location<input value={location} onChange={(event) => setLocation(event.target.value)} /></label>
            <label>About<textarea rows={6} value={about} onChange={(event) => setAbout(event.target.value)} /></label>
            <button className="button button-dark" disabled={!userId} type="submit">Save Profile</button>
          </form>
          {message && <p className="form-message" role="status">{message}</p>}
        </article>
      </section>
    </>
  );
}
