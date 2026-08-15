import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { themeScript } from "@/lib/themeScript";
import { NavigationBar } from "@/components/layout";
import { SiteFooter } from "@/components/layout";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s · Nicolas Van Labeke",
    default: "Nicolas Van Labeke — Research & Engineering Portfolio",
  },
  description:
    "Professional portfolio of Nicolas Van Labeke — academic R&D in AI in Education and frontend engineering.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const t = await getTranslations("Navigation");

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-bg text-text" suppressHydrationWarning>
        <Script id="theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeScript }} />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded-md focus:bg-bg focus:text-accent focus:shadow-md focus:font-medium focus:text-sm"
          >
            {t("skip_to_content")}
          </a>

          <div id="nav-sentinel" aria-hidden="true" className="absolute top-0 h-px w-full pointer-events-none" />

          <NavigationBar />

          <main
            id="main-content"
            className="flex-1 pt-(--nav-height)"
          >
            {children}
          </main>

          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
