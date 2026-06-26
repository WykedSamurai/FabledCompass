import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fabled Compass",
  description: "Navigate careers through jobs, workplace adventures, and demonstrated skills."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <Link className="brand" href="/">
            <span className="brand-mark">✦</span>
            <span>Fabled Compass</span>
          </Link>
          <nav className="site-nav" aria-label="Primary navigation">
            <Link href="/jobs">Jobs</Link>
            <Link href="/adventures">Adventures</Link>
            <Link href="/profile">Profile</Link>
            <Link href="/account">Account</Link>
            <Link href="/auth">Sign In</Link>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <p>Fabled Compass · Every career has a story.</p>
        </footer>
      </body>
    </html>
  );
}
