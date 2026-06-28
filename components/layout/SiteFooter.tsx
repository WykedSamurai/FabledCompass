import Link from "next/link";

const footerLinks = [
  { href: "/terms", label: "Terms of Service" },
  { href: "/traveler-promise", label: "Promise to Travelers" },
  { href: "/vision", label: "Vision" },
  { href: "/privacy", label: "Privacy Statement" }
];

export default function SiteFooter() {
  return (
    <footer className="fc-footer" aria-label="Site footer">
      <div className="fc-footer-inner">
        <p className="fc-footer-copy">Created by Wyked Samurai • Fabled Compass name created in 2018</p>
        <nav className="fc-footer-links" aria-label="Footer links">
          {footerLinks.map((link) => (
            <Link href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
