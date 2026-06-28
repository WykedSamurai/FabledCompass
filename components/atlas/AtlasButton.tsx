import type { ReactNode } from "react";
import styles from "./atlasButton.module.css";

type Variant = "primary" | "ghost" | "quiet";

type AtlasButtonProps = {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: Variant;
};

function classNames(...names: Array<string | undefined>) {
  return names.filter(Boolean).join(" ");
}

export default function AtlasButton({
  children,
  className,
  href,
  onClick,
  type = "button",
  variant = "primary"
}: AtlasButtonProps) {
  const classes = classNames(styles.button, styles[variant], className);

  if (href) {
    return <a className={classes} href={href}>{children}</a>;
  }

  return <button className={classes} type={type} onClick={onClick}>{children}</button>;
}
