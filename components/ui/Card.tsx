export default function Card({
  eyebrow,
  title,
  children,
  className = ""
}: {
  eyebrow?: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`fc-card ${className}`}>
      {eyebrow && <p className="fc-eyebrow">{eyebrow}</p>}
      {title && <h2>{title}</h2>}
      {children}
    </section>
  );
}
