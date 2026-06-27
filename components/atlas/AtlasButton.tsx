import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./atlasButton.module.css";

type Variant = "primary" | "ghost" | "quiet";

type BaseProps = {
  children: ReactNode;
  className?: string;
  variant?: Variant;
};

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: never;
};

type LinkProps = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

function classNames(...names: Array<string | undefined>) {
  return names.filter(Boolean).join(" ");
}

export default function AtlasButton(props: ButtonProps | LinkProps) {
  const { children, className, variant = "primary", ...rest } = props;
  const classes = classNames(styles.button, styles[variant], className);

  if ("href" in rest && rest.href) {
    return <a className={classes} {...rest}>{children}</a>;
  }

  return <button className={classes} type="button" {...rest}>{children}</button>;
}
