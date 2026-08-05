import Link from "next/link";

export interface ButtonProps {
  href?: string;
  children: React.ReactNode;
  variant?: "ghost" | "primary";
  className?: string;
}

const BASE =
  "inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded transition-colors focus-visible:outline-2 focus-visible:outline-offset-2";

const VARIANTS: Record<NonNullable<ButtonProps["variant"]>, string> = {
  ghost:
    "border border-border text-foreground hover:border-accent hover:text-accent-hover",
  primary:
    "border border-accent bg-accent text-accent-foreground hover:bg-accent-hover hover:border-accent-hover",
};

export function Button({
  href,
  children,
  variant = "ghost",
  className,
}: ButtonProps) {
  const cls = [BASE, VARIANTS[variant], className].filter(Boolean).join(" ");

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return <button className={cls}>{children}</button>;
}
