import type { Metadata } from "next";
import { STIX_Two_Text, Spectral } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";

/* Display face — mathematical typesetting, italic cut as character not emphasis */
const stixTwoText = STIX_Two_Text({
  variable: "--font-stix",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

/* Body face — academic without stiffness, 65–72ch at 17px */
const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

/* Label face — Departure Mono is not on Google Fonts; loaded via @font-face in globals.css */

export const metadata: Metadata = {
  title: {
    template: "%s · Nicolas Van Labeke",
    default: "Nicolas Van Labeke — Research & Engineering Portfolio",
  },
  description:
    "Professional portfolio of Nicolas Van Labeke — academic R&D in AI in Education and frontend engineering.",
  other: {
    // Vercel injects these at build time. Used by Playwright smoke tests to
    // verify the correct commit is deployed before promoting to production.
    "x-commit": process.env.VERCEL_GIT_COMMIT_SHA ?? "local",
    "x-env": process.env.VERCEL_ENV ?? "development",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${stixTwoText.variable} ${spectral.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
