import { cn } from "@/lib/utils";

type SectionLabelProps = {
  children: React.ReactNode;
  as?: "p" | "h2" | "h3" | "span";
  active?: boolean;
  className?: string;
  id?: string;
};

/**
 * Departure/Space Mono label atom.
 * Renders the construction-drawing annotation style:
 * uppercase, small monospace, tracked. One red per surface — pass active
 * only on the single element that is the active/current item.
 */
export function SectionLabel({
  children,
  as: Tag = "p",
  active = false,
  className,
  id,
}: SectionLabelProps) {
  return (
    <Tag id={id} className={cn("label", active && "active-mark", className)}>
      {children}
    </Tag>
  );
}
