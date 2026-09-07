import type { Metadata } from "next";
import { STIX_Two_Text, Spectral, Space_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "@/styles/globals.css";

// ── Fonts ────────────────────────────────────────────────────────────────────
// Each font is loaded as a CSS custom property injected on <html>.
// The CSS variables are referenced in src/styles/tokens/typography.css.

const stixTwoText = STIX_Two_Text({
  weight: ["400", "500"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-stix-two-text",
  display: "swap",
});

const spectral = Spectral({
  weight: ["400", "500"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-spectral",
  display: "swap",
});

// Space Mono replaces Departure Mono (not on Google Fonts).
// Same instrument-panel character, native tabular figures.
const spaceMono = Space_Mono({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

// ── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: {
    default: "Dr Nicolas Van Labeke",
    template: "%s · Nicolas Van Labeke",
  },
  description:
    "25 years of precise practice — research and engineering drawn as one continuous proof.",
  metadataBase: new URL("https://portfolio.calques3d.org"),
};

// ── Root layout ───────────────────────────────────────────────────────────────

type RootLayoutProps = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${stixTwoText.variable} ${spectral.variable} ${spaceMono.variable}`}
    >
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
