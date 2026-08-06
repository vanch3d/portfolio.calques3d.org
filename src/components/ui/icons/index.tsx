/**
 * Custom SVG icon set — stroke-based, 24×24 viewBox, currentColor.
 *
 * All icons are aria-hidden="true" — consumers are responsible for
 * providing an accessible label on the parent button or link.
 *
 * Size is controlled via width/height props (default 16×16).
 * StrokeWidth defaults to 2 to match the site's visual weight.
 */

interface IconProps {
  size?: number;
  strokeWidth?: number;
}

const defaults: Required<IconProps> = { size: 16, strokeWidth: 2 };

function Icon({
  size = defaults.size,
  strokeWidth = defaults.strokeWidth,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </Icon>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </Icon>
  );
}

export function HamburgerIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </Icon>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </Icon>
  );
}

export function DownloadIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 3v13" />
      <path d="M7 11l5 5 5-5" />
      <path d="M5 21h14" />
    </Icon>
  );
}
