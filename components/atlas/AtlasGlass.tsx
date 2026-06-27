import type { ReactNode } from "react";
import styles from "./atlasGlass.module.css";

type BaseProps = {
  children: ReactNode;
  className?: string;
};

type HeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
};

function classNames(...names: Array<string | undefined>) {
  return names.filter(Boolean).join(" ");
}

export function AtlasPanel({ children, className }: BaseProps) {
  return <section className={classNames(styles.panel, className)}>{children}</section>;
}

export function AtlasCard({ children, className }: BaseProps) {
  return <article className={classNames(styles.card, className)}>{children}</article>;
}

export function AtlasSection({ children, className }: BaseProps) {
  return <div className={classNames(styles.section, className)}>{children}</div>;
}

export function AtlasHeader({ eyebrow, title, description, children, className }: HeaderProps) {
  return (
    <header className={classNames(styles.header, className)}>
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      <h2>{title}</h2>
      {description && <p className={styles.description}>{description}</p>}
      {children}
    </header>
  );
}

export function AtlasDrawer({ children, className }: BaseProps) {
  return <aside className={classNames(styles.drawer, className)}>{children}</aside>;
}

export function AtlasDialog({ children, className }: BaseProps) {
  return <div className={classNames(styles.dialog, className)}>{children}</div>;
}
